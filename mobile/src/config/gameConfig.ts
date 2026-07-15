import {
  CENSOR_MASTER,
  MASTER_BUILDINGS,
  parseHqRequirement,
  type BuildingId,
  type ResourceId,
} from './censorMaster';

export type { ResourceId } from './censorMaster';
export type ShopItemId = BuildingId;

export type ShopItemConfig = {
  cost: Partial<Record<ResourceId, number>>;
  required_hq_level: number;
  description: string;
  is_initial: boolean;
};

export const gameConfig = {
  ui_hud_system: {
    top_bar: {
      display_elements: ['gold', 'wood', 'stone', 'diamonds'],
      update_frequency: 'realtime',
    },
    bottom_menu: {
      hammer_icon: {
        action: CENSOR_MASTER.ui_elements.shop_action,
        state: 'active',
      },
    },
  },
  progression_system: {
    currency_types: ['gold', 'wood', 'stone', 'diamonds'],
    building_requirements: Object.fromEntries(
      MASTER_BUILDINGS.map((item) => [
        item.id,
        {
          required_hq_level: parseHqRequirement(item.req),
          cost: item.baseCost,
          description: item.description,
        },
      ])
    ),
    ui_interaction: {
      locked_feedback: 'Hauptquartier-Level zu niedrig!',
      insufficient_resources_feedback: 'Nicht genug Ressourcen!',
      unavailable_feedback: 'Bald verfügbar',
    },
  },
} as const;

/** Compatibility export; all entries are generated from CENSOR_MASTER. */
export const progressionSystem = gameConfig.progression_system;

export default gameConfig;
