import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WATER_EFFECTS } from '../config/mapTransformation';
import AnimatedUnit from './AnimatedUnit';

type Props = {
  onOpenShop: () => void;
  onOpenMap: () => void;
  onOpenBaseEditor: () => void;
  onDive?: () => void;
  disabled?: boolean;
};

/** Phase-2 combat hooks; capacities will be connected to troop loadouts later. */
export type HarborSupportState = {
  landingBoatCapacity: number;
  gunboatEnergy: number;
};

export const INITIAL_HARBOR_SUPPORT: HarborSupportState = {
  landingBoatCapacity: 0,
  gunboatEnergy: 0,
};

export default function BeachHarbor({ onOpenShop, onOpenMap, onOpenBaseEditor, onDive, disabled = false }: Props) {
  const insets = useSafeAreaInsets();
  const disembark = useRef(new Animated.Value(0)).current;
  const harborMotion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const march = Animated.loop(
      Animated.sequence([
        Animated.delay(900),
        Animated.timing(disembark, {
          toValue: 1,
          duration: 3600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(700),
        Animated.timing(disembark, {
          toValue: 0,
          duration: 1,
          useNativeDriver: true,
        }),
      ])
    );
    const bob = Animated.loop(
      Animated.sequence([
        Animated.timing(harborMotion, {
          toValue: 1,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(harborMotion, {
          toValue: 0,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    march.start();
    bob.start();
    return () => {
      march.stop();
      bob.stop();
    };
  }, [disembark, harborMotion]);

  return (
    <View style={[styles.anchor, { paddingBottom: Math.max(insets.bottom, 5) }]} pointerEvents="box-none">
      <View style={styles.sand} pointerEvents="none" />
      <Pressable style={styles.water} disabled={disabled || !onDive} onPress={onDive}>
        <Animated.View
          style={[
            styles.foam,
            {
              opacity: harborMotion.interpolate({ inputRange: [0, 1], outputRange: [0.46, 1] }),
              transform: [
                { rotate: '-4deg' },
                { scaleX: harborMotion.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.04] }) },
              ],
            },
          ]}
        />
        <Text style={styles.diveHint}>TAUCHGANG</Text>
      </Pressable>

      <Pressable
        disabled={disabled}
        onPress={onOpenShop}
        style={({ pressed }) => [styles.action, styles.build, pressed && styles.pressed]}
      >
        <View style={styles.actionInset}><Text style={styles.actionIcon}>⚒</Text></View>
        <Text style={styles.actionLabel}>BAUEN</Text>
        <View style={styles.activeBadge}><Text style={styles.activeText}>AKTIV</Text></View>
      </Pressable>

      <View style={styles.dock}>
        <View style={styles.harborShore}>
          <View style={styles.harborRockOne} />
          <View style={styles.harborRockTwo} />
        </View>
        <View style={styles.pier}>
          {Array.from({ length: 6 }).map((_, index) => <View key={index} style={styles.plank} />)}
          <View style={styles.postLeft} />
          <View style={styles.postRight} />
          <Soldier style={styles.soldierOne} />
          <Soldier style={styles.soldierTwo} />
          <Soldier style={styles.soldierThree} />
          <Soldier style={styles.soldierFour} />
        </View>
        <View style={styles.boats}>
          <Animated.View
            style={[
              styles.boat,
              {
                transform: [{
                  translateY: harborMotion.interpolate({ inputRange: [0, 1], outputRange: [1.5, -2.5] }),
                }],
              },
            ]}
          >
            {WATER_EFFECTS.enabled && WATER_EFFECTS.reflections && <BoatReflection />}
            <View style={styles.boatWake} />
            <View style={styles.boatHull} />
            <View style={styles.boatCabin} />
            <View style={styles.boatRamp} />
            <Text style={styles.boatFlag}>⚑</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.boat,
              styles.boatTwo,
              {
                transform: [{
                  translateY: harborMotion.interpolate({ inputRange: [0, 1], outputRange: [-1.5, 2] }),
                }],
              },
            ]}
          >
            {WATER_EFFECTS.enabled && WATER_EFFECTS.reflections && <BoatReflection orange />}
            <View style={styles.boatWake} />
            <View style={[styles.boatHull, styles.orangeHull]} />
            <View style={styles.boatCabin} />
            <View style={styles.boatRamp} />
          </Animated.View>
          <Animated.View
            style={[
              styles.boat,
              styles.boatThree,
              {
                transform: [{
                  translateY: harborMotion.interpolate({ inputRange: [0, 1], outputRange: [1, -2] }),
                }],
              },
            ]}
          >
            {WATER_EFFECTS.enabled && WATER_EFFECTS.reflections && <BoatReflection />}
            <View style={styles.boatWake} />
            <View style={styles.boatHull} />
            <View style={styles.boatCabin} />
            <View style={styles.boatRamp} />
          </Animated.View>
        </View>
        <Animated.View
          style={[
            styles.gunboat,
            {
              transform: [
                { rotate: '-12deg' },
                { translateY: harborMotion.interpolate({ inputRange: [0, 1], outputRange: [1.5, -2] }) },
                { rotate: harborMotion.interpolate({ inputRange: [0, 1], outputRange: ['-0.6deg', '0.6deg'] }) },
              ],
            },
          ]}
        >
          <View style={styles.gunboatWake} />
          <View style={styles.gunboatHull} />
          <View style={styles.gunboatDeck} />
          <View style={styles.gunboatTurret}><View style={styles.gunboatBarrel} /></View>
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.disembarkingUnit,
            {
              opacity: disembark.interpolate({
                inputRange: [0, 0.08, 0.88, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [
                { translateX: disembark.interpolate({ inputRange: [0, 1], outputRange: [31, 0] }) },
                { translateY: disembark.interpolate({ inputRange: [0, 1], outputRange: [53, -38] }) },
              ],
            },
          ]}
        >
          <AnimatedUnit motionState="walk">
            <Soldier style={styles.marchSoldier} />
          </AnimatedUnit>
        </Animated.View>
      </View>

      <Pressable
        disabled={disabled}
        onPress={onOpenMap}
        style={({ pressed }) => [styles.action, styles.map, pressed && styles.pressed]}
      >
        <View style={[styles.actionInset, styles.mapInset]}><View style={styles.compass}>
          <Text style={styles.north}>N</Text>
          <View style={styles.radarRing} />
          <View style={styles.radarCrossHorizontal} />
          <View style={styles.radarCrossVertical} />
          <View style={styles.radarSweep} />
          <View style={styles.radarBlip} />
          <View style={styles.hub} />
        </View></View>
        <Text style={styles.actionLabel}>KARTE</Text>
      </Pressable>
      <Pressable
        disabled={disabled}
        onPress={onOpenBaseEditor}
        style={({ pressed }) => [styles.editor, pressed && styles.pressed]}
      >
        <Text style={styles.editorIcon}>▦</Text>
        <Text style={styles.editorLabel}>BASE EDITOR</Text>
      </Pressable>
    </View>
  );
}

function BoatReflection({ orange = false }: { orange?: boolean }) {
  return (
    <View style={styles.reflection} pointerEvents="none">
      <View style={styles.reflectionNebula} />
      <View style={[styles.reflectionHull, orange && styles.reflectionHullOrange]} />
      <View style={styles.reflectionCabin} />
      <View style={styles.reflectionRamp} />
      <View style={[styles.reflectionStar, styles.reflectionStarOne]} />
      <View style={[styles.reflectionStar, styles.reflectionStarTwo]} />
      <View style={styles.reflectionRipple} />
    </View>
  );
}

function Soldier({ style }: { style: object }) {
  return (
    <View style={[styles.soldier, style]} pointerEvents="none">
      <View style={styles.helmet} />
      <View style={styles.soldierHead} />
      <View style={styles.soldierBody} />
      <View style={styles.rifle} />
      <View style={styles.boots} />
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 164,
    zIndex: 40,
    paddingHorizontal: 8,
  },
  sand: {
    position: 'absolute',
    right: '8%',
    bottom: 78,
    width: '48%',
    height: 43,
    borderRadius: 70,
    backgroundColor: '#e9bd5d',
    borderWidth: 4,
    borderColor: '#fff5c2',
    transform: [{ rotate: '-5deg' }],
  },
  water: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 98,
  },
  foam: {
    position: 'absolute',
    right: '7%',
    top: 2,
    width: '47%',
    height: 6,
    borderRadius: 9,
    backgroundColor: 'rgba(240,226,255,0.84)',
    shadowColor: '#db8cff',
    shadowOpacity: 0.8,
    shadowRadius: 5,
    transform: [{ rotate: '-4deg' }],
  },
  diveHint: { position: 'absolute', right: 102, bottom: 8, color: 'rgba(240,226,255,0.78)', fontSize: 7, fontWeight: '900', letterSpacing: 0.7 },
  action: {
    position: 'absolute',
    width: 76,
    height: 76,
    bottom: 8,
    borderRadius: 38,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14532d',
    shadowOpacity: 0.32,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 4,
  },
  build: { left: 8, backgroundColor: 'rgba(83,45,23,0.97)', borderColor: '#fde047', shadowColor: '#fde047', shadowOpacity: 0.78 },
  map: { right: 8, backgroundColor: 'rgba(4,29,68,0.96)', borderColor: '#67e8f9', shadowColor: '#22d3ee', shadowOpacity: 0.7 },
  actionInset: { width: 55, height: 55, borderRadius: 28, borderWidth: 2, borderColor: '#6e3918', backgroundColor: '#df8b30', alignItems: 'center', justifyContent: 'center' },
  mapInset: { backgroundColor: '#092d48', borderColor: '#67e8f9' },
  actionIcon: { fontSize: 28, transform: [{ rotate: '-10deg' }] },
  actionLabel: { position: 'absolute', bottom: 3, color: '#fff', fontSize: 9, fontWeight: '900', textShadowColor: '#142a31', textShadowRadius: 2, letterSpacing: 0.7 },
  activeBadge: { position: 'absolute', top: -9, borderRadius: 7, paddingHorizontal: 5, paddingVertical: 2, backgroundColor: '#22c55e', borderWidth: 1, borderColor: '#dcfce7' },
  activeText: { color: '#fff', fontSize: 6, fontWeight: '900', letterSpacing: 0.5 },
  pressed: { transform: [{ scale: 0.95 }], opacity: 0.88 },
  dock: {
    position: 'absolute',
    right: 84,
    bottom: 8,
    width: '43%',
    maxWidth: 270,
    height: 155,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  harborShore: {
    position: 'absolute',
    top: 0,
    width: 116,
    height: 45,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffefbd',
    backgroundColor: '#e5b65a',
    transform: [{ rotate: '-4deg' }],
  },
  harborRockOne: { position: 'absolute', left: 8, top: 2, width: 27, height: 22, borderRadius: 12, backgroundColor: '#aa936d', borderBottomWidth: 4, borderBottomColor: '#756047' },
  harborRockTwo: { position: 'absolute', right: 7, top: 8, width: 22, height: 18, borderRadius: 10, backgroundColor: '#c4ad81', borderBottomWidth: 4, borderBottomColor: '#79664c' },
  pier: {
    position: 'absolute',
    top: 18,
    width: 72,
    height: 104,
    backgroundColor: '#9a5d31',
    borderWidth: 3,
    borderColor: '#713f12',
    borderRadius: 8,
    paddingTop: 7,
    gap: 9,
  },
  plank: { height: 4, backgroundColor: '#d8a76b', opacity: 0.85, borderBottomWidth: 1, borderBottomColor: '#5d351d' },
  postLeft: { position: 'absolute', left: -7, top: 6, width: 10, height: 99, borderRadius: 4, backgroundColor: '#78350f' },
  postRight: { position: 'absolute', right: -7, top: 6, width: 10, height: 99, borderRadius: 4, backgroundColor: '#78350f' },
  boats: { width: '100%', height: 89, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  boat: { width: 48, height: 62, alignItems: 'center', justifyContent: 'flex-end' },
  boatTwo: { marginBottom: 9 },
  boatThree: { marginBottom: 2 },
  gunboat: { position: 'absolute', left: -54, bottom: 1, width: 76, height: 39, alignItems: 'center', justifyContent: 'flex-end' },
  gunboatWake: { position: 'absolute', bottom: -4, width: 85, height: 15, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(240,226,255,0.82)' },
  gunboatHull: { width: 73, height: 19, borderRadius: 12, borderWidth: 3, borderColor: '#24333c', backgroundColor: '#53676b' },
  gunboatDeck: { position: 'absolute', bottom: 13, width: 48, height: 13, borderRadius: 6, borderWidth: 2, borderColor: '#32433e', backgroundColor: '#798a70' },
  gunboatTurret: { position: 'absolute', bottom: 21, width: 18, height: 13, borderRadius: 8, borderWidth: 2, borderColor: '#293832', backgroundColor: '#66785f' },
  gunboatBarrel: { position: 'absolute', right: -19, top: 3, width: 23, height: 4, borderRadius: 2, backgroundColor: '#283735' },
  disembarkingUnit: { position: 'absolute', zIndex: 10, left: '50%', top: 68, width: 20, height: 27 },
  marchSoldier: { left: 0, top: 0 },
  reflection: {
    position: 'absolute',
    bottom: -31,
    width: 63,
    height: 34,
    alignItems: 'center',
    overflow: 'hidden',
    opacity: 0.34,
    transform: [{ scaleY: -1 }, { scaleX: 0.92 }, { rotate: '2deg' }],
  },
  reflectionNebula: {
    position: 'absolute',
    left: 2,
    right: 1,
    top: 7,
    height: 21,
    borderRadius: 13,
    backgroundColor: 'rgba(181,76,214,0.66)',
    transform: [{ scaleX: 1.14 }],
  },
  reflectionHull: {
    position: 'absolute',
    top: 5,
    width: 56,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#91b3ba',
    borderWidth: 2,
    borderColor: '#5ed9ff',
  },
  reflectionHullOrange: {
    backgroundColor: '#bb795e',
    borderColor: '#efb08f',
  },
  reflectionCabin: {
    position: 'absolute',
    top: 17,
    width: 25,
    height: 16,
    borderRadius: 5,
    backgroundColor: '#8aa69c',
  },
  reflectionRamp: {
    position: 'absolute',
    top: 7,
    width: 34,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(193,236,239,0.72)',
  },
  reflectionStar: {
    position: 'absolute',
    zIndex: 3,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#fff',
    shadowColor: '#d9faff',
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  reflectionStarOne: { left: 10, top: 13 },
  reflectionStarTwo: { right: 12, top: 22, width: 2, height: 2 },
  reflectionRipple: {
    position: 'absolute',
    zIndex: 4,
    left: 4,
    right: 3,
    top: 15,
    height: 3,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(229,248,255,0.58)',
    transform: [{ skewX: '-18deg' }],
  },
  boatHull: {
    width: 56,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0c4a6e',
    backgroundColor: '#aeb6a5',
    shadowColor: '#002d43',
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  orangeHull: { backgroundColor: '#a9683f', borderColor: '#56301f' },
  boatCabin: {
    position: 'absolute',
    bottom: 17,
    width: 26,
    height: 22,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#35463c',
    backgroundColor: '#718368',
  },
  boatWake: { position: 'absolute', bottom: -4, width: 66, height: 12, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(238,251,255,0.88)' },
  boatRamp: { position: 'absolute', bottom: 4, width: 34, height: 9, borderRadius: 4, borderWidth: 2, borderColor: '#394b4e', backgroundColor: '#879698' },
  boatFlag: { position: 'absolute', top: 0, right: 4, color: '#ef4444', fontSize: 21 },
  soldier: { position: 'absolute', width: 17, height: 25, zIndex: 5, alignItems: 'center' },
  helmet: { zIndex: 3, width: 13, height: 7, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#52623a', borderWidth: 1, borderColor: '#26331f' },
  soldierHead: { width: 8, height: 7, borderRadius: 4, marginTop: -2, backgroundColor: '#d99a6c' },
  soldierBody: { width: 12, height: 10, borderRadius: 3, backgroundColor: '#697d4a', borderWidth: 1, borderColor: '#2e3b27' },
  rifle: { position: 'absolute', right: -2, top: 10, width: 3, height: 14, borderRadius: 2, backgroundColor: '#3b2b20', transform: [{ rotate: '-22deg' }] },
  boots: { width: 11, height: 3, backgroundColor: '#302c24', borderRadius: 2 },
  soldierOne: { left: 8, top: 29 },
  soldierTwo: { right: 8, top: 29, transform: [{ scaleX: -1 }] },
  soldierThree: { left: 8, top: 55 },
  soldierFour: { right: 8, top: 55, transform: [{ scaleX: -1 }] },
  editor: {
    position: 'absolute',
    right: 5,
    bottom: 84,
    height: 38,
    minWidth: 92,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f4d99a',
    backgroundColor: 'rgba(64,78,48,0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    elevation: 8,
  },
  editorIcon: { color: '#f7d87c', fontSize: 18, marginRight: 5 },
  editorLabel: { color: '#fff', fontSize: 8, fontWeight: '900', letterSpacing: 0.35 },
  compass: {
    width: 49,
    height: 49,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#67e8f9',
    backgroundColor: '#073352',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  north: { position: 'absolute', top: 1, color: '#a5f3fc', fontSize: 7, fontWeight: '900', zIndex: 3 },
  radarRing: { position: 'absolute', width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(103,232,249,0.55)' },
  radarCrossHorizontal: { position: 'absolute', width: 39, height: 1, backgroundColor: 'rgba(103,232,249,0.35)' },
  radarCrossVertical: { position: 'absolute', width: 1, height: 39, backgroundColor: 'rgba(103,232,249,0.35)' },
  radarSweep: { position: 'absolute', width: 3, height: 20, borderRadius: 2, backgroundColor: '#5eead4', transform: [{ translateY: -9 }, { rotate: '38deg' }] },
  radarBlip: { position: 'absolute', right: 9, top: 14, width: 4, height: 4, borderRadius: 2, backgroundColor: '#fef08a' },
  hub: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#67e8f9',
    backgroundColor: '#e6ffff',
  },
});
