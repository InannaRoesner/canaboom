import type { ImageSourcePropType } from 'react-native';

/** Registered building sprite IDs – filename without .png */
export type BuildingSpriteId =
  | 'hq_main'
  | 'troop_tent'
  | 'gold_mine'
  | 'rocket_launcher'
  | 'bunker'
  | 'radar'
  | 'sawmill'
  | 'stone_quarry'
  | 'landing_craft'
  | 'pier';

export type UnitSpriteId = 'cyber_infanterist' | 'rifleman' | 'heavy_gunner';

export type SpriteId = BuildingSpriteId | UnitSpriteId;

/** Static require map – Metro needs literal paths at bundle time. */
const BUILDING_SPRITES: Record<BuildingSpriteId, ImageSourcePropType> = {
  hq_main: require('../../assets/images/sprites/buildings/hq_main.png'),
  troop_tent: require('../../assets/images/sprites/buildings/troop_tent.png'),
  gold_mine: require('../../assets/images/sprites/buildings/gold_mine.png'),
  rocket_launcher: require('../../assets/images/sprites/buildings/rocket_launcher.png'),
  bunker: require('../../assets/images/sprites/buildings/bunker.png'),
  radar: require('../../assets/images/sprites/buildings/radar.png'),
  sawmill: require('../../assets/images/sprites/buildings/sawmill.png'),
  stone_quarry: require('../../assets/images/sprites/buildings/stone_quarry.png'),
  landing_craft: require('../../assets/images/sprites/buildings/landing_craft.png'),
  pier: require('../../assets/images/sprites/buildings/pier.png'),
};

const UNIT_SPRITES: Record<UnitSpriteId, ImageSourcePropType> = {
  cyber_infanterist: require('../../assets/images/sprites/units/cyber_infanterist.png'),
  rifleman: require('../../assets/images/sprites/units/rifleman.png'),
  heavy_gunner: require('../../assets/images/sprites/units/heavy_gunner.png'),
};

const BUILDING_TEXTURE_MODULES: Record<BuildingSpriteId, number> = {
  hq_main: require('../../assets/images/sprites/buildings/hq_main.png'),
  troop_tent: require('../../assets/images/sprites/buildings/troop_tent.png'),
  gold_mine: require('../../assets/images/sprites/buildings/gold_mine.png'),
  rocket_launcher: require('../../assets/images/sprites/buildings/rocket_launcher.png'),
  bunker: require('../../assets/images/sprites/buildings/bunker.png'),
  radar: require('../../assets/images/sprites/buildings/radar.png'),
  sawmill: require('../../assets/images/sprites/buildings/sawmill.png'),
  stone_quarry: require('../../assets/images/sprites/buildings/stone_quarry.png'),
  landing_craft: require('../../assets/images/sprites/buildings/landing_craft.png'),
  pier: require('../../assets/images/sprites/buildings/pier.png'),
};

export function isBuildingSpriteId(id: string): id is BuildingSpriteId {
  return id in BUILDING_SPRITES;
}

export function isUnitSpriteId(id: string): id is UnitSpriteId {
  return id in UNIT_SPRITES;
}

export function getBuildingSprite(id: string): ImageSourcePropType | null {
  if (!isBuildingSpriteId(id)) return null;
  return BUILDING_SPRITES[id];
}

export function getUnitSprite(id: string): ImageSourcePropType | null {
  if (!isUnitSpriteId(id)) return null;
  return UNIT_SPRITES[id];
}

export function getBuildingTextureModule(id: string): number | null {
  if (!isBuildingSpriteId(id)) return null;
  return BUILDING_TEXTURE_MODULES[id];
}

export function listRegisteredBuildingSprites(): BuildingSpriteId[] {
  return Object.keys(BUILDING_SPRITES) as BuildingSpriteId[];
}

export function listRegisteredUnitSprites(): UnitSpriteId[] {
  return Object.keys(UNIT_SPRITES) as UnitSpriteId[];
}

/** Map shop/building keys to sprite IDs. */
export const BUILDING_KEY_TO_SPRITE: Record<string, BuildingSpriteId> = {
  hq_main: 'hq_main',
  troop_tent: 'troop_tent',
  gold_mine: 'gold_mine',
  rocket_launcher: 'rocket_launcher',
  bunker: 'bunker',
  radar: 'radar',
  sawmill: 'sawmill',
  stone_quarry: 'stone_quarry',
  landing_craft: 'landing_craft',
  pier: 'pier',
};

/** Map combat unit IDs to sprite IDs. */
export const UNIT_ID_TO_SPRITE: Record<string, UnitSpriteId> = {
  robot_01: 'cyber_infanterist',
  cyber_02: 'rifleman',
  titan_03: 'heavy_gunner',
  cyber_infanterist: 'cyber_infanterist',
  rifleman: 'rifleman',
  heavy_gunner: 'heavy_gunner',
};

export function resolveBuildingSpriteId(building: {
  spriteId?: string;
  key?: string;
}): BuildingSpriteId | null {
  if (building.spriteId && isBuildingSpriteId(building.spriteId)) {
    return building.spriteId;
  }
  if (building.key && building.key in BUILDING_KEY_TO_SPRITE) {
    return BUILDING_KEY_TO_SPRITE[building.key];
  }
  return null;
}

export function resolveUnitSpriteId(unitId: string): UnitSpriteId | null {
  const mapped = UNIT_ID_TO_SPRITE[unitId];
  return mapped ?? (isUnitSpriteId(unitId) ? unitId : null);
}
