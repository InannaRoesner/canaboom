import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BoomBeachBottomBar from '../components/BoomBeachBottomBar';
import HomeBaseScreen from './HomeBaseScreen';
import WorldMapScreen from './WorldMapScreen';
import type { MainTab, RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

export default function MainScreen({ navigation }: Props) {
  const [tab, setTab] = useState<MainTab>('home');
  const [buildOpen, setBuildOpen] = useState(false);

  return (
    <View style={styles.root}>
      {tab === 'home' ? (
        <HomeBaseScreen
          buildMenuOpen={buildOpen}
          onCloseBuildMenu={() => setBuildOpen(false)}
        />
      ) : (
        <WorldMapScreen navigation={navigation} />
      )}

      <BoomBeachBottomBar
        mapActive={tab === 'map'}
        onBuild={() => {
          setTab('home');
          setBuildOpen(true);
        }}
        onMap={() => setTab(tab === 'map' ? 'home' : 'map')}
        onChest={() => Alert.alert('Truhe', 'Schatztruhe — bald mit Diamanten-Boni!')}
        onTroops={() => Alert.alert('Truppen', 'Truppenzelt: Cyber-Infanteristen bereit zum Angriff!')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1a6fa8' },
});
