import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GalaxyWaterEffects from '../components/GalaxyWaterEffects';
import { ROCKET_IMAGE } from '../assets/images';
import { ASSET_CACHE_VERSION } from '../config/assetReplace';
import { ISOMETRIC_3D_PIPELINE } from '../engine/Isometric3DPipeline';
import type { RootStackParamList } from '../navigation/types';
import { useAttackPreparation } from '../context/AttackPreparationContext';
import { getUnitById } from '../config/units';

type Props = NativeStackScreenProps<RootStackParamList, 'Travel'>;

export default function TravelScreen({ navigation, route }: Props) {
  const { loadedUnitCount, boatCount, selectedUnitId } = useAttackPreparation();
  const progress = useRef(new Animated.Value(0)).current;
  const duration = useMemo(
    () => Math.max(2000, Math.min(4000, 2000 + (route.params.distanceFactor ?? 1) * 220)),
    [route.params.distanceFactor],
  );

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (!finished) return;
      navigation.replace('Game', {
        planetId: route.params.planetId,
        opponentId: route.params.targetId,
        opponentName: route.params.targetName,
        enemyHqLevel: route.params.enemyHqLevel,
        raidRewards: route.params.rewards,
      });
    });
    return () => animation.stop();
  }, [duration, navigation, progress, route.params]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-130, 430] });
  const translateY = progress.interpolate({ inputRange: [0, 0.55, 1], outputRange: [35, -28, 15] });

  return (
    <View
      key={`travel-${ASSET_CACHE_VERSION}`}
      collapsable={false}
      needsOffscreenAlphaCompositing={ISOMETRIC_3D_PIPELINE.hardware_acceleration.offscreen_alpha_compositing}
      renderToHardwareTextureAndroid={ISOMETRIC_3D_PIPELINE.hardware_acceleration.render_to_hardware_texture_android}
      shouldRasterizeIOS={ISOMETRIC_3D_PIPELINE.hardware_acceleration.rasterize_ios}
      style={styles.root}
    >
      <GalaxyWaterEffects />
      <Text style={styles.title}>KURS AUF {route.params.targetName.toUpperCase()}</Text>
      <Text style={styles.subtitle}>
        {boatCount} Boote · {loadedUnitCount} {getUnitById(selectedUnitId).name} auf dem Weg zur Landung …
      </Text>
      <Animated.Image
        source={ROCKET_IMAGE}
        resizeMode="contain"
        style={[styles.ship, { transform: [{ translateX }, { translateY }, { rotate: '12deg' }] }]}
      />
      <View style={styles.destination}>
        <Text style={styles.destinationIcon}>🏝️</Text>
        <Text style={styles.destinationText}>ZIEL</Text>
      </View>
      <View style={styles.wake} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden', justifyContent: 'center' },
  title: { position: 'absolute', top: 36, alignSelf: 'center', color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 1.2, zIndex: 5 },
  subtitle: { position: 'absolute', top: 65, alignSelf: 'center', color: '#c4b5fd', fontSize: 12, fontWeight: '700', zIndex: 5 },
  ship: { position: 'absolute', left: 0, alignSelf: 'center', width: 115, height: 88, zIndex: 4 },
  destination: { position: 'absolute', right: 22, alignItems: 'center', zIndex: 3 },
  destinationIcon: { fontSize: 66 },
  destinationText: { color: '#fef3c7', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  wake: { position: 'absolute', left: 0, right: 0, top: '58%', height: 3, backgroundColor: 'rgba(216,180,254,0.45)' },
});
