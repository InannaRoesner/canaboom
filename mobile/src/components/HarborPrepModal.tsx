import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { getLandingCraftCapacity } from '../game/scaling';
import {
  UNITS,
  UNIT_CYBER_INFANTERIST,
  getUnlockedUnits,
  getUnitLoadCount,
  getUnitTrainingCost,
  type UnitId,
} from '../config/units';

type Props = {
  visible: boolean;
  initialBoatCount: number;
  initialBoatLevel: number;
  tentRobotCount: number;
  alreadyLoadedCount: number;
  hqLevel: number;
  onCancel: () => void;
  onContinue: (boatCount: number, boatLevel: number, unitId: UnitId, unitCount: number) => void;
};

export default function HarborPrepModal({
  visible,
  initialBoatCount,
  initialBoatLevel,
  tentRobotCount,
  alreadyLoadedCount,
  hqLevel,
  onCancel,
  onContinue,
}: Props) {
  const [boatCount, setBoatCount] = useState(initialBoatCount);
  const [boatLevel, setBoatLevel] = useState(initialBoatLevel);
  const availableUnits = useMemo(() => getUnlockedUnits(hqLevel), [hqLevel]);
  const [selectedUnitId, setSelectedUnitId] = useState<UnitId>(UNIT_CYBER_INFANTERIST.unit_id);
  const selectedUnit = UNITS[selectedUnitId];
  const capacityPerBoat = useMemo(() => getLandingCraftCapacity(5, boatLevel), [boatLevel]);
  const availableRobots = tentRobotCount + alreadyLoadedCount;
  const loadCount = Math.min(
    availableRobots,
    getUnitLoadCount(boatCount * capacityPerBoat, selectedUnit),
  );
  const loadCost = getUnitTrainingCost(selectedUnit, loadCount);

  useEffect(() => {
    if (!availableUnits.some((unit) => unit.unit_id === selectedUnitId)) {
      setSelectedUnitId(UNIT_CYBER_INFANTERIST.unit_id);
    }
  }, [availableUnits, selectedUnitId]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>HAFEN · ANGRIFFSVORBEREITUNG</Text>
          <Text style={styles.title}>Landungsboote beladen</Text>
          <Text style={styles.description}>
            Wähle deine Flotte. Die Boote werden aus dem Truppenzelt beladen.
          </Text>

          <View style={styles.unitCard}>
            <View style={styles.robotPlaceholder}><Text style={styles.robotEmoji}>🤖</Text></View>
            <View style={styles.unitCopy}>
              <Text style={styles.unitName}>{selectedUnit.name}</Text>
              <Text style={styles.unitNote}>{selectedUnit.tactical_note}</Text>
              <Text style={styles.unitStats}>
                {selectedUnit.stats.hp} HP · {selectedUnit.stats.damage_per_shot} Schaden · HQ {selectedUnit.unlock.slice(3)}
              </Text>
            </View>
          </View>
          <View style={styles.unitChoices}>
            {availableUnits.map((unit) => (
              <Pressable
                key={unit.unit_id}
                style={[
                  styles.unitChoice,
                  selectedUnitId === unit.unit_id && styles.unitChoiceActive,
                ]}
                onPress={() => setSelectedUnitId(unit.unit_id as UnitId)}
              >
                <Text style={styles.unitChoiceText}>{unit.name}</Text>
              </Pressable>
            ))}
          </View>

          <Stepper
            label="Landungsboote"
            value={boatCount}
            suffix="Boote"
            onMinus={() => setBoatCount((value) => Math.max(1, value - 1))}
            onPlus={() => setBoatCount((value) => Math.min(4, value + 1))}
          />
          <Stepper
            label="Boot-Level"
            value={boatLevel}
            suffix={`Kapazität ${capacityPerBoat}`}
            onMinus={() => setBoatLevel((value) => Math.max(1, value - 1))}
            onPlus={() => setBoatLevel((value) => Math.min(20, value + 1))}
          />

          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Einsatzstärke</Text>
            <Text style={styles.summaryValue}>🤖 {loadCount} {selectedUnit.name}</Text>
            <Text style={styles.summaryHint}>
              Zelt: {availableRobots}/10 · Boot: {capacityPerBoat} Plätze · Beladen: {loadCost} Gold
            </Text>
          </View>
          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={onCancel}>
              <Text style={styles.cancelText}>Abbrechen</Text>
            </Pressable>
            <Pressable
              disabled={loadCount === 0}
              style={[styles.continue, loadCount === 0 && styles.disabled]}
              onPress={() => onContinue(boatCount, boatLevel, selectedUnitId, loadCount)}
            >
              <Text style={styles.continueText}>FÜR {loadCost} GOLD BELADEN</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Stepper({
  label,
  value,
  suffix,
  onMinus,
  onPlus,
}: {
  label: string;
  value: number;
  suffix: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowHint}>{suffix}</Text>
      </View>
      <View style={styles.stepper}>
        <Pressable style={styles.stepButton} onPress={onMinus}><Text style={styles.stepText}>−</Text></Pressable>
        <Text style={styles.value}>{value}</Text>
        <Pressable style={styles.stepButton} onPress={onPlus}><Text style={styles.stepText}>+</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', padding: 22, backgroundColor: 'rgba(2,6,23,0.78)' },
  card: { borderRadius: 22, borderWidth: 2, borderColor: '#67e8f9', padding: 20, backgroundColor: '#0f2340' },
  eyebrow: { color: '#67e8f9', fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  title: { marginTop: 5, color: '#fff', fontSize: 23, fontWeight: '900' },
  description: { marginTop: 8, marginBottom: 14, color: '#cbd5e1', fontSize: 13, lineHeight: 18 },
  unitCard: { flexDirection: 'row', gap: 10, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#38bdf8', backgroundColor: '#102c49' },
  robotPlaceholder: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#334155' },
  robotEmoji: { fontSize: 30 },
  unitCopy: { flex: 1 },
  unitName: { color: '#fff', fontSize: 15, fontWeight: '900' },
  unitNote: { marginTop: 2, color: '#cbd5e1', fontSize: 9, lineHeight: 12 },
  unitStats: { marginTop: 4, color: '#67e8f9', fontSize: 9, fontWeight: '800' },
  unitChoices: { marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  unitChoice: { borderRadius: 9, borderWidth: 1, borderColor: '#475569', paddingHorizontal: 9, paddingVertical: 6, backgroundColor: '#172f4d' },
  unitChoiceActive: { borderColor: '#67e8f9', backgroundColor: '#155e75' },
  unitChoiceText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  row: { minHeight: 64, marginTop: 8, padding: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#172f4d' },
  rowLabel: { color: '#fff', fontSize: 14, fontWeight: '800' },
  rowHint: { color: '#93c5fd', fontSize: 10, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563eb' },
  stepText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  value: { minWidth: 24, color: '#fff', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  summary: { marginTop: 14, padding: 12, borderRadius: 12, backgroundColor: '#422006', borderWidth: 1, borderColor: '#f59e0b' },
  summaryLabel: { color: '#fcd34d', fontSize: 10, fontWeight: '800' },
  summaryValue: { color: '#fff', fontSize: 18, fontWeight: '900' },
  summaryHint: { marginTop: 3, color: '#fde68a', fontSize: 9, fontWeight: '700' },
  actions: { marginTop: 16, flexDirection: 'row', gap: 10 },
  cancel: { flex: 1, padding: 13, borderRadius: 12, alignItems: 'center', backgroundColor: '#334155' },
  cancelText: { color: '#e2e8f0', fontWeight: '800' },
  continue: { flex: 1.5, padding: 13, borderRadius: 12, alignItems: 'center', backgroundColor: '#16a34a' },
  continueText: { color: '#fff', fontWeight: '900' },
  disabled: { opacity: 0.45 },
});
