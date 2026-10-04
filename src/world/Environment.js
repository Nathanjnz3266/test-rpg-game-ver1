import * as THREE from 'three';
import { eventBus } from '../core/EventBus.js';

export class Environment {
  constructor(scene) {
    this.scene = scene;

    // Time cycle (0 = Midnight, 6 = Sunrise, 12 = Noon, 18 = Sunset)
    this.timeOfDay = 12.0;
    this.timeScale = 0.05; // hours per sec
    this.currentWeather = 'SUNNY'; // SUNNY, RAIN, FOG, STORM

    // Lighting
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    this.dirLight.position.set(50, 100, 50);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.dirLight, this.ambientLight);

    // Weather Particles (Rain)
    this.rainParticles = null;
    this.initRain();
  }

  initRain() {
    const count = 1500;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0x88ccff, size: 0.25, transparent: true, opacity: 0.7 });
    this.rainParticles = new THREE.Points(geo, mat);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  update(dt, playerPos, regionData) {
    // Progress Time of Day
    this.timeOfDay = (this.timeOfDay + dt * this.timeScale) % 24.0;

    const angle = (this.timeOfDay / 24.0) * Math.PI * 2;
    this.dirLight.position.x = Math.cos(angle) * 100 + playerPos.x;
    this.dirLight.position.y = Math.sin(angle) * 100;
    this.dirLight.position.z = Math.sin(angle) * 50 + playerPos.z;

    const isNight = this.timeOfDay < 6.0 || this.timeOfDay > 18.0;

    if (isNight) {
      this.dirLight.intensity = 0.2;
      this.dirLight.color.setHex(0x5566aa);
      this.ambientLight.intensity = 0.25;
      this.scene.background = new THREE.Color(0x050a15);
      if (this.scene.fog) this.scene.fog.color.setHex(0x050a15);
    } else {
      this.dirLight.intensity = 1.2;
      this.dirLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 0.6;
      this.scene.background = new THREE.Color(regionData.skyColor);
      if (this.scene.fog) this.scene.fog.color.setHex(regionData.fogColor);
    }

    // Weather particles update
    if (this.currentWeather === 'RAIN' || this.currentWeather === 'STORM') {
      this.rainParticles.visible = true;
      this.rainParticles.position.copy(playerPos);
      const pos = this.rainParticles.geometry.attributes.position.array;
      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3 + 1] -= 35 * dt;
        if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = 40;
      }
      this.rainParticles.geometry.attributes.position.needsUpdate = true;
    } else {
      this.rainParticles.visible = false;
    }

    eventBus.emit('TIME_WEATHER_UPDATE', {
      timeOfDay: this.timeOfDay,
      isNight: isNight,
      weather: this.currentWeather
    });
  }

  setWeather(type) {
    this.currentWeather = type;
  }
}
