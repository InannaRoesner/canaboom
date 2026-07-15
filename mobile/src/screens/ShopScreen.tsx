import React from 'react';
import { Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Shop'>;

export default function ShopScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>💎 Truhen-Shop</Text>
      <Text style={styles.sub}>Der Shop ist derzeit deaktiviert.</Text>
      <Text style={styles.fair}>Der Fokus liegt aktuell vollständig auf Gameplay, Karten und Gebäuden.</Text>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Zurück zum Spiel</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0f1a' },
  content: { padding: 16, paddingBottom: 40 },
  title: { color: '#f0f4ff', fontSize: 22, fontWeight: '800' },
  sub: { color: '#8b9dc3', marginTop: 6, marginBottom: 4 },
  fair: { color: '#4ade80', fontSize: 12, marginBottom: 16 },
  back: { color: '#8b9dc3', textAlign: 'center', marginTop: 20 },
});
