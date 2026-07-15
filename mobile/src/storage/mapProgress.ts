import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GALAXY_SECTOR_IDS,
  type GalaxySectorId,
} from '../config/galaxyWorldMap';
import type { MapResources } from '../map/MapManager';

const MAP_PROGRESS_KEY = '@canaboom/map-progress/v1';
const RADAR_STATUS_KEY = '@canaboom/radar-built/v1';

export type MapProgress = {
  unlockedPlanetIds: string[];
  unlockedSectorIds: GalaxySectorId[];
  resources: MapResources;
};

export const DEFAULT_MAP_PROGRESS: MapProgress = {
  unlockedPlanetIds: ['earth'],
  unlockedSectorIds: ['home_archipelago'],
  resources: {
    blueten: 1840,
    duenger: 420,
    fuel: 180,
  },
};

export async function loadMapProgress(): Promise<MapProgress> {
  try {
    const stored = await AsyncStorage.getItem(MAP_PROGRESS_KEY);
    if (!stored) return DEFAULT_MAP_PROGRESS;
    const parsed = JSON.parse(stored) as Partial<MapProgress>;
    const validSectorIds = new Set<string>(GALAXY_SECTOR_IDS);
    return {
      unlockedPlanetIds: Array.from(new Set(['earth', ...(parsed.unlockedPlanetIds ?? [])])),
      unlockedSectorIds: Array.from(new Set([
        'home_archipelago' as GalaxySectorId,
        ...(parsed.unlockedSectorIds ?? []).filter((id) => validSectorIds.has(id)),
      ])),
      resources: {
        ...DEFAULT_MAP_PROGRESS.resources,
        ...parsed.resources,
      },
    };
  } catch {
    return DEFAULT_MAP_PROGRESS;
  }
}

export async function saveMapProgress(progress: MapProgress): Promise<void> {
  await AsyncStorage.setItem(MAP_PROGRESS_KEY, JSON.stringify(progress));
}

export async function setRadarBuilt(built = true): Promise<void> {
  await AsyncStorage.setItem(RADAR_STATUS_KEY, built ? 'true' : 'false');
}

export async function isRadarBuilt(): Promise<boolean> {
  return (await AsyncStorage.getItem(RADAR_STATUS_KEY)) === 'true';
}
