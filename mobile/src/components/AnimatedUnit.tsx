import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View, type ViewProps } from 'react-native';
import { getUnitSprite, resolveUnitSpriteId, type UnitSpriteId } from '../sprites/SpriteRegistry';

type Motion = 'idle' | 'walk' | 'attack';

type Props = ViewProps & {
  motionState?: Motion;
  delay?: number;
  unitSpriteId?: UnitSpriteId | string;
  children?: React.ReactNode;
};

export default function AnimatedUnit({
  motionState = 'idle',
  delay = 0,
  unitSpriteId,
  children,
  style,
  ...rest
}: Props) {
  const bob = useRef(new Animated.Value(0)).current;
  const tilt = useRef(new Animated.Value(0)).current;
  const resolvedId = unitSpriteId ? resolveUnitSpriteId(unitSpriteId) : null;
  const sprite = resolvedId ? getUnitSprite(resolvedId) : null;

  useEffect(() => {
    const duration = motionState === 'attack' ? 280 : motionState === 'walk' ? 420 : 900;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(bob, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(tilt, { toValue: 1, duration, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(bob, { toValue: 0, duration, useNativeDriver: true }),
          Animated.timing(tilt, { toValue: 0, duration, useNativeDriver: true }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob, delay, motionState, tilt]);

  const translateY = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, motionState === 'attack' ? -6 : -3],
  });
  const rotate = tilt.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', motionState === 'attack' ? '-8deg' : '4deg'],
  });

  return (
    <Animated.View style={[styles.unit, style, { transform: [{ translateY }, { rotate }] }]} {...rest}>
      {sprite ? (
        <View style={styles.spriteWrap}>
          <View style={styles.spriteShadow} />
          <Image source={sprite} style={styles.sprite} resizeMode="contain" />
        </View>
      ) : (
        children ?? <Text style={styles.fallback}>🪖</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  unit: { marginHorizontal: 1 },
  spriteWrap: { width: 22, height: 28, alignItems: 'center', justifyContent: 'flex-end' },
  spriteShadow: {
    position: 'absolute',
    bottom: 0,
    width: 14,
    height: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sprite: { width: 22, height: 28 },
  fallback: { fontSize: 18 },
});
