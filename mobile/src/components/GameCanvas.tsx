import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, type DimensionValue } from 'react-native';
import { api } from '../api/client';

type Props = {
  onDialog: (speaker: string, line: string) => void;
  attackSignal: number;
  tapSalvoSignal: number;
  buildSignal: number;
  matchSignal: number;
};

type Target = { id: string; icon: string; color: string; left: DimensionValue; top: DimensionValue };

const STARTING_TARGETS: Target[] = [
  { id: 'hq', icon: '🏰', color: '#f97316', left: '44%', top: '24%' },
  { id: 'storage', icon: '🧪', color: '#38bdf8', left: '65%', top: '43%' },
  { id: 'generator', icon: '🌸', color: '#22c55e', left: '25%', top: '49%' },
];

/**
 * Static 2D combat board. The historical component name is retained for route
 * compatibility, but no GL context, 3D renderer, lights or camera are created.
 */
export default function GameCanvas({
  onDialog,
  attackSignal,
  tapSalvoSignal,
  buildSignal,
  matchSignal,
}: Props) {
  const [targets, setTargets] = useState(STARTING_TARGETS);
  const [impact, setImpact] = useState<string | null>(null);
  const previous = useRef({ attack: 0, tap: 0, build: 0, match: 0 });

  const fire = (kind: string) => {
    const target = targets[Math.floor(Math.random() * targets.length)];
    if (!target) return;
    setImpact(target.id);
    setTimeout(() => setImpact(null), 360);
    api.combatAttack(kind, target.id, 0, 0)
      .then((data) => onDialog('Captain Bud', `Treffer! ${data.damage} Schaden an ${target.id}.`))
      .catch(() => onDialog('Captain Bud', 'Volltreffer auf der Insel!'));
  };

  useEffect(() => {
    if (attackSignal > previous.current.attack) {
      previous.current.attack = attackSignal;
      fire('island_cannon');
    }
  }, [attackSignal]);

  useEffect(() => {
    if (tapSalvoSignal > previous.current.tap) {
      previous.current.tap = tapSalvoSignal;
      fire('gunboat_salvo');
    }
  }, [tapSalvoSignal]);

  useEffect(() => {
    if (buildSignal > previous.current.build) {
      previous.current.build = buildSignal;
      const index = targets.length;
      setTargets((current) => [
        ...current,
        {
          id: `hut-${index}`,
          icon: '🏠',
          color: '#facc15',
          left: `${20 + (index * 17) % 60}%`,
          top: `${35 + (index * 11) % 35}%`,
        },
      ]);
      onDialog('Mary', 'Eine neue 2D-Strandhütte steht!');
    }
  }, [buildSignal]);

  useEffect(() => {
    if (matchSignal > previous.current.match) {
      previous.current.match = matchSignal;
      api.matchFind()
        .then((match) => onDialog('Matchmaking', `Insel von ${match.opponent_name} gefunden!`))
        .catch(() => onDialog('Matchmaking', 'Eine feindliche Tropeninsel wurde gefunden.'));
    }
  }, [matchSignal]);

  return (
    <View style={styles.scene}>
      <View style={styles.sky}>
        <Text style={styles.cloud}>☁️</Text>
        <Text style={styles.sun}>☀️</Text>
      </View>
      <View style={styles.water}>
        <View style={styles.waveOne} />
        <View style={styles.waveTwo} />
      </View>
      <View style={styles.islandShadow} />
      <View style={styles.sand} />
      <View style={styles.grass}>
        <Text style={styles.palms}>🌴       🌴</Text>
      </View>
      {targets.map((target) => (
        <View key={target.id} style={[styles.target, { left: target.left, top: target.top }]}>
          <View style={styles.targetShadow} />
          <View style={[styles.targetBody, { backgroundColor: target.color }]}>
            <View style={styles.targetHighlight} />
            <Text style={styles.targetIcon}>{target.icon}</Text>
          </View>
          {impact === target.id && <Text style={styles.impact}>💥</Text>}
        </View>
      ))}
      <View style={styles.gunboat}>
        <View style={styles.boatCabin} />
        <View style={styles.boatHull}><Text style={styles.boatMark}>CANABOOM</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1, overflow: 'hidden', backgroundColor: '#bae6fd' },
  sky: { position: 'absolute', left: 0, right: 0, top: 0, height: '35%', backgroundColor: '#7dd3fc' },
  cloud: { position: 'absolute', left: '14%', top: 18, fontSize: 48, opacity: 0.85 },
  sun: { position: 'absolute', right: '12%', top: 14, fontSize: 46 },
  water: { position: 'absolute', left: 0, right: 0, top: '30%', bottom: 0, backgroundColor: '#38bdf8' },
  waveOne: { position: 'absolute', left: '4%', top: 30, width: 90, height: 5, borderRadius: 4, backgroundColor: '#e0f2fe' },
  waveTwo: { position: 'absolute', right: '8%', bottom: 35, width: 120, height: 5, borderRadius: 4, backgroundColor: '#e0f2fe' },
  islandShadow: { position: 'absolute', left: '13%', right: '13%', top: '20%', bottom: '12%', borderRadius: 180, backgroundColor: 'rgba(3,105,161,0.38)' },
  sand: { position: 'absolute', left: '11%', right: '11%', top: '17%', bottom: '15%', borderRadius: 180, borderWidth: 8, borderColor: '#fef08a', backgroundColor: '#f4d03f' },
  grass: { position: 'absolute', left: '16%', right: '16%', top: '13%', bottom: '22%', borderRadius: 170, borderWidth: 7, borderColor: '#15803d', backgroundColor: '#4ade80' },
  palms: { position: 'absolute', left: 15, right: 15, bottom: 15, fontSize: 32, textAlign: 'center' },
  target: { position: 'absolute', width: 76, height: 82, alignItems: 'center', justifyContent: 'flex-end' },
  targetShadow: { position: 'absolute', bottom: 0, width: 65, height: 18, borderRadius: 20, backgroundColor: 'rgba(20,83,45,0.35)' },
  targetBody: { width: 61, height: 53, marginBottom: 7, borderWidth: 4, borderColor: '#14532d', borderRadius: 11, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  targetHighlight: { position: 'absolute', left: 3, top: 3, width: 18, bottom: 3, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.28)' },
  targetIcon: { fontSize: 29 },
  impact: { position: 'absolute', top: -9, right: -8, fontSize: 45, zIndex: 4 },
  gunboat: { position: 'absolute', left: '4%', bottom: '5%', width: 112, height: 62, alignItems: 'center', justifyContent: 'flex-end' },
  boatHull: { width: 108, height: 29, borderRadius: 15, borderWidth: 4, borderColor: '#7c2d12', backgroundColor: '#fb923c', alignItems: 'center', justifyContent: 'center' },
  boatCabin: { position: 'absolute', bottom: 22, width: 43, height: 31, borderRadius: 8, borderWidth: 4, borderColor: '#075985', backgroundColor: '#fef3c7' },
  boatMark: { color: '#7c2d12', fontSize: 8, fontWeight: '900' },
});
