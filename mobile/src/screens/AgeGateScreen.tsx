import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setAgeVerified } from '../storage/ageGate';
import { APP_NAME } from '../constants/config';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AgeGate'>;

export default function AgeGateScreen({ navigation }: Props) {
  const confirm = async () => {
    await setAgeVerified();
    navigation.replace('Home');
  };

  const deny = () => {
    Alert.alert(
      'Zugang verweigert',
      'CanaBoom ist nur für Personen ab 18 Jahren zugänglich.',
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={styles.root}>
      <Text style={styles.badge}>18+ · STRIKT</Text>
      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.warning}>
        Dieses Spiel enthält explizite Darstellungen von Cannabis-Pflanzen, Hanf, Weed, Gras und
        Grow-Inhalten. Keine Verniedlichung — realistisches 18+-Setting.
      </Text>
      <Text style={styles.question}>Bist du mindestens 18 Jahre alt?</Text>
      <Pressable style={styles.yes} onPress={confirm}>
        <Text style={styles.yesText}>Ja, ich bin 18+ — Spiel betreten</Text>
      </Pressable>
      <Pressable style={styles.no} onPress={deny}>
        <Text style={styles.noText}>Nein — App verlassen</Text>
      </Pressable>
      <Text style={styles.legal}>
        Mit „Ja“ bestätigst du dein Alter. Transaktions- und KI-Daten werden nur für volljährige
        Nutzer verarbeitet. Siehe Impressum & Datenschutz.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050810',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  badge: {
    color: '#ef4444',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: { color: '#f0f4ff', fontSize: 34, fontWeight: '800' },
  warning: {
    color: '#fca5a5',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 22,
    fontSize: 14,
    maxWidth: 360,
  },
  question: { color: '#e2e8f0', fontSize: 18, fontWeight: '700', marginTop: 28 },
  yes: {
    marginTop: 24,
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  yesText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  no: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#475569',
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  noText: { color: '#94a3b8', fontWeight: '600' },
  legal: { color: '#64748b', fontSize: 11, textAlign: 'center', marginTop: 24, maxWidth: 320 },
});
