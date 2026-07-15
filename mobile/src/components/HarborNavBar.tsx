import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MainTab } from '../navigation/types';

type Props = {
  activeTab: MainTab;
  onBuild: () => void;
  onTabChange: (tab: MainTab) => void;
};

export default function HarborNavBar({ activeTab, onBuild, onTabChange }: Props) {
  return (
    <View style={styles.bar}>
      <Pressable style={styles.buildBtn} onPress={onBuild}>
        <Text style={styles.buildIcon}>🔨</Text>
        <Text style={styles.buildLabel}>BAUEN</Text>
      </Pressable>

      <View style={styles.harbor}>
        <Text style={styles.boat}>🚤</Text>
        <Text style={styles.harborLabel}>GALAXIE-HAFEN</Text>
      </View>

      <Pressable
        style={[styles.mapBtn, activeTab === 'map' && styles.mapBtnActive]}
        onPress={() => onTabChange(activeTab === 'map' ? 'home' : 'map')}
      >
        <Text style={styles.mapIcon}>🧭</Text>
        <Text style={styles.mapLabel}>{activeTab === 'map' ? 'BASIS' : 'KARTE'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 6,
  },
  buildBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#b45309',
    borderWidth: 3,
    borderColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buildIcon: { fontSize: 28 },
  buildLabel: { color: '#fff', fontSize: 8, fontWeight: '900', marginTop: 2 },
  harbor: { alignItems: 'center', opacity: 0.9 },
  boat: { fontSize: 36 },
  harborLabel: { color: '#ddd6fe', fontSize: 7, fontWeight: '900' },
  mapBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0369a1',
    borderWidth: 3,
    borderColor: '#7dd3fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBtnActive: { backgroundColor: '#7c3aed', borderColor: '#c4b5fd' },
  mapIcon: { fontSize: 28 },
  mapLabel: { color: '#fff', fontSize: 8, fontWeight: '900', marginTop: 2 },
});
