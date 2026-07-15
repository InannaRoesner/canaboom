export type GameMasterResource = 'gold' | 'holz' | 'stein' | 'diamanten';
export type CombatTierId = 'tier_1' | 'tier_2' | 'tier_3';
export type CombatTierUnlock = `hq_${number}`;

export type GameMasterSettings = {
  game_master_settings: {
    start_kit: Record<GameMasterResource, number>;
    start_base: {
      hqLevel: 1;
      troopTentCount: 1;
    };
    economy_logic: {
      production_rate: 'base * 1.25 ^ (level - 1)';
      storage_capacity: 'base * 2 ^ (level - 1)';
      buildings: {
        Sägewerk: { resource: 'holz'; rate: number };
        Goldmiene: { resource: 'gold'; rate: number };
        Steinbruch: { resource: 'stein'; rate: number };
      };
    };
    combat_balance: {
      tier_system: Record<
        CombatTierId,
        { name: string; hp: number; dmg: number; unlock: CombatTierUnlock }
      >;
      upgrade_logic: {
        formula: 'current_stats * 1.3';
        requirement: 'Arsenal-Gebäude erforderlich';
      };
    };
  };
};

/** Canonical economy and troop-balance data supplied by the game master. */
export const GAME_MASTER_SETTINGS = {
  game_master_settings: {
    start_kit: {
      gold: 500,
      holz: 200,
      stein: 50,
      diamanten: 150,
    },
    start_base: {
      hqLevel: 1,
      troopTentCount: 1,
    },
    economy_logic: {
      production_rate: 'base * 1.25 ^ (level - 1)',
      storage_capacity: 'base * 2 ^ (level - 1)',
      buildings: {
        Sägewerk: { resource: 'holz', rate: 50 },
        Goldmiene: { resource: 'gold', rate: 100 },
        Steinbruch: { resource: 'stein', rate: 25 },
      },
    },
    combat_balance: {
      tier_system: {
        tier_1: { name: 'Cyber-Infanterist', hp: 150, dmg: 25, unlock: 'hq_1' },
        tier_2: { name: 'Phasen-Grenadier', hp: 450, dmg: 85, unlock: 'hq_8' },
        tier_3: { name: 'Vanguard-Schwerroboter', hp: 1200, dmg: 250, unlock: 'hq_15' },
      },
      upgrade_logic: {
        formula: 'current_stats * 1.3',
        requirement: 'Arsenal-Gebäude erforderlich',
      },
    },
  },
} as const satisfies GameMasterSettings;

export const START_KIT = GAME_MASTER_SETTINGS.game_master_settings.start_kit;
export const START_BASE = GAME_MASTER_SETTINGS.game_master_settings.start_base;
export const ECONOMY_SETTINGS = GAME_MASTER_SETTINGS.game_master_settings.economy_logic;
export const COMBAT_BALANCE = GAME_MASTER_SETTINGS.game_master_settings.combat_balance;

