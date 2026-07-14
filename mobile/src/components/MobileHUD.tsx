import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  blueten?: number;
  duenger?: number;
  power?: number;
};

export default function MobileHUD({ blueten = 1200, duenger = 340, power = 240 }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 4 }]}>
      <Text style={styles.logo}>🚀 CanaBoom</Text>
      <View style={styles.stats}>
        <Text style={styles.stat}>🌸 {blueten}</Text>
        <Text style={styles.stat}>🧪 {duenger}</Text>
        <Text style={styles.stat}>⚡ {power}</Text>
      </View>
      <Text style={styles.badge}>100% GRATIS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: 'rgba(10,15,26,0.94)',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  logo: { color: '#f0f4ff', fontWeight: '800', fontSize: 15 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { color: '#c4b5fd', fontSize: 12, fontWeight: '600' },
  badge: { color: '#4ade80', fontSize: 10, fontWeight: '700' },
});
