import * as THREE from 'three';
import { ModelBuilder } from './3d/ModelBuilder.js';
import { eventBus } from '../core/EventBus.js';

export class Boss {
  constructor(bossData, spawnPos) {
    this.data = bossData;
    this.id = bossData.id;
    this.name = bossData.name;
    this.level = bossData.level;
    this.maxHp = bossData.hp;
    this.hp = this.maxHp;
    this.attack = bossData.attack;
    this.defense = bossData.defense;
    this.moveSpeed = bossData.moveSpeed || 5.0;
    this.expYield = bossData.expYield;
    this.goldYield = bossData.goldYield;

    this.currentPhaseIndex = 0;
    this.phases = bossData.phases;
    this.currentPhase = this.phases[0];

    this.state = 'IDLE';
    this.attackCooldown = 0;
    this.telegraphTimer = 0;
    this.activeTelegraphMesh = null;
    this.pendingAttackType = null;

    // 3D Mesh
    this.mesh = ModelBuilder.createBossModel(bossData);
    this.mesh.position.copy(spawnPos);
  }

  update(dt, playerPos, player, scene) {
    if (this.state === 'DEAD') return;

    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    // Handle AOE Telegraph Countdown
    if (this.telegraphTimer > 0) {
      this.telegraphTimer -= dt;
      if (this.telegraphTimer <= 0) {
        this.executeTelegraphedAttack(player, scene);
      }
      return;
    }

    // Check Phase shift based on HP ratio
    const hpRatio = this.hp / this.maxHp;
    for (let i = this.phases.length - 1; i > this.currentPhaseIndex; i--) {
      if (hpRatio <= this.phases[i].hpThreshold) {
        this.currentPhaseIndex = i;
        this.currentPhase = this.phases[i];
        if (this.currentPhase.attackBuff) {
          this.attack *= this.currentPhase.attackBuff;
        }
        eventBus.emit('BOSS_PHASE_SHIFT', { boss: this, phase: this.currentPhase });
        break;
      }
    }

    const distToPlayer = this.mesh.position.distanceTo(playerPos);
    if (distToPlayer <= 35.0) {
      if (this.attackCooldown <= 0) {
        this.startTelegraphedAttack(playerPos, scene);
        this.attackCooldown = 3.5;
      } else if (distToPlayer > 4.0) {
        const dir = new THREE.Vector3().subVectors(playerPos, this.mesh.position).normalize();
        dir.y = 0;
        this.mesh.position.addScaledVector(dir, this.moveSpeed * dt);
        this.mesh.lookAt(playerPos.x, this.mesh.position.y, playerPos.z);
      }
    }
  }

  startTelegraphedAttack(playerPos, scene) {
    const attacks = this.currentPhase.attacks;
    const attackType = attacks[Math.floor(Math.random() * attacks.length)];
    this.pendingAttackType = attackType;
    this.telegraphTimer = 1.5; // 1.5 second warning delay for player to dodge!

    // Create Red Glowing AOE Warning Ring on ground
    const aoeGeo = new THREE.RingGeometry(0.1, 4.5, 32);
    const aoeMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    this.activeTelegraphMesh = new THREE.Mesh(aoeGeo, aoeMat);
    this.activeTelegraphMesh.rotation.x = -Math.PI / 2;
    this.activeTelegraphMesh.position.set(playerPos.x, playerPos.y + 0.05, playerPos.z);
    scene.add(this.activeTelegraphMesh);
  }

  executeTelegraphedAttack(player, scene) {
    if (this.activeTelegraphMesh) {
      scene.remove(this.activeTelegraphMesh);
      this.activeTelegraphMesh.geometry.dispose();
      this.activeTelegraphMesh.material.dispose();
      this.activeTelegraphMesh = null;
    }

    if (player.isDead) return;

    const distToTelegraph = player.mesh.position.distanceTo(
      this.activeTelegraphMesh ? this.activeTelegraphMesh.position : player.mesh.position
    );

    let damageMult = 1.5;
    if (this.pendingAttackType === 'THORN_CYCLONE' || this.pendingAttackType === 'METEOR_BOMBARD' || this.pendingAttackType === 'VOID_NOVA') {
      damageMult = 2.5;
    }

    const dmg = player.takeDamage(this.attack * damageMult);
    eventBus.emit('SHOW_DAMAGE_TEXT', {
      text: `BOSS HIT! -${dmg}`,
      pos: player.mesh.position,
      color: '#ff0033'
    });
    eventBus.emit('SCREEN_SHAKE', 0.4);
  }

  takeDamage(amount, isCrit = false) {
    if (this.state === 'DEAD') return 0;

    const netDamage = Math.max(1, Math.floor(amount - this.defense * 0.25));
    this.hp -= netDamage;

    eventBus.emit('SHOW_DAMAGE_TEXT', {
      text: isCrit ? `CRIT! ${netDamage}` : `${netDamage}`,
      pos: this.mesh.position,
      color: isCrit ? '#ffcc00' : '#ffffff',
      isCrit: isCrit
    });

    eventBus.emit('BOSS_HP_UPDATE', this);

    if (this.hp <= 0) {
      this.hp = 0;
      this.state = 'DEAD';
      eventBus.emit('BOSS_KILLED', this);
    }

    return netDamage;
  }
}
