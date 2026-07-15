import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onOpenShop: () => void;
  onMap: () => void;
  onBaseEditor?: () => void;
  disabled?: boolean;
};

export default function GameBottomBar({ onOpenShop, onMap, onBaseEditor, disabled = false }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 4) }]} pointerEvents="box-none">
      <View style={styles.harbor} pointerEvents="none">
        <View style={styles.harborRim} />
        <View style={styles.dockStem} />
        <View style={styles.docks}>
          <View style={[styles.berth, styles.berthLeft]}>
            <View style={styles.boat}>
              <View style={styles.boatGlass} />
              <Text style={styles.boatIcon}>▲</Text>
            </View>
          </View>
          <View style={styles.berth}>
            <View style={styles.gunboat}>
              <View style={styles.boatGlass} />
              <Text style={styles.boatIcon}>⚑</Text>
            </View>
          </View>
          <View style={[styles.berth, styles.berthRight]}>
            <View style={styles.boat}>
              <View style={styles.boatGlass} />
              <Text style={styles.boatIcon}>▲</Text>
            </View>
          </View>
        </View>
      </View>

      <Pressable
        disabled={disabled}
        style={({ pressed }) => [styles.action, styles.build, pressed && styles.pressed]}
        onPress={onOpenShop}
      >
        <View style={styles.buttonInset}>
          <Text style={styles.actionIcon}>⚒</Text>
        </View>
        <Text style={styles.actionLabel}>BAUEN</Text>
        <View style={styles.activeBadge}><Text style={styles.activeText}>AKTIV</Text></View>
      </Pressable>

      <Pressable
        disabled={disabled}
        style={({ pressed }) => [styles.action, styles.map, pressed && styles.pressed]}
        onPress={onMap}
      >
        <View style={styles.compassFace}>
          <Text style={styles.north}>N</Text>
          <View style={styles.radarRing} />
          <View style={styles.radarHorizontal} />
          <View style={styles.radarVertical} />
          <View style={styles.compassNeedle} />
          <View style={styles.radarBlip} />
          <View style={styles.compassHub} />
        </View>
        <Text style={styles.actionLabel}>KARTE</Text>
      </Pressable>
      <Pressable
        disabled={disabled}
        style={({ pressed }) => [styles.editor, pressed && styles.pressed]}
        onPress={onBaseEditor}
      >
        <Text style={styles.editorIcon}>▦</Text>
        <Text style={styles.editorLabel}>BASE EDITOR</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 132,
    zIndex: 25,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  action: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 12,
    zIndex: 5,
  },
  build: { backgroundColor: '#8a4c0f', borderColor: '#fde047', shadowColor: '#fde047', shadowOpacity: 0.75 },
  map: { backgroundColor: '#071d4f', borderColor: '#67e8f9', shadowColor: '#22d3ee', shadowOpacity: 0.75 },
  pressed: { transform: [{ scale: 0.94 }], opacity: 0.85 },
  buttonInset: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#e59218',
    borderWidth: 3,
    borderColor: '#a85c0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: { fontSize: 37, transform: [{ rotate: '-12deg' }] },
  actionLabel: { color: '#fff', fontSize: 9, fontWeight: '900', marginTop: -3, textShadowColor: '#000', textShadowRadius: 2 },
  activeBadge: { position: 'absolute', top: -9, borderRadius: 7, paddingHorizontal: 5, paddingVertical: 2, backgroundColor: '#22c55e', borderWidth: 1, borderColor: '#dcfce7' },
  activeText: { color: '#fff', fontSize: 6, fontWeight: '900', letterSpacing: 0.5 },
  harbor: {
    position: 'absolute',
    left: '21%',
    right: '21%',
    bottom: -7,
    height: 117,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: 'rgba(9,83,111,0.94)',
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: '#2cb9da',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 4,
  },
  harborRim: {
    position: 'absolute',
    top: 8,
    width: '90%',
    height: 73,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 5,
    borderBottomWidth: 0,
    borderColor: '#718596',
    backgroundColor: '#17445a',
  },
  dockStem: {
    position: 'absolute',
    bottom: 0,
    width: 34,
    height: 52,
    backgroundColor: '#647382',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#303e49',
  },
  docks: {
    position: 'absolute',
    top: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 3,
  },
  berth: {
    width: 53,
    height: 78,
    borderRadius: 17,
    backgroundColor: '#0a7895',
    borderWidth: 2,
    borderColor: '#5bd8e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  berthLeft: { transform: [{ rotate: '-6deg' }] },
  berthRight: { transform: [{ rotate: '6deg' }] },
  boat: {
    width: 38,
    height: 62,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#cbd5e1',
    borderWidth: 3,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 7,
  },
  boatGlass: {
    position: 'absolute',
    top: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#67e8f9',
    borderWidth: 2,
    borderColor: '#164e63',
  },
  gunboat: {
    width: 43,
    height: 68,
    borderRadius: 18,
    backgroundColor: '#68775d',
    borderWidth: 2,
    borderColor: '#344438',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boatIcon: { color: '#475569', fontSize: 16 },
  editor: { position: 'absolute', right: 0, bottom: 87, height: 34, borderRadius: 9, borderWidth: 2, borderColor: '#f0d48e', backgroundColor: '#485a37', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  editorIcon: { color: '#f4d471', fontSize: 16, marginRight: 4 },
  editorLabel: { color: '#fff', fontSize: 8, fontWeight: '900' },
  compassFace: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#073352',
    borderWidth: 3,
    borderColor: '#67e8f9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  north: { position: 'absolute', top: 2, color: '#a5f3fc', fontSize: 10, fontWeight: '900', zIndex: 3 },
  radarRing: { position: 'absolute', width: 39, height: 39, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(103,232,249,0.6)' },
  radarHorizontal: { position: 'absolute', width: 54, height: 1, backgroundColor: 'rgba(103,232,249,0.36)' },
  radarVertical: { position: 'absolute', width: 1, height: 54, backgroundColor: 'rgba(103,232,249,0.36)' },
  compassNeedle: {
    width: 13,
    height: 47,
    backgroundColor: '#5eead4',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    transform: [{ rotate: '35deg' }, { scaleX: 0.55 }],
  },
  radarBlip: { position: 'absolute', right: 12, top: 18, width: 5, height: 5, borderRadius: 3, backgroundColor: '#fef08a' },
  compassHub: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#e6ffff',
    borderWidth: 3,
    borderColor: '#67e8f9',
  },
});
