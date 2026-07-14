/** WhatsApp-Emoji-Stil: rote Spitze, weißer Rumpf, blaues Fenster */
import * as THREE from 'three';

export type OrbitalRocket = {
  mesh: THREE.Group;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
};

export function createAstronautRocket(scale = 1): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22 * scale, 0.28 * scale, 1.3 * scale, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.15 })
  );
  body.position.y = 0.65 * scale;
  g.add(body);
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.28 * scale, 0.65 * scale, 16),
    new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.35 })
  );
  nose.position.y = 1.45 * scale;
  g.add(nose);
  const windowMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.11 * scale, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x2563eb, emissiveIntensity: 0.55 })
  );
  windowMesh.position.set(0, 0.8 * scale, 0.26 * scale);
  g.add(windowMesh);
  const finMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
  [-1, 1].forEach((s) => {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.07 * scale, 0.32 * scale, 0.22 * scale), finMat);
    fin.position.set(s * 0.26 * scale, 0.22 * scale, 0);
    g.add(fin);
  });
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.12 * scale, 0.35 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.9 })
  );
  flame.position.y = -0.05 * scale;
  flame.rotation.x = Math.PI;
  g.add(flame);
  return g;
}

export function spawnOrbitalRockets(count = 3): OrbitalRocket[] {
  const rockets: OrbitalRocket[] = [];
  for (let i = 0; i < count; i++) {
    const mesh = createAstronautRocket(0.75 + i * 0.15);
    rockets.push({
      mesh,
      orbitRadius: 8 + i * 1.2,
      orbitAngle: (i / count) * Math.PI * 2,
      orbitSpeed: 0.12 + i * 0.04,
    });
  }
  return rockets;
}

export function updateRockets(rockets: OrbitalRocket[], t: number, planetY = 6): void {
  rockets.forEach((r) => {
    r.orbitAngle += r.orbitSpeed * 0.016;
    const a = r.orbitAngle;
    r.mesh.position.set(
      Math.cos(a) * r.orbitRadius,
      planetY * 0.35 + Math.sin(t + a) * 0.4,
      Math.sin(a) * r.orbitRadius
    );
    r.mesh.lookAt(0, planetY, 0);
  });
}
