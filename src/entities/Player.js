import * as THREE from 'three';
import { CLASSES } from '../data/classes.js';
import { SKILLS } from '../data/skills.js';
import { ModelBuilder } from './3d/ModelBuilder.js';
import { eventBus } from '../core/EventBus.js';

export class Player {
  constructor(customization = {}) {
    this.name = customization.name || 'Hero of Aetheria';
    this.classId = customization.classId || 'WARRIOR';
    this.classData = CLASSES[this.classId];

    this.customization = {
      gender: customization.gender || 'Male',
      skinColor: customization.skinColor || 0xffdbac,
      hairColor: customization.hairColor || 0x2c1d11,
      outfitColor: customization.outfitColor || 0x2b3e50,
      hairStyle: customization.hairStyle || 'Short'
    };

    // Progression
    this.level = 1;
    this.exp = 0;
    this.expToNext = this.calculateExpToNext(1);
    this.skillPoints = 0;
    this.gold = 500;
    this.title = 'Novice Adventurer';

    // Stat Allocations (Primary)
    this.stats = {
      str: this.classData.baseStats.str,
      dex: this.classData.baseStats.dex,
      int: this.classData.baseStats.int,
      vit: this.classData.baseStats.vit,
      luk: this.classData.baseStats.luk
    };

    // Calculated Secondary Stats
    this.maxHp = this.classData.baseStats.hp;
    this.hp = this.maxHp;
    this.maxMp = this.classData.baseStats.mp;
    this.mp = this.maxMp;
    this.attack = this.classData.baseStats.attack;
    this.defense = this.classData.baseStats.defense;
    this.magicAttack = this.classData.baseStats.magicAttack;
    this.magicDefense = this.classData.baseStats.magicDefense;
    this.critRate = this.classData.baseStats.critRate;
    this.critDmg = this.classData.baseStats.critDmg;
    this.attackSpeed = this.classData.baseStats.attackSpeed;
    this.moveSpeed = this.classData.baseStats.moveSpeed;
    this.cdr = this.classData.baseStats.cdr;
    this.lifeSteal = this.classData.baseStats.lifeSteal;

    // Combat State
    this.isAttacking = false;
    this.isDodging = false;
    this.isBlocking = false;
    this.isMounted = false;
    this.isDead = false;
    this.dodgeCooldown = 0;
    this.ultimateCharge = 0; // 0 to 100
    this.unlockedSkills = [...this.classData.skillIds];
    this.skillCooldowns = {};

    // Active Buffs
    this.activeBuffs = [];

    // 3D Object
    this.mesh = ModelBuilder.createPlayerModel({
      ...this.customization,
      classType: this.classId
    });
    this.mountMesh = null;

    this.recalculateStats();
  }

  calculateExpToNext(level) {
    return Math.floor(100 * Math.pow(level, 1.4));
  }

  addExp(amount) {
    if (this.level >= 100) return;
    this.exp += amount;
    let leveledUp = false;

    while (this.exp >= this.expToNext && this.level < 100) {
      this.exp -= this.expToNext;
      this.level++;
      this.skillPoints += 2;
      this.expToNext = this.calculateExpToNext(this.level);

      // Stat gain on level up
      this.stats.str += Math.ceil(this.classData.statWeights.STR);
      this.stats.dex += Math.ceil(this.classData.statWeights.DEX);
      this.stats.int += Math.ceil(this.classData.statWeights.INT);
      this.stats.vit += Math.ceil(this.classData.statWeights.VIT);
      this.stats.luk += Math.ceil(this.classData.statWeights.LUK);

      leveledUp = true;
    }

    if (leveledUp) {
      this.recalculateStats();
      this.hp = this.maxHp;
      this.mp = this.maxMp;
      eventBus.emit('PLAYER_LEVEL_UP', { level: this.level });
    }

    eventBus.emit('PLAYER_STAT_CHANGE', this);
  }

  addGold(amount) {
    this.gold = Math.max(0, this.gold + amount);
    eventBus.emit('PLAYER_GOLD_CHANGE', this.gold);
  }

  recalculateStats(equippedItems = {}) {
    const base = this.classData.baseStats;

    let bonusHp = (this.stats.vit - base.vit) * 15;
    let bonusMp = (this.stats.int - base.int) * 10;
    let bonusAtk = (this.stats.str - base.str) * 2.5 + (this.stats.dex - base.dex) * 1.5;
    let bonusMAtk = (this.stats.int - base.int) * 3.0;
    let bonusDef = (this.stats.vit - base.vit) * 1.8;
    let bonusMDef = (this.stats.int - base.int) * 1.2;
    let bonusCrit = (this.stats.luk - base.luk) * 0.5 + (this.stats.dex - base.dex) * 0.2;

    let itemAtk = 0, itemDef = 0, itemMAtk = 0, itemMDef = 0, itemHp = 0, itemMp = 0, itemCrit = 0, itemCritDmg = 0, itemLifeSteal = 0, itemCdr = 0, itemMove = 0;

    Object.values(equippedItems).forEach(item => {
      if (!item || !item.baseStats) return;
      const s = item.baseStats;
      const enhanceMult = 1 + (item.enhancement || 0) * 0.1;

      if (s.attack) itemAtk += s.attack * enhanceMult;
      if (s.defense) itemDef += s.defense * enhanceMult;
      if (s.magicAttack) itemMAtk += s.magicAttack * enhanceMult;
      if (s.magicDefense) itemMDef += s.magicDefense * enhanceMult;
      if (s.hp) itemHp += s.hp;
      if (s.mp) itemMp += s.mp;
      if (s.critRate) itemCrit += s.critRate;
      if (s.critDmg) itemCritDmg += s.critDmg;
      if (s.lifeSteal) itemLifeSteal += s.lifeSteal;
      if (s.cdr) itemCdr += s.cdr;
      if (s.moveSpeed) itemMove += s.moveSpeed;
    });

    // Buff multipliers
    let buffAtkMult = 1.0;
    let buffDefMult = 1.0;
    this.activeBuffs.forEach(b => {
      if (b.attackBonus) buffAtkMult += b.attackBonus / 100;
      if (b.defBonus) buffDefMult += b.defBonus / 100;
    });

    this.maxHp = Math.floor((base.hp + bonusHp + itemHp) * (this.level * 0.15 + 0.85));
    this.maxMp = Math.floor(base.mp + bonusMp + itemMp);
    this.attack = Math.floor((base.attack + bonusAtk + itemAtk) * buffAtkMult);
    this.magicAttack = Math.floor((base.magicAttack + bonusMAtk + itemMAtk) * buffAtkMult);
    this.defense = Math.floor((base.defense + bonusDef + itemDef) * buffDefMult);
    this.magicDefense = Math.floor(base.magicDefense + bonusMDef + itemMDef);
    this.critRate = Math.min(80, Math.floor(base.critRate + bonusCrit + itemCrit));
    this.critDmg = Math.floor(base.critDmg + itemCritDmg);
    this.moveSpeed = base.moveSpeed + itemMove + (this.isMounted ? 3.5 : 0);
    this.cdr = Math.min(50, base.cdr + itemCdr);
    this.lifeSteal = base.lifeSteal + itemLifeSteal;

    this.hp = Math.min(this.hp, this.maxHp);
    this.mp = Math.min(this.mp, this.maxMp);
  }

  takeDamage(amount) {
    if (this.isDodging || this.isBlocking) {
      if (this.isBlocking) {
        amount = Math.floor(amount * 0.2); // 80% damage reduction when blocking
        eventBus.emit('SHOW_DAMAGE_TEXT', { text: 'BLOCKED', pos: this.mesh.position, color: '#3498db' });
      } else {
        return 0; // Perfect dodge i-frames
      }
    }

    const actualDamage = Math.max(1, Math.floor(amount - this.defense * 0.4));
    this.hp = Math.max(0, this.hp - actualDamage);

    // Charge Ultimate on taking damage
    this.addUltimateCharge(3);

    if (this.hp <= 0) {
      this.isDead = true;
      eventBus.emit('PLAYER_DIED');
    }

    eventBus.emit('PLAYER_STAT_CHANGE', this);
    return actualDamage;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    eventBus.emit('PLAYER_STAT_CHANGE', this);
  }

  restoreMp(amount) {
    this.mp = Math.min(this.maxMp, this.mp + amount);
    eventBus.emit('PLAYER_STAT_CHANGE', this);
  }

  addUltimateCharge(amount) {
    this.ultimateCharge = Math.min(100, this.ultimateCharge + amount);
    eventBus.emit('ULTIMATE_CHARGE_UPDATE', this.ultimateCharge);
  }

  update(dt) {
    // Cooldown timers
    if (this.dodgeCooldown > 0) this.dodgeCooldown = Math.max(0, this.dodgeCooldown - dt);

    Object.keys(this.skillCooldowns).forEach(key => {
      if (this.skillCooldowns[key] > 0) {
        this.skillCooldowns[key] = Math.max(0, this.skillCooldowns[key] - dt);
      }
    });

    // Passive MP regen
    if (this.mp < this.maxMp && !this.isDead) {
      this.mp = Math.min(this.maxMp, this.mp + 4 * dt);
    }
  }

  toggleMount() {
    this.isMounted = !this.isMounted;
    if (this.isMounted) {
      if (!this.mountMesh) {
        this.mountMesh = ModelBuilder.createMountModel('HORSE');
      }
      this.mesh.add(this.mountMesh);
      this.mountMesh.position.set(0, -0.6, 0);
    } else if (this.mountMesh) {
      this.mesh.remove(this.mountMesh);
    }
    this.recalculateStats();
  }

  serialize() {
    return {
      name: this.name,
      classId: this.classId,
      customization: this.customization,
      level: this.level,
      exp: this.exp,
      gold: this.gold,
      stats: this.stats,
      skillPoints: this.skillPoints,
      title: this.title,
      position: { x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z }
    };
  }
}
