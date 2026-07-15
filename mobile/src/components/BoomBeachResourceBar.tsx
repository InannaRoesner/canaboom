import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useResources } from '../context/ResourceContext';

export default function BoomBeachResourceBar() {
  const { resources } = useResources();

  return (
    <View style={styles.bar}>
      <ResourcePill icon="🪙" value={resources.gold} />
      <ResourcePill icon="🪵" value={resources.wood} />
      <ResourcePill icon="🪨" value={resources.stone} />
      <View style={styles.diamondWrap}>
        <ResourcePill icon="💎" value={resources.diamonds} accent />
        <Pressable style={styles.plusBtn}>
          <Text style={styles.plusText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ResourcePill({ icon, value, accent }: { icon: string; value: number; accent?: boolean }) {
  return (
    <View style={[styles.pill, accent && styles.pillAccent]}>
      <Text style={styles.pillIcon}>{icon}</Text>
      <Text style={styles.pillValue}>{value.toLocaleString('de-DE')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    minWidth: 68,
  },
  pillAccent: { backgroundColor: 'rgba(109,40,217,0.4)' },
  pillIcon: { fontSize: 13 },
  pillValue: { color: '#fff', fontSize: 11, fontWeight: '900' },
  diamondWrap: { flexDirection: 'row', alignItems: 'center' },
  plusBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  plusText: { color: '#fff', fontSize: 14, fontWeight: '900', marginTop: -1 },
});
