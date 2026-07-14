/**
 * Einzigartige Cannabis-Gebäude — jedes Haus komplett anders designt.
 * Prozedurale 3D-Meshes mit saftigen Blättern, Neon-Deko, Hydro-Elementen.
 */
import * as THREE from 'three';

export type BuildingSpec = {
  id: string;
  variant: number;
  x: number;
  z: number;
  group: THREE.Group;
};

const leafMat = (hue: number, emissive = 0.6) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(hue / 360, 0.75, 0.38),
    emissive: new THREE.Color().setHSL(hue / 360, 0.9, 0.25),
    emissiveIntensity: emissive,
    roughness: 0.45,
  });

/** 7-zackiges Cannabis-Blatt aus verzerrten Kegeln */
function cannabisLeaf(hue: number, scale = 1, serration = 7): THREE.Group {
  const g = new THREE.Group();
  const mat = leafMat(hue);
  for (let i = 0; i < serration; i++) {
    const lobe = new THREE.Mesh(new THREE.ConeGeometry(0.08 * scale, 0.35 * scale, 3), mat);
    const a = (i / serration) * Math.PI * 2;
    lobe.position.set(Math.cos(a) * 0.15 * scale, 0.1 * scale, Math.sin(a) * 0.15 * scale);
    lobe.rotation.x = -0.5 + (i % 2) * 0.1;
    lobe.rotation.y = a;
    g.add(lobe);
  }
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03 * scale, 0.04 * scale, 0.5 * scale, 6),
    new THREE.MeshStandardMaterial({ color: 0x166534 })
  );
  stem.position.y = -0.15 * scale;
  g.add(stem);
  return g;
}

function leafCluster(count: number, hue: number, radius: number): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const leaf = cannabisLeaf(hue + i * 8, 0.8 + Math.random() * 0.5, 5 + (i % 4));
    const a = (i / count) * Math.PI * 2;
    leaf.position.set(Math.cos(a) * radius, 0.2 + i * 0.08, Math.sin(a) * radius);
    leaf.rotation.y = a + Math.random();
    g.add(leaf);
  }
  return g;
}

/** Grow-HQ — violetter Turm, Kronen-TorusKnot aus Neon-Blättern */
export function buildGrowHQ(x: number, z: number): BuildingSpec {
  const g = new THREE.Group();
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 1.1, 2.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x6d28d9, emissive: 0x4c1d95, emissiveIntensity: 0.5, metalness: 0.3 })
  );
  tower.position.y = 1.1;
  g.add(tower);
  const crown = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.55, 0.12, 80, 12),
    new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x22c55e, emissiveIntensity: 1.2 })
  );
  crown.position.y = 2.6;
  g.add(crown);
  g.add(leafCluster(12, 115, 1.4));
  const vines = new THREE.Mesh(
    new THREE.TorusGeometry(1.3, 0.06, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0x15803d, emissive: 0x14532d, emissiveIntensity: 0.4 })
  );
  vines.rotation.x = Math.PI / 2;
  vines.position.y = 0.5;
  g.add(vines);
  g.position.set(x, 0, z);
  return { id: 'grow_hq', variant: 0, x, z, group: g };
}

/** Gewächshaus Variante A — Kristall-Kuppel mit radialen Riesenblättern */
export function buildGreenhouseA(x: number, z: number, hue = 120): BuildingSpec {
  const g = new THREE.Group();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, transparent: true, opacity: 0.35, emissive: 0x4ade80, emissiveIntensity: 0.25 })
  );
  dome.position.y = 0.5;
  g.add(dome);
  for (let i = 0; i < 9; i++) {
    const big = cannabisLeaf(hue + i * 12, 1.4, 9);
    const a = (i / 9) * Math.PI * 2;
    big.position.set(Math.cos(a) * 0.5, 0.6, Math.sin(a) * 0.5);
    big.rotation.y = a;
    g.add(big);
  }
  const frame = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.95, 0),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true })
  );
  frame.position.y = 0.7;
  g.add(frame);
  g.position.set(x, 0, z);
  return { id: 'gewaechshaus', variant: 1, x, z, group: g };
}

/** Gewächshaus Variante B — Sechseck-Stapel mit überhängenden Blättern */
export function buildGreenhouseB(x: number, z: number, hue = 95): BuildingSpec {
  const g = new THREE.Group();
  for (let layer = 0; layer < 3; layer++) {
    const hex = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7 - layer * 0.12, 0.75 - layer * 0.12, 0.35, 6),
      new THREE.MeshStandardMaterial({ color: 0x1e3a2f, emissive: 0x14532d, emissiveIntensity: 0.3 })
    );
    hex.position.y = 0.2 + layer * 0.4;
    g.add(hex);
    const overhang = leafCluster(6, hue + layer * 20, 0.55 + layer * 0.1);
    overhang.position.y = 0.35 + layer * 0.4;
    g.add(overhang);
  }
  g.position.set(x, 0, z);
  return { id: 'gewaechshaus', variant: 2, x, z, group: g };
}

/** Gewächshaus Variante C — Spiral-Turm voller Blätter */
export function buildGreenhouseC(x: number, z: number, hue = 140): BuildingSpec {
  const g = new THREE.Group();
  const spiral = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.45, 0.1, 64, 8, 2, 5),
    new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x0891b2, emissiveIntensity: 0.5 })
  );
  spiral.position.y = 1;
  g.add(spiral);
  for (let i = 0; i < 14; i++) {
    const leaf = cannabisLeaf(hue + i * 5, 1.1, 7);
    const t = i / 14;
    leaf.position.set(Math.sin(t * 8) * 0.6, 0.15 + t * 1.6, Math.cos(t * 8) * 0.6);
    leaf.rotation.y = t * 6;
    g.add(leaf);
  }
  g.position.set(x, 0, z);
  return { id: 'gewaechshaus', variant: 3, x, z, group: g };
}

/** Bewässerung — Hydro-Ring mit Blatt-Brunnen */
export function buildIrrigation(x: number, z: number, variant = 0): BuildingSpec {
  const g = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.1, 12, 32),
    new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0284c7, emissiveIntensity: 0.7, metalness: 0.5 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.35;
  g.add(ring);
  for (let i = 0; i < 8; i++) {
    const drop = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x7dd3fc, emissive: 0x38bdf8, emissiveIntensity: 0.8 })
    );
    const a = (i / 8) * Math.PI * 2;
    drop.position.set(Math.cos(a) * 0.85, 0.5 + (i % 2) * 0.15, Math.sin(a) * 0.85);
    g.add(drop);
    const leaf = cannabisLeaf(160 + i * 10 + variant * 15, 0.9, 6);
    leaf.position.set(Math.cos(a) * 0.4, 0.3, Math.sin(a) * 0.4);
    g.add(leaf);
  }
  const centerFountain = leafCluster(5, 170 + variant * 20, 0.2);
  centerFountain.position.y = 0.5;
  g.add(centerFountain);
  g.position.set(x, 0, z);
  return { id: 'bewaesserung', variant, x, z, group: g };
}

/** Trocknungsraum — Amber-Vault mit hängenden Blatt-Bündeln */
export function buildDryingRoom(x: number, z: number, variant = 0): BuildingSpec {
  const g = new THREE.Group();
  const vault = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1, 1.1),
    new THREE.MeshStandardMaterial({ color: 0xd97706, emissive: 0xb45309, emissiveIntensity: 0.45 })
  );
  vault.position.y = 0.5;
  g.add(vault);
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(1, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.35 })
  );
  roof.position.y = 1.15;
  roof.rotation.y = Math.PI / 4;
  g.add(roof);
  for (let i = 0; i < 6; i++) {
    const bundle = new THREE.Group();
    for (let j = 0; j < 4; j++) {
      const dried = cannabisLeaf(45 + variant * 8 + j * 5, 0.6, 5);
      dried.rotation.z = j * 0.4;
      bundle.add(dried);
    }
    bundle.position.set(-0.5 + i * 0.35, 1.4, (i % 2) * 0.3 - 0.15);
    g.add(bundle);
  }
  g.add(leafCluster(4, 50 + variant * 12, 0.55));
  g.position.set(x, 0, z);
  return { id: 'trocknungsraum', variant, x, z, group: g };
}

export function createStarterBase(): BuildingSpec[] {
  return [
    buildGrowHQ(0, 0),
    buildGreenhouseA(-2.2, 1.5, 118),
    buildGreenhouseB(2, -1.2, 92),
    buildGreenhouseC(-0.8, -2, 145),
    buildIrrigation(-1.5, -0.8, 0),
    buildIrrigation(1.8, 1.8, 1),
    buildDryingRoom(2.5, 0.5, 0),
    buildDryingRoom(-2.5, -1.5, 1),
  ];
}
