import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onAttack: () => void;
  onBuild: () => void;
  onMatch: () => void;
  onShop: () => void;
  onBack?: () => void;
};

export default function TouchControls({ onAttack, onBuild, onMatch, onShop, onBack }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 8 }]}>
      <Pressable style={[styles.btn, styles.fire]} onPress={onAttack}>
        <Text style={styles.btnText}>🔥 Angriff</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={onBuild}>
        <Text style={styles.btnText}>🏗️ Bauen</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={onMatch}>
        <Text style={styles.btnText}>⚖️ Fair Match</Text>
      </Pressable>
      <Pressable style={[styles.btn, styles.shop]} onPress={onShop}>
        <Text style={styles.btnText}>💎 Shop</Text>
      </Pressable>
      {onBack ? (
        <Pressable style={styles.btn} onPress={onBack}>
          <Text style={styles.btnText}>🗺️ Karte</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: 'rgba(10,15,26,0.92)',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#475569',
    minWidth: 100,
    alignItems: 'center',
  },
  fire: { backgroundColor: '#7c2d12', borderColor: '#ea580c' },
  shop: { backgroundColor: '#422006', borderColor: '#fbbf24' },
  btnText: { color: '#f8fafc', fontWeight: '700', fontSize: 13 },
});
