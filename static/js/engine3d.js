/**
 * CanaBoom 3D Engine — Sonnensystem, Grow-HQ, Astronauten-Raketen, Feuer-Partikel
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FireParticleSystem } from './particles.js';

const canvas = document.getElementById('game-canvas');
const wrap = document.getElementById('game-canvas-wrap');

function resize() {
  const w = wrap.clientWidth;
  const h = Math.max(420, window.innerHeight * 0.55);
  wrap.style.height = h + 'px';
  return { w, h };
}

let { w, h } = resize();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050810);
scene.fog = new THREE.FogExp2(0x050810, 0.018);

const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 500);
camera.position.set(8, 7, 12);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2.1;
controls.minDistance = 5;
controls.maxDistance = 35;

// Licht
scene.add(new THREE.AmbientLight(0x334466, 0.6));
const sun = new THREE.DirectionalLight(0xfff5e6, 1.4);
sun.position.set(12, 18, 8);
sun.castShadow = true;
scene.add(sun);
const neon = new THREE.PointLight(0x4ade80, 1.2, 30);
neon.position.set(-2, 3, 2);
scene.add(neon);

// Sterne
const starGeo = new THREE.BufferGeometry();
const starCount = 2500;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) positions[i] = (Math.random() - 0.5) * 200;
starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 })));

// Planet Erde
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(6, 48, 48),
  new THREE.MeshStandardMaterial({ color: 0x1a4d2e, roughness: 0.85, metalness: 0.1 })
);
planet.receiveShadow = true;
scene.add(planet);

// Basis-Plattform
const base = new THREE.Mesh(
  new THREE.CylinderGeometry(3.2, 3.5, 0.4, 32),
  new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.3, roughness: 0.6 })
);
base.position.y = 6.2;
base.receiveShadow = true;
planet.add(base);

const buildings = [];
const world = window.CANABOOM || {};

function neonLeafDome(x, z, color = 0x4ade80) {
  const g = new THREE.Group();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, transparent: true, opacity: 0.5, emissive: color, emissiveIntensity: 0.35 })
  );
  dome.position.y = 0.35;
  g.add(dome);
  for (let i = 0; i < 5; i++) {
    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.45, 4),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.8 })
    );
    leaf.position.set(Math.cos(i) * 0.35, 0.5, Math.sin(i) * 0.35);
    leaf.rotation.x = -0.4;
    g.add(leaf);
  }
  g.position.set(x, 6.45, z);
  planet.add(g);
  buildings.push({ mesh: g, id: 'gewaechshaus', x, z });
  return g;
}

function growHQ(x, z) {
  const g = new THREE.Group();
  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.4, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x4c1d95, emissiveIntensity: 0.4 })
  );
  tower.position.y = 0.9;
  g.add(tower);
  const crown = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.35, 0.08, 64, 8),
    new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x22c55e, emissiveIntensity: 1 })
  );
  crown.position.y = 1.8;
  g.add(crown);
  g.position.set(x, 6.45, z);
  planet.add(g);
  buildings.push({ mesh: g, id: 'grow_hq', x, z });
  return g;
}

function hydroRing(x, z) {
  const g = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.08, 12, 32),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 0.6 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.4;
  g.add(ring);
  g.position.set(x, 6.45, z);
  planet.add(g);
  buildings.push({ mesh: g, id: 'bewaesserung', x, z });
  return g;
}

function dryingVault(x, z) {
  const g = new THREE.Group();
  const vault = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.7, 0.8),
    new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xb45309, emissiveIntensity: 0.35 })
  );
  vault.position.y = 0.45;
  g.add(vault);
  g.position.set(x, 6.45, z);
  planet.add(g);
  buildings.push({ mesh: g, id: 'trocknungsraum', x, z });
  return g;
}

growHQ(0, 0);
neonLeafDome(-1.8, 1.2);
neonLeafDome(1.6, -0.8, 0x22d3ee);
hydroRing(-0.5, -1.5);
dryingVault(2, 1.5);

/** WhatsApp-Emoji-Stil: roter Spitze, weißer Rumpf */
function astronautRocket(scale = 1, orbitRadius = 9, angle = 0) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25 * scale, 0.3 * scale, 1.4 * scale, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.4 })
  );
  body.position.y = 0.7 * scale;
  g.add(body);
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.3 * scale, 0.7 * scale, 16),
    new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.3 })
  );
  nose.position.y = 1.55 * scale;
  g.add(nose);
  const window = new THREE.Mesh(
    new THREE.SphereGeometry(0.12 * scale, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x3b82f6, emissiveIntensity: 0.5 })
  );
  window.position.set(0, 0.85 * scale, 0.28 * scale);
  g.add(window);
  const finMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
  [-1, 1].forEach((s) => {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08 * scale, 0.35 * scale, 0.25 * scale), finMat);
    fin.position.set(s * 0.28 * scale, 0.25 * scale, 0);
    g.add(fin);
  });
  g.userData.orbitRadius = orbitRadius;
  g.userData.orbitAngle = angle;
  g.userData.orbitSpeed = 0.15 + Math.random() * 0.1;
  scene.add(g);
  return g;
}

const rockets = [
  astronautRocket(0.9, 9, 0),
  astronautRocket(0.7, 10.5, Math.PI * 0.6),
  astronautRocket(1.1, 8.2, Math.PI * 1.3),
];

const fireSystem = new FireParticleSystem(scene);

async function addDialogLine(speaker, line, source = '') {
  const box = document.getElementById('dialog-lines');
  if (!box) return;
  const el = document.createElement('div');
  el.className = 'line';
  el.innerHTML = `<strong>${speaker}</strong>: ${line}`;
  if (source) el.dataset.source = source;
  box.prepend(el);
  while (box.children.length > 6) box.removeChild(box.lastChild);
}

async function fetchAiDialog(trigger, context = '') {
  const res = await fetch('/api/v1/ai/dialog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trigger, context }),
  });
  return res.json();
}

async function runAttack() {
  const target = buildings[Math.floor(Math.random() * buildings.length)] || { x: 0, z: 0, id: 'gewaechshaus' };
  const weapon = Math.random() > 0.5 ? 'flame_rocket' : 'plasma_thrower';
  const res = await fetch('/api/v1/combat/attack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      weapon,
      target_building: target.id,
      target_x: target.x,
      target_z: target.z,
    }),
  });
  const data = await res.json();
  const worldPos = new THREE.Vector3(target.x, 6.8, target.z);
  fireSystem.burst(worldPos, data.fire?.particles || [], data.fire?.burn_duration_ms || 2000);

  const commentary = await fetch('/api/v1/ai/combat-commentary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'hit', damage: data.damage, building: target.id }),
  }).then((r) => r.json());

  await addDialogLine(commentary.speaker, commentary.line, commentary.source);
}

async function runMatchmaking() {
  const res = await fetch('/api/v1/matchmaking/find', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hq_level: 3, troop_count: 12, building_count: 5, planet_id: 'earth' }),
  });
  const match = await res.json();
  document.getElementById('hud-power').textContent = `⚡ VP ${match.player_power}`;
  const line = await fetchAiDialog('attack_start', `Gegner: ${match.opponent_name} (VP ${match.opponent_power})`);
  await addDialogLine(line.speaker, `${line.line} — Fair Play: ${match.note}`, line.source);
}

async function loadAiTutorial() {
  const res = await fetch('/api/v1/ai/tutorial?player_name=Commander');
  const steps = await res.json();
  for (const step of steps) {
    await addDialogLine(step.speaker, step.line, step.source);
  }
}

document.getElementById('btn-attack')?.addEventListener('click', runAttack);
document.getElementById('btn-match')?.addEventListener('click', runMatchmaking);
document.getElementById('btn-build')?.addEventListener('click', async () => {
  const offset = (Math.random() - 0.5) * 2;
  neonLeafDome(offset, (Math.random() - 0.5) * 2);
  const line = await fetchAiDialog('build', 'Neues Gewächshaus');
  await addDialogLine(line.speaker, line.line, line.source);
});

fetch('/api/v1/ai/status').then((r) => r.json()).then((s) => {
  const badge = document.getElementById('ai-badge');
  if (badge) badge.textContent = s.mode === 'llm' ? `KI: ${s.provider}` : 'Lokale KI';
});

loadAiTutorial();

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  planet.rotation.y = t * 0.05;
  rockets.forEach((r) => {
    r.userData.orbitAngle += r.userData.orbitSpeed * 0.016;
    const a = r.userData.orbitAngle;
    const rad = r.userData.orbitRadius;
    r.position.set(Math.cos(a) * rad, 2 + Math.sin(t + a) * 0.3, Math.sin(a) * rad);
    r.lookAt(0, 6, 0);
  });
  fireSystem.update(0.016);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  ({ w, h } = resize());
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

animate();
