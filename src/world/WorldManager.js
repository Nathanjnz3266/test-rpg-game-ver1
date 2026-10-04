import * as THREE from 'three';
import { REGIONS } from '../data/regions.js';
import { ModelBuilder } from '../entities/3d/ModelBuilder.js';
import { Environment } from './Environment.js';
import { eventBus } from '../core/EventBus.js';

export class WorldManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7ec0ee);
    this.scene.fog = new THREE.FogExp2(0xa8e0ff, 0.005);

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.cameraDistance = 9.0;
    this.cameraPitch = 0.35; // radians pitch angle
    this.cameraYaw = 0; // radians yaw angle

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Environment
    this.environment = new Environment(this.scene);

    // Current Active Region
    this.currentRegionKey = 'GREENVALE';
    this.currentRegion = REGIONS.GREENVALE;

    // World Elements
    this.terrainMesh = null;
    this.shrines = [];
    this.dungeonPortal = null;
    this.npcs = [];

    this.initTerrain();
    this.initTownBuildings();
    this.initShrinesAndPortals();
    this.initNPCs();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initTerrain() {
    const size = 300;
    const geo = new THREE.PlaneGeometry(size, size, 64, 64);
    geo.rotateX(-Math.PI / 2);

    // Create subtle height variation
    const pos = geo.attributes.position.array;
    for (let i = 0; i < pos.length / 3; i++) {
      const x = pos[i * 3];
      const z = pos[i * 3 + 2];
      // Keep town center flat
      if (Math.hypot(x, z) > 30) {
        pos[i * 3 + 1] = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 2.5;
      }
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: this.currentRegion.groundColor,
      roughness: 0.9,
      metalness: 0.1
    });

    this.terrainMesh = new THREE.Mesh(geo, mat);
    this.terrainMesh.receiveShadow = true;
    this.scene.add(this.terrainMesh);

    // Add trees & rocks around terrain
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 35 + Math.random() * 100;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const tree = ModelBuilder.createOakTree();
      tree.position.set(x, 0, z);
      const s = 0.8 + Math.random() * 0.6;
      tree.scale.set(s, s, s);
      this.scene.add(tree);
    }
  }

  initTownBuildings() {
    // Greenvale Town Plaza center buildings
    const housePositions = [
      { x: -15, z: -15 },
      { x: 15, z: -15 },
      { x: -20, z: 15 },
      { x: 20, z: 15 }
    ];

    housePositions.forEach(p => {
      const house = ModelBuilder.createTownHouse();
      house.position.set(p.x, 0, p.z);
      this.scene.add(house);
    });
  }

  initShrinesAndPortals() {
    // Teleport Crystal Shrine in Town Plaza
    const shrine = ModelBuilder.createShrineCrystal();
    shrine.position.set(0, 0, -25);
    shrine.name = 'SHRINE_GREENVALE_TOWN';
    this.scene.add(shrine);
    this.shrines.push(shrine);

    // Dungeon Portal Ring
    const portalGeo = new THREE.TorusGeometry(2.5, 0.3, 16, 32);
    const portalMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6, emissive: 0x8e44ad, roughness: 0.2 });
    this.dungeonPortal = new THREE.Mesh(portalGeo, portalMat);
    this.dungeonPortal.position.set(120, 2.5, -140);
    this.scene.add(this.dungeonPortal);
  }

  initNPCs() {
    const npcDefs = [
      { id: 'NPC_ELDER_MARCUS', name: 'Elder Marcus', title: 'Town Elder', pos: { x: 0, z: -5 }, color: 0x3498db },
      { id: 'NPC_CAPTAIN_BRYAN', name: 'Captain Bryan', title: 'Guard Captain', pos: { x: -8, z: 5 }, color: 0xe74c3c },
      { id: 'NPC_MAGE_VALERIA', name: 'High Mage Valeria', title: 'Arcane Scholar', pos: { x: 8, z: 5 }, color: 0x9b59b6 },
      { id: 'NPC_THORIN', name: 'Blacksmith Thorin', title: 'Forge Master', pos: { x: -18, z: -5 }, color: 0xe67e22 },
      { id: 'NPC_BOB', name: 'Merchant Bob', title: 'General Goods', pos: { x: 18, z: -5 }, color: 0xf1c40f }
    ];

    npcDefs.forEach(def => {
      const group = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: def.color });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 1.2, 8), bodyMat);
      body.position.y = 0.9;

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 10), new THREE.MeshStandardMaterial({ color: 0xffdbac }));
      head.position.y = 1.7;

      group.add(body, head);
      group.position.set(def.pos.x, 0, def.pos.z);
      group.name = def.id;
      group.userData = def;

      this.scene.add(group);
      this.npcs.push(group);
    });
  }

  switchRegion(regionKey) {
    if (!REGIONS[regionKey]) return;
    this.currentRegionKey = regionKey;
    this.currentRegion = REGIONS[regionKey];

    this.scene.background = new THREE.Color(this.currentRegion.skyColor);
    this.terrainMesh.material.color.setHex(this.currentRegion.groundColor);
    if (this.scene.fog) {
      this.scene.fog.color.setHex(this.currentRegion.fogColor);
      this.scene.fog.density = this.currentRegion.fogDensity;
    }
    eventBus.emit('REGION_CHANGED', this.currentRegion);
  }

  updateCamera(playerPos, dx, dy, scrollDelta, lockOnTargetPos = null) {
    // Zoom control
    if (scrollDelta !== 0) {
      this.cameraDistance = THREE.MathUtils.clamp(this.cameraDistance + scrollDelta * 1.5, 4.0, 20.0);
    }

    // Mouse Look rotation
    if (dx !== 0 || dy !== 0) {
      this.cameraYaw -= dx * 0.003;
      this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch + dy * 0.003, 0.05, 1.2);
    }

    let targetLookAt = playerPos.clone().add(new THREE.Vector3(0, 1.6, 0));

    if (lockOnTargetPos) {
      targetLookAt.lerp(lockOnTargetPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 0.4);
    }

    // Calculate over-the-shoulder Third-Person position
    const offsetX = Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
    const offsetY = Math.sin(this.cameraPitch) * this.cameraDistance;
    const offsetZ = Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

    this.camera.position.set(
      targetLookAt.x + offsetX,
      targetLookAt.y + offsetY,
      targetLookAt.z + offsetZ
    );

    this.camera.lookAt(targetLookAt);
  }

  render(dt, playerPos) {
    this.environment.update(dt, playerPos, this.currentRegion);

    // Rotate crystal shrines
    this.shrines.forEach(s => {
      const mesh = s.getObjectByName('CRYSTAL_MESH');
      if (mesh) mesh.rotation.y += 0.015;
    });

    if (this.dungeonPortal) {
      this.dungeonPortal.rotation.z += 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
