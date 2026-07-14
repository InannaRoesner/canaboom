import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { APP_NAME, LEGAL } from '../constants/config';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.badge}>18+ · CANNABIS · 3D MOBILE</Text>
      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.lead}>
        Boom-Beach-Mechanik im Sonnensystem. Echtes Cannabis, Hanf & Weed — kein Kinder-Setting.
        Grow-HQ, einzigartige Cannabis-Gebäude, WhatsApp-Style Orbit-Raketen, KI-Alien-Crew.
      </Text>
      <Pressable style={styles.cta} onPress={() => navigation.navigate('Game')}>
        <Text style={styles.ctaText}>🎮 3D-Spiel starten</Text>
      </Pressable>
      <Pressable style={styles.cta2} onPress={() => navigation.navigate('Shop')}>
        <Text style={styles.cta2Text}>💎 Truhen-Shop (optional)</Text>
      </Pressable>
      <View style={styles.links}>
        <Pressable onPress={() => navigation.navigate('Legal', { page: 'impressum' })}>
          <Text style={styles.link}>Impressum</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Legal', { page: 'datenschutz' })}>
          <Text style={styles.link}>Datenschutz / DSGVO</Text>
        </Pressable>
      </View>
      <Text style={styles.footer}>© {LEGAL.founder} · {LEGAL.brand}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0f1a' },
  content: { padding: 24, alignItems: 'center' },
  badge: { color: '#c4b5fd', fontSize: 11, fontWeight: '700', marginTop: 40 },
  title: { color: '#f0f4ff', fontSize: 36, fontWeight: '800', marginTop: 12 },
  lead: { color: '#8b9dc3', textAlign: 'center', marginTop: 12, lineHeight: 22, maxWidth: 340 },
  cta: {
    marginTop: 28,
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  cta2: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  cta2Text: { color: '#8b9dc3', fontWeight: '600' },
  links: { flexDirection: 'row', gap: 20, marginTop: 32 },
  link: { color: '#64748b', fontSize: 13 },
  footer: { color: '#475569', fontSize: 11, marginTop: 40 },
});
