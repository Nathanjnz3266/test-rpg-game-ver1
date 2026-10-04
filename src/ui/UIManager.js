import { CLASSES } from '../data/classes.js';
import { SKILLS } from '../data/skills.js';
import { ITEMS_DATABASE, RARITIES } from '../data/items.js';
import { REGIONS } from '../data/regions.js';
import { CRAFTING_RECIPES } from '../data/items.js';
import { BlacksmithSystem } from '../systems/BlacksmithSystem.js';
import { CraftingSystem } from '../systems/CraftingSystem.js';
import { SaveSystem } from '../core/SaveSystem.js';
import { eventBus } from '../core/EventBus.js';

export class UIManager {
  constructor(game) {
    this.game = game;
    this.uiRoot = document.getElementById('ui-root');

    this.activeModal = null;
    this.activeNpc = null;

    this.initEventListeners();
  }

  initEventListeners() {
    eventBus.on('PLAYER_STAT_CHANGE', (player) => this.updatePlayerBars(player));
    eventBus.on('SHOW_DAMAGE_TEXT', (data) => this.showDamageText(data));
    eventBus.on('SHOW_NOTIFICATION', (data) => this.showNotification(data));
    eventBus.on('BOSS_HP_UPDATE', (boss) => this.updateBossBar(boss));
    eventBus.on('BOSS_KILLED', () => this.hideBossBar());
    eventBus.on('TIME_WEATHER_UPDATE', (data) => this.updateEnvironmentHUD(data));
    eventBus.on('ULTIMATE_CHARGE_UPDATE', (charge) => this.updateUltimateSlot(charge));

    // Global Key shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyI') this.toggleModal('INVENTORY');
      if (e.code === 'KeyC') this.toggleModal('CHARACTER');
      if (e.code === 'KeyK') this.toggleModal('SKILLS');
      if (e.code === 'KeyJ') this.toggleModal('QUESTS');
      if (e.code === 'KeyM') this.toggleModal('MAP');
      if (e.code === 'Escape') this.toggleModal(this.activeModal ? null : 'SETTINGS');
    });
  }

  renderCharacterCreation(onStartGame) {
    let selectedClassId = 'WARRIOR';

    const html = `
      <div class="modal-overlay interactive">
        <div class="modal-card glass-panel" style="width: 900px;">
          <h1 class="modal-title" style="text-align: center; font-size: 28px;">ETERNAL REALM: CHRONICLES OF THE FORGOTTEN</h1>
          <p style="text-align: center; color: #8b949e; font-size: 14px;">Select your Hero Class & Customize your Appearance for Aetheria</p>

          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 15px;">
            ${Object.values(CLASSES).map(c => `
              <div class="class-card glass-panel ${c.id === selectedClassId ? 'selected-class' : ''}" data-class="${c.id}" style="padding: 12px; text-align: center; cursor: pointer; border: 2px solid ${c.id === selectedClassId ? '#f1c40f' : 'rgba(255,255,255,0.1)'}; border-radius: 8px;">
                <div style="font-size: 32px;">${c.icon}</div>
                <div style="font-family: var(--font-title); font-weight: 700; color: ${c.color}; margin-top: 6px;">${c.name}</div>
                <div style="font-size: 11px; color: #8b949e; margin-top: 4px;">${c.role}</div>
              </div>
            `).join('')}
          </div>

          <div id="class-preview-box" class="glass-panel" style="padding: 15px; border-left: 4px solid #f1c40f;">
            <!-- Render selected class info -->
          </div>

          <div style="display: flex; gap: 15px; align-items: center; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
            <label style="font-weight: 600;">Hero Name:</label>
            <input type="text" id="hero-name-input" value="Aetherius" style="background: rgba(22,27,34,0.9); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 8px 12px; border-radius: 6px; flex: 1; font-family: var(--font-body);" />
            <button id="btn-start-game" class="btn-primary" style="font-size: 16px; padding: 10px 30px;">ENTER AETHERIA</button>
          </div>
        </div>
      </div>
    `;

    this.uiRoot.innerHTML = html;

    const updatePreview = (id) => {
      const c = CLASSES[id];
      document.getElementById('class-preview-box').innerHTML = `
        <h3 style="color: ${c.color}; font-family: var(--font-title);">${c.name} — ${c.title}</h3>
        <p style="font-size: 13px; color: #ccc; margin: 6px 0;">${c.description}</p>
        <div style="font-size: 12px; color: var(--color-gold);">Primary Stat: <strong>${c.primaryStat}</strong> | Base HP: ${c.baseStats.hp} | Base MP: ${c.baseStats.mp}</div>
      `;
    };

    updatePreview(selectedClassId);

    document.querySelectorAll('.class-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedClassId = card.dataset.class;
        document.querySelectorAll('.class-card').forEach(c => c.style.borderColor = 'rgba(255,255,255,0.1)');
        card.style.borderColor = '#f1c40f';
        updatePreview(selectedClassId);
      });
    });

    document.getElementById('btn-start-game').addEventListener('click', () => {
      const name = document.getElementById('hero-name-input').value.trim() || 'Aetherius';
      onStartGame({ name, classId: selectedClassId });
    });
  }

  renderHUD() {
    const p = this.game.player;
    const skills = p.unlockedSkills.map(id => SKILLS[id]);

    const html = `
      <!-- TOP LEFT PLAYER STATS -->
      <div class="hud-top-left glass-panel interactive">
        <div class="player-avatar">${p.classData.icon}</div>
        <div class="player-bars">
          <div class="player-name-row">
            <span class="player-name">${p.name}</span>
            <span class="player-level-badge">LV ${p.level}</span>
          </div>

          <div class="bar-container">
            <div id="bar-hp-fill" class="bar-fill bar-hp" style="width: 100%;"></div>
            <span id="bar-hp-text" class="bar-text">${p.hp} / ${p.maxHp}</span>
          </div>

          <div class="bar-container">
            <div id="bar-mp-fill" class="bar-fill bar-mp" style="width: 100%;"></div>
            <span id="bar-mp-text" class="bar-text">${p.mp} / ${p.maxMp}</span>
          </div>

          <div class="bar-container">
            <div id="bar-exp-fill" class="bar-fill bar-exp" style="width: 0%;"></div>
            <span id="bar-exp-text" class="bar-text">EXP 0%</span>
          </div>
        </div>
      </div>

      <!-- TOP RIGHT MINIMAP -->
      <div class="hud-top-right interactive">
        <div class="minimap-card glass-panel">
          <canvas id="minimap-canvas" width="140" height="140"></canvas>
          <div id="hud-region-name" class="region-title">${this.game.worldManager.currentRegion.name}</div>
          <div id="hud-time-weather" style="font-size: 11px; color: #8b949e; margin-top: 2px;">☀️ 12:00 PM | Clear</div>
        </div>
      </div>

      <!-- QUEST TRACKER -->
      <div id="hud-quest-tracker" class="quest-tracker-panel glass-panel interactive">
        <div class="quest-tracker-title">📜 CURRENT QUEST</div>
        <div id="quest-tracker-content" class="quest-obj-text">No active quests</div>
      </div>

      <!-- EPIC BOSS HEALTH BAR -->
      <div id="boss-bar-container" class="boss-health-bar-container glass-panel" style="display: none;">
        <div id="boss-bar-name" class="boss-name-title">Forest Guardian</div>
        <div class="boss-bar-outer">
          <div id="boss-bar-fill" class="boss-bar-fill" style="width: 100%;"></div>
        </div>
      </div>

      <!-- BOTTOM HOTBAR -->
      <div class="hud-bottom glass-panel interactive">
        ${skills.slice(0, 4).map((s, idx) => `
          <div class="hotbar-slot" data-skill="${s.id}">
            <span class="hotbar-key">${idx + 1}</span>
            <span>${s.icon}</span>
            <div id="cd-${s.id}" class="hotbar-cooldown" style="display: none;"></div>
          </div>
        `).join('')}

        <!-- Ultimate Slot -->
        ${skills[4] ? `
          <div id="ultimate-slot" class="hotbar-slot ultimate-slot" data-skill="${skills[4].id}">
            <span class="hotbar-key">R</span>
            <span>${skills[4].icon}</span>
            <div id="ultimate-fill-meter" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 0%; background: rgba(241, 196, 15, 0.4); border-radius: 8px;"></div>
          </div>
        ` : ''}

        <div class="hotbar-slot" data-action="POTION">
          <span class="hotbar-key">Q</span>
          <span>🧪</span>
        </div>

        <div class="hotbar-slot" data-action="DODGE">
          <span class="hotbar-key">SPACE</span>
          <span>⚡</span>
        </div>
      </div>

      <div id="modal-container"></div>
      <div id="notification-root" class="notification-container"></div>
    `;

    this.uiRoot.innerHTML = html;
    this.updatePlayerBars(p);
    this.updateQuestTracker();
  }

  updatePlayerBars(player) {
    const hpPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    const mpPct = Math.max(0, Math.min(100, (player.mp / player.maxMp) * 100));
    const expPct = Math.max(0, Math.min(100, (player.exp / player.expToNext) * 100));

    const hpFill = document.getElementById('bar-hp-fill');
    const mpFill = document.getElementById('bar-mp-fill');
    const expFill = document.getElementById('bar-exp-fill');

    if (hpFill) hpFill.style.width = `${hpPct}%`;
    if (mpFill) mpFill.style.width = `${mpPct}%`;
    if (expFill) expFill.style.width = `${expPct}%`;

    const hpText = document.getElementById('bar-hp-text');
    const mpText = document.getElementById('bar-mp-text');
    const expText = document.getElementById('bar-exp-text');

    if (hpText) hpText.innerText = `${player.hp} / ${player.maxHp}`;
    if (mpText) mpText.innerText = `${player.mp} / ${player.maxMp}`;
    if (expText) expText.innerText = `EXP ${Math.floor(expPct)}%`;
  }

  updateQuestTracker() {
    const el = document.getElementById('quest-tracker-content');
    if (!el) return;

    const active = this.game.questSystem.activeQuests.find(q => q.status === 'Active');
    if (!active) {
      el.innerHTML = '<span style="color: #6e7681;">Explore the realm and talk to NPCs</span>';
      return;
    }

    el.innerHTML = `
      <strong style="color: #fff;">${active.name}</strong>
      <ul style="margin-left: 15px; margin-top: 4px;">
        ${active.objectives.map(o => `<li>${o.text} (${o.current}/${o.count})</li>`).join('')}
      </ul>
    `;
  }

  updateBossBar(boss) {
    const container = document.getElementById('boss-bar-container');
    const nameEl = document.getElementById('boss-bar-name');
    const fillEl = document.getElementById('boss-bar-fill');

    if (!container || !fillEl) return;
    container.style.display = 'block';

    const pct = Math.max(0, (boss.hp / boss.maxHp) * 100);
    nameEl.innerText = `${boss.name} [Phase ${boss.currentPhaseIndex + 1}]`;
    fillEl.style.width = `${pct}%`;
  }

  hideBossBar() {
    const container = document.getElementById('boss-bar-container');
    if (container) container.style.display = 'none';
  }

  updateUltimateSlot(charge) {
    const slot = document.getElementById('ultimate-slot');
    const meter = document.getElementById('ultimate-fill-meter');
    if (meter) meter.style.height = `${charge}%`;
    if (slot) {
      if (charge >= 100) slot.classList.add('ultimate-glow');
      else slot.classList.remove('ultimate-glow');
    }
  }

  updateEnvironmentHUD(data) {
    const el = document.getElementById('hud-time-weather');
    if (!el) return;

    const hrs = Math.floor(data.timeOfDay);
    const mins = Math.floor((data.timeOfDay - hrs) * 60);
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 || 12;

    el.innerText = `${data.isNight ? '🌙' : '☀️'} ${displayHrs}:${mins < 10 ? '0' : ''}${mins} ${ampm} | ${data.weather}`;
  }

  toggleModal(modalType) {
    const container = document.getElementById('modal-container');
    if (!container) return;

    if (this.activeModal === modalType || !modalType) {
      container.innerHTML = '';
      this.activeModal = null;
      return;
    }

    this.activeModal = modalType;

    if (modalType === 'INVENTORY') this.renderInventoryModal(container);
    if (modalType === 'CHARACTER') this.renderCharacterModal(container);
    if (modalType === 'SETTINGS') this.renderSettingsModal(container);
    if (modalType === 'MAP') this.renderMapModal(container);
  }

  renderInventoryModal(container) {
    const p = this.game.player;
    const inv = this.game.inventorySystem;

    const html = `
      <div class="modal-overlay interactive">
        <div class="modal-card glass-panel">
          <div class="modal-header">
            <h2 class="modal-title">EQUIPMENT & INVENTORY</h2>
            <button class="btn-close" onclick="window.game.uiManager.toggleModal(null)">✕</button>
          </div>

          <div style="display: grid; grid-template-columns: 280px 1fr; gap: 20px;">
            <!-- EQUIPPED SLOTS -->
            <div class="glass-panel" style="padding: 15px;">
              <h3 style="color: var(--color-gold); font-size: 14px; margin-bottom: 10px;">Equipped Gear</h3>
              ${Object.keys(inv.equipped).map(slot => {
                const item = inv.equipped[slot];
                return `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="font-size: 11px; color: #8b949e;">${slot}:</span>
                    <span style="font-size: 12px; color: ${item ? RARITIES[item.itemData.rarity].color : '#555'};">
                      ${item ? `${item.itemData.name} ${item.enhancement ? `+${item.enhancement}` : ''}` : '(Empty)'}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- INVENTORY GRID -->
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Gold: <strong style="color: var(--color-gold);">${p.gold} 🪙</strong></span>
                <span>Slots: ${inv.items.length} / ${inv.maxSlots}</span>
              </div>
              <div class="inventory-grid">
                ${inv.items.map(item => `
                  <div class="inv-slot" data-inst="${item.instanceId}">
                    ${item.enhancement ? `<span class="inv-enhance">+${item.enhancement}</span>` : ''}
                    <span class="inv-icon">${item.itemData.icon}</span>
                    ${item.quantity > 1 ? `<span class="inv-count">x${item.quantity}</span>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    document.querySelectorAll('.inv-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        const instId = slot.dataset.inst;
        inv.equipItem(instId, p);
        this.renderInventoryModal(container);
      });
    });
  }

  renderCharacterModal(container) {
    const p = this.game.player;
    const html = `
      <div class="modal-overlay interactive">
        <div class="modal-card glass-panel" style="width: 500px;">
          <div class="modal-header">
            <h2 class="modal-title">CHARACTER SHEET</h2>
            <button class="btn-close" onclick="window.game.uiManager.toggleModal(null)">✕</button>
          </div>

          <div style="line-height: 1.8;">
            <div>Name: <strong>${p.name}</strong> (${p.classData.name})</div>
            <div>Title: <span style="color: var(--color-gold);">${p.title}</span></div>
            <div>Level: <strong>${p.level}</strong> | Stat Points: <strong style="color: #2ecc71;">${p.skillPoints}</strong></div>
            <hr style="border-color: rgba(255,255,255,0.1); margin: 10px 0;" />
            <div>⚔️ Attack: <strong>${p.attack}</strong></div>
            <div>🔮 Magic Attack: <strong>${p.magicAttack}</strong></div>
            <div>🛡️ Defense: <strong>${p.defense}</strong></div>
            <div>🎯 Crit Rate: <strong>${p.critRate}%</strong> | Crit Dmg: <strong>${p.critDmg}%</strong></div>
            <div>👟 Movement Speed: <strong>${p.moveSpeed.toFixed(1)}</strong></div>
            <hr style="border-color: rgba(255,255,255,0.1); margin: 10px 0;" />
            <div>STR: ${p.stats.str} | DEX: ${p.stats.dex} | INT: ${p.stats.int} | VIT: ${p.stats.vit} | LUK: ${p.stats.luk}</div>
          </div>
        </div>
      </div>
    `;
    container.innerHTML = html;
  }

  renderSettingsModal(container) {
    const html = `
      <div class="modal-overlay interactive">
        <div class="modal-card glass-panel" style="width: 450px; text-align: center;">
          <h2 class="modal-title" style="margin-bottom: 15px;">PAUSE & SETTINGS</h2>
          <button class="btn-primary" style="width: 100%; margin-bottom: 10px;" onclick="window.game.saveGame()">SAVE GAME</button>
          <button class="btn-primary" style="width: 100%; margin-bottom: 10px;" onclick="window.game.exportSave()">EXPORT SAVE FILE</button>
          <button class="btn-primary" style="width: 100%; background: #c0392b;" onclick="window.game.uiManager.toggleModal(null)">RESUME GAME</button>
        </div>
      </div>
    `;
    container.innerHTML = html;
  }

  showDamageText(data) {
    const el = document.createElement('div');
    el.className = 'damage-text';
    el.innerText = data.text;
    el.style.color = data.color || '#fff';
    el.style.left = `${window.innerWidth / 2 + (Math.random() - 0.5) * 60}px`;
    el.style.top = `${window.innerHeight / 2 - 40 + (Math.random() - 0.5) * 40}px`;

    document.getElementById('ui-root').appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  showNotification(data) {
    const root = document.getElementById('notification-root');
    if (!root) return;

    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.innerText = data.text;
    root.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }
}
