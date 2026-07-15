export type GalaxyEnvironment =
  | 'ocean'
  | 'red_planet_surface'
  | 'space_debris'
  | 'alien_landscape';

export type GalaxySectorConfig = {
  name: string;
  environment: GalaxyEnvironment;
};

export type GalaxyWorldMapConfig = {
  system_logic: 'progression_based';
  cloud_layer: {
    unlock_cost_currency: 'gold';
    unlock_cost_scaling: '1.5';
    effect: 'reveal_new_sectors';
  };
  exploration_path: readonly GalaxySectorConfig[];
  island_generation: {
    total_islands_per_sector: 1000;
    difficulty_scaling: 'distance_from_base';
    rewards_scaling: 'danger_level';
  };
};

/** Canonical JSON-compatible galaxy progression configuration. */
export const GALAXY_WORLD_MAP = {
  system_logic: 'progression_based',
  cloud_layer: {
    unlock_cost_currency: 'gold',
    unlock_cost_scaling: '1.5',
    effect: 'reveal_new_sectors',
  },
  exploration_path: [
    { name: 'Heimatbasis-Archipel', environment: 'ocean' },
    { name: 'Mars-Front', environment: 'red_planet_surface' },
    { name: 'Asteroiden-Gürtel', environment: 'space_debris' },
    { name: 'Outer-Rim-Planeten', environment: 'alien_landscape' },
  ],
  island_generation: {
    total_islands_per_sector: 1000,
    difficulty_scaling: 'distance_from_base',
    rewards_scaling: 'danger_level',
  },
} as const satisfies GalaxyWorldMapConfig;

export const GALAXY_SECTOR_IDS = [
  'home_archipelago',
  'mars_front',
  'asteroid_belt',
  'outer_rim',
] as const;

export type GalaxySectorId = (typeof GALAXY_SECTOR_IDS)[number];

export const GALAXY_BASE_UNLOCK_COST = 200;

export function getSectorUnlockCost(sectorIndex: number): number {
  const scaling = Number(GALAXY_WORLD_MAP.cloud_layer.unlock_cost_scaling);
  return Math.round(GALAXY_BASE_UNLOCK_COST * Math.pow(scaling, sectorIndex));
}
