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

Angaben gemäß § 5 TMG

${APP_NAME} ist ein kostenloses 3D-Mobile-Strategiespiel (iOS/Android) mit expliziten
Cannabis-/Hanf-/Weed-Inhalten. Strikte Altersfreigabe: ab 18 Jahren (Jugendschutz).

Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV): ${LEGAL.founder}, ${LEGAL.address}

Hinweis: Reines, kostenloses Unterhaltungsprodukt für Volljährige.
Eingebaute KI für Alien-Dialoge — nur für 18+-Nutzer. Siehe Datenschutz.
`;

const DATENSCHUTZ = `
Datenschutzerklärung (DSGVO) — ${APP_NAME}

Verantwortliche: ${LEGAL.founder}, ${LEGAL.address}
Kontakt: ${LEGAL.email}

0. Altersfreigabe 18+ (Jugendschutz)
${APP_NAME} enthält explizite Cannabis-/Hanf-Darstellungen. Zugang nur für volljährige Nutzer (18+).
Beim ersten Start ist eine aktive Altersbestätigung erforderlich. KI-Verarbeitungsdaten
werden ausschließlich für bestätigte Volljährige verarbeitet.
Minderjährige dürfen die App nicht nutzen.

1. Kostenloser Spielzugang (18+)
Technisch notwendige Daten: IP (gekürzt), Geräte-ID, Spielstand, Altersbestätigungs-Flag, Crash-Logs.
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.

2. Eingebaute KI (Alien-Crew, nur 18+)
Dynamische Dialoge via lokaler Engine oder LLM (Ollama/OpenAI).
Spielkontext (Kampf, Cannabis-Gebäude, Schaden) kann an KI-Dienst übermittelt werden.
Speicherdauer Logs: max. 30 Tage.

3. Fair Play Matchmaking
HQ-Level, Gebäude und Truppen bestimmen die Matchmaking-Stärke.

4. Ihre Rechte (DSGVO)
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
