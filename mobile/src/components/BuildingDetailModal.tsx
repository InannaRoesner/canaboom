import React, { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { BaseBuilding } from './IsometricBaseGrid';
import { CENSOR_MASTER, HQ_MAIN, MASTER_BUILDINGS } from '../config/censorMaster';
import { getHqStatsAtLevel, productionRate, storageCapacity, valueAtLevel } from '../game/scaling';

type Props = {
  building: BaseBuilding | null;
  onClose: () => void;
  onAction?: (building: BaseBuilding) => void;
};

export default function BuildingDetailModal({ building, onClose, onAction }: Props) {
  const detail = useMemo(() => {
    if (!building) return null;
    const level = building.level ?? 1;
    const master = MASTER_BUILDINGS.find((item) => item.name === building.name);
    const hq = building.type === 'hq' ? getHqStatsAtLevel(level) : null;
    const hp = hq?.hp ?? Math.round(valueAtLevel(building.type === 'defense' ? 1250 : 850, level));
    const secondary = master?.capacityBoost
      ? { label: 'Lagerkapazität', value: storageCapacity(master.capacityBoost, level).toLocaleString('de-DE') }
      : master?.passivePerHour
        ? { label: 'Produktion / Std.', value: productionRate(master.passivePerHour, level).toLocaleString('de-DE') }
        : building.type === 'defense'
          ? { label: 'Schaden / Sek.', value: Math.round(valueAtLevel(28, level)).toLocaleString('de-DE') }
          : { label: 'Rastergröße', value: `${building.size ?? 1} × ${building.size ?? 1}` };
    return {
      level,
      hp,
      secondary,
      description: building.type === 'hq' ? HQ_MAIN.tactical_description : master?.description ?? 'Ein wichtiges Gebäude deiner Inselbasis.',
      actionLabel: building.name === 'Radar' ? 'GALAXIE-KARTE' : building.name === 'Truppenzelt' ? 'TRUPPEN' : building.name === 'Arsenal' ? 'VERBESSERN' : undefined,
    };
  }, [building]);

  if (!building || !detail) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => undefined}>
          <View style={styles.titleBar}>
            <View>
              <Text style={styles.title}>{building.name.toUpperCase()}</Text>
              <Text style={styles.level}>LEVEL {detail.level} / {CENSOR_MASTER.game_rules.level_cap}</Text>
            </View>
            <Pressable style={styles.close} onPress={onClose}><Text style={styles.closeText}>✕</Text></Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.visualColumn}>
              <View style={styles.visualShadow} />
              <View style={[styles.visual, { backgroundColor: building.color }]}>
                <View style={styles.visualHighlight} />
                <Text style={styles.visualIcon}>{building.icon}</Text>
              </View>
              <View style={styles.levelBadge}><Text style={styles.levelBadgeText}>STUFE {detail.level}</Text></View>
            </View>
            <View style={styles.stats}>
              <Stat label="Trefferpunkte" value={`${detail.hp.toLocaleString('de-DE')} HP`} color="#e85e4b" />
              <Stat label={detail.secondary.label} value={detail.secondary.value} color="#67b9e8" />
            </View>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.description}>{detail.description}</Text>
          </View>
          {detail.actionLabel && (
            <Pressable style={styles.action} onPress={() => onAction?.(building)}>
              <Text style={styles.actionText}>{detail.actionLabel}</Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statIcon, { backgroundColor: color }]} />
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18, backgroundColor: 'rgba(3,8,15,0.7)' },
  card: { width: '100%', maxWidth: 430, borderRadius: 16, borderWidth: 5, borderColor: '#4e493f', backgroundColor: '#ded8c9', padding: 11, shadowColor: '#000', shadowOpacity: 0.75, shadowRadius: 16, elevation: 20 },
  titleBar: { minHeight: 53, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 9, borderWidth: 3, borderColor: '#5e594f', backgroundColor: '#f0ece2', paddingLeft: 14, paddingRight: 6 },
  title: { color: '#403b33', fontSize: 19, fontWeight: '900', letterSpacing: 0.5 },
  level: { color: '#776f62', fontSize: 9, fontWeight: '900', marginTop: 1 },
  close: { width: 40, height: 40, borderRadius: 8, borderWidth: 3, borderColor: '#7c211a', backgroundColor: '#d94a38', alignItems: 'center', justifyContent: 'center' },
  closeText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  content: { minHeight: 175, flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  visualColumn: { flex: 1.05, alignItems: 'center', justifyContent: 'center' },
  visualShadow: { position: 'absolute', bottom: 23, width: 115, height: 25, borderRadius: 40, backgroundColor: 'rgba(38,31,23,0.42)' },
  visual: { width: 112, height: 106, borderRadius: 18, borderWidth: 5, borderColor: '#474238', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-2deg' }], shadowColor: '#000', shadowOpacity: 0.6, shadowRadius: 7, elevation: 9 },
  visualHighlight: { position: 'absolute', left: 8, top: 7, bottom: 7, width: 15, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.24)' },
  visualIcon: { fontSize: 60, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 3, height: 4 }, textShadowRadius: 3 },
  levelBadge: { marginTop: -9, borderRadius: 7, borderWidth: 2, borderColor: '#6c5118', backgroundColor: '#f2c94c', paddingHorizontal: 12, paddingVertical: 4 },
  levelBadgeText: { color: '#4f3b12', fontSize: 9, fontWeight: '900' },
  stats: { flex: 1, gap: 9 },
  stat: { minHeight: 62, flexDirection: 'row', alignItems: 'center', borderRadius: 9, borderWidth: 3, borderColor: '#777166', backgroundColor: '#f3efe5', paddingHorizontal: 9 },
  statIcon: { width: 30, height: 30, borderRadius: 15, marginRight: 9, borderWidth: 3, borderColor: 'rgba(70,60,50,0.7)' },
  statLabel: { color: '#6a6359', fontSize: 9, fontWeight: '900' },
  statValue: { color: '#342f29', fontSize: 15, fontWeight: '900', marginTop: 2 },
  descriptionBox: { borderRadius: 9, borderWidth: 3, borderColor: '#817a6e', backgroundColor: '#f4f0e7', padding: 10 },
  description: { color: '#554f46', fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  action: { alignSelf: 'center', minWidth: 150, marginTop: 10, borderRadius: 8, borderWidth: 3, borderColor: '#3c6d30', backgroundColor: '#64ae4e', paddingHorizontal: 18, paddingVertical: 9, alignItems: 'center' },
  actionText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 0.7 },
});
