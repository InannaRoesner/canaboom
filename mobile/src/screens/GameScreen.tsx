import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useResources } from '../context/ResourceContext';
import { useAttackPreparation } from '../context/AttackPreparationContext';
import { useArsenal } from '../context/ArsenalContext';
import {
  RaidManager,
  storeRaidVictory,
  type RaidState,
} from '../combat/RaidManager';
import { useCombatAudio } from '../audio/useGameAudio';
import AnimatedUnit from '../components/AnimatedUnit';
import IslandScene3D from '../components/IslandScene3D';
import type { BaseBuilding } from '../components/BuildingRenderer';
import { HQ_MAIN } from '../config/censorMaster';
import { ASSET_CACHE_VERSION } from '../config/assetReplace';
import { ISOMETRIC_3D_PIPELINE } from '../engine/Isometric3DPipeline';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

const RAID_SECONDS = 90;
const DEFAULT_REWARDS = {
  resources: { gold: 100, wood: 50, stone: 15 },
  victoryPoints: 3,
  galaxyMapIntel: 1,
};

function buildEnemyBase(hqLevel: number, defenseAlive: boolean): BaseBuilding[] {
  const hqSize = HQ_MAIN.grid_size[0] as BaseBuilding['size'];
  const buildings: BaseBuilding[] = [
    {
      id: 'enemy-hq',
      type: 'hq',
      name: 'Feind-HQ',
      icon: '★',
      color: '#78716c',
      row: 1,
      col: 1,
      level: hqLevel,
      size: hqSize,
    },
  ];
  if (defenseAlive) {
    buildings.push({
      id: 'enemy-cannon',
      type: 'defense',
      name: 'Kanone',
      icon: '♜',
      color: '#475569',
      row: 4,
      col: 5,
      level: 1,
      size: 2,
    });
  }
  return buildings;
}

export default function GameScreen({ navigation, route }: Props) {
  const params = route.params;
  const rewards = params?.raidRewards ?? DEFAULT_REWARDS;
  const {
    soldierCapacity,
    boatCount,
    selectedUnitId,
  } = useAttackPreparation();
  const { level: arsenalLevel } = useArsenal();
  const manager = useMemo(
    () => new RaidManager(params?.enemyHqLevel ?? 1, rewards, {
      unitId: selectedUnitId,
      count: soldierCapacity,
      arsenalLevel,
    }),
    [arsenalLevel, params?.enemyHqLevel, rewards, selectedUnitId, soldierCapacity],
  );
  const deployedUnits = useMemo(() => manager.getUnits(), [manager]);
  const [raid, setRaid] = useState<RaidState>(manager.getState());
  const [seconds, setSeconds] = useState(RAID_SECONDS);
  const [artilleryReady, setArtilleryReady] = useState(true);
  const [unitHealth, setUnitHealth] = useState(100);
  const [defenseHp, setDefenseHp] = useState(700);
  const [landingComplete, setLandingComplete] = useState(false);
  const [scene3dActive, setScene3dActive] = useState(false);
  const landing = useRef(new Animated.Value(0)).current;
  const rewarded = useRef(false);
  const { addResources } = useResources();
  const { playCombat } = useCombatAudio();

  const enemyBuildings = useMemo(
    () => buildEnemyBase(params?.enemyHqLevel ?? 1, defenseHp > 0),
    [defenseHp, params?.enemyHqLevel],
  );

  useEffect(() => {
    Animated.timing(landing, {
      toValue: 1,
      duration: Math.max(900, Math.round(5400 / Math.max(1, manager.getMovementSpeed()))),
      useNativeDriver: true,
    }).start(() => setLandingComplete(true));
  }, [landing, manager]);

  useEffect(() => {
    if (!landingComplete || raid.status !== 'active') return undefined;
    const battle = setInterval(() => {
      if (defenseHp > 0) {
        const troopDamage = manager.getTroopDamage(0.9, 'defense');
        setDefenseHp((hp) => Math.max(0, hp - troopDamage));
      } else {
        setRaid(manager.damageHq(manager.getTroopDamage(0.9, 'hq')));
      }
      setUnitHealth(manager.damageUnits(3));
    }, 900);
    return () => clearInterval(battle);
  }, [defenseHp, landingComplete, manager, raid.status]);

  useEffect(() => {
    if (raid.status !== 'active') return undefined;
    const timer = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setRaid(manager.lose());
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [manager, raid.status]);

  useEffect(() => {
    if (unitHealth === 0 && raid.status === 'active') setRaid(manager.lose());
  }, [manager, raid.status, unitHealth]);

  useEffect(() => {
    if (raid.status !== 'won' || rewarded.current) return;
    rewarded.current = true;
    addResources(rewards.resources);
    void storeRaidVictory(rewards);
    Alert.alert(
      'Sieg! Hauptquartier zerstört',
      `Beute: ${rewards.resources.gold} Gold · ${rewards.resources.wood} Holz · ${rewards.resources.stone} Stein\n+${rewards.victoryPoints} Siegpunkte · +${rewards.galaxyMapIntel} Karten-Information`,
      [{ text: 'Zur Karte', onPress: () => navigation.navigate('Main') }],
    );
  }, [addResources, navigation, raid.status, rewards]);

  useEffect(() => {
    if (raid.status !== 'lost') return;
    Alert.alert('Angriff gescheitert', 'Die Truppen wurden besiegt oder die Zeit ist abgelaufen.', [
      { text: 'Zurück', onPress: () => navigation.navigate('Main') },
    ]);
  }, [navigation, raid.status]);

  const artillery = useCallback(() => {
    if (!artilleryReady || raid.status !== 'active') return;
    playCombat();
    setArtilleryReady(false);
    if (defenseHp > 0) {
      setDefenseHp((hp) => Math.max(0, hp - 420));
    } else {
      setRaid(manager.damageHq(650));
    }
    setTimeout(() => setArtilleryReady(true), 3500);
  }, [artilleryReady, defenseHp, manager, playCombat, raid.status]);

  const heal = useCallback(() => {
    if (raid.status !== 'active') return;
    setUnitHealth(manager.healUnits(28));
  }, [manager, raid.status]);

  const hpPercent = (raid.hqHp / raid.hqMaxHp) * 100;
  const troopCount = Math.min(16, Math.max(4, soldierCapacity));
  const troopTranslate = landing.interpolate({ inputRange: [0, 1], outputRange: [90, -20] });

  return (
    <View
      key={`game-raid-${ASSET_CACHE_VERSION}`}
      collapsable={false}
      needsOffscreenAlphaCompositing={ISOMETRIC_3D_PIPELINE.hardware_acceleration.offscreen_alpha_compositing}
      renderToHardwareTextureAndroid={ISOMETRIC_3D_PIPELINE.hardware_acceleration.render_to_hardware_texture_android}
      shouldRasterizeIOS={ISOMETRIC_3D_PIPELINE.hardware_acceleration.rasterize_ios}
      style={styles.root}
    >
      <StatusBar hidden />

      <View testID="raid-engine-layer-0-3d" style={styles.sceneLayer}>
        <IslandScene3D
          buildings={enemyBuildings}
          compact
          frustum={13}
          onModeChange={(mode) => setScene3dActive(mode === '3d')}
        />
      </View>

      <View style={styles.skyTint} pointerEvents="none" />

      <View style={styles.hudTop} pointerEvents="box-none">
        <Pressable style={styles.retreat} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.retreatText}>RÜCKZUG</Text>
        </Pressable>
        <Text style={styles.target}>ANGRIFF · {params?.opponentName ?? 'FEINDINSEL'}</Text>
        <Text style={styles.timer}>⏱ {seconds}s</Text>
      </View>

      <View style={styles.hqHud} pointerEvents="none">
        <Text style={styles.hqLabel}>FEIND-HQ</Text>
        <View style={styles.hpTrack}>
          <View style={[styles.hpFill, { width: `${hpPercent}%` }]} />
        </View>
        <Text style={styles.hpText}>
          {raid.hqHp.toLocaleString('de-DE')} / {raid.hqMaxHp.toLocaleString('de-DE')} HP
        </Text>
        {defenseHp > 0 && (
          <Text style={styles.defenseText}>KANONE · {defenseHp} HP</Text>
        )}
        {defenseHp === 0 && raid.status === 'active' && (
          <Text style={styles.defenseDestroyed}>VERTEIDIGUNG ZERSTÖRT</Text>
        )}
      </View>

      <View style={styles.beachOverlay} pointerEvents="none">
        <Text style={styles.landingLabel}>
          {!landingComplete
            ? `VOM BOOT · AUTO-PFAD ZUM ${defenseHp > 0 ? 'TURM' : 'HQ'}`
            : defenseHp > 0
              ? 'LASER-ZIEL: VERTEIDIGUNGSTURM'
              : 'AUTO-PFAD: FEIND-HQ'}
        </Text>
        <Animated.View style={[styles.troops, { transform: [{ translateY: troopTranslate }] }]}>
          {Array.from({ length: troopCount }, (_, index) => (
            <AnimatedUnit
              key={index}
              motionState={raid.status !== 'active' ? 'idle' : landingComplete ? 'attack' : 'walk'}
              delay={(index % 4) * 35}
              unitSpriteId={selectedUnitId}
            />
          ))}
        </Animated.View>
        <View style={styles.unitHealth}>
          <Text style={styles.unitHealthText}>
            {unitHealth}% · {deployedUnits.length} Roboter · {deployedUnits[0]?.maxHp ?? 150} HP je
          </Text>
        </View>
      </View>

      <View style={styles.gunboatOverlay} pointerEvents="none">
        <Text style={styles.boatIcon}>🚢</Text>
        <Text style={styles.boatLabel}>KANONENBOOT · {boatCount} LANDUNGSBOOTE</Text>
        {scene3dActive && <Text style={styles.engineBadge}>3D</Text>}
      </View>

      <View style={styles.abilities}>
        <Pressable
          style={[styles.ability, styles.artillery, !artilleryReady && styles.disabled]}
          disabled={!artilleryReady}
          onPress={artillery}
        >
          <Text style={styles.abilityIcon}>💥</Text>
          <Text style={styles.abilityText}>{artilleryReady ? 'ARTILLERIE' : 'LÄDT …'}</Text>
          <Text style={styles.abilityHint}>{defenseHp > 0 ? 'Verteidigung anvisieren' : 'HQ anvisieren'}</Text>
        </Pressable>
        <Pressable style={[styles.ability, styles.heal]} onPress={heal}>
          <Text style={styles.abilityIcon}>✚</Text>
          <Text style={styles.abilityText}>HEILUNG</Text>
          <Text style={styles.abilityHint}>Truppen +28%</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden', backgroundColor: '#09052d' },
  sceneLayer: { ...StyleSheet.absoluteFillObject },
  skyTint: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '18%',
    backgroundColor: 'rgba(125,211,252,0.22)',
    zIndex: 2,
  },
  hudTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '17%',
    paddingHorizontal: 18,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 30,
  },
  target: { color: '#e0f2fe', fontSize: 15, fontWeight: '900', letterSpacing: 0.8, flex: 1, marginHorizontal: 8 },
  timer: { color: '#fff', fontSize: 16, fontWeight: '900', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: 'rgba(15,23,42,0.88)' },
  hqHud: {
    position: 'absolute',
    top: '14%',
    alignSelf: 'center',
    minWidth: 170,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(66,32,6,0.65)',
    backgroundColor: 'rgba(24,7,64,0.55)',
    zIndex: 25,
  },
  hqLabel: { color: '#fef08a', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  hpTrack: { width: 135, height: 10, marginTop: 5, borderRadius: 5, overflow: 'hidden', backgroundColor: '#3f3f46' },
  hpFill: { height: '100%', backgroundColor: '#ef4444' },
  hpText: { color: '#fff', fontSize: 9, marginTop: 3, fontWeight: '700' },
  defenseText: { color: '#cbd5e1', fontSize: 8, marginTop: 4, fontWeight: '800' },
  defenseDestroyed: { color: '#86efac', fontSize: 8, marginTop: 4, fontWeight: '900' },
  beachOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '22%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  landingLabel: { position: 'absolute', left: 12, top: 4, color: '#fde68a', fontSize: 9, fontWeight: '900', textShadowColor: '#000', textShadowRadius: 3 },
  troops: { maxWidth: '70%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  soldier: { fontSize: 18, marginHorizontal: -1 },
  unitHealth: { position: 'absolute', right: 10, bottom: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7, backgroundColor: 'rgba(22,101,52,0.88)' },
  unitHealthText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  gunboatOverlay: { position: 'absolute', left: 20, bottom: 88, alignItems: 'center', zIndex: 22 },
  boatIcon: { fontSize: 42 },
  boatLabel: { color: '#ddd6fe', fontSize: 7, fontWeight: '900' },
  engineBadge: { marginTop: 2, color: '#86efac', fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  abilities: { position: 'absolute', right: 16, bottom: 12, flexDirection: 'row', gap: 9, zIndex: 35 },
  ability: { width: 128, minHeight: 62, padding: 8, borderRadius: 12, borderWidth: 2, alignItems: 'center' },
  artillery: { backgroundColor: 'rgba(154,52,18,0.92)', borderColor: '#fdba74' },
  heal: { backgroundColor: 'rgba(22,101,52,0.92)', borderColor: '#86efac' },
  disabled: { opacity: 0.5 },
  abilityIcon: { position: 'absolute', left: 7, top: 10, fontSize: 21 },
  abilityText: { marginLeft: 22, color: '#fff', fontSize: 11, fontWeight: '900' },
  abilityHint: { marginLeft: 22, color: '#f1f5f9', fontSize: 7, marginTop: 3 },
  retreat: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(127,29,29,0.9)' },
  retreatText: { color: '#fff', fontSize: 8, fontWeight: '900' },
});
