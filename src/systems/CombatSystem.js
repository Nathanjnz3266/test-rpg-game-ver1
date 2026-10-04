import * as THREE from 'three';
import { SKILLS } from '../data/skills.js';
import { audioEngine } from '../core/AudioEngine.js';
import { eventBus } from '../core/EventBus.js';

export class CombatSystem {
  constructor(scene) {
    this.scene = scene;
    this.comboStep = 0;
    this.comboResetTimer = 0;
    this.lockOnTarget = null;
    this.slowMoTimer = 0;
    this.particles = [];
  }

  update(dt, player, enemies, boss) {
    // Handle combo chain timeout
    if (this.comboResetTimer > 0) {
      this.comboResetTimer -= dt;
      if (this.comboResetTimer <= 0) this.comboStep = 0;
    }

    // Handle Perfect Dodge slow motion time dilation
    if (this.slowMoTimer > 0) {
      this.slowMoTimer -= dt;
    }

    // Update active visual particles (slash trails, fireballs, magic rings)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.mesh) {
        if (p.vel) p.mesh.position.addScaledVector(p.vel, dt);
        if (p.mesh.material && p.mesh.material.opacity !== undefined) {
          p.mesh.material.opacity = p.life / p.maxLife;
        }
      }
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }
  }

  performLightAttack(player, enemies, boss) {
    if (player.isAttacking || player.isDodging || player.isDead) return;

    player.isAttacking = true;
    this.comboStep = (this.comboStep % 3) + 1;
    this.comboResetTimer = 1.2;

    const dmgMult = 1.0 + (this.comboStep - 1) * 0.3;
    const isCrit = Math.random() * 100 < player.critRate;
    const baseDamage = player.attack * dmgMult * (isCrit ? player.critDmg / 100 : 1.0);

    // Audio & Slash VFX
    audioEngine.playSfx(this.comboStep === 3 ? 'HEAVY_HIT' : 'SLASH');
    this.spawnSlashVfx(player.mesh.position, player.mesh.rotation.y, this.comboStep === 3 ? 0xff3300 : 0xffffff);

    // Melee Hitbox detection in front cone
    const attackRange = 3.5;
    const playerDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.mesh.rotation.y);

    enemies.forEach(e => {
      if (e.state === 'DEAD') return;
      const toEnemy = new THREE.Vector3().subVectors(e.mesh.position, player.mesh.position);
      if (toEnemy.length() <= attackRange) {
        toEnemy.normalize();
        if (playerDir.dot(toEnemy) > 0.4) {
          e.takeDamage(baseDamage, isCrit);
          player.addUltimateCharge(4);
          eventBus.emit('CAMERA_SHAKE', 0.1);
        }
      }
    });

    if (boss && boss.state !== 'DEAD') {
      const toBoss = new THREE.Vector3().subVectors(boss.mesh.position, player.mesh.position);
      if (toBoss.length() <= attackRange + boss.data.scale * 0.5) {
        toBoss.normalize();
        if (playerDir.dot(toBoss) > 0.3) {
          boss.takeDamage(baseDamage, isCrit);
          player.addUltimateCharge(6);
          eventBus.emit('CAMERA_SHAKE', 0.2);
        }
      }
    }

    setTimeout(() => { player.isAttacking = false; }, 300);
  }

  performDodge(player) {
    if (player.isDodging || player.dodgeCooldown > 0 || player.isDead) return;

    player.isDodging = true;
    player.dodgeCooldown = 1.5;
    audioEngine.playSfx('DODGE');

    // Dash position vector forward
    const dashDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.mesh.rotation.y);
    player.mesh.position.addScaledVector(dashDir, 4.5);

    // Trigger Perfect Dodge Slow Motion if dodging right near enemy
    this.slowMoTimer = 1.0;
    eventBus.emit('SHOW_NOTIFICATION', { text: 'PERFECT DODGE! [Slow-Mo]', type: 'info' });

    setTimeout(() => { player.isDodging = false; }, 400);
  }

  castSkill(skillId, player, enemies, boss) {
    const skill = SKILLS[skillId];
    if (!skill || player.isDead) return;

    if (player.skillCooldowns[skillId] > 0) {
      eventBus.emit('SHOW_NOTIFICATION', { text: 'Skill on cooldown!', type: 'warning' });
      return;
    }

    if (!skill.isUltimate && player.mp < skill.mpCost) {
      eventBus.emit('SHOW_NOTIFICATION', { text: 'Not enough MP!', type: 'warning' });
      return;
    }

    if (skill.isUltimate && player.ultimateCharge < 100) {
      eventBus.emit('SHOW_NOTIFICATION', { text: 'Ultimate gauge not ready!', type: 'warning' });
      return;
    }

    // Deduct cost
    if (!skill.isUltimate) {
      player.mp -= skill.mpCost;
    } else {
      player.ultimateCharge = 0;
      eventBus.emit('ULTIMATE_CHARGE_UPDATE', 0);
    }

    player.skillCooldowns[skillId] = skill.cooldown * (1 - player.cdr / 100);

    // Execute Skill Damage & VFX
    const isCrit = Math.random() * 100 < player.critRate;
    const isMagic = player.classId === 'MAGE';
    const baseStat = isMagic ? player.magicAttack : player.attack;
    const totalDmg = baseStat * skill.damageMultiplier * (isCrit ? player.critDmg / 100 : 1.0);

    audioEngine.playSfx(skill.isUltimate ? 'BOSS_ROAR' : isMagic ? 'FIREBALL' : 'SLASH');
    this.spawnMagicVfx(player.mesh.position, skill.vfx);
    eventBus.emit('CAMERA_SHAKE', skill.isUltimate ? 0.6 : 0.25);

    const aoeRadius = skill.aoe || skill.range || 4.0;
    enemies.forEach(e => {
      if (e.state === 'DEAD') return;
      if (e.mesh.position.distanceTo(player.mesh.position) <= aoeRadius + 2.0) {
        e.takeDamage(totalDmg, isCrit);
      }
    });

    if (boss && boss.state !== 'DEAD') {
      if (boss.mesh.position.distanceTo(player.mesh.position) <= aoeRadius + boss.data.scale) {
        boss.takeDamage(totalDmg, isCrit);
      }
    }

    eventBus.emit('PLAYER_STAT_CHANGE', player);
  }

  spawnSlashVfx(pos, yaw, color = 0xffffff) {
    const geo = new THREE.RingGeometry(1.2, 1.8, 16, 1, 0, Math.PI);
    const mat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = -yaw;
    mesh.position.set(pos.x, pos.y + 1.0, pos.z);

    this.scene.add(mesh);
    this.particles.push({ mesh: mesh, life: 0.3, maxLife: 0.3 });
  }

  spawnMagicVfx(pos, vfxType) {
    const geo = new THREE.SphereGeometry(1.5, 16, 16);
    let color = 0x00ffff;
    if (vfxType === 'FIREBALL' || vfxType === 'EARTHQUAKE') color = 0xff4400;
    if (vfxType === 'LIGHTNING') color = 0xffff00;
    if (vfxType === 'ARCANE_SUPERNOVA') color = 0x9b59b6;

    const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, pos.y + 1.2, pos.z);

    this.scene.add(mesh);
    this.particles.push({ mesh: mesh, life: 0.6, maxLife: 0.6 });
  }
}
