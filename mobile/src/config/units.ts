import {
  COMBAT_BALANCE,
  type CombatTierId,
  type CombatTierUnlock,
} from './gameMasterSettings';

export type UnitCategory = 'infantry';

export type UnitDefinition = {
  unit_id: string;
  tier: CombatTierId;
  unlock: CombatTierUnlock;
  name: string;
  category: UnitCategory;
  stats: {
    hp: number;
    damage_per_shot: number;
    fire_rate: number;
    movement_speed: number;
    training_cost_gold: number;
    housing_space: number;
  };
  tactical_note: string;
  asset_path: string;
};

const TIERS = COMBAT_BALANCE.tier_system;

export const UNIT_CYBER_INFANTERIST = {
  unit_id: 'robot_01',
  tier: 'tier_1',
  unlock: TIERS.tier_1.unlock,
  name: TIERS.tier_1.name,
  category: 'infantry',
  stats: {
    hp: TIERS.tier_1.hp,
    damage_per_shot: TIERS.tier_1.dmg,
    fire_rate: 0.8,
    movement_speed: 4.5,
    training_cost_gold: 50,
    housing_space: 1,
  },
  tactical_note:
    'Günstige Einheit, ideal für den Einsatz in großen Gruppen. Hohe Feuergeschwindigkeit, aber geringe Panzerung.',
  asset_path: 'assets/images/units/cyber_infanterist.png',
} as const satisfies UnitDefinition;

export const UNIT_PHASEN_GRENADIER = {
  unit_id: 'cyber_02',
  tier: 'tier_2',
  unlock: TIERS.tier_2.unlock,
  name: TIERS.tier_2.name,
  category: 'infantry',
  stats: {
    hp: TIERS.tier_2.hp,
    damage_per_shot: TIERS.tier_2.dmg,
    fire_rate: 0.8,
    movement_speed: 4.5,
    training_cost_gold: 50,
    housing_space: 1,
  },
  tactical_note: 'Elite-Einheit mit Phasenrüstung und hoher Explosivkraft.',
  asset_path: 'assets/images/units/phasen_grenadier.png',
} as const satisfies UnitDefinition;

export const UNIT_VANGUARD_SCHWERROBOTER = {
  unit_id: 'titan_03',
  tier: 'tier_3',
  unlock: TIERS.tier_3.unlock,
  name: TIERS.tier_3.name,
  category: 'infantry',
  stats: {
    hp: TIERS.tier_3.hp,
    damage_per_shot: TIERS.tier_3.dmg,
    fire_rate: 0.8,
    movement_speed: 4.5,
    training_cost_gold: 50,
    housing_space: 1,
  },
  tactical_note: 'Schwerroboter für Angriffe auf besonders widerstandsfähige Ziele.',
  asset_path: 'assets/images/units/vanguard_schwerroboter.png',
} as const satisfies UnitDefinition;

export const UNITS = {
  // Legacy IDs remain stable for saved attack preparations and raid payloads.
  robot_01: UNIT_CYBER_INFANTERIST,
  cyber_02: UNIT_PHASEN_GRENADIER,
  titan_03: UNIT_VANGUARD_SCHWERROBOTER,
} as const;

export type UnitId = keyof typeof UNITS;

/** @deprecated Use UNIT_CYBER_INFANTERIST. Kept for persisted robot_01 data. */
export const UNIT_ROBOT_01 = UNIT_CYBER_INFANTERIST;
/** @deprecated Use UNIT_PHASEN_GRENADIER. */
export const UNIT_CYBER_02 = UNIT_PHASEN_GRENADIER;
/** @deprecated Use UNIT_VANGUARD_SCHWERROBOTER. */
export const UNIT_TITAN_03 = UNIT_VANGUARD_SCHWERROBOTER;

export function getUnitUnlockLevel(unit: UnitDefinition): number {
  return Math.max(1, Number(unit.unlock.slice('hq_'.length)) || 1);
}

export function getUnlockedUnits(hqLevel: number): UnitDefinition[] {
  const normalizedHqLevel = Math.max(1, Math.floor(hqLevel));
  return Object.values(UNITS).filter(
    (unit) => getUnitUnlockLevel(unit) <= normalizedHqLevel
  );
}

export function getUnitById(unitId: string): UnitDefinition {
  return UNITS[unitId as UnitId] ?? UNIT_CYBER_INFANTERIST;
}

export function getUnitDps(unit: UnitDefinition): number {
  return unit.stats.damage_per_shot * unit.stats.fire_rate;
}

export function getUnitLoadCount(slotCapacity: number, unit: UnitDefinition): number {
  return Math.floor(Math.max(0, slotCapacity) / unit.stats.housing_space);
}

export function getUnitTrainingCost(unit: UnitDefinition, count: number): number {
  return unit.stats.training_cost_gold * Math.max(0, Math.floor(count));
}
