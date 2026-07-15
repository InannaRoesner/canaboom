import { BUILDING_CATALOG } from './buildings';

export type ResourceId = 'gold' | 'wood' | 'stone' | 'diamonds';
export type BuildingId = string;
export type BuildingCategory = 'prod' | 'def' | 'mili' | 'sup' | 'deco';
export type BuildingSize = 1 | 2 | 3 | 4;

export type MasterBuilding = {
  id: BuildingId;
  name: string;
  category: BuildingCategory;
  size: BuildingSize;
  req: string;
  baseCost: Partial<Record<ResourceId, number>>;
  description: string;
  icon: string;
  color: string;
  playable: boolean;
  passivePerHour?: number;
  capacityBoost?: number;
};

const CATEGORY_MAP = {
  production: 'prod',
  defense: 'def',
  military: 'mili',
  support: 'sup',
  decoration: 'deco',
  storage: 'prod',
  hq: 'sup',
} as const;

export const HQ_MAIN = {
  id: 'hq_main',
  name: 'Hauptquartier',
  grid_size: [3, 3] as const,
  max_level: 20,
  is_shootable: true,
  tactical_description:
    'Das Herz deiner Galaxie-Basis. Upgrade für neue Gebäude, stärkere Verteidigung und mehr Lagerplatz.',
  scaling_rules: {
    hp_multiplier: 1.28,
    damage_multiplier: 1.18,
    cost_multiplier: 1.35,
  },
  level_stats: [
    { level: 1, hp: 1500, damage_per_sec: 12, build_time_min: 0 },
    { level: 5, hp: 4200, damage_per_sec: 28, build_time_min: 45 },
    { level: 10, hp: 9800, damage_per_sec: 52, build_time_min: 120 },
    { level: 12, hp: 14200, damage_per_sec: 68, build_time_min: 180 },
    { level: 20, hp: 32000, damage_per_sec: 120, build_time_min: 480 },
  ],
} as const;

export const CENSOR_MASTER = {
  game_rules: {
    level_cap: 20,
    max_grid: 8,
    hq_level_anchor: true,
    scaling_factor: 1.25,
  },
  ui_elements: {
    shop_action: 'open_shop_menu',
  },
  buildings_map: {
    Goldmiene: { type: 'prod', size: 3, req: 'hq_1', spriteId: 'gold_mine' },
    Raketenwerfer: { type: 'def', size: 2, req: 'hq_5', spriteId: 'rocket_launcher' },
    Bunker: { type: 'def', size: 3, req: 'hq_3', spriteId: 'bunker' },
    Truppenzelt: { type: 'mili', size: 4, req: 'hq_1', spriteId: 'troop_tent' },
    Radar: { type: 'sup', size: 2, req: 'hq_4', spriteId: 'radar' },
    Sägewerk: { type: 'prod', size: 3, req: 'hq_2', spriteId: 'sawmill' },
    Steinbruch: { type: 'prod', size: 3, req: 'hq_4', spriteId: 'stone_quarry' },
  },
} as const;

export const MASTER_BUILDINGS: MasterBuilding[] = [
  {
    id: 'hq',
    name: HQ_MAIN.name,
    category: 'sup',
    size: 3,
    req: 'hq_1',
    baseCost: {},
    description: HQ_MAIN.tactical_description,
    icon: '★',
    color: '#78716c',
    playable: false,
  },
  ...BUILDING_CATALOG.map((spec) => ({
    id: spec.key,
    name: spec.name,
    category: CATEGORY_MAP[spec.type] ?? 'deco',
    size: spec.size,
    req: `hq_${spec.requiredHqLevel}`,
    baseCost: spec.cost,
    description: spec.description,
    icon: spec.icon,
    color: spec.color,
    playable: true,
    passivePerHour: spec.production?.gold ?? spec.production?.wood ?? spec.production?.stone,
  })),
];

const HQ_UNLOCKS: Record<number, string[]> = {
  1: ['troop_tent', 'gold_mine'],
  2: ['sawmill'],
  3: ['bunker'],
  4: ['radar', 'stone_quarry'],
  5: ['rocket_launcher'],
};

export function parseHqRequirement(req: string): number {
  const match = /^hq_(\d+)$/i.exec(req.trim());
  return match ? Number.parseInt(match[1], 10) : 1;
}

export function getHqUnlockLevel(buildingName: string): number | null {
  const found = MASTER_BUILDINGS.find((b) => b.name === buildingName);
  return found ? parseHqRequirement(found.req) : null;
}

export function getHqUnlocksAtLevel(level: number): string[] {
  const unlocks = new Set<string>();
  Object.entries(HQ_UNLOCKS).forEach(([hqLevel, items]) => {
    if (level >= Number(hqLevel)) items.forEach((item) => unlocks.add(item));
  });
  return [...unlocks];
}
