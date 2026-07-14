import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

type Line = { speaker: string; line: string };

type Props = {
  lines: Line[];
};

export default function DialogPanel({ lines }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>👽 Alien-Crew · KI</Text>
      <ScrollView style={styles.scroll} nestedScrollEnabled>
        {lines.map((l, i) => (
          <View key={`${l.speaker}-${i}`} style={styles.line}>
            <Text style={styles.speaker}>{l.speaker}</Text>
            <Text style={styles.text}>{l.line}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 110,
    backgroundColor: '#141c2e',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingHorizontal: 10,
    paddingTop: 6,
  },
  title: { color: '#c4b5fd', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  scroll: { flex: 1 },
  line: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#7c3aed',
  },
  speaker: { color: '#a78bfa', fontWeight: '700', fontSize: 11 },
  text: { color: '#e2e8f0', fontSize: 12, marginTop: 2 },
});
