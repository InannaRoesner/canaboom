import * as THREE from 'three';
import type { ParticleData } from '../api/client';

export type LiveParticle = ParticleData & {
  maxLife: number;
  r: number; g: number; b: number;
  expires: number;
};

export class MobileFireSystem {
  private particles: LiveParticle[] = [];
  private points: THREE.Points;
  private geo: THREE.BufferGeometry;

  constructor(scene: THREE.Scene) {
    this.geo = new THREE.BufferGeometry();
    const mat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.points = new THREE.Points(this.geo, mat);
    scene.add(this.points);
  }

  burst(worldPos: THREE.Vector3, serverParticles: ParticleData[], durationMs = 2500) {
    const color = new THREE.Color();
    for (const p of serverParticles.slice(0, 90)) {
      color.set(p.color || '#ff6b35');
      this.particles.push({
        ...p,
        x: worldPos.x + p.x,
        y: worldPos.y + p.y,
        z: worldPos.z + p.z,
        maxLife: p.life,
        r: color.r,
        g: color.g,
        b: color.b,
        expires: Date.now() + durationMs,
      });
    }
  }

  update(dt: number) {
    const now = Date.now();
    this.particles = this.particles.filter((p) => now < p.expires && p.life > 0);
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vy -= 1.5 * dt;
      p.life -= dt * 0.55;
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
      col[i * 3 + 1] = p.g * fade * 0.55;
      col[i * 3 + 2] = p.b * fade * 0.15;
    }
    this.geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.geo.setDrawRange(0, n);
  }
}
