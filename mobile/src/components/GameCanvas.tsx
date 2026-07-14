import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import * as THREE from 'three';
import { createStarterBase, buildGreenhouseA, type BuildingSpec } from '../game/buildings';
import { spawnOrbitalRockets, updateRockets, type OrbitalRocket } from '../game/rockets';
import { MobileFireSystem } from '../game/particles';
import { api } from '../api/client';

type Props = {
  onDialog: (speaker: string, line: string) => void;
  attackSignal: number;
  buildSignal: number;
  matchSignal: number;
};

function PlanetBase({ buildings }: { buildings: BuildingSpec[] }) {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[4, 48]} />
        <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.65} />
      </mesh>
      {buildings.map((b) => (
        <primitive key={`${b.id}-${b.variant}-${b.x}-${b.z}`} object={b.group} />
      ))}
    </group>
  );
}

function SceneContent({ onDialog, attackSignal, buildSignal, matchSignal }: Props) {
  const planetRef = useRef<THREE.Mesh>(null);
  const fireRef = useRef<MobileFireSystem | null>(null);
  const rocketsRef = useRef<OrbitalRocket[]>([]);
  const [buildings, setBuildings] = useState<BuildingSpec[]>(() => createStarterBase());
  const { scene } = useThree();
  const lastSignals = useRef({ attack: 0, build: 0, match: 0 });

  useEffect(() => {
    fireRef.current = new MobileFireSystem(scene);
    rocketsRef.current = spawnOrbitalRockets(3);
    rocketsRef.current.forEach((r) => scene.add(r.mesh));
    const stars = new THREE.BufferGeometry();
    const arr = new Float32Array(1500 * 3);
    for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() - 0.5) * 120;
    stars.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xffffff, size: 0.12 })));
    api.aiTutorial().then((steps) => {
      steps.forEach((s) => onDialog(s.speaker, s.line));
    }).catch(() => onDialog('Zorp', 'Willkommen auf der Erde, Commander!'));
    return () => {
      rocketsRef.current.forEach((r) => scene.remove(r.mesh));
    };
  }, [scene, onDialog]);

  useEffect(() => {
    if (attackSignal > lastSignals.current.attack) {
      lastSignals.current.attack = attackSignal;
      const target = buildings[Math.floor(Math.random() * buildings.length)];
      if (!target) return;
      const weapon = Math.random() > 0.5 ? 'flame_rocket' : 'plasma_thrower';
      api.combatAttack(weapon, target.id, target.x, target.z).then(async (data) => {
        const pos = new THREE.Vector3(target.x, 1.2, target.z);
        fireRef.current?.burst(pos, data.fire.particles, data.fire.burn_duration_ms);
        const c = await api.aiDialog('attack_hit', `${data.damage} auf ${target.id}`);
        onDialog(c.speaker, c.line);
      }).catch(() => onDialog('Captain Bud', 'Feuer frei!'));
    }
  }, [attackSignal, onDialog, buildings]);

  useEffect(() => {
    if (buildSignal > lastSignals.current.build) {
      lastSignals.current.build = buildSignal;
      const hue = 100 + Math.random() * 60;
      const nb = buildGreenhouseA((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, hue);
      setBuildings((prev) => [...prev, nb]);
      api.aiDialog('build', 'Neues Gewächshaus').then((c) => onDialog(c.speaker, c.line));
    }
  }, [buildSignal, onDialog]);

  useEffect(() => {
    if (matchSignal > lastSignals.current.match) {
      lastSignals.current.match = matchSignal;
      api.matchFind().then(async (m) => {
        const c = await api.aiDialog('attack_start', `${m.opponent_name} VP${m.opponent_power}`);
        onDialog(c.speaker, `${c.line} — ${m.note}`);
      });
    }
  }, [matchSignal, onDialog]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (planetRef.current) planetRef.current.rotation.y = t * 0.04;
    updateRockets(rocketsRef.current, t, 0);
    fireRef.current?.update(dt);
  });

  return (
    <>
      <ambientLight intensity={0.55} color="#445566" />
      <directionalLight position={[10, 14, 6]} intensity={1.3} castShadow color="#fff5e6" />
      <pointLight position={[-3, 4, 2]} intensity={1.1} color="#4ade80" />
      <mesh ref={planetRef} position={[0, -2.5, 0]} receiveShadow>
        <sphereGeometry args={[5.5, 48, 48]} />
        <meshStandardMaterial color="#1a4d2e" roughness={0.85} />
      </mesh>
      <group position={[0, 0.2, 0]}>
        <PlanetBase buildings={buildings} />
      </group>
    </>
  );
}

export default function GameCanvas(props: Props) {
  return (
    <Canvas
      camera={{ position: [7, 6, 10], fov: 50 }}
      gl={{ antialias: true }}
      style={{ flex: 1 }}
    >
      <SceneContent {...props} />
    </Canvas>
  );
}
