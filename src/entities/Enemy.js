import * as THREE from 'three';
import { ModelBuilder } from './3d/ModelBuilder.js';
import { eventBus } from '../core/EventBus.js';

export class Enemy {
  constructor(enemyData, spawnPos) {
    this.data = enemyData;
    this.id = enemyData.id;
    this.name = enemyData.name;
    this.level = enemyData.level;
    this.maxHp = enemyData.hp;
    this.hp = this.maxHp;
    this.attack = enemyData.attack;
    this.defense = enemyData.defense;
    this.moveSpeed = enemyData.moveSpeed;
    this.attackRange = enemyData.attackRange || 2.5;
    this.attackRate = enemyData.attackRate || 1.8;
    this.expYield = enemyData.expYield;
    this.goldYield = enemyData.goldYield;

    // AI States
    this.state = 'IDLE'; // IDLE, PATROL, CHASE, ATTACK, STAGGER, FLEE, DEAD
    this.spawnPos = spawnPos.clone();
    this.attackCooldown = 0;
    this.staggerTimer = 0;

    // 3D Mesh
    this.mesh = ModelBuilder.createEnemyModel(enemyData);
    this.mesh.position.copy(spawnPos);
  }

  update(dt, playerPos, player) {
    if (this.state === 'DEAD') return;

    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    if (this.state === 'STAGGER') {
      this.staggerTimer -= dt;
      if (this.staggerTimer <= 0) this.state = 'CHASE';
      return;
    }

    const distToPlayer = this.mesh.position.distanceTo(playerPos);
    const detectRadius = 16.0;

    // Flee condition if low HP and mob flees
    if (this.hp / this.maxHp < 0.15 && this.data.canFlee) {
      this.state = 'FLEE';
    } else if (distToPlayer <= detectRadius) {
      if (distToPlayer <= this.attackRange) {
        this.state = 'ATTACK';
      } else {
        this.state = 'CHASE';
      }
    } else {
      this.state = 'IDLE';
    }

    // State Execution
    if (this.state === 'CHASE') {
      const dir = new THREE.Vector3().subVectors(playerPos, this.mesh.position).normalize();
      dir.y = 0; // Lock to ground plane
      this.mesh.position.addScaledVector(dir, this.moveSpeed * dt);
      this.mesh.lookAt(playerPos.x, this.mesh.position.y, playerPos.z);
    } else if (this.state === 'ATTACK') {
      this.mesh.lookAt(playerPos.x, this.mesh.position.y, playerPos.z);
      if (this.attackCooldown <= 0) {
        this.performAttack(player);
        this.attackCooldown = this.attackRate;
      }
    } else if (this.state === 'FLEE') {
      const fleeDir = new THREE.Vector3().subVectors(this.mesh.position, playerPos).normalize();
      fleeDir.y = 0;
      this.mesh.position.addScaledVector(fleeDir, this.moveSpeed * 1.2 * dt);
    }
  }

  performAttack(player) {
    if (player.isDead) return;
    const dmg = player.takeDamage(this.attack);
    eventBus.emit('SHOW_DAMAGE_TEXT', {
      text: `-${dmg}`,
      pos: player.mesh.position,
      color: '#e74c3c'
    });
  }

  takeDamage(amount, isCrit = false) {
    if (this.state === 'DEAD') return 0;

    const netDamage = Math.max(1, Math.floor(amount - this.defense * 0.3));
    this.hp -= netDamage;

    // Stagger animation state trigger
    if (netDamage > this.maxHp * 0.2) {
      this.state = 'STAGGER';
      this.staggerTimer = 0.5;
    } else if (this.state === 'IDLE') {
      this.state = 'CHASE';
    }

    eventBus.emit('SHOW_DAMAGE_TEXT', {
      text: isCrit ? `CRIT! ${netDamage}` : `${netDamage}`,
      pos: this.mesh.position,
      color: isCrit ? '#f39c12' : '#ffffff',
      isCrit: isCrit
    });

    if (this.hp <= 0) {
      this.hp = 0;
      this.state = 'DEAD';
      eventBus.emit('ENEMY_KILLED', this);
    }

    return netDamage;
  }
}
