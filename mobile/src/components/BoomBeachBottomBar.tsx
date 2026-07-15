import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onBuild: () => void;
  onMap: () => void;
  onChest?: () => void;
  onTroops?: () => void;
  mapActive?: boolean;
};

export default function BoomBeachBottomBar({
  onBuild,
  onMap,
  onChest,
  onTroops,
  mapActive = false,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 6) }]} pointerEvents="box-none">
      <View style={styles.leftCluster}>
        <Pressable style={({ pressed }) => [styles.hammerBtn, pressed && styles.pressed]} onPress={onBuild}>
          <View style={styles.hammerInner}>
            <Text style={styles.hammerIcon}>🔨</Text>
          </View>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.chestBtn, pressed && styles.pressed]} onPress={onChest}>
          <Text style={styles.chestIcon}>🎁</Text>
          <Text style={styles.chestGems}>💎</Text>
        </Pressable>
      </View>

      <View style={styles.rightCluster}>
        <Pressable style={({ pressed }) => [styles.troopsBtn, pressed && styles.pressed]} onPress={onTroops}>
          <Text style={styles.troopsIcon}>🪖</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.compassBtn, mapActive && styles.compassActive, pressed && styles.pressed]}
          onPress={onMap}
        >
          <View style={styles.compassFace}>
            <Text style={styles.north}>N</Text>
            <View style={styles.compassNeedle} />
            <View style={styles.compassHub} />
          </View>
          <Text style={styles.compassLabel}>{mapActive ? 'BASIS' : 'KARTE'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    zIndex: 50,
  },
  leftCluster: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  rightCluster: { flexDirection: 'column', alignItems: 'center', gap: 6 },
  hammerBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#1e6fd9',
    borderWidth: 4,
    borderColor: '#5eb0ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 10,
  },
  hammerInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#3d8fef',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1a5bb5',
  },
  hammerIcon: { fontSize: 32 },
  chestBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 2,
    borderColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  chestIcon: { fontSize: 24 },
  chestGems: { position: 'absolute', bottom: 2, right: 4, fontSize: 10 },
  troopsBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e6fd9',
    borderWidth: 3,
    borderColor: '#5eb0ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  troopsIcon: { fontSize: 26 },
  compassBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#1e6fd9',
    borderWidth: 4,
    borderColor: '#5eb0ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 10,
  },
  compassActive: { backgroundColor: '#7c3aed', borderColor: '#c4b5fd' },
  compassFace: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0d4a9e',
    borderWidth: 2,
    borderColor: '#7dd3fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  north: { position: 'absolute', top: 2, color: '#fff', fontSize: 8, fontWeight: '900' },
  compassNeedle: {
    width: 8,
    height: 32,
    backgroundColor: '#ef4444',
    borderRadius: 4,
    transform: [{ rotate: '25deg' }],
  },
  compassHub: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#7dd3fc',
  },
  compassLabel: {
    position: 'absolute',
    bottom: -2,
    color: '#fff',
    fontSize: 7,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowRadius: 2,
  },
  pressed: { transform: [{ scale: 0.94 }], opacity: 0.88 },
});
