import React from 'react';
import { ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LEGAL, APP_NAME } from '../constants/config';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Legal'>;

const IMPRESSUM = `
Impressum — ${APP_NAME}

${LEGAL.founder}
${LEGAL.brand}
${LEGAL.address}
E-Mail: ${LEGAL.email}

Angaben gemäß § 5 DDG

${APP_NAME} ist ein kostenloses 3D-Mobile-Strategiespiel (iOS/Android) mit optionalen In-App-Käufen über Stripe.

Verantwortlich für den Inhalt: ${LEGAL.founder}

Hinweis: Reines Unterhaltungsprodukt. In-App-Käufe optional. Eingebaute KI für Alien-Dialoge — siehe Datenschutz.
`;

const DATENSCHUTZ = `
Datenschutzerklärung (DSGVO) — ${APP_NAME}

Verantwortliche: ${LEGAL.founder}, ${LEGAL.address}
Kontakt: ${LEGAL.email}

1. Kostenloser Spielzugang
Technisch notwendige Daten: IP (gekürzt), Geräte-ID, Spielstand, Crash-Logs.
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.

2. In-App-Käufe (Stripe)
Zahlungen über Stripe Payments Europe Ltd. Keine Speicherung von Kreditkartendaten durch uns.
Sandbox-Modus: keine echten Belastungen.

3. Eingebaute KI (Alien-Crew)
Dynamische Dialoge via lokaler Engine oder konfiguriertem LLM (Ollama/OpenAI).
Spielkontext (Trigger, Gebäude, Schaden) kann an KI-Dienst übermittelt werden — keine Zahlungsdaten.
Speicherdauer Logs: max. 30 Tage.

4. Fair Play Matchmaking
HQ-Level, Gebäude und Truppen zählen — IAP-Käufe beeinflussen Matchmaking NICHT.

5. Ihre Rechte
Auskunft, Löschung, Widerspruch: ${LEGAL.email}

Stand: Juli 2026 — Platzhalter, vor Veröffentlichung rechtlich prüfen.
`;

export default function LegalScreen({ route, navigation }: Props) {
  const text = route.params.page === 'impressum' ? IMPRESSUM : DATENSCHUTZ;
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.body}>{text.trim()}</Text>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Zurück</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0f1a' },
  content: { padding: 20 },
  body: { color: '#cbd5e1', fontSize: 14, lineHeight: 22 },
  back: { color: '#8b9dc3', marginTop: 24, textAlign: 'center' },
});
