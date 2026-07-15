import { COMBAT_BALANCE } from './gameMasterSettings';

export type ArsenalUpgrade = {
  level: number;
  unitStatsMultiplier: number;
  damageBonusVsDefense: number;
  goldCost: number;
};

export const ARSENAL_UPGRADES: readonly ArsenalUpgrade[] = [
  { level: 0, unitStatsMultiplier: 1, damageBonusVsDefense: 1, goldCost: 0 },
  { level: 1, unitStatsMultiplier: 1.3, damageBonusVsDefense: 1.3, goldCost: 250 },
  { level: 2, unitStatsMultiplier: 1.3 ** 2, damageBonusVsDefense: 1.3 ** 2, goldCost: 500 },
  { level: 3, unitStatsMultiplier: 1.3 ** 3, damageBonusVsDefense: 1.3 ** 3, goldCost: 900 },
  { level: 4, unitStatsMultiplier: 1.3 ** 4, damageBonusVsDefense: 1.3 ** 4, goldCost: 1500 },
];

export const ARSENAL_REQUIREMENT_MESSAGE =
  COMBAT_BALANCE.upgrade_logic.requirement;

export function getArsenalUpgrade(level: number): ArsenalUpgrade {
  const normalized = Math.max(0, Math.min(ARSENAL_UPGRADES.length - 1, Math.floor(level)));
  return ARSENAL_UPGRADES[normalized];
}

export function getNextArsenalUpgrade(level: number): ArsenalUpgrade | undefined {
  return ARSENAL_UPGRADES.find((upgrade) => upgrade.level === Math.floor(level) + 1);
}
