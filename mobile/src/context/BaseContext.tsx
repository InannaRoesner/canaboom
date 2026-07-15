import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BaseBuilding } from '../components/BuildingRenderer';
import { HQ_MAIN } from '../config/censorMaster';
import { getBuildingSpec } from '../config/buildings';

type BaseContextValue = {
  buildings: BaseBuilding[];
  hqLevel: number;
  placeBuilding: (specKey: string, row: number, col: number) => boolean;
  canPlaceAt: (size: number, row: number, col: number, ignoreId?: string) => boolean;
  productionTick: () => void;
};

const STORAGE_KEY = 'canaboom_base_v1';
const GRID = 6;

function defaultBase(): BaseBuilding[] {
  const hqSize = HQ_MAIN.grid_size[0] as BaseBuilding['size'];
  const tent = getBuildingSpec('troop_tent')!;
  const mine = getBuildingSpec('gold_mine')!;
  return [
    {
      id: 'hq-1',
      key: 'hq_main',
      spriteId: 'hq_main',
      type: 'hq',
      name: HQ_MAIN.name,
      icon: '★',
      color: '#78716c',
      row: 2,
      col: 2,
      level: 1,
      size: 2,
    },
    {
      id: 'radar-1',
      key: 'radar',
      spriteId: 'radar',
      type: 'support',
      name: 'Radar',
      icon: '📡',
      color: '#0369a1',
      row: 3,
      col: 4,
      level: 1,
      size: 2,
    },
    {
      id: 'tent-1',
      key: tent.key,
      spriteId: tent.spriteId,
      type: tent.type,
      name: tent.name,
      icon: tent.icon,
      color: tent.color,
      row: 4,
      col: 2,
      level: 1,
      size: 2,
    },
    {
      id: 'mine-1',
      key: mine.key,
      spriteId: mine.spriteId,
      type: mine.type,
      name: mine.name,
      icon: mine.icon,
      color: mine.color,
      row: 2,
      col: 3,
      level: 1,
      size: 2,
    },
  ];
}

const BaseContext = createContext<BaseContextValue | null>(null);

export function BaseProvider({ children }: { children: React.ReactNode }) {
  const [buildings, setBuildings] = useState<BaseBuilding[]>(defaultBase);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setBuildings(JSON.parse(raw) as BaseBuilding[]);
    });
  }, []);

  useEffect(() => {
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(buildings));
  }, [buildings]);

  const hqLevel = useMemo(
    () => buildings.find((b) => b.type === 'hq')?.level ?? 1,
    [buildings],
  );

  const canPlaceAt = useCallback(
    (size: number, row: number, col: number, ignoreId?: string) => {
      if (row < 0 || col < 0 || row + size > GRID || col + size > GRID) return false;
      for (const b of buildings) {
        if (b.id === ignoreId) continue;
        const bs = b.size ?? 1;
        const overlap =
          row < b.row + bs && row + size > b.row && col < b.col + bs && col + size > b.col;
        if (overlap) return false;
      }
      return true;
    },
    [buildings],
  );

  const placeBuilding = useCallback(
    (specKey: string, row: number, col: number) => {
      const spec = getBuildingSpec(specKey);
      if (!spec || hqLevel < spec.requiredHqLevel) return false;
      if (!canPlaceAt(spec.size, row, col)) return false;
      setBuildings((prev) => [
        ...prev,
        {
          id: `${specKey}-${Date.now()}`,
          key: spec.key,
          spriteId: spec.spriteId,
          type: spec.type,
          name: spec.name,
          icon: spec.icon,
          color: spec.color,
          row,
          col,
          level: 1,
          size: spec.size,
        },
      ]);
      return true;
    },
    [canPlaceAt, hqLevel],
  );

  const productionTick = useCallback(() => {
    // Production handled via ResourceContext in HomeBaseScreen interval
  }, []);

  const value = useMemo(
    () => ({ buildings, hqLevel, placeBuilding, canPlaceAt, productionTick }),
    [buildings, canPlaceAt, hqLevel, placeBuilding, productionTick],
  );

  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>;
}

export function useBase() {
  const ctx = useContext(BaseContext);
  if (!ctx) throw new Error('useBase outside provider');
  return ctx;
}

export { GRID as BASE_GRID_SIZE };
