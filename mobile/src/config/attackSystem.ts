export type AttackSystemConfig = {
  travel_logic: {
    mode: 'realtime_ship_movement';
    visuals: 'ship_sailing_on_galaxy_water';
    energy_cost: 'gold_per_distance';
  };
  landing_craft_rules: {
    capacity_per_level: 'base * 1.1';
    level_one_capacity: 5;
    combat_support: 'gunboat_artillery_active';
  };
  raid_mechanics: {
    objective: 'destroy_enemy_hq';
    rewards: readonly ['resources', 'victory_points', 'galaxy_map_intel'];
  };
};

export const ATTACK_SYSTEM = {
  travel_logic: {
    mode: 'realtime_ship_movement',
    visuals: 'ship_sailing_on_galaxy_water',
    energy_cost: 'gold_per_distance',
  },
  landing_craft_rules: {
    capacity_per_level: 'base * 1.1',
    level_one_capacity: 5,
    combat_support: 'gunboat_artillery_active',
  },
  raid_mechanics: {
    objective: 'destroy_enemy_hq',
    rewards: ['resources', 'victory_points', 'galaxy_map_intel'],
  },
} as const satisfies AttackSystemConfig;

export const ATTACK_BASE_GOLD = 40;

export function getTravelGoldCost(distanceFactor: number, baseGold = ATTACK_BASE_GOLD): number {
  return Math.max(1, Math.round(Math.max(0, distanceFactor) * baseGold));
}

export default ATTACK_SYSTEM;
