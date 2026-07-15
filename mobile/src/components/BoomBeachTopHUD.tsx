import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useBase } from '../context/BaseContext';

const TIPS = [
  'Landungsboot kann verstärkt werden',
  'Ein Bauarbeiter ist untätig',
  'Karte kann erkundet werden',
  'Upgrade dein HQ für neue Gebäude',
  'Verteidigungen schützen deine Basis',
];

type Props = {
  playerName?: string;
  medals?: number;
};

export default function BoomBeachTopHUD({ playerName = 'Kommandant', medals = 3 }: Props) {
  const { hqLevel } = useBase();
  const [tipIndex, setTipIndex] = React.useState(0);

  return (
    <View style={styles.wrap}>
      <View style={styles.levelRow}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelNum}>{hqLevel}</Text>
        </View>
        <Text style={styles.playerName}>{playerName}</Text>
        <View style={styles.medalBadge}>
          <Text style={styles.medalIcon}>🏅</Text>
          <Text style={styles.medalCount}>{medals}</Text>
        </View>
      </View>

      <Pressable style={styles.advisorRow} onPress={() => setTipIndex((i) => (i + 1) % TIPS.length)}>
        <View style={styles.portrait}>
          <Text style={styles.portraitEmoji}>👨‍✈️</Text>
        </View>
        <View style={styles.tipsList}>
          {TIPS.slice(tipIndex, tipIndex + 3).map((tip, i) => (
            <Text key={`${tipIndex}-${i}`} style={styles.tipLine}>
              • {tip}
            </Text>
          ))}
        </View>
        <View style={styles.scrollBadge}>
          <Text style={styles.scrollIcon}>📜</Text>
          <View style={styles.notifDot}>
            <Text style={styles.notifText}>1</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { maxWidth: 280 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  levelCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e6fd9',
    borderWidth: 3,
    borderColor: '#5eb0ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  levelNum: { color: '#fff', fontSize: 16, fontWeight: '900' },
  playerName: { color: '#fff', fontSize: 14, fontWeight: '800', textShadowColor: '#000', textShadowRadius: 3 },
  medalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  medalIcon: { fontSize: 14 },
  medalCount: { color: '#fde68a', fontSize: 12, fontWeight: '900', marginLeft: 2 },
  advisorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  portrait: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#c4a574',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  portraitEmoji: { fontSize: 30 },
  tipsList: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tipLine: { color: '#fff', fontSize: 9, fontWeight: '700', lineHeight: 13 },
  scrollBadge: { position: 'relative', marginTop: 4 },
  scrollIcon: { fontSize: 28 },
  notifDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  notifText: { color: '#fff', fontSize: 8, fontWeight: '900' },
});
