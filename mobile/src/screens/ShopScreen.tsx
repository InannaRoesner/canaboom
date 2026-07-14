import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api, ShopPackage } from '../api/client';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Shop'>;

export default function ShopScreen({ navigation }: Props) {
  const [packages, setPackages] = useState<ShopPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.shopPackages()
      .then((d) => setPackages(d.packages))
      .catch(() => Alert.alert('Offline', 'Backend nicht erreichbar — Stripe-Shop später.'))
      .finally(() => setLoading(false));
  }, []);

  const buy = async (id: string) => {
    try {
      const { checkout_url } = await api.checkout(id);
      await WebBrowser.openBrowserAsync(checkout_url);
    } catch {
      Alert.alert('Fehler', 'Stripe Sandbox Checkout fehlgeschlagen.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#7c3aed" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>💎 Truhen-Shop</Text>
      <Text style={styles.sub}>100% kostenlos spielbar · Boom Beach Preisstufen 1,99–99,99 €</Text>
      <Text style={styles.fair}>⚖️ Fair Play: Käufe beeinflussen Matchmaking NICHT</Text>
      {packages.map((p) => (
        <Pressable key={p.id} style={styles.card} onPress={() => buy(p.id)}>
          <Text style={styles.name}>{p.name}</Text>
          <Text style={styles.cat}>{p.category}</Text>
          {p.rewards && <Text style={styles.loot}>{p.rewards.join(' · ')}</Text>}
          {p.amount != null && <Text style={styles.loot}>{p.amount} Credits</Text>}
          <Text style={styles.price}>{p.price_eur.toFixed(2)} €</Text>
        </Pressable>
      ))}
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Zurück zum Spiel</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0f1a' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0f1a' },
  title: { color: '#f0f4ff', fontSize: 22, fontWeight: '800' },
  sub: { color: '#8b9dc3', marginTop: 6, marginBottom: 4 },
  fair: { color: '#4ade80', fontSize: 12, marginBottom: 16 },
  card: {
    backgroundColor: '#141c2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  name: { color: '#f0f4ff', fontWeight: '700', fontSize: 16 },
  cat: { color: '#a78bfa', fontSize: 11, marginTop: 2 },
  loot: { color: '#8b9dc3', fontSize: 12, marginTop: 4 },
  price: { color: '#fbbf24', fontSize: 20, fontWeight: '800', marginTop: 8 },
  back: { color: '#8b9dc3', textAlign: 'center', marginTop: 20 },
});
