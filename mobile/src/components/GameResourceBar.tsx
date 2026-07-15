import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useResources } from '../context/ResourceContext';

type Props = {
  /** Legacy compact mode – show gold only */
  gold?: number;
};

export default function GameResourceBar({ gold }: Props) {
  const { resources } = useResources();
  if (gold !== undefined) {
    return (
      <View style={[styles.bar, styles.compact]}>
        <ResourceChip icon="🪙" label="GOLD" value={gold} />
      </View>
    );
  }
  return (
    <View style={styles.bar}>
      <ResourceChip icon="🪙" label="GOLD" value={resources.gold} />
      <ResourceChip icon="🪵" label="HOLZ" value={resources.wood} />
      <ResourceChip icon="🪨" label="STEIN" value={resources.stone} />
      <ResourceChip icon="💎" label="DIAMANTEN" value={resources.diamonds} accent />
    </View>
  );
}

function ResourceChip({
  icon,
  label,
  value,
  accent,
}: {
  icon: string;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <View style={[styles.chip, accent && styles.chipAccent]}>
      <Text style={styles.icon}>{icon}</Text>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value.toLocaleString('de-DE')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(15,23,42,0.82)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
    minWidth: 72,
  },
  chipAccent: { backgroundColor: 'rgba(109,40,217,0.35)' },
  compact: { position: 'absolute', top: 8, right: 8, zIndex: 20 },
  icon: { fontSize: 14 },
  label: { color: '#cbd5e1', fontSize: 7, fontWeight: '800' },
  value: { color: '#fff', fontSize: 11, fontWeight: '900' },
});
