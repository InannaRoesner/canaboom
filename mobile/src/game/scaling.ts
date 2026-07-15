import {
  CENSOR_MASTER,
  HQ_MAIN,
  getHqUnlocksAtLevel,
  type ResourceId,
} from '../config/censorMaster';
import { COMBAT_BALANCE } from '../config/gameMasterSettings';

function normalizedLevel(level: number): number {
  return Math.max(1, Math.floor(level));
}

/** Canonical hourly production curve from game_master_settings. */
export function productionRate(base: number, level: number): number {
  return Math.max(0, base) * Math.pow(1.25, normalizedLevel(level) - 1);
}

/** Canonical resource-storage curve from game_master_settings. */
export function storageCapacity(base: number, level: number): number {
  return Math.max(0, base) * Math.pow(2, normalizedLevel(level) - 1);
}

/** Applies one Arsenal upgrade step to a current combat stat. */
export function upgradeCombatStat(currentStat: number, hasArsenal: boolean): number {
  if (!hasArsenal) {
    throw new Error(COMBAT_BALANCE.upgrade_logic.requirement);
  }
  return currentStat * 1.3;
}

/** Shared 25% progression curve from the Strategie-Insel master document. */
export function valueAtLevel(base: number, level: number): number {
  const cappedLevel = Math.min(
    Math.max(1, Math.floor(level)),
    CENSOR_MASTER.game_rules.level_cap
  );
  return base * Math.pow(CENSOR_MASTER.game_rules.scaling_factor, cappedLevel - 1);
}

export function scaledInteger(base: number, level: number): number {
  return Math.round(valueAtLevel(base, level));
}

/** Landing-craft capacity grows by 10% for every level after level one. */
export function getLandingCraftCapacity(base: number, level: number): number {
  const normalizedLevel = Math.max(1, Math.floor(level));
  return Math.floor(Math.max(0, base) * Math.pow(1.1, normalizedLevel - 1));
}

export type HqStatsAtLevel = {
  level: number;
  hp: number;
  damage_per_sec: number;
  build_time_min: number;
  unlocks: string[];
  is_shootable: boolean;
};

function clampHqLevel(level: number): number {
  return Math.min(
    Math.max(1, Math.floor(level)),
    CENSOR_MASTER.game_rules.level_cap
  );
}

function scaleToNextMilestone(
  base: number,
  levelsAfterMilestone: number,
  multiplier: number,
  nextValue?: number
): number {
  const scaled = base * Math.pow(multiplier, levelsAfterMilestone);
  return Math.round(nextValue === undefined ? scaled : Math.min(scaled, nextValue));
}

/**
 * Resolves sparse HQ milestones. Exact milestone values always win; intervening
 * levels grow from the previous milestone using the HQ-specific multipliers.
 */
export function getHqStatsAtLevel(level: number): HqStatsAtLevel {
  const cappedLevel = clampHqLevel(level);
  const milestones = HQ_MAIN.level_stats;
  const lower =
    [...milestones].reverse().find((milestone) => milestone.level <= cappedLevel) ??
    milestones[0];
  const upper = milestones.find((milestone) => milestone.level > cappedLevel);
  const levelsAfterMilestone = cappedLevel - lower.level;
  const interval = upper ? upper.level - lower.level : 0;
  const progress = upper && interval > 0 ? levelsAfterMilestone / interval : 0;

  return {
    level: cappedLevel,
    hp: scaleToNextMilestone(
      lower.hp,
      levelsAfterMilestone,
      HQ_MAIN.scaling_rules.hp_multiplier,
      upper?.hp
    ),
    damage_per_sec: scaleToNextMilestone(
      lower.damage_per_sec,
      levelsAfterMilestone,
      HQ_MAIN.scaling_rules.damage_multiplier,
      upper?.damage_per_sec
    ),
    build_time_min: upper
      ? Math.round(
          lower.build_time_min +
            (upper.build_time_min - lower.build_time_min) * progress
        )
      : lower.build_time_min,
    unlocks: getHqUnlocksAtLevel(cappedLevel),
    is_shootable: HQ_MAIN.is_shootable,
  };
}

/** Applies the HQ cost curve to a level-one resource cost. */
export function getHqUpgradeCostAtLevel(
  baseCost: Partial<Record<ResourceId, number>>,
  level: number
): Partial<Record<ResourceId, number>> {
  const cappedLevel = clampHqLevel(level);
  return Object.fromEntries(
    Object.entries(baseCost).map(([resource, amount]) => [
      resource,
      Math.round((amount ?? 0) * Math.pow(
        HQ_MAIN.scaling_rules.cost_multiplier,
        cappedLevel - 1
      )),
    ])
  ) as Partial<Record<ResourceId, number>>;
}
