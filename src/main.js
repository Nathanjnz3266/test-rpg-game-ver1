import * as THREE from 'three';
import './style.css';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { Boss } from './entities/Boss.js';
import { ENEMIES_DATABASE } from './data/enemies.js';
import { WorldManager } from './world/WorldManager.js';
import { InventorySystem } from './systems/InventorySystem.js';
import { CombatSystem } from './systems/CombatSystem.js';
import { QuestSystem } from './systems/QuestSystem.js';
import { SaveSystem } from './core/SaveSystem.js';
import { audioEngine } from './core/AudioEngine.js';
import { InputHandler } from './core/InputHandler.js';
import { UIManager } from './ui/UIManager.js';
import { eventBus } from './core/EventBus.js';

export class EternalRealmGame {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.worldManager = new WorldManager(this.canvas);
    this.inputHandler = new InputHandler(this.canvas);

    this.player = null;
    this.enemies = [];
    this.boss = null;

    this.inventorySystem = new InventorySystem();
    this.combatSystem = new CombatSystem(this.worldManager.scene);
    this.questSystem = new QuestSystem();
    this.uiManager = new UIManager(this);

    this.lastTime = performance.now();
    this.autoSaveTimer = 0;
    this.isGameStarted = false;

    this.bindInputCallbacks();
    this.bindEventSubscriptions();

    // Show Character Creation
    this.uiManager.renderCharacterCreation((customization) => this.startGame(customization));
  }

  startGame(customization) {
    this.player = new Player(customization);
    this.worldManager.scene.add(this.player.mesh);
    this.player.mesh.position.set(0, 0, 0);

    // Spawn Initial Greenvale Enemies
    this.spawnEnemies();

    // Spawn Greenvale Boss (Forest Guardian)
    this.spawnBoss('BOSS_FOREST_GUARDIAN', new THREE.Vector3(80, 0, -80));

    this.uiManager.renderHUD();
    audioEngine.playBgm('TOWN_GREENVALE');

    this.isGameStarted = true;
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  spawnEnemies() {
    const goblinSpawns = [
      new THREE.Vector3(-25, 0, 35),
      new THREE.Vector3(-35, 0, 45),
      new THREE.Vector3(-20, 0, 50),
      new THREE.Vector3(-45, 0, 30),
      new THREE.Vector3(-50, 0, 40)
    ];

    goblinSpawns.forEach(pos => {
      const e = new Enemy(ENEMIES_DATABASE.GOBLIN, pos);
      this.worldManager.scene.add(e.mesh);
      this.enemies.push(e);
    });

    const wolfSpawns = [
      new THREE.Vector3(40, 0, 50),
      new THREE.Vector3(55, 0, 60),
      new THREE.Vector3(35, 0, 70),
      new THREE.Vector3(60, 0, 45)
    ];

    wolfSpawns.forEach(pos => {
      const e = new Enemy(ENEMIES_DATABASE.WOLF, pos);
      this.worldManager.scene.add(e.mesh);
      this.enemies.push(e);
    });
  }

  spawnBoss(bossId, pos) {
    const bData = ENEMIES_DATABASE[bossId];
    if (!bData) return;
    this.boss = new Boss(bData, pos);
    this.worldManager.scene.add(this.boss.mesh);
  }

  bindInputCallbacks() {
    this.inputHandler.onAttackClick = () => {
      if (!this.isGameStarted || !this.player) return;
      this.combatSystem.performLightAttack(this.player, this.enemies, this.boss);
    };

    this.inputHandler.onDodgePress = () => {
      if (!this.isGameStarted || !this.player) return;
      this.combatSystem.performDodge(this.player);
    };

    this.inputHandler.onMountToggle = () => {
      if (!this.isGameStarted || !this.player) return;
      this.player.toggleMount();
    };

    this.inputHandler.onSkillPress = (code) => {
      if (!this.isGameStarted || !this.player) return;

      const skills = this.player.unlockedSkills.map(id => ({ id }));
      if (code === 'Digit1' && skills[0]) this.combatSystem.castSkill(skills[0].id, this.player, this.enemies, this.boss);
      if (code === 'Digit2' && skills[1]) this.combatSystem.castSkill(skills[1].id, this.player, this.enemies, this.boss);
      if (code === 'Digit3' && skills[2]) this.combatSystem.castSkill(skills[2].id, this.player, this.enemies, this.boss);
      if (code === 'Digit4' && skills[3]) this.combatSystem.castSkill(skills[3].id, this.player, this.enemies, this.boss);
      if (code === 'KeyR' && skills[4]) this.combatSystem.castSkill(skills[4].id, this.player, this.enemies, this.boss);

      if (code === 'KeyQ') {
        // Drink HP potion
        const pot = this.inventorySystem.items.find(i => i.itemData.id === 'POTION_HP_SMALL' || i.itemData.id === 'POTION_HP_LARGE');
        if (pot) {
          this.player.heal(pot.itemData.restoreHp || 100);
          this.inventorySystem.removeItem(pot.instanceId, 1);
          audioEngine.playSfx('POTION');
        }
      }
    };
  }

  bindEventSubscriptions() {
    eventBus.on('ENEMY_KILLED', (enemy) => {
      this.player.addExp(enemy.expYield);
      this.player.addGold(enemy.goldYield);
      this.questSystem.onEnemyKilled(enemy.id, this.player, this.inventorySystem);
      audioEngine.playSfx('LOOT_PICKUP');

      // Drop items
      if (enemy.data.drops) {
        enemy.data.drops.forEach(d => {
          if (Math.random() <= d.chance) {
            this.inventorySystem.addItem(d.itemId, d.count || 1);
          }
        });
      }
    });

    eventBus.on('BOSS_KILLED', (boss) => {
      this.player.addExp(boss.expYield);
      this.player.addGold(boss.goldYield);
      this.questSystem.onEnemyKilled(boss.id, this.player, this.inventorySystem);
      audioEngine.playSfx('LEVEL_UP');
      eventBus.emit('SHOW_NOTIFICATION', { text: `VICTORY! DEFEATED ${boss.name}!`, type: 'success' });
    });

    eventBus.on('PLAYER_LEVEL_UP', (data) => {
      audioEngine.playSfx('LEVEL_UP');
      eventBus.emit('SHOW_NOTIFICATION', { text: `LEVEL UP! Reached Level ${data.level}!`, type: 'success' });
    });
  }

  gameLoop(currentTime) {
    if (!this.isGameStarted) return;

    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    // Movement Physics
    const moveVec = this.inputHandler.getMovementVector();
    if ((moveVec.x !== 0 || moveVec.z !== 0) && !this.player.isAttacking && !this.player.isDead) {
      // Align movement relative to camera yaw
      const moveAngle = Math.atan2(moveVec.x, moveVec.z) + this.worldManager.cameraYaw;
      const moveSpeed = this.player.moveSpeed * dt;

      this.player.mesh.position.x += Math.sin(moveAngle) * moveSpeed;
      this.player.mesh.position.z += Math.cos(moveAngle) * moveSpeed;
      this.player.mesh.rotation.y = moveAngle + Math.PI;
    }

    // Camera update
    this.worldManager.updateCamera(
      this.player.mesh.position,
      this.inputHandler.mouse.dx,
      this.inputHandler.mouse.dy,
      this.inputHandler.mouse.scrollDelta
    );
    this.inputHandler.resetMouseDelta();

    // Update Entities
    this.player.update(dt);

    this.enemies.forEach(e => e.update(dt, this.player.mesh.position, this.player));

    if (this.boss) {
      this.boss.update(dt, this.player.mesh.position, this.player, this.worldManager.scene);
    }

    this.combatSystem.update(dt, this.player, this.enemies, this.boss);

    // Render 3D World
    this.worldManager.render(dt, this.player.mesh.position);

    // Auto-save every 30 seconds
    this.autoSaveTimer += dt;
    if (this.autoSaveTimer >= 30) {
      this.autoSaveTimer = 0;
      this.saveGame();
    }

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  saveGame() {
    SaveSystem.save(this);
    eventBus.emit('SHOW_NOTIFICATION', { text: 'Game Auto-saved', type: 'info' });
  }

  exportSave() {
    SaveSystem.exportSaveFile();
  }
}

// Initialize Game on Window Load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new EternalRealmGame();
});
