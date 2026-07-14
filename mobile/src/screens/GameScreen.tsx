import React, { useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GameCanvas from '../components/GameCanvas';
import MobileHUD from '../components/MobileHUD';
import DialogPanel from '../components/DialogPanel';
import TouchControls from '../components/TouchControls';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function GameScreen({ navigation }: Props) {
  const [lines, setLines] = useState<{ speaker: string; line: string }[]>([]);
  const [attackSignal, setAttackSignal] = useState(0);
  const [buildSignal, setBuildSignal] = useState(0);
  const [matchSignal, setMatchSignal] = useState(0);

  const onDialog = useCallback((speaker: string, line: string) => {
    setLines((prev) => [{ speaker, line }, ...prev].slice(0, 8));
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <MobileHUD />
      <View style={styles.canvas}>
        <GameCanvas
          onDialog={onDialog}
          attackSignal={attackSignal}
          buildSignal={buildSignal}
          matchSignal={matchSignal}
        />
      </View>
      <DialogPanel lines={lines} />
      <TouchControls
        onAttack={() => setAttackSignal((n) => n + 1)}
        onBuild={() => setBuildSignal((n) => n + 1)}
        onMatch={() => setMatchSignal((n) => n + 1)}
        onShop={() => navigation.navigate('Shop')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050810' },
  canvas: { flex: 1 },
});
