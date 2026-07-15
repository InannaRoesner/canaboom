import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export default function LieutenantDialog({ visible, onDismiss }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.lieutenant} pointerEvents="none">
        <View style={styles.salutingArm}>
          <View style={styles.hand} />
        </View>
        <View style={styles.cap}>
          <View style={styles.capBadge}><Text style={styles.star}>★</Text></View>
          <View style={styles.capPeak} />
        </View>
        <View style={styles.head}>
          <View style={styles.hair} />
          <View style={styles.eyes}><View style={styles.eye} /><View style={styles.eye} /></View>
          <View style={styles.mouth} />
        </View>
        <View style={styles.neck} />
        <View style={styles.body}>
          <View style={styles.collarLeft} /><View style={styles.collarRight} />
          <View style={styles.rank}><Text style={styles.rankText}>II</Text></View>
          <View style={styles.belt} />
        </View>
        <Text style={styles.name}>LEUTNANT</Text>
      </View>

      <View style={styles.bubble}>
        <View style={styles.pointer} />
        <Text style={styles.dialogText}>
          Dies wird als deine Basis dienen, Kommandant. Es scheint außerdem, als beginne unser Einsatz
          früher als erwartet.
        </Text>
        <Pressable accessibilityRole="button" onPress={onDismiss} style={styles.dismiss}>
          <Text style={styles.dismissText}>VERSTANDEN</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 145,
    zIndex: 80,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  lieutenant: { width: 104, height: 154, alignItems: 'center', justifyContent: 'flex-end' },
  salutingArm: {
    position: 'absolute',
    zIndex: 7,
    right: 2,
    top: 52,
    width: 18,
    height: 59,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#253321',
    backgroundColor: '#59743f',
    transform: [{ rotate: '-34deg' }],
  },
  hand: { position: 'absolute', top: -10, left: -1, width: 20, height: 15, borderRadius: 8, backgroundColor: '#e5a879', borderWidth: 2, borderColor: '#6e432d' },
  cap: { position: 'absolute', zIndex: 6, top: 12, width: 70, height: 31, borderRadius: 19, borderWidth: 3, borderColor: '#26331f', backgroundColor: '#667d42' },
  capBadge: { position: 'absolute', left: 27, top: 3, width: 17, height: 17, borderRadius: 9, backgroundColor: '#e8c553', alignItems: 'center', justifyContent: 'center' },
  star: { color: '#334323', fontSize: 10, fontWeight: '900' },
  capPeak: { position: 'absolute', right: -10, bottom: -5, width: 45, height: 11, borderRadius: 8, backgroundColor: '#314027', transform: [{ rotate: '5deg' }] },
  head: { position: 'absolute', zIndex: 5, top: 31, width: 58, height: 66, borderRadius: 25, borderWidth: 3, borderColor: '#70452f', backgroundColor: '#e9ad7d', overflow: 'hidden' },
  hair: { height: 14, backgroundColor: '#67402b' },
  eyes: { marginTop: 15, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10 },
  eye: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#283022' },
  mouth: { alignSelf: 'center', marginTop: 12, width: 19, height: 7, borderBottomWidth: 2, borderBottomColor: '#713c31', borderRadius: 9 },
  neck: { position: 'absolute', zIndex: 2, top: 86, width: 25, height: 20, backgroundColor: '#d8986d' },
  body: { width: 86, height: 66, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 3, borderColor: '#26331f', backgroundColor: '#536d38', overflow: 'hidden' },
  collarLeft: { position: 'absolute', left: 18, top: 0, width: 25, height: 20, backgroundColor: '#799557', transform: [{ rotate: '24deg' }] },
  collarRight: { position: 'absolute', right: 18, top: 0, width: 25, height: 20, backgroundColor: '#799557', transform: [{ rotate: '-24deg' }] },
  rank: { position: 'absolute', right: 12, top: 26, width: 22, height: 12, borderWidth: 1, borderColor: '#513d14', backgroundColor: '#e2bd4c', alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#324224', fontSize: 7, fontWeight: '900' },
  belt: { position: 'absolute', left: 0, right: 0, bottom: 8, height: 8, backgroundColor: '#2e3324' },
  name: { position: 'absolute', bottom: -2, color: '#fff', fontSize: 8, fontWeight: '900', textShadowColor: '#172012', textShadowRadius: 3 },
  bubble: {
    flex: 1,
    marginLeft: 7,
    marginBottom: 13,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#3e4b4e',
    backgroundColor: '#fff',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 10,
  },
  pointer: { position: 'absolute', left: -14, bottom: 24, width: 24, height: 24, backgroundColor: '#fff', borderLeftWidth: 3, borderBottomWidth: 3, borderColor: '#3e4b4e', transform: [{ rotate: '45deg' }] },
  dialogText: { color: '#27343a', fontSize: 12, lineHeight: 17, fontWeight: '700' },
  dismiss: { alignSelf: 'flex-end', marginTop: 8, borderRadius: 8, borderWidth: 2, borderColor: '#244626', backgroundColor: '#5b963b', paddingHorizontal: 11, paddingVertical: 6 },
  dismissText: { color: '#fff', fontSize: 9, fontWeight: '900' },
});
