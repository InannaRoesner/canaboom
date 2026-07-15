import {
  GALAXY_SECTOR_IDS,
  GALAXY_WORLD_MAP,
  getSectorUnlockCost,
  type GalaxyEnvironment,
  type GalaxySectorId,
} from '../config/galaxyWorldMap';

export type MapResources = {
  blueten: number;
  duenger: number;
  fuel: number;
};

export type UnlockCost = {
  blueten?: number;
  duenger?: number;
  fuel?: number;
};

export type PlanetNode = {
  id: string;
  name: string;
  x: number;
  y: number;
  ring: number;
  sectorId: GalaxySectorId;
  unlockCost: UnlockCost;
  assetKey: string;
  unlocked: boolean;
  sectorCleared: boolean;
};

export type AsteroidField = {
  id: string;
  fromPlanetId: string;
  toPlanetId: string;
  x: number;
  y: number;
  angle: number;
  length: number;
  cleared: boolean;
  reachable: boolean;
  unlockCost: UnlockCost;
};

type PlanetDefinition = Omit<PlanetNode, 'unlocked' | 'sectorCleared'> & {
  routeFromId?: string;
};

export type GalaxySector = {
  id: GalaxySectorId;
  index: number;
  name: string;
  environment: GalaxyEnvironment;
  unlocked: boolean;
  unlockCost: number;
};

const RAW_PLANET_DEFINITIONS = [
  { id: 'earth', name: 'Erde', x: 900, y: 900, ring: 0, unlockCost: {}, assetKey: 'earth' },
  { id: 'luna', name: 'Luna', x: 900, y: 620, ring: 1, routeFromId: 'earth', unlockCost: { blueten: 180 }, assetKey: 'planet_01' },
  { id: 'mars', name: 'Mars', x: 1140, y: 760, ring: 1, routeFromId: 'earth', unlockCost: { blueten: 240, duenger: 40 }, assetKey: 'planet_02' },
  { id: 'venus', name: 'Venus', x: 1100, y: 1100, ring: 1, routeFromId: 'earth', unlockCost: { blueten: 300, duenger: 55 }, assetKey: 'planet_03' },
  { id: 'mercury', name: 'Merkur', x: 700, y: 1100, ring: 1, routeFromId: 'earth', unlockCost: { blueten: 360, fuel: 20 }, assetKey: 'planet_04' },
  { id: 'phobos', name: 'Phobos', x: 570, y: 760, ring: 1, routeFromId: 'earth', unlockCost: { blueten: 420, fuel: 25 }, assetKey: 'planet_05' },
  { id: 'europa', name: 'Europa', x: 900, y: 330, ring: 2, routeFromId: 'luna', unlockCost: { blueten: 520, duenger: 90, fuel: 35 }, assetKey: 'planet_06' },
  { id: 'io', name: 'Io', x: 1260, y: 440, ring: 2, routeFromId: 'mars', unlockCost: { blueten: 620, duenger: 105, fuel: 45 }, assetKey: 'planet_07' },
  { id: 'titan', name: 'Titan', x: 1460, y: 760, ring: 2, routeFromId: 'mars', unlockCost: { blueten: 720, duenger: 120, fuel: 55 }, assetKey: 'planet_08' },
  { id: 'ganymede', name: 'Ganymed', x: 1400, y: 1180, ring: 2, routeFromId: 'venus', unlockCost: { blueten: 820, duenger: 140, fuel: 65 }, assetKey: 'planet_09' },
  { id: 'enceladus', name: 'Enceladus', x: 1080, y: 1450, ring: 2, routeFromId: 'mercury', unlockCost: { blueten: 940, duenger: 160, fuel: 75 }, assetKey: 'planet_10' },
  { id: 'triton', name: 'Triton', x: 650, y: 1420, ring: 2, routeFromId: 'mercury', unlockCost: { blueten: 1060, duenger: 180, fuel: 85 }, assetKey: 'planet_11' },
  { id: 'ceres', name: 'Ceres', x: 350, y: 1120, ring: 2, routeFromId: 'phobos', unlockCost: { blueten: 1180, duenger: 200, fuel: 95 }, assetKey: 'planet_12' },
  { id: 'callisto', name: 'Callisto', x: 370, y: 600, ring: 2, routeFromId: 'phobos', unlockCost: { blueten: 1300, duenger: 220, fuel: 110 }, assetKey: 'planet_13' },
  { id: 'kepler', name: 'Kepler-22b', x: 600, y: 210, ring: 3, routeFromId: 'europa', unlockCost: { blueten: 1480, duenger: 250, fuel: 125 }, assetKey: 'planet_14' },
  { id: 'vulcan', name: 'Vulkan', x: 1230, y: 160, ring: 3, routeFromId: 'io', unlockCost: { blueten: 1660, duenger: 280, fuel: 145 }, assetKey: 'planet_15' },
  { id: 'neptune', name: 'Neptun', x: 1640, y: 470, ring: 3, routeFromId: 'titan', unlockCost: { blueten: 1850, duenger: 310, fuel: 165 }, assetKey: 'planet_16' },
  { id: 'saturn', name: 'Saturn', x: 1620, y: 1250, ring: 3, routeFromId: 'ganymede', unlockCost: { blueten: 2050, duenger: 350, fuel: 190 }, assetKey: 'planet_17' },
  { id: 'pluto', name: 'Pluto', x: 1300, y: 1650, ring: 3, routeFromId: 'enceladus', unlockCost: { blueten: 2300, duenger: 390, fuel: 215 }, assetKey: 'planet_18' },
  { id: 'eris', name: 'Eris', x: 490, y: 1640, ring: 3, routeFromId: 'triton', unlockCost: { blueten: 2550, duenger: 430, fuel: 240 }, assetKey: 'planet_19' },
  { id: 'nova', name: 'Nova Prime', x: 130, y: 900, ring: 3, routeFromId: 'ceres', unlockCost: { blueten: 2850, duenger: 480, fuel: 270 }, assetKey: 'planet_20' },
] satisfies Array<Omit<PlanetDefinition, 'sectorId'>>;

const PLANET_DEFINITIONS: PlanetDefinition[] = RAW_PLANET_DEFINITIONS.map((planet) => ({
  ...planet,
  sectorId: GALAXY_SECTOR_IDS[Math.min(planet.ring, GALAXY_SECTOR_IDS.length - 1)],
}));

const definitionById = new Map(PLANET_DEFINITIONS.map((planet) => [planet.id, planet]));

export class MapManager {
  planets: PlanetNode[];
  galaxySectors: GalaxySector[];
  private resources: MapResources;

  constructor(
    resources: MapResources,
    unlockedPlanetIds: string[] = ['earth'],
    unlockedSectorIds: GalaxySectorId[] = ['home_archipelago'],
  ) {
    const unlocked = new Set(['earth', ...unlockedPlanetIds]);
    const unlockedSectors = new Set<GalaxySectorId>(['home_archipelago', ...unlockedSectorIds]);
    this.resources = { ...resources };
    this.galaxySectors = GALAXY_WORLD_MAP.exploration_path.map((sector, index) => ({
      id: GALAXY_SECTOR_IDS[index],
      index,
      name: sector.name,
      environment: sector.environment,
      unlocked: unlockedSectors.has(GALAXY_SECTOR_IDS[index]),
      unlockCost: getSectorUnlockCost(index),
    }));
    this.planets = PLANET_DEFINITIONS.map(({ routeFromId: _routeFromId, ...planet }) => ({
      ...planet,
      unlocked: unlocked.has(planet.id),
      sectorCleared: unlocked.has(planet.id),
    }));
  }

  getPlanet(id: string): PlanetNode {
    const planet = this.planets.find((candidate) => candidate.id === id);
    if (!planet) {
      throw new Error(`Unbekannter Planet: ${id}`);
    }
    return planet;
  }

  getResources(): MapResources {
    return { ...this.resources };
  }

  setResources(resources: MapResources): void {
    this.resources = { ...resources };
  }

  getSector(id: GalaxySectorId): GalaxySector {
    const sector = this.galaxySectors.find((candidate) => candidate.id === id);
    if (!sector) throw new Error(`Unbekannter Galaxie-Sektor: ${id}`);
    return sector;
  }

  unlockSector(sectorId: GalaxySectorId): { success: boolean; reason?: string } {
    const sector = this.getSector(sectorId);
    if (sector.unlocked) return { success: false, reason: 'Sektor ist bereits aufgedeckt.' };
    const previousSector = this.galaxySectors[sector.index - 1];
    if (!previousSector?.unlocked) {
      return { success: false, reason: 'Decke zuerst den vorherigen Sektor auf.' };
    }
    sector.unlocked = true;
    return { success: true };
  }

  canUnlock(planetId: string): boolean {
    const planet = this.getPlanet(planetId);
    if (planet.unlocked || planet.id === 'earth') return false;

    const definition = definitionById.get(planetId);
    const parent = definition?.routeFromId ? this.getPlanet(definition.routeFromId) : undefined;
    if (!parent?.unlocked) return false;

    return (planet.unlockCost.blueten ?? 0) <= this.resources.blueten
      && (planet.unlockCost.duenger ?? 0) <= this.resources.duenger
      && (planet.unlockCost.fuel ?? 0) <= this.resources.fuel;
  }

  unlockPlanetRoute(planetId: string): { success: boolean; reason?: string } {
    const planet = this.getPlanet(planetId);
    if (planet.unlocked) return { success: false, reason: 'Sektor ist bereits freigeschaltet.' };

    const definition = definitionById.get(planetId);
    const parent = definition?.routeFromId ? this.getPlanet(definition.routeFromId) : undefined;
    if (!parent?.unlocked) {
      return { success: false, reason: 'Die vorherige Route ist noch blockiert.' };
    }
    if (!this.canUnlock(planetId)) {
      return { success: false, reason: 'Nicht genug Blüten, Dünger oder Treibstoff.' };
    }

    this.resources.blueten -= planet.unlockCost.blueten ?? 0;
    this.resources.duenger -= planet.unlockCost.duenger ?? 0;
    this.resources.fuel -= planet.unlockCost.fuel ?? 0;
    planet.unlocked = true;
    planet.sectorCleared = true;
    return { success: true };
  }

  getAsteroidFields(): AsteroidField[] {
    return PLANET_DEFINITIONS.flatMap((definition) => {
      if (!definition.routeFromId) return [];
      const from = this.getPlanet(definition.routeFromId);
      const to = this.getPlanet(definition.id);
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      return [{
        id: `field_${from.id}_${to.id}`,
        fromPlanetId: from.id,
        toPlanetId: to.id,
        x: (from.x + to.x) / 2,
        y: (from.y + to.y) / 2,
        angle: Math.atan2(dy, dx) * 180 / Math.PI,
        length: Math.hypot(dx, dy),
        cleared: to.sectorCleared,
        reachable: from.unlocked && !to.unlocked,
        unlockCost: to.unlockCost,
      }];
    });
  }
}

export const SPACE_MAP_SIZE = 1800;
