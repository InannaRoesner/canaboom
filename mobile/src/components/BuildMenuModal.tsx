import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BUILDING_CATALOG, SHOP_TABS, type BuildingSpec } from '../config/buildings';
import { useBase } from '../context/BaseContext';
import { useResources } from '../context/ResourceContext';
import { getBuildingSprite } from '../sprites/SpriteRegistry';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (spec: BuildingSpec) => void;
};

export default function BuildMenuModal({ visible, onClose, onSelect }: Props) {
  const [tab, setTab] = useState(SHOP_TABS[0].key);
  const { hqLevel } = useBase();
  const { canAfford } = useResources();

  const items = useMemo(
    () => BUILDING_CATALOG.filter((b) => b.category === tab),
    [tab],
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <Text style={styles.title}>BAU-MENÜ</Text>
          <View style={styles.tabs}>
            {SHOP_TABS.map((t) => (
              <Pressable
                key={t.key}
                style={[styles.tab, tab === t.key && styles.tabActive]}
                onPress={() => setTab(t.key)}
              >
                <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {items.map((spec) => {
              const locked = hqLevel < spec.requiredHqLevel;
              const affordable = canAfford(spec.cost);
              const sprite = getBuildingSprite(spec.spriteId);
              return (
                <Pressable
                  key={spec.key}
                  style={[styles.card, locked && styles.cardLocked]}
                  disabled={locked}
                  onPress={() => {
                    onSelect(spec);
                    onClose();
                  }}
                >
                  <View style={styles.cardIcon}>
                    {sprite ? (
                      <Image source={sprite} style={styles.cardSprite} resizeMode="contain" />
                    ) : (
                      <Text style={styles.cardEmoji}>{spec.icon}</Text>
                    )}
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardName}>{spec.name}</Text>
                    <Text style={styles.cardDesc}>{spec.description}</Text>
                    <Text style={styles.cardCost}>
                      🪙 {spec.cost.gold} · 🪵 {spec.cost.wood}
                      {spec.cost.stone ? ` · 🪨 ${spec.cost.stone}` : ''}
                    </Text>
                    {locked ? (
                      <Text style={styles.locked}>HQ Lv {spec.requiredHqLevel} benötigt</Text>
                    ) : !affordable ? (
                      <Text style={styles.locked}>Nicht genug Ressourcen</Text>
                    ) : (
                      <Text style={styles.ready}>Tippen zum Platzieren</Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>SCHLIESSEN</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  panel: {
    maxHeight: '72%',
    backgroundColor: 'rgba(15,23,42,0.96)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 14,
  },
  title: { color: '#fef08a', fontSize: 16, fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tabActive: { backgroundColor: '#7c3aed' },
  tabText: { color: '#cbd5e1', fontSize: 10, fontWeight: '800' },
  tabTextActive: { color: '#fff' },
  list: { maxHeight: 320 },
  listContent: { gap: 8, paddingBottom: 8 },
  card: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardLocked: { opacity: 0.5 },
  cardIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 10,
  },
  cardSprite: { width: 52, height: 52 },
  cardEmoji: { fontSize: 28 },
  cardBody: { flex: 1 },
  cardName: { color: '#fff', fontSize: 13, fontWeight: '900' },
  cardDesc: { color: '#94a3b8', fontSize: 9, marginTop: 2 },
  cardCost: { color: '#fde68a', fontSize: 9, marginTop: 4, fontWeight: '800' },
  locked: { color: '#f87171', fontSize: 8, marginTop: 3, fontWeight: '800' },
  ready: { color: '#86efac', fontSize: 8, marginTop: 3, fontWeight: '800' },
  close: {
    marginTop: 8,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#475569',
  },
  closeText: { color: '#fff', fontWeight: '900', fontSize: 11 },
});
