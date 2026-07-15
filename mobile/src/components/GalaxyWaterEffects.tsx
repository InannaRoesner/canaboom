import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type Props = { compact?: boolean };

export default function GalaxyWaterEffects({ compact = false }: Props) {
  const wave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wave, { toValue: 1, duration: 2400, useNativeDriver: true }),
        Animated.timing(wave, { toValue: 0, duration: 2400, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [wave]);

  const translateY = wave.interpolate({ inputRange: [0, 1], outputRange: [0, compact ? 4 : 8] });

  return (
    <View style={styles.root}>
      <View style={styles.sky} />
      <Animated.View style={[styles.ocean, { transform: [{ translateY }] }]}>
        <View style={styles.oceanDeep} />
        <View style={styles.oceanGlow} />
        <View style={styles.foam} />
      </Animated.View>
      <View style={styles.island}>
        <View style={styles.sand} />
        <View style={styles.grass} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: '#09052d' },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#1e1048',
  },
  ocean: { ...StyleSheet.absoluteFillObject },
  oceanDeep: { flex: 1, backgroundColor: '#2a1060' },
  oceanGlow: {
    position: 'absolute',
    bottom: '20%',
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(168,85,247,0.25)',
  },
  foam: {
    position: 'absolute',
    bottom: '38%',
    left: '15%',
    right: '15%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(221,214,254,0.45)',
  },
  island: {
    position: 'absolute',
    alignSelf: 'center',
    top: '28%',
    width: '55%',
    height: '42%',
    alignItems: 'center',
  },
  sand: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '35%',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    backgroundColor: '#c8a86a',
  },
  grass: {
    width: '85%',
    height: '70%',
    borderRadius: 999,
    backgroundColor: '#5a8f3c',
    borderWidth: 3,
    borderColor: '#3f6b28',
  },
});
