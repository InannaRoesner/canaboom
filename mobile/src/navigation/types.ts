export type RootStackParamList = {
  Loading: undefined;
  Main: undefined;
  AgeGate: undefined;
  Home: undefined;
  Shop: undefined;
  Legal: { page: string };
  Travel: RaidTargetParams & { distanceFactor?: number };
  Game: {
    opponentName?: string;
    opponentId?: string;
    planetId?: string;
    enemyHqLevel?: number;
    raidRewards?: {
      resources: { gold: number; wood: number; stone: number };
      victoryPoints: number;
      galaxyMapIntel: number;
    };
  };
};

export type MainTab = 'home' | 'map';

export type RaidTargetParams = {
  planetId: string;
  targetId: string;
  targetName: string;
  enemyHqLevel: number;
  distanceFactor?: number;
  rewards: {
    resources: { gold: number; wood: number; stone: number };
    victoryPoints: number;
    galaxyMapIntel: number;
  };
};
