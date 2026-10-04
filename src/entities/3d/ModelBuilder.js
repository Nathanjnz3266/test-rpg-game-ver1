import * as THREE from 'three';

export class ModelBuilder {
  // --- PLAYER MODEL GENERATOR ---
  static createPlayerModel(customization = {}) {
    const group = new THREE.Group();

    const skinColor = customization.skinColor || 0xffdbac;
    const hairColor = customization.hairColor || 0x2c1d11;
    const outfitColor = customization.outfitColor || 0x2b3e50;
    const armorColor = customization.armorColor || 0x7f8c8d;
    const classType = customization.classType || 'WARRIOR';

    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 });
    const outfitMat = new THREE.MeshStandardMaterial({ color: outfitColor, roughness: 0.5 });
    const armorMat = new THREE.MeshStandardMaterial({ color: armorColor, metalness: 0.7, roughness: 0.3 });

    // Torso / Body
    const torsoGeo = new THREE.CylinderGeometry(0.4, 0.35, 1.1, 10);
    const torso = new THREE.Mesh(torsoGeo, outfitMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    group.add(torso);

    // Armor Chest Piece
    const chestPlateGeo = new THREE.BoxGeometry(0.85, 0.6, 0.55);
    const chestPlate = new THREE.Mesh(chestPlateGeo, armorMat);
    chestPlate.position.y = 1.25;
    chestPlate.castShadow = true;
    group.add(chestPlate);

    // Head
    const headGeo = new THREE.SphereGeometry(0.32, 12, 12);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.95;
    head.castShadow = true;
    group.add(head);

    // Hair
    const hairGeo = new THREE.ConeGeometry(0.36, 0.4, 10);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 2.15;
    hair.rotation.x = -0.2;
    group.add(hair);

    // Shoulders
    const shoulderGeo = new THREE.SphereGeometry(0.22, 8, 8);
    const leftShoulder = new THREE.Mesh(shoulderGeo, armorMat);
    leftShoulder.position.set(-0.5, 1.5, 0);
    const rightShoulder = new THREE.Mesh(shoulderGeo, armorMat);
    rightShoulder.position.set(0.5, 1.5, 0);
    group.add(leftShoulder, rightShoulder);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.8, 8);
    const leftArm = new THREE.Mesh(armGeo, skinMat);
    leftArm.position.set(-0.5, 1.0, 0);
    const rightArm = new THREE.Mesh(armGeo, skinMat);
    rightArm.position.set(0.5, 1.0, 0);
    group.add(leftArm, rightArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.15, 0.12, 0.9, 8);
    const leftLeg = new THREE.Mesh(legGeo, outfitMat);
    leftLeg.position.set(-0.2, 0.45, 0);
    const rightLeg = new THREE.Mesh(legGeo, outfitMat);
    rightLeg.position.set(0.2, 0.45, 0);
    group.add(leftLeg, rightLeg);

    // Boots
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
    const bootGeo = new THREE.BoxGeometry(0.25, 0.2, 0.35);
    const leftBoot = new THREE.Mesh(bootGeo, bootMat);
    leftBoot.position.set(-0.2, 0.1, 0.05);
    const rightBoot = new THREE.Mesh(bootGeo, bootMat);
    rightBoot.position.set(0.2, 0.1, 0.05);
    group.add(leftBoot, rightBoot);

    // Class Weapon Mesh
    const weaponGroup = new THREE.Group();
    weaponGroup.name = 'WEAPON_CONTAINER';

    if (classType === 'WARRIOR' || classType === 'PALADIN') {
      // Sword & Shield
      const bladeGeo = new THREE.BoxGeometry(0.1, 1.2, 0.04);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.9, roughness: 0.1 });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(0.65, 1.1, 0.4);
      blade.rotation.x = Math.PI / 4;
      weaponGroup.add(blade);

      const shieldGeo = new THREE.CylinderGeometry(0.4, 0.3, 0.08, 6);
      const shieldMat = new THREE.MeshStandardMaterial({ color: 0xb8860b, metalness: 0.6, roughness: 0.4 });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      shield.position.set(-0.6, 1.0, 0.2);
      shield.rotation.y = Math.PI / 2;
      weaponGroup.add(shield);
    } else if (classType === 'MAGE') {
      // Staff with Orb
      const staffGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8);
      const staffMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.7 });
      const staff = new THREE.Mesh(staffGeo, staffMat);
      staff.position.set(0.65, 1.0, 0.2);

      const orbGeo = new THREE.SphereGeometry(0.2, 12, 12);
      const orbMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00aaaa, roughness: 0.1 });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(0.65, 1.9, 0.2);
      weaponGroup.add(staff, orb);
    } else if (classType === 'RANGER') {
      // Bow
      const bowGeo = new THREE.TorusGeometry(0.6, 0.03, 8, 12, Math.PI);
      const bowMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      const bow = new THREE.Mesh(bowGeo, bowMat);
      bow.position.set(0.6, 1.0, 0);
      bow.rotation.y = Math.PI / 2;
      weaponGroup.add(bow);
    } else if (classType === 'ASSASSIN') {
      // Dual Daggers
      const daggerMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 });
      const daggerGeo = new THREE.BoxGeometry(0.06, 0.6, 0.03);
      const d1 = new THREE.Mesh(daggerGeo, daggerMat);
      d1.position.set(0.6, 0.9, 0.3);
      d1.rotation.x = Math.PI / 3;
      const d2 = new THREE.Mesh(daggerGeo, daggerMat);
      d2.position.set(-0.6, 0.9, 0.3);
      d2.rotation.x = Math.PI / 3;
      weaponGroup.add(d1, d2);
    }

    group.add(weaponGroup);
    return group;
  }

  // --- ENEMY MODEL GENERATOR ---
  static createEnemyModel(enemyData) {
    const group = new THREE.Group();
    const color = enemyData.color || 0xcc3333;
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.6 });

    if (enemyData.id === 'WOLF' || enemyData.id === 'NIGHTMARE_WOLF') {
      // Quadruped Wolf model
      const bodyGeo = new THREE.BoxGeometry(0.8, 0.7, 1.6);
      const body = new THREE.Mesh(bodyGeo, mat);
      body.position.y = 0.6;
      body.castShadow = true;

      const headGeo = new THREE.ConeGeometry(0.35, 0.7, 6);
      const head = new THREE.Mesh(headGeo, mat);
      head.position.set(0, 0.8, 0.9);
      head.rotation.x = Math.PI / 2;

      group.add(body, head);
    } else if (enemyData.id === 'VOLCANO_GOLEM') {
      // Golem jagged rock model
      const coreGeo = new THREE.DodecahedronGeometry(1.0, 0);
      const lavaMat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xaa2200, roughness: 0.4 });
      const core = new THREE.Mesh(coreGeo, lavaMat);
      core.position.y = 1.2;

      const headGeo = new THREE.BoxGeometry(0.6, 0.5, 0.6);
      const head = new THREE.Mesh(headGeo, mat);
      head.position.y = 2.1;

      group.add(core, head);
    } else {
      // Bipedal Goblin / Skeleton / Orc
      const bodyGeo = new THREE.CylinderGeometry(0.4, 0.3, 1.2, 8);
      const body = new THREE.Mesh(bodyGeo, mat);
      body.position.y = 0.9;
      body.castShadow = true;

      const headGeo = new THREE.SphereGeometry(0.35, 10, 10);
      const head = new THREE.Mesh(headGeo, mat);
      head.position.y = 1.75;
      head.castShadow = true;

      const armGeo = new THREE.BoxGeometry(0.18, 0.7, 0.18);
      const leftArm = new THREE.Mesh(armGeo, mat);
      leftArm.position.set(-0.55, 1.0, 0);
      const rightArm = new THREE.Mesh(armGeo, mat);
      rightArm.position.set(0.55, 1.0, 0);

      group.add(body, head, leftArm, rightArm);
    }

    const s = enemyData.scale || 1.0;
    group.scale.set(s, s, s);
    return group;
  }

  // --- BOSS MODEL GENERATOR ---
  static createBossModel(bossData) {
    const group = new THREE.Group();

    if (bossData.id === 'BOSS_INFERNO_DRAGON') {
      // Impressive Dragon Mesh with Wings
      const bodyGeo = new THREE.CylinderGeometry(0.8, 1.2, 3.5, 10);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xaa0000, roughness: 0.3, metalness: 0.4 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.x = Math.PI / 3;
      body.position.y = 2.0;

      const neckGeo = new THREE.CylinderGeometry(0.5, 0.8, 2.0, 8);
      const neck = new THREE.Mesh(neckGeo, bodyMat);
      neck.position.set(0, 3.2, 1.0);
      neck.rotation.x = -Math.PI / 6;

      const headGeo = new THREE.ConeGeometry(0.6, 1.5, 8);
      const headMat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0x661100 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(0, 4.0, 1.8);
      head.rotation.x = Math.PI / 2;

      // Wings
      const wingGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, 0,
        3.5, 2.0, -1.0,
        2.5, -1.0, -2.0
      ]);
      wingGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      wingGeo.computeVertexNormals();
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x880000, side: THREE.DoubleSide });

      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.set(0.8, 2.5, 0);

      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.set(-0.8, 2.5, 0);
      rightWing.rotation.y = Math.PI;

      group.add(body, neck, head, leftWing, rightWing);
    } else if (bossData.id === 'BOSS_FOREST_GUARDIAN') {
      // Treant Ancient Boss
      const trunkGeo = new THREE.CylinderGeometry(1.2, 1.6, 4.0, 8);
      const barkMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, barkMat);
      trunk.position.y = 2.0;

      const foliageGeo = new THREE.DodecahedronGeometry(2.2, 1);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.6 });
      const foliage = new THREE.Mesh(foliageGeo, leafMat);
      foliage.position.y = 4.5;

      group.add(trunk, foliage);
    } else {
      // Sovereign / Werewolf Boss
      const bodyGeo = new THREE.CylinderGeometry(1.0, 0.8, 3.2, 10);
      const bossMat = new THREE.MeshStandardMaterial({ color: bossData.color || 0x4a148c, roughness: 0.3 });
      const body = new THREE.Mesh(bodyGeo, bossMat);
      body.position.y = 1.6;

      const crownGeo = new THREE.ConeGeometry(0.8, 1.0, 6);
      const crownMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9 });
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.y = 3.6;

      group.add(body, crown);
    }

    const scale = bossData.scale || 2.5;
    group.scale.set(scale, scale, scale);
    return group;
  }

  // --- MOUNT MODEL GENERATOR ---
  static createMountModel(type = 'HORSE') {
    const group = new THREE.Group();
    const horseMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.7 });

    const bodyGeo = new THREE.BoxGeometry(1.0, 0.9, 2.2);
    const body = new THREE.Mesh(bodyGeo, horseMat);
    body.position.y = 1.2;

    const headGeo = new THREE.BoxGeometry(0.5, 0.6, 1.0);
    const head = new THREE.Mesh(headGeo, horseMat);
    head.position.set(0, 1.8, 1.1);
    head.rotation.x = Math.PI / 6;

    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.2, 8);
    const leg1 = new THREE.Mesh(legGeo, horseMat); leg1.position.set(-0.4, 0.6, 0.8);
    const leg2 = new THREE.Mesh(legGeo, horseMat); leg2.position.set(0.4, 0.6, 0.8);
    const leg3 = new THREE.Mesh(legGeo, horseMat); leg3.position.set(-0.4, 0.6, -0.8);
    const leg4 = new THREE.Mesh(legGeo, horseMat); leg4.position.set(0.4, 0.6, -0.8);

    group.add(body, head, leg1, leg2, leg3, leg4);
    return group;
  }

  // --- ENVIRONMENT ASSETS GENERATOR ---
  static createOakTree() {
    const group = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.4, 0.6, 3.5, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.75;
    trunk.castShadow = true;

    const leavesGeo = new THREE.DodecahedronGeometry(2.0, 1);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = 4.0;
    leaves.castShadow = true;

    group.add(trunk, leaves);
    return group;
  }

  static createTownHouse() {
    const group = new THREE.Group();

    const wallsGeo = new THREE.BoxGeometry(6, 4, 6);
    const wallsMat = new THREE.MeshStandardMaterial({ color: 0xdfd3c3, roughness: 0.8 });
    const walls = new THREE.Mesh(wallsGeo, wallsMat);
    walls.position.y = 2.0;

    const roofGeo = new THREE.ConeGeometry(5.0, 3.0, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x8d281e, roughness: 0.5 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 5.5;
    roof.rotation.y = Math.PI / 4;

    group.add(walls, roof);
    return group;
  }

  static createShrineCrystal() {
    const group = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.6, 8);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.3;

    const crystalGeo = new THREE.OctahedronGeometry(1.0, 0);
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00aaaa, roughness: 0.1 });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.y = 1.8;
    crystal.name = 'CRYSTAL_MESH';

    group.add(base, crystal);
    return group;
  }

  static createLootOrb(rarityColor = 0xffd700) {
    const group = new THREE.Group();
    const orbGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const orbMat = new THREE.MeshStandardMaterial({ color: rarityColor, emissive: rarityColor, roughness: 0.2 });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.y = 0.5;

    const light = new THREE.PointLight(rarityColor, 1.5, 4);
    light.position.y = 0.5;
    group.add(orb, light);
    return group;
  }
}
