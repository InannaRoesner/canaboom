import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

type Props = {
  active?: boolean;
  colors?: string[];
};

/** Lila/grüne Diamant-Partikel bei Kampf-Angriffen (Platzhalter-Effekt) */
export default function DiamondBurst({ active = false, colors = ['#a855f7', '#22c55e', '#c084fc', '#4ade80'] }: Props) {
  const anims = useRef(colors.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!active) return;
    anims.forEach((a) => a.setValue(0));
    Animated.stagger(
      40,
      anims.map((a) =>
        Animated.timing(a, { toValue: 1, duration: 520, useNativeDriver: true }),
      ),
    ).start();
  }, [active, anims]);

  if (!active) return null;

  const positions = [
    { left: '45%', top: '40%' },
    { left: '52%', top: '35%' },
    { left: '38%', top: '48%' },
    { left: '58%', top: '44%' },
  ] as const;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {anims.map((anim, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.diamond,
            positions[i],
            {
              color: colors[i % colors.length],
              opacity: anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 0] }),
              transform: [
                {
                  translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -48 - i * 8] }),
                },
                { scale: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 1.2, 0.6] }) },
              ],
            },
          ]}
        >
          💎
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  diamond: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: '800',
  },
});
