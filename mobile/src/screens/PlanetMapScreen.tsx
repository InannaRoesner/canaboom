import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameResourceBar from '../components/GameResourceBar';
import { useResources } from '../context/ResourceContext';
import { useAttackPreparation } from '../context/AttackPreparationContext';
import { getTravelGoldCost } from '../config/attackSystem';
import type { RaidTargetParams } from '../navigation/types';
import { getMapBots, type BotProfile } from '../data/bots';
import { MapManager, SPACE_MAP_SIZE, type AsteroidField, type PlanetNode } from '../map/MapManager';
import { getIslandPage } from '../map/IslandGenerator';
import { getPlanetAsset, PLANET_COLORS } from '../map/planetAssets';
import { WORLD_BG } from '../map/worldBackground';
import GalaxyWaterEffects from '../components/GalaxyWaterEffects';
import { ASSET_CACHE_VERSION } from '../config/assetReplace';
import { ISOMETRIC_3D_PIPELINE } from '../engine/Isometric3DPipeline';
import type { GalaxySectorId } from '../config/galaxyWorldMap';
import {
  DEFAULT_MAP_PROGRESS,
  isRadarBuilt,
  loadMapProgress,
  saveMapProgress,
} from '../storage/mapProgress';
import type { RootStackParamList } from '../navigation/types';
import { UNITS, getUnitById } from '../config/units';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'> & {
  onOpenHome: () => void;
};

const PLANET_SIZE = 94;
const ASTEROID_SIZE = 74;
const SECTOR_COLORS = ['#075985', '#9a3412', '#475569', '#6b21a8'] as const;
const SECTOR_ANCHORS = [
  { x: 900, y: 820 },
  { x: 1160, y: 650 },
  { x: 1360, y: 380 },
  { x: 1390, y: 150 },
] as const;
const stars = Array.from({ length: 85 }, (_, index) => ({
  left: (index * 193 + 47) % SPACE_MAP_SIZE,
  top: (index * 317 + 89) % SPACE_MAP_SIZE,
  size: 1 + (index % 3),
  opacity: 0.25 + (index % 5) * 0.12,
}));

function formatCost(cost: PlanetNode['unlockCost']): string {
  return [
    cost.blueten ? `🌸 ${cost.blueten}` : '',
    cost.duenger ? `🧪 ${cost.duenger}` : '',
    cost.fuel ? `⛽ ${cost.fuel}` : '',
  ].filter(Boolean).join('  ');
}

export default function PlanetMapScreen({ navigation, onOpenHome }: Props) {
  const insets = useSafeAreaInsets();
  const { resources: playerResources, canAfford, spend } = useResources();
  const attackPreparation = useAttackPreparation();
  const managerRef = useRef(new MapManager(DEFAULT_MAP_PROGRESS.resources));
  const pan = useRef(new Animated.ValueXY({ x: -650, y: -650 })).current;
  const dragStart = useRef({ x: -650, y: -650 });
  const didCenter = useRef(false);
  const islandFloat = useRef(new Animated.Value(0)).current;
  const [viewport, setViewport] = useState({ width: 390, height: 780 });
  const [, setRevision] = useState(0);
  const [ready, setReady] = useState(false);
  const [radarOnline, setRadarOnline] = useState(false);
  const manager = managerRef.current;
  const resources = manager.getResources();
  const bots = useMemo(() => getMapBots(), []);

  useEffect(() => {
    void Promise.all([loadMapProgress(), isRadarBuilt()]).then(([progress, radarBuilt]) => {
      managerRef.current = new MapManager(
        progress.resources,
        progress.unlockedPlanetIds,
        progress.unlockedSectorIds,
      );
      setRadarOnline(radarBuilt);
      setRevision((value) => value + 1);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(islandFloat, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(islandFloat, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    );
    floatLoop.start();
    return () => floatLoop.stop();
  }, [islandFloat]);

  const clampPosition = (x: number, y: number) => ({
    x: Math.max(viewport.width - SPACE_MAP_SIZE - 60, Math.min(60, x)),
    y: Math.max(viewport.height - SPACE_MAP_SIZE - 60, Math.min(60, y)),
  });

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gesture) =>
      Math.abs(gesture.dx) > 6 || Math.abs(gesture.dy) > 6,
    onPanResponderGrant: () => {
      pan.stopAnimation((value) => {
        dragStart.current = value;
      });
    },
    onPanResponderMove: (_event, gesture) => {
      pan.setValue(clampPosition(
        dragStart.current.x + gesture.dx,
        dragStart.current.y + gesture.dy,
      ));
    },
    onPanResponderRelease: () => {
      pan.stopAnimation((value) => {
        const next = clampPosition(value.x, value.y);
        Animated.spring(pan, {
          toValue: next,
          useNativeDriver: false,
          tension: 80,
          friction: 12,
        }).start();
      });
    },
  }), [pan, viewport.height, viewport.width]);

  const persist = async () => {
    const current = managerRef.current;
    await saveMapProgress({
      unlockedPlanetIds: current.planets.filter((planet) => planet.unlocked).map((planet) => planet.id),
      unlockedSectorIds: current.galaxySectors.filter((sector) => sector.unlocked).map((sector) => sector.id),
      resources: current.getResources(),
    });
  };

  const unlockField = (field: AsteroidField) => {
    const planet = managerRef.current.getPlanet(field.toPlanetId);
    if (!field.reachable) {
      Alert.alert('Route blockiert', 'Schalte zuerst den vorherigen Planeten dieser Route frei.');
      return;
    }
    Alert.alert(
      `☄️ Sektor zu ${planet.name} räumen?`,
      `Die Asteroidenflotte benötigt:\n${formatCost(planet.unlockCost)}`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Räumen',
          onPress: () => {
            const result = managerRef.current.unlockPlanetRoute(planet.id);
            if (!result.success) {
              Alert.alert('Nicht möglich', result.reason);
              return;
            }
            void persist();
            setRevision((value) => value + 1);
            Alert.alert('Sektor frei!', `${planet.name} ist jetzt erreichbar.`);
          },
        },
      ],
    );
  };

  const revealSector = (sectorId: GalaxySectorId) => {
    const sector = managerRef.current.getSector(sectorId);
    if (sector.unlocked) return;
    if (!radarOnline) {
      Alert.alert(
        'Radarantenne erforderlich',
        'Baue zuerst eine Radarantenne auf deiner Heimatbasis, um Galaxiewolken aufzudecken.',
      );
      return;
    }
    const previous = managerRef.current.galaxySectors[sector.index - 1];
    if (!previous?.unlocked) {
      Alert.alert('Wolken undurchdringlich', 'Decke zuerst den vorherigen Sektor auf.');
      return;
    }
    Alert.alert(
      `☁️ ${sector.name} aufdecken?`,
      `Die Radarerkundung kostet ${sector.unlockCost.toLocaleString('de-DE')} Gold.`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Aufdecken',
          onPress: () => {
            if (!canAfford({ gold: sector.unlockCost })) {
              Alert.alert(
                'Nicht genug Gold',
                `Dir fehlen ${Math.max(0, sector.unlockCost - playerResources.gold).toLocaleString('de-DE')} Gold.`,
              );
              return;
            }
            const result = managerRef.current.unlockSector(sectorId);
            if (!result.success) {
              Alert.alert('Nicht möglich', result.reason);
              return;
            }
            spend({ gold: sector.unlockCost });
            void persist();
            setRevision((value) => value + 1);
            Alert.alert('Sektor aufgedeckt!', `${sector.name} ist jetzt sichtbar.`);
          },
        },
      ],
    );
  };

  const beginAttack = (target: RaidTargetParams, sectorUnlocked: boolean) => {
    if (!sectorUnlocked) {
      Alert.alert(
        'Ziel im Nebel',
        'Dieser Sektor ist von Galaxiewolken bedeckt. Decke ihn zuerst mit der Radarantenne auf.',
      );
      return;
    }
    if (!attackPreparation.prepared) {
      Alert.alert('Flotte nicht vorbereitet', 'Belade zuerst deine Landungsboote am Hafen.');
      return;
    }
    const fuelCost = getTravelGoldCost(target.distanceFactor ?? 1);
    Alert.alert(
      `⚓ Angriff auf ${target.targetName}?`,
      `${attackPreparation.boatCount} Boote · ${attackPreparation.soldierCapacity} ${getUnitById(attackPreparation.selectedUnitId).name}\nTreibstoff: ${fuelCost.toLocaleString('de-DE')} Gold`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Tanken & Segeln',
          onPress: () => {
            if (!canAfford({ gold: fuelCost }) || !spend({ gold: fuelCost })) {
              Alert.alert(
                'Nicht genug Gold',
                `Für diese Reise fehlen dir ${Math.max(0, fuelCost - playerResources.gold).toLocaleString('de-DE')} Gold.`,
              );
              return;
            }
            navigation.navigate('Travel', target);
          },
        },
      ],
    );
  };

  const attackBot = (bot: BotProfile) => {
    const planet = managerRef.current.getPlanet(bot.planetId);
    const sectorUnlocked = managerRef.current.getSector(planet.sectorId).unlocked;
    beginAttack({
      targetId: bot.id,
      targetName: bot.displayName,
      planetId: bot.planetId,
      enemyHqLevel: bot.hqLevel,
      distanceFactor: Math.max(1, planet.ring * 1.25),
      rewards: {
        resources: {
          gold: 120 + bot.hqLevel * 45,
          wood: 45 + bot.hqLevel * 20,
          stone: 15 + bot.hqLevel * 8,
        },
        victoryPoints: 3 + bot.hqLevel,
        galaxyMapIntel: 1,
      },
    }, sectorUnlocked);
  };

  const openPlanet = (planet: PlanetNode) => {
    const sector = managerRef.current.getSector(planet.sectorId);
    if (!sector.unlocked) {
      Alert.alert(
        `☁️ ${sector.name}`,
        `Decke diesen Sektor zuerst für ${sector.unlockCost.toLocaleString('de-DE')} Gold auf.`,
      );
      return;
    }
    if (!planet.unlocked) {
      Alert.alert(
        `🔒 ${planet.name}`,
        'Tippe auf das Asteroidenfeld der Route, um diesen Sektor freizuschalten.',
      );
      return;
    }
    if (planet.id === 'earth') {
      Alert.alert('🌍 Erde', 'Deine Heimatbasis und Startpunkt aller Weltraumrouten.', [
        { text: 'Schließen', style: 'cancel' },
        { text: 'Zur Basis', onPress: onOpenHome },
      ]);
      return;
    }
    const planetBots = bots.filter((bot) => bot.planetId === planet.id);
    if (!planetBots.length) {
      Alert.alert(`🪐 ${planet.name}`, `Ring ${planet.ring} erforscht.\nNoch keine Gegner entdeckt.`);
      return;
    }
    Alert.alert(
      `🪐 ${planet.name}`,
      `${planetBots.length} Bot-Ziele im Orbit. Erstes Ziel: ${planetBots[0].displayName}`,
      [
        { text: 'Schließen', style: 'cancel' },
        { text: 'Angreifen', onPress: () => attackBot(planetBots[0]) },
      ],
    );
  };

  return (
    <View
      key={`planet-map-${ASSET_CACHE_VERSION}`}
      collapsable={false}
      needsOffscreenAlphaCompositing={ISOMETRIC_3D_PIPELINE.hardware_acceleration.offscreen_alpha_compositing}
      renderToHardwareTextureAndroid={ISOMETRIC_3D_PIPELINE.hardware_acceleration.render_to_hardware_texture_android}
      shouldRasterizeIOS={ISOMETRIC_3D_PIPELINE.hardware_acceleration.rasterize_ios}
      style={styles.root}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setViewport({ width, height });
        if (!didCenter.current) {
          didCenter.current = true;
          const centered = { x: width / 2 - 900, y: height / 2 - 900 };
          dragStart.current = centered;
          pan.setValue(centered);
        }
      }}
    >
      <GalaxyWaterEffects />
      <Animated.View
        key={`world-map-${ASSET_CACHE_VERSION}`}
        {...panResponder.panHandlers}
        collapsable={false}
        needsOffscreenAlphaCompositing={ISOMETRIC_3D_PIPELINE.hardware_acceleration.offscreen_alpha_compositing}
        renderToHardwareTextureAndroid={ISOMETRIC_3D_PIPELINE.hardware_acceleration.render_to_hardware_texture_android}
        shouldRasterizeIOS={ISOMETRIC_3D_PIPELINE.hardware_acceleration.rasterize_ios}
        style={[styles.map, { transform: pan.getTranslateTransform() }]}
      >
        {WORLD_BG && (
          <Image
            source={WORLD_BG}
            style={styles.worldBackground}
            resizeMode="cover"
          />
        )}
        {stars.map((star, index) => (
          <View
            key={`star-${index}`}
            style={[
              styles.star,
              {
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              },
            ]}
          />
        ))}

        {[...manager.galaxySectors].reverse().map((sector) => {
          const diameter = 330 + sector.index * 420;
          return (
            <View
              key={`sector-tint-${sector.id}`}
              pointerEvents="none"
              style={[
                styles.sectorTint,
                {
                  width: diameter,
                  height: diameter,
                  borderRadius: diameter / 2,
                  left: 900 - diameter / 2,
                  top: 900 - diameter / 2,
                  backgroundColor: SECTOR_COLORS[sector.index],
                  opacity: sector.unlocked ? 0.1 : 0.035,
                },
              ]}
            />
          );
        })}

        {[1, 2, 3].map((ring) => (
          <View
            key={`ring-${ring}`}
            pointerEvents="none"
            style={[
              styles.orbitRing,
              {
                width: ring * 510,
                height: ring * 510,
                borderRadius: ring * 255,
                left: 900 - ring * 255,
                top: 900 - ring * 255,
              },
            ]}
          />
        ))}

        {manager.galaxySectors.map((sector) => {
          const anchor = SECTOR_ANCHORS[sector.index];
          return (
            <Pressable
              key={`sector-${sector.id}`}
              style={[
                styles.sectorBadge,
                {
                  left: anchor.x - 105,
                  top: anchor.y,
                  borderColor: SECTOR_COLORS[sector.index],
                },
                !sector.unlocked && styles.sectorBadgeLocked,
              ]}
              onPress={() => revealSector(sector.id)}
            >
              <Text style={styles.sectorIndex}>ETAPPE {sector.index + 1}</Text>
              <Text style={styles.sectorName}>{sector.name}</Text>
              <Text style={styles.sectorEnvironment}>{sector.environment.replaceAll('_', ' ')}</Text>
              {!sector.unlocked && (
                <>
                  <Text style={styles.clouds}>☁️ ☁️ ☁️</Text>
                  <Text style={styles.goldCost}>● {sector.unlockCost.toLocaleString('de-DE')} Gold</Text>
                </>
              )}
            </Pressable>
          );
        })}

        {manager.galaxySectors.flatMap((sector) => {
          if (!sector.unlocked) return [];
          const islands = getIslandPage(sector.id, 0, 20);
          const radius = 105 + sector.index * 215;
          return [
            ...islands.map((island) => {
              const angle = (island.index / islands.length) * Math.PI * 2 + sector.index * 0.31;
              const drift = (island.mapPosition.x - 50) * 1.4;
              return (
                <Animated.View
                  key={island.id}
                  style={[
                    styles.islandAnchor,
                    {
                      left: 900 + Math.cos(angle) * (radius + drift) - 10,
                      top: 900 + Math.sin(angle) * (radius + drift) - 10,
                      transform: [{
                        translateY: islandFloat.interpolate({
                          inputRange: [0, 1],
                          outputRange: island.index % 2 ? [-2, 2] : [2, -2],
                        }),
                      }],
                    },
                  ]}
                >
                  <Pressable
                  style={[styles.island, { backgroundColor: SECTOR_COLORS[sector.index] }]}
                  onPress={() => Alert.alert(
                    island.name,
                    `Gefahr ${island.dangerLevel} · Schwierigkeit ${island.difficulty}\nBelohnung: ${island.rewards.gold.toLocaleString('de-DE')} Gold`,
                    [
                      { text: 'Schließen', style: 'cancel' },
                      {
                        text: 'Angreifen',
                        onPress: () => beginAttack({
                          planetId: sector.id,
                          targetId: island.id,
                          targetName: island.name,
                          enemyHqLevel: Math.max(1, Math.min(20, Math.ceil(island.difficulty / 5))),
                          distanceFactor: Math.max(1, island.distanceFromBase / 300),
                          rewards: {
                            resources: island.rewards,
                            victoryPoints: Math.max(1, Math.ceil(island.dangerLevel / 8)),
                            galaxyMapIntel: 1 + Math.floor(island.dangerLevel / 30),
                          },
                        }, managerRef.current.getSector(island.sectorId).unlocked),
                      },
                    ],
                  )}
                >
                  <Text style={styles.islandIcon}>{sector.index === 2 ? '◆' : '▲'}</Text>
                  </Pressable>
                </Animated.View>
              );
            }),
            <View
              key={`${sector.id}-more`}
              pointerEvents="none"
              style={[
                styles.moreIslands,
                {
                  left: 900 + radius - 48,
                  top: 900 - 42,
                  borderColor: SECTOR_COLORS[sector.index],
                },
              ]}
            >
              <Text style={styles.moreIslandsText}>Mehr Inseln…</Text>
              <Text style={styles.moreIslandsCount}>20 / 1000</Text>
            </View>,
          ];
        })}

        {manager.getAsteroidFields()
          .filter((field) => manager.getSector(manager.getPlanet(field.toPlanetId).sectorId).unlocked)
          .map((field) => (
          <React.Fragment key={field.id}>
            <View
              pointerEvents="none"
              style={[
                styles.route,
                field.cleared ? styles.routeCleared : styles.routeLocked,
                {
                  left: field.x - field.length / 2,
                  top: field.y - 2,
                  width: field.length,
                  transform: [{ rotate: `${field.angle}deg` }],
                },
              ]}
            />
            {!field.cleared && (
              <Pressable
                style={[
                  styles.asteroidField,
                  {
                    left: field.x - ASTEROID_SIZE / 2,
                    top: field.y - ASTEROID_SIZE / 2,
                    opacity: field.reachable ? 1 : 0.55,
                  },
                ]}
                onPress={() => unlockField(field)}
              >
                <Text style={styles.asteroidIcon}>☄️</Text>
                <Text style={styles.asteroidLabel}>
                  {field.reachable ? formatCost(field.unlockCost) : 'GESPERRT'}
                </Text>
              </Pressable>
            )}
          </React.Fragment>
          ))}

        {manager.planets.map((planet, index) => {
          const asset = getPlanetAsset(planet.assetKey);
          const size = planet.id === 'earth' ? 112 : PLANET_SIZE;
          return (
            <Pressable
              key={planet.id}
              style={[
                styles.planetNode,
                {
                  left: planet.x - size / 2,
                  top: planet.y - size / 2,
                  width: size,
                },
              ]}
              onPress={() => openPlanet(planet)}
            >
              <View
                style={[
                  styles.planetDisc,
                  {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderColor: planet.unlocked ? '#67e8f9' : '#475569',
                    backgroundColor: PLANET_COLORS[index % PLANET_COLORS.length],
                  },
                  (!planet.unlocked || !manager.getSector(planet.sectorId).unlocked) && styles.planetLocked,
                ]}
              >
                {asset ? (
                  <Image source={asset} style={styles.planetImage} resizeMode="cover" />
                ) : (
                  <>
                    <Text style={styles.earthIcon}>🌍</Text>
                    <View style={styles.earthGlow} />
                  </>
                )}
                {!planet.unlocked && <Text style={styles.lock}>🔒</Text>}
                {!manager.getSector(planet.sectorId).unlocked && (
                  <View style={styles.planetCloud}>
                    <Text style={styles.planetCloudText}>☁️☁️</Text>
                  </View>
                )}
              </View>
              <View style={[styles.namePlate, !planet.unlocked && styles.namePlateLocked]}>
                <Text style={styles.planetName} numberOfLines={1}>{planet.name}</Text>
                <Text style={styles.ringLabel}>
                  {manager.getSector(planet.sectorId).name}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </Animated.View>

      <View style={[styles.header, { top: insets.top + 8 }]}>
        <Pressable style={styles.backButton} onPress={onOpenHome}>
          <Text style={styles.backText}>‹ BASIS</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>GALAXIE-WELTKARTE</Text>
          <Text style={styles.subtitle}>{ready ? 'Ziehen zum Navigieren' : 'Sektoren werden geladen …'}</Text>
        </View>
      </View>
      <GameResourceBar gold={playerResources.gold} />
      <View style={[styles.fuel, { top: insets.top + 82 }]}>
        <Text style={styles.fuelText}>⛽ {resources.fuel.toLocaleString('de-DE')}</Text>
      </View>
      <View style={[styles.legend, { bottom: Math.max(insets.bottom, 10) + 62 }]}>
        <Text style={styles.legendText}>{radarOnline ? '📡 Radar online' : '📡 Radar fehlt'} · ☁️ Sektoren aufdecken · ▲ Inseln erkunden</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden', backgroundColor: '#09052d' },
  map: {
    position: 'absolute',
    width: SPACE_MAP_SIZE,
    height: SPACE_MAP_SIZE,
    backgroundColor: 'transparent',
  },
  worldBackground: {
    ...StyleSheet.absoluteFillObject,
    width: SPACE_MAP_SIZE,
    height: SPACE_MAP_SIZE,
  },
  sectorTint: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  sectorBadge: {
    position: 'absolute',
    zIndex: 12,
    width: 210,
    minHeight: 54,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: 'rgba(2,6,23,0.9)',
  },
  sectorBadgeLocked: {
    minHeight: 88,
    backgroundColor: 'rgba(51,65,85,0.95)',
  },
  sectorIndex: { color: '#94a3b8', fontSize: 7, fontWeight: '900', letterSpacing: 1.2 },
  sectorName: { color: '#f8fafc', fontSize: 12, fontWeight: '900', textAlign: 'center' },
  sectorEnvironment: { color: '#cbd5e1', fontSize: 7, fontWeight: '700' },
  clouds: { marginTop: 2, fontSize: 15, letterSpacing: -4 },
  goldCost: { color: '#fde68a', fontSize: 9, fontWeight: '900' },
  islandAnchor: {
    position: 'absolute',
    zIndex: 3,
  },
  island: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  islandIcon: { color: '#fff', fontSize: 8, fontWeight: '900' },
  moreIslands: {
    position: 'absolute',
    zIndex: 4,
    width: 96,
    paddingVertical: 4,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(2,6,23,0.9)',
  },
  moreIslandsText: { color: '#e2e8f0', fontSize: 8, fontWeight: '900' },
  moreIslandsCount: { color: '#94a3b8', fontSize: 7, fontWeight: '700' },
  star: { position: 'absolute', borderRadius: 2, backgroundColor: '#e0f2fe' },
  orbitRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.13)',
  },
  route: { position: 'absolute', height: 4, borderRadius: 2 },
  routeCleared: { backgroundColor: 'rgba(34,211,238,0.55)' },
  routeLocked: { backgroundColor: 'rgba(100,116,139,0.35)' },
  asteroidField: {
    position: 'absolute',
    width: ASTEROID_SIZE,
    height: ASTEROID_SIZE,
    borderRadius: ASTEROID_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,41,59,0.92)',
    borderWidth: 2,
    borderColor: '#f59e0b',
    elevation: 7,
  },
  asteroidIcon: { fontSize: 30 },
  asteroidLabel: {
    maxWidth: 110,
    marginTop: 1,
    color: '#fde68a',
    fontSize: 7,
    fontWeight: '900',
    textAlign: 'center',
  },
  planetNode: { position: 'absolute', alignItems: 'center', zIndex: 5 },
  planetDisc: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    shadowColor: '#22d3ee',
    shadowOpacity: 0.65,
    shadowRadius: 10,
    elevation: 10,
  },
  planetLocked: { opacity: 0.58, shadowOpacity: 0 },
  planetCloud: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(71,85,105,0.5)',
  },
  planetCloudText: { fontSize: 27, letterSpacing: -12, marginLeft: -8 },
  planetImage: { width: '100%', height: '100%' },
  earthIcon: { fontSize: 69, zIndex: 2 },
  earthGlow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 5,
    borderColor: 'rgba(134,239,172,0.45)',
  },
  lock: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15,23,42,0.9)',
    textAlign: 'center',
    lineHeight: 36,
    fontSize: 20,
  },
  namePlate: {
    minWidth: 88,
    maxWidth: 122,
    marginTop: -4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(8,47,73,0.94)',
    borderWidth: 1,
    borderColor: '#22d3ee',
  },
  namePlateLocked: { backgroundColor: 'rgba(30,41,59,0.94)', borderColor: '#64748b' },
  planetName: { color: '#f8fafc', fontSize: 11, fontWeight: '900' },
  ringLabel: { color: '#7dd3fc', fontSize: 7, fontWeight: '800', letterSpacing: 0.8 },
  header: {
    position: 'absolute',
    left: 10,
    zIndex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  backButton: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(15,23,42,0.94)',
    borderWidth: 2,
    borderColor: '#64748b',
  },
  backText: { color: '#e2e8f0', fontSize: 11, fontWeight: '900' },
  title: { color: '#f8fafc', fontSize: 16, fontWeight: '900', letterSpacing: 1.2 },
  subtitle: { color: '#67e8f9', fontSize: 9, fontWeight: '700' },
  fuel: {
    position: 'absolute',
    right: 10,
    zIndex: 31,
    width: 112,
    height: 31,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(4,9,18,0.9)',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  fuelText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  legend: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: 'rgba(2,6,23,0.86)',
    borderWidth: 1,
    borderColor: '#334155',
  },
  legendText: { color: '#94a3b8', fontSize: 9, fontWeight: '700' },
});
