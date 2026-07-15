import type { BuildingSpriteId } from '../sprites/SpriteRegistry';

export type ShopCategory = 'ressourcen' | 'abwehr' | 'unterstuetzung' | 'dekorationen';

export type BuildingSpec = {
  key: string;
  spriteId: BuildingSpriteId;
  name: string;
  category: ShopCategory;
  size: 1 | 2 | 3 | 4;
  cost: { gold: number; wood: number; stone?: number };
  requiredHqLevel: number;
  production?: { gold?: number; wood?: number; stone?: number };
  type: 'hq' | 'defense' | 'storage' | 'production' | 'military' | 'decoration' | 'support';
  icon: string;
  color: string;
  description: string;
};

export const BUILDING_CATALOG: BuildingSpec[] = [
  {
    key: 'gold_mine',
    spriteId: 'gold_mine',
    name: 'Goldmine',
    category: 'ressourcen',
    size: 3,
    cost: { gold: 0, wood: 0 },
    requiredHqLevel: 1,
    production: { gold: 120 },
    type: 'production',
    icon: '⛏',
    color: '#d4a017',
    description: 'Erzeugt Gold für Upgrades und Kartenfreischaltungen.',
  },
  {
    key: 'sawmill',
    spriteId: 'sawmill',
    name: 'Sägewerk',
    category: 'ressourcen',
    size: 3,
    cost: { gold: 500, wood: 0 },
    requiredHqLevel: 2,
    production: { wood: 80 },
    type: 'production',
    icon: '🪵',
    color: '#a16207',
    description: 'Erzeugt Holz zur Erweiterung deiner Basis.',
  },
  {
    key: 'stone_quarry',
    spriteId: 'stone_quarry',
    name: 'Steinbruch',
    category: 'ressourcen',
    size: 3,
    cost: { gold: 1500, wood: 800 },
    requiredHqLevel: 4,
    production: { stone: 40 },
    type: 'production',
    icon: '🪨',
    color: '#78716c',
    description: 'Gewinnt Stein für schwere Verteidigungen.',
  },
  {
    key: 'rocket_launcher',
    spriteId: 'rocket_launcher',
    name: 'Raketenwerfer',
    category: 'abwehr',
    size: 2,
    cost: { gold: 5000, wood: 2000, stone: 500 },
    requiredHqLevel: 5,
    type: 'defense',
    icon: '🚀',
    color: '#475569',
    description: 'Beschützt deine Basis vor Angriffen.',
  },
  {
    key: 'bunker',
    spriteId: 'bunker',
    name: 'Bunker',
    category: 'abwehr',
    size: 3,
    cost: { gold: 3000, wood: 1500, stone: 800 },
    requiredHqLevel: 3,
    type: 'defense',
    icon: '🛡',
    color: '#57534e',
    description: 'Schwere Panzerung für kritische Bereiche.',
  },
  {
    key: 'troop_tent',
    spriteId: 'troop_tent',
    name: 'Truppenzelt',
    category: 'unterstuetzung',
    size: 4,
    cost: { gold: 0, wood: 0 },
    requiredHqLevel: 1,
    type: 'military',
    icon: '⛺',
    color: '#b45309',
    description: 'Trainiert Truppen für Angriffe.',
  },
  {
    key: 'radar',
    spriteId: 'radar',
    name: 'Radar',
    category: 'unterstuetzung',
    size: 2,
    cost: { gold: 2500, wood: 1200 },
    requiredHqLevel: 4,
    type: 'support',
    icon: '📡',
    color: '#0369a1',
    description: 'Enthüllt versteckte Inseln auf der Karte.',
  },
  {
    key: 'pier',
    spriteId: 'pier',
    name: 'Galaxie-Pier',
    category: 'dekorationen',
    size: 2,
    cost: { gold: 800, wood: 400 },
    requiredHqLevel: 1,
    type: 'decoration',
    icon: '⚓',
    color: '#854d0e',
    description: 'Landungssteg für deine Kanonenboote.',
  },
];

export const SHOP_TABS: { key: ShopCategory; label: string }[] = [
  { key: 'ressourcen', label: 'Ressourcen' },
  { key: 'abwehr', label: 'Abwehr' },
  { key: 'unterstuetzung', label: 'Unterstützung' },
  { key: 'dekorationen', label: 'Dekorationen' },
];

export function getBuildingSpec(key: string): BuildingSpec | undefined {
  return BUILDING_CATALOG.find((b) => b.key === key);
}
