import {
  CENSOR_MASTER,
  MASTER_BUILDINGS,
  getHqUnlockLevel,
  parseHqRequirement,
  type BuildingCategory,
  type BuildingSize,
} from '../config/censorMaster';
import {
  progressionSystem,
  type ResourceId,
  type ShopItemConfig,
  type ShopItemId,
} from '../config/gameConfig';
import type { PlayerResources } from '../context/ResourceContext';

export type ShopItem = ShopItemConfig & {
  id: ShopItemId;
  name: string;
  icon: string;
  color: string;
  unlocked: boolean;
  available: boolean;
  category: BuildingCategory;
  size: BuildingSize;
};

export type PurchaseResult =
  | { success: true; item: ShopItem }
  | { success: false; error: string };

export class ShopManager {
  private readonly hqLevel: number;

  constructor(
    private readonly resources: PlayerResources,
    private readonly spendResources: (cost: Partial<PlayerResources>) => boolean,
    hqLevel = 12
  ) {
    this.hqLevel = Math.min(
      Math.max(1, Math.floor(hqLevel)),
      CENSOR_MASTER.game_rules.level_cap
    );
  }

  getShopItems(): ShopItem[] {
    return MASTER_BUILDINGS
      .filter(({ id }) => id !== 'hq')
      .map((master) => {
      const requiredHqLevel =
        getHqUnlockLevel(master.name) ?? parseHqRequirement(master.req);
      const initial = requiredHqLevel === 1;
      const config: ShopItemConfig = {
        cost: master.baseCost,
        required_hq_level: requiredHqLevel,
        description: master.description,
        is_initial: initial,
      };
      return {
        id: master.id,
        ...config,
        name: master.name,
        icon: master.icon,
        color: master.color,
        category: master.category,
        size: master.size,
        available: master.playable,
        unlocked: this.hqLevel >= config.required_hq_level,
      };
    });
  }

  canPurchase(itemId: ShopItemId): boolean {
    return this.getPurchaseError(itemId) === null;
  }

  getPurchaseError(itemId: ShopItemId): string | null {
    const item = this.getShopItems().find(({ id }) => id === itemId);
    if (!item) return 'Dieser Shop-Artikel existiert nicht.';
    if (!item.available) return progressionSystem.ui_interaction.unavailable_feedback;
    if (!item.unlocked || this.hqLevel < item.required_hq_level) {
      return progressionSystem.ui_interaction.locked_feedback;
    }

    const missing = (Object.keys(item.cost) as ResourceId[])
      .some((resource) => this.resources[resource] < (item.cost[resource] ?? 0));

    return missing
      ? progressionSystem.ui_interaction.insufficient_resources_feedback
      : null;
  }

  purchase(itemId: ShopItemId): PurchaseResult {
    const error = this.getPurchaseError(itemId);
    if (error) return { success: false, error };
    const item = this.getShopItems().find(({ id }) => id === itemId)!;
    if (!this.spendResources(item.cost)) {
      return {
        success: false,
        error: progressionSystem.ui_interaction.insufficient_resources_feedback,
      };
    }
    return { success: true, item };
  }
}
