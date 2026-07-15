import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const TIPS = [
  'Leutnant: Upgrade dein HQ, um neue Gebäude freizuschalten!',
  'Leutnant: Sägewerk und Steinbruch liefern langfristig Ressourcen.',
  'Leutnant: Freischalte Nebel auf der Karte mit Gold.',
  'Leutnant: Zerstöre das Feind-HQ für maximale Beute!',
  'Leutnant: Platziere Verteidigungen eng um dein HQ.',
];

export default function LieutenantTips() {
  const [index, setIndex] = useState(0);
  const tip = useMemo(() => TIPS[index % TIPS.length], [index]);

  return (
    <Pressable style={styles.wrap} onPress={() => setIndex((i) => i + 1)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👨‍✈️</Text>
      </View>
      <View style={styles.bubble}>
        <Text style={styles.name}>LEUTNANT</Text>
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: 220,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e3a5f',
    borderWidth: 2,
    borderColor: '#93c5fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 26 },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.88)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: 'rgba(147,197,253,0.35)',
  },
  name: { color: '#93c5fd', fontSize: 8, fontWeight: '900', marginBottom: 4 },
  tip: { color: '#fff', fontSize: 10, fontWeight: '600', lineHeight: 14 },
});
