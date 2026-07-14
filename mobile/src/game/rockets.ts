/**
 * WhatsApp-Style Rakete — Vorlage: rocket-reference.png
 * Silber-blauer Rumpf, rote Nase & Flossen, blaues Bullauge mit Sternen, Flammen-Schweif
 */
import * as THREE from 'three';

export type OrbitalRocket = {
  mesh: THREE.Group;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  role: 'lander' | 'gunboat';
};

const SILVER = 0x9ca8b8;
const RED = 0xdc2626;
const RED_GLOSS = 0xef4444;

function starryPortholeMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0x1e3a8a,
    emissive: 0x2563eb,
    emissiveIntensity: 0.7,
    metalness: 0.1,
    roughness: 0.2,
  });
}

/** Referenzbild: bullet-shaped rocket mit 3 roten Flossen */
export function createWhatsAppRocket(scale = 1, role: 'lander' | 'gunboat' = 'lander'): THREE.Group {
  const g = new THREE.Group();
  g.userData.role = role;

  // Silber-blauer Metallrumpf mit Paneellinien
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2 * scale, 0.26 * scale, 1.35 * scale, 20),
    new THREE.MeshStandardMaterial({
      color: SILVER,
      metalness: 0.55,
      roughness: 0.35,
    }),
  );
  body.position.y = 0.68 * scale;
  g.add(body);

  for (let i = 0; i < 4; i++) {
    const seam = new THREE.Mesh(
      new THREE.TorusGeometry(0.22 * scale, 0.008 * scale, 4, 20),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 }),
    );
    seam.rotation.x = Math.PI / 2;
    seam.position.y = 0.35 * scale + i * 0.28 * scale;
    g.add(seam);
  }

  // Rote abgerundete Spitze
  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.26 * scale, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: RED_GLOSS,
      emissive: RED,
      emissiveIntensity: 0.25,
      metalness: 0.2,
      roughness: 0.25,
    }),
  );
  nose.position.y = 1.42 * scale;
  g.add(nose);

  // Bullauge: roter Ring + blaues Glas
  const frame = new THREE.Mesh(
    new THREE.TorusGeometry(0.13 * scale, 0.025 * scale, 10, 24),
    new THREE.MeshStandardMaterial({ color: RED, metalness: 0.3 }),
  );
  frame.position.set(0, 0.78 * scale, 0.24 * scale);
  frame.rotation.y = 0.2;
  g.add(frame);
  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(0.1 * scale, 14, 14),
    starryPortholeMaterial(),
  );
  glass.position.set(0, 0.78 * scale, 0.28 * scale);
  g.add(glass);

  // 3 geschwungene rote Flossen (Referenzbild)
  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Group();
    const finBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.06 * scale, 0.38 * scale, 0.28 * scale),
      new THREE.MeshStandardMaterial({ color: RED_GLOSS, emissive: RED, emissiveIntensity: 0.15 }),
    );
    finBody.position.y = 0.18 * scale;
    fin.add(finBody);
    const angle = (i / 3) * Math.PI * 2;
    fin.position.set(Math.cos(angle) * 0.24 * scale, 0.15 * scale, Math.sin(angle) * 0.24 * scale);
    fin.rotation.y = angle;
    fin.rotation.z = 0.35;
    g.add(fin);
  }

  // Flammen-Schweif (gelb-weiß-orange)
  const flameGroup = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.ConeGeometry(0.1 * scale, 0.45 * scale, 10),
    new THREE.MeshStandardMaterial({ color: 0xfffbeb, emissive: 0xfef08a, emissiveIntensity: 1.2 }),
  );
  core.position.y = -0.12 * scale;
  core.rotation.x = Math.PI;
  flameGroup.add(core);
  const outer = new THREE.Mesh(
    new THREE.ConeGeometry(0.16 * scale, 0.55 * scale, 10),
    new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.85,
    }),
  );
  outer.position.y = -0.18 * scale;
  outer.rotation.x = Math.PI;
  flameGroup.add(outer);
  g.add(flameGroup);
  g.userData.flameGroup = flameGroup;

  if (role === 'gunboat') {
    g.scale.setScalar(scale * 1.35);
  }
  return g;
}

/** Kanonenboot-Äquivalent: Haupt-Rakete schwebt im Orbit über feindlicher Basis */
export function createOrbitGunboat(): OrbitalRocket {
  const mesh = createWhatsAppRocket(1.1, 'gunboat');
  return {
    mesh,
    orbitRadius: 0,
    orbitAngle: 0,
    orbitSpeed: 0,
    role: 'gunboat',
  };
}

export function spawnLanderRockets(count = 2): OrbitalRocket[] {
  const rockets: OrbitalRocket[] = [];
  for (let i = 0; i < count; i++) {
    rockets.push({
      mesh: createWhatsAppRocket(0.65 + i * 0.1, 'lander'),
      orbitRadius: 7.5 + i * 1.4,
      orbitAngle: (i / count) * Math.PI * 2 + 0.5,
      orbitSpeed: 0.14 + i * 0.03,
      role: 'lander',
    });
  }
  return rockets;
}

export function updateGunboatPosition(gunboat: OrbitalRocket, t: number, baseY = 4.5): void {
  gunboat.mesh.position.set(
    Math.sin(t * 0.3) * 0.8,
    baseY + Math.sin(t * 0.5) * 0.25,
    Math.cos(t * 0.25) * 0.6,
  );
  gunboat.mesh.lookAt(0, 0, 0);
  const flame = gunboat.mesh.userData.flameGroup as THREE.Group | undefined;
  if (flame) flame.scale.y = 0.6 + Math.sin(t * 8) * 0.15;
}

export function updateLanderRockets(rockets: OrbitalRocket[], t: number): void {
  rockets.forEach((r) => {
    if (r.role !== 'lander') return;
    r.orbitAngle += r.orbitSpeed * 0.016;
    const a = r.orbitAngle;
    r.mesh.position.set(
      Math.cos(a) * r.orbitRadius,
      2.8 + Math.sin(t + a) * 0.35,
      Math.sin(a) * r.orbitRadius,
    );
    r.mesh.lookAt(0, 0.5, 0);
  });
}

/** Laser-/Feuer-Salve von Gunboat zur Zielposition */
export function createSalvoBeam(
  from: THREE.Vector3,
  to: THREE.Vector3,
  scene: THREE.Scene,
  color = 0xff4500,
): THREE.Group {
  const g = new THREE.Group();
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.12, len, 8),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.85,
    }),
  );
  beam.position.copy(mid);
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  g.add(beam);
  scene.add(g);
  setTimeout(() => scene.remove(g), 450);
  return g;
}
