import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameResourceBar from '../components/GameResourceBar';
import LieutenantTips from '../components/LieutenantTips';
import { MAP_ISLANDS, type MapIsland } from '../data/mapIslands';
import { useAttackPreparation } from '../context/AttackPreparationContext';
import { useResources } from '../context/ResourceContext';
import type { RootStackParamList } from '../navigation/types';

const STORAGE_KEY = 'canaboom_map_unlocks_v1';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

export default function WorldMapScreen({ navigation }: Props) {
  const { width, height } = Dimensions.get('window');
  const { spendResources, canAfford } = useResources();
  const { setSoldierCapacity, setBoatCount } = useAttackPreparation();
  const [islands, setIslands] = useState<MapIsland[]>(MAP_ISLANDS);
  const [selected, setSelected] = useState<MapIsland | null>(null);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      const unlocked = new Set(JSON.parse(raw) as string[]);
      setIslands((prev) => prev.map((i) => ({ ...i, unlocked: i.unlocked || unlocked.has(i.id) })));
    });
  }, []);

  const persistUnlocks = useCallback((next: MapIsland[]) => {
    const ids = next.filter((i) => i.unlocked && i.id !== 'home').map((i) => i.id);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, []);

  const unlockFog = useCallback(
    (island: MapIsland) => {
      if (island.unlocked || island.id === 'home') return;
      if (!canAfford({ gold: island.fogCost })) {
        Alert.alert('Zu wenig Gold', `Du brauchst ${island.fogCost} Gold, um den Nebel zu lichten.`);
        return;
      }
      spendResources({ gold: island.fogCost });
      setIslands((prev) => {
        const next = prev.map((i) => (i.id === island.id ? { ...i, unlocked: true } : i));
        persistUnlocks(next);
        return next;
      });
      Alert.alert('Nebel gelichtet!', `${island.name} ist jetzt angreifbar.`);
    },
    [canAfford, persistUnlocks, spendResources],
  );

  const startAttack = useCallback(() => {
    if (!selected || selected.id === 'home') return;
    setSoldierCapacity(12);
    setBoatCount(3);
    setSelected(null);
    navigation.navigate('Game', {
      opponentName: selected.name,
      enemyHqLevel: selected.hqLevel,
      raidRewards: {
        resources: selected.rewards,
        victoryPoints: selected.victoryPoints,
        galaxyMapIntel: 1,
      },
    });
  }, [navigation, selected, setBoatCount, setSoldierCapacity]);

  const fogLayers = useMemo(
    () =>
      islands
        .filter((i) => !i.unlocked && i.id !== 'home')
        .map((i) => (
          <Pressable
            key={`fog-${i.id}`}
            style={[
              styles.fog,
              {
                left: i.x * width - 40,
                top: i.y * height - 40,
              },
            ]}
            onPress={() => unlockFog(i)}
          >
            <Text style={styles.fogText}>NEBEL</Text>
            <Text style={styles.fogCost}>🪙 {i.fogCost}</Text>
          </Pressable>
        )),
    [height, islands, unlockFog, width],
  );

  return (
    <View style={styles.root}>
      <View style={styles.oceanBg} />
      <View style={styles.stars} pointerEvents="none" />

      {islands.map((island) => (
        <Pressable
          key={island.id}
          style={[
            styles.island,
            {
              left: island.x * width - 28,
              top: island.y * height - 28,
              opacity: island.unlocked ? 1 : 0.35,
            },
            island.id === 'home' && styles.homeIsland,
          ]}
          onPress={() => {
            if (island.id === 'home') return;
            if (!island.unlocked) {
              unlockFog(island);
              return;
            }
            setSelected(island);
          }}
        >
          <Text style={styles.islandEmoji}>{island.id === 'home' ? '🏠' : '🏝'}</Text>
          <Text style={styles.islandName}>{island.name}</Text>
        </Pressable>
      ))}

      {fogLayers}

      <View style={styles.hudTop}>
        <LieutenantTips />
        <GameResourceBar />
      </View>

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalPanel}>
            <Text style={styles.modalTitle}>ANGRIFF VORBEREITEN</Text>
            <Text style={styles.modalSub}>{selected?.name}</Text>
            <Text style={styles.modalInfo}>Feind-HQ Stufe {selected?.hqLevel}</Text>
            <Text style={styles.modalInfo}>
              Beute: 🪙 {selected?.rewards.gold} · 🪵 {selected?.rewards.wood} · 🪨 {selected?.rewards.stone}
            </Text>
            <Pressable style={styles.attackBtn} onPress={startAttack}>
              <Text style={styles.attackBtnText}>⚓ ANGREIFEN</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={() => setSelected(null)}>
              <Text style={styles.cancelBtnText}>ABBRECHEN</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#09052d' },
  oceanBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1a0a40' },
  stars: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(168,85,247,0.08)',
  },
  island: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5a8f3c',
    borderWidth: 3,
    borderColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIsland: { backgroundColor: '#0369a1', borderColor: '#7dd3fc' },
  islandEmoji: { fontSize: 22 },
  islandName: {
    position: 'absolute',
    bottom: -14,
    color: '#fff',
    fontSize: 7,
    fontWeight: '900',
    width: 80,
    textAlign: 'center',
  },
  fog: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(30,20,60,0.75)',
    borderWidth: 2,
    borderColor: 'rgba(196,181,253,0.4)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fogText: { color: '#c4b5fd', fontSize: 9, fontWeight: '900' },
  fogCost: { color: '#fde68a', fontSize: 8, marginTop: 4, fontWeight: '800' },
  hudTop: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalPanel: {
    width: '78%',
    backgroundColor: 'rgba(15,23,42,0.96)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalTitle: { color: '#fef08a', fontSize: 14, fontWeight: '900', textAlign: 'center' },
  modalSub: { color: '#fff', fontSize: 16, fontWeight: '900', textAlign: 'center', marginTop: 6 },
  modalInfo: { color: '#cbd5e1', fontSize: 10, textAlign: 'center', marginTop: 6 },
  attackBtn: {
    marginTop: 16,
    backgroundColor: '#b91c1c',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fca5a5',
  },
  attackBtnText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  cancelBtn: { marginTop: 10, alignItems: 'center', padding: 8 },
  cancelBtnText: { color: '#94a3b8', fontWeight: '800', fontSize: 10 },
});
