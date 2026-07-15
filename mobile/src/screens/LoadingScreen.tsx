import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHomeAudio } from '../audio/useGameAudio';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

export default function LoadingScreen({ navigation }: Props) {
  const lift = React.useRef(new Animated.Value(0)).current;
  const { playLaunch } = useHomeAudio();

  useEffect(() => {
    playLaunch();
    Animated.timing(lift, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => navigation.replace('Main'), 400);
    });
  }, [lift, navigation, playLaunch]);

  const translateY = lift.interpolate({ inputRange: [0, 1], outputRange: [80, -120] });

  return (
    <View style={styles.root}>
      <Text style={styles.logo}>CANABOOM</Text>
      <Text style={styles.sub}>Galaxie-Strategie · Boom Beach Stil</Text>
      <Animated.View style={[styles.rocketWrap, { transform: [{ translateY }] }]}>
        <Text style={styles.rocket}>🚀</Text>
        <View style={styles.flame} />
      </Animated.View>
      <Text style={styles.hint}>Starte deine Basis …</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#09052d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { color: '#c4b5fd', fontSize: 28, fontWeight: '900', letterSpacing: 4 },
  sub: { color: '#94a3b8', fontSize: 10, marginTop: 6, fontWeight: '700' },
  rocketWrap: { marginTop: 40, alignItems: 'center' },
  rocket: { fontSize: 64 },
  flame: {
    width: 12,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#f97316',
    marginTop: -8,
  },
  hint: { position: 'absolute', bottom: 40, color: '#64748b', fontSize: 11, fontWeight: '700' },
});
