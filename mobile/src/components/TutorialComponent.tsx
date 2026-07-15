import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { BUD_GUIDE_IMAGE, MARY_GUIDE_IMAGE } from '../assets/images';
import { useTutorialAudio } from '../audio/useGameAudio';

const STEPS = [
  {
    name: 'Bud',
    image: BUD_GUIDE_IMAGE,
    accent: '#84cc16',
    text: 'Yo, Captain! Willkommen bei CanaBoom! Wir sind Bud und Mary, deine intergalaktischen Botanik-Berater. Wir haben gehört, hier gibt es das beste Space-Pot im ganzen Quadranten – aber die Konkurrenz will es uns nicht überlassen!',
  },
  {
    name: 'Mary',
    image: MARY_GUIDE_IMAGE,
    accent: '#ec4899',
    text: 'Lass den Joint mal kurz beiseite, Bud. Wir haben Arbeit! Captain, deine Mission ist klar: Baue deine Heimatbasis auf der Erde aus, starte die Rakete und erobere das Sonnensystem!',
  },
] as const;

type Props = {
  onComplete: () => void | Promise<void>;
};

export default function TutorialComponent({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const { playBlip } = useTutorialAudio();
  const current = STEPS[step];

  const advance = () => {
    playBlip();
    if (step < STEPS.length - 1) {
      setStep((value) => value + 1);
    } else {
      void onComplete();
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={[styles.dialog, { borderColor: current.accent }]}>
        <View style={styles.portraitFrame}>
          <Image source={current.image} style={styles.portrait} resizeMode="cover" />
        </View>
        <View style={styles.content}>
          <Text style={[styles.name, { color: current.accent }]}>{current.name}</Text>
          <Text style={styles.text}>{current.text}</Text>
          <View style={styles.footer}>
            <Text style={styles.progress}>{step + 1} / {STEPS.length}</Text>
            <Pressable style={[styles.next, { backgroundColor: current.accent }]} onPress={advance}>
              <Text style={styles.nextText}>{step === STEPS.length - 1 ? 'Los geht’s!' : 'Weiter'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: 'rgba(2,6,23,0.72)',
    justifyContent: 'flex-end',
    padding: 14,
    paddingBottom: 104,
  },
  dialog: {
    flexDirection: 'row',
    maxWidth: 620,
    alignSelf: 'center',
    backgroundColor: '#111827',
    borderRadius: 20,
    borderWidth: 3,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 20,
  },
  portraitFrame: {
    width: 100,
    height: 132,
    overflow: 'hidden',
    borderRadius: 15,
    backgroundColor: '#020617',
  },
  portrait: { width: '100%', height: '100%' },
  content: { flex: 1, marginLeft: 12 },
  name: { fontWeight: '900', fontSize: 19 },
  text: { color: '#f8fafc', fontSize: 13, lineHeight: 18, marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 },
  progress: { color: '#64748b', fontSize: 11, fontWeight: '700' },
  next: { paddingVertical: 9, paddingHorizontal: 20, borderRadius: 11 },
  nextText: { color: '#071013', fontWeight: '900' },
});
