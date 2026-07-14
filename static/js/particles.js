/**
 * Dynamisches Feuer-Partikel-System für Plasma-Werfer & Flammen-Raketen
 */
import * as THREE from 'three';

export class FireParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.geo = new THREE.BufferGeometry();
    this.mat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.points = new THREE.Points(this.geo, this.mat);
    scene.add(this.points);
  }

  burst(worldPos, serverParticles, durationMs = 2000) {
    const color = new THREE.Color();
    for (const p of serverParticles.slice(0, 80)) {
      color.set(p.color || '#ff6b35');
      this.particles.push({
        x: worldPos.x + (p.x || 0),
        y: worldPos.y + (p.y || 0),
        z: worldPos.z + (p.z || 0),
        vx: p.vx || 0,
        vy: p.vy || 0,
        vz: p.vz || 0,
        life: p.life || 0.8,
        maxLife: p.life || 0.8,
        size: p.size || 0.12,
        r: color.r,
        g: color.g,
        b: color.b,
        expires: performance.now() + durationMs,
      });
    }
  }

  update(dt) {
    const now = performance.now();
    this.particles = this.particles.filter((p) => now < p.expires && p.life > 0);
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vy -= 1.2 * dt;
      p.life -= dt * 0.5;
    }
    const n = this.particles.length;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const p = this.particles[i];
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
      const fade = p.life / p.maxLife;
      col[i * 3] = p.r * fade;
      col[i * 3 + 1] = p.g * fade * 0.6;
      col[i * 3 + 2] = p.b * fade * 0.2;
    }
    this.geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.geo.setDrawRange(0, n);
  }
}
