import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { BuildingSpriteId } from '../sprites/SpriteRegistry';
import { getBuildingSprite, resolveBuildingSpriteId } from '../sprites/SpriteRegistry';

export type BaseBuilding = {
  id: string;
  key?: string;
  spriteId?: BuildingSpriteId | string;
  type: 'hq' | 'defense' | 'storage' | 'production' | 'military' | 'decoration' | 'support';
  name: string;
  icon: string;
  color: string;
  row: number;
  col: number;
  level: number;
  size?: 1 | 2 | 3 | 4;
};

export const MEADOW_COLS = 6;
export const MEADOW_ROWS = 6;
export const TILE_W = 52;
export const TILE_H = 26;

type Props = {
  building: BaseBuilding;
  ghost?: boolean;
  selected?: boolean;
};

export default function BuildingRenderer({ building, ghost = false, selected = false }: Props) {
  const size = building.size ?? 1;
  const spriteId = resolveBuildingSpriteId(building);
  const sprite = spriteId ? getBuildingSprite(spriteId) : null;
  const width = size * TILE_W + 8;
  const height = size * TILE_H + 64;

  return (
    <View
      style={[
        styles.wrap,
        { width, height, opacity: ghost ? 0.55 : 1 },
        selected && styles.selected,
      ]}
      pointerEvents="none"
    >
      <View style={[styles.shadow, { width: width * 0.72 }]} />
      {sprite ? (
        <Image source={sprite} style={[styles.sprite, { width: width + 12, height: height + 8 }]} resizeMode="contain" />
      ) : (
        <View style={[styles.fallback, { backgroundColor: building.color, width: width * 0.8, height: height * 0.55 }]}>
          <Text style={styles.fallbackIcon}>{building.icon}</Text>
        </View>
      )}
      {building.type === 'hq' && (
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv {building.level}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'flex-end' },
  shadow: {
    position: 'absolute',
    bottom: 2,
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sprite: { position: 'absolute', bottom: 0 },
  fallback: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  fallbackIcon: { fontSize: 22 },
  levelBadge: {
    position: 'absolute',
    top: 0,
    right: -4,
    backgroundColor: '#ca8a04',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#fef08a',
  },
  levelText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  selected: { transform: [{ scale: 1.04 }] },
});
