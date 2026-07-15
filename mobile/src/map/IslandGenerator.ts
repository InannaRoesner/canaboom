import {
  GALAXY_SECTOR_IDS,
  GALAXY_WORLD_MAP,
  type GalaxyEnvironment,
  type GalaxySectorId,
} from '../config/galaxyWorldMap';

export type IslandMetadata = {
  id: string;
  sectorId: GalaxySectorId;
  index: number;
  name: string;
  environment: GalaxyEnvironment;
  distanceFromBase: number;
  dangerLevel: number;
  difficulty: number;
  rewards: {
    gold: number;
    wood: number;
    stone: number;
  };
  mapPosition: {
    x: number;
    y: number;
  };
};

function hash(seed: string): number {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function seededUnit(seed: string): number {
  return hash(seed) / 0xffffffff;
}

export function getIsland(sectorId: GalaxySectorId, index: number): IslandMetadata {
  const sectorIndex = GALAXY_SECTOR_IDS.indexOf(sectorId);
  if (sectorIndex < 0) throw new Error(`Unbekannter Sektor: ${sectorId}`);
  if (!Number.isInteger(index) || index < 0 || index >= GALAXY_WORLD_MAP.island_generation.total_islands_per_sector) {
    throw new RangeError(`Inselindex muss zwischen 0 und 999 liegen: ${index}`);
  }

  const sector = GALAXY_WORLD_MAP.exploration_path[sectorIndex];
  const distanceFromBase = sectorIndex * 1000 + index + 1;
  const variance = seededUnit(`${sectorId}:${index}:danger`);
  const dangerLevel = Math.min(100, 1 + sectorIndex * 22 + Math.floor(index / 25) + Math.floor(variance * 12));
  const difficulty = Math.round((1 + distanceFromBase / 65) * (1 + dangerLevel / 100));
  const rewardScale = 1 + dangerLevel * 0.12;

  return {
    id: `${sectorId}_island_${index}`,
    sectorId,
    index,
    name: `${sector.name} · Insel ${index + 1}`,
    environment: sector.environment,
    distanceFromBase,
    dangerLevel,
    difficulty,
    rewards: {
      gold: Math.round((35 + difficulty * 8) * rewardScale),
      wood: Math.round((12 + difficulty * 3) * rewardScale),
      stone: Math.round((4 + difficulty) * rewardScale),
    },
    mapPosition: {
      x: 18 + seededUnit(`${sectorId}:${index}:x`) * 64,
      y: 22 + seededUnit(`${sectorId}:${index}:y`) * 58,
    },
  };
}

export function getIslandPage(
  sectorId: GalaxySectorId,
  offset = 0,
  limit = 20,
): IslandMetadata[] {
  const total = GALAXY_WORLD_MAP.island_generation.total_islands_per_sector;
  const start = Math.max(0, Math.min(total, Math.floor(offset)));
  const count = Math.max(0, Math.min(total - start, Math.floor(limit)));
  return Array.from({ length: count }, (_, pageIndex) => getIsland(sectorId, start + pageIndex));
}
