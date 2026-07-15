export type MapIsland = {
  id: string;
  name: string;
  x: number;
  y: number;
  unlocked: boolean;
  fogCost: number;
  hqLevel: number;
  rewards: { gold: number; wood: number; stone: number };
  victoryPoints: number;
};

export const MAP_ISLANDS: MapIsland[] = [
  {
    id: 'home',
    name: 'Heimatinsel',
    x: 0.22,
    y: 0.55,
    unlocked: true,
    fogCost: 0,
    hqLevel: 12,
    rewards: { gold: 0, wood: 0, stone: 0 },
    victoryPoints: 0,
  },
  {
    id: 'alpha',
    name: 'Nebel-Alpha',
    x: 0.42,
    y: 0.38,
    unlocked: false,
    fogCost: 500,
    hqLevel: 2,
    rewards: { gold: 120, wood: 80, stone: 20 },
    victoryPoints: 2,
  },
  {
    id: 'beta',
    name: 'Nebel-Beta',
    x: 0.58,
    y: 0.52,
    unlocked: false,
    fogCost: 900,
    hqLevel: 4,
    rewards: { gold: 220, wood: 140, stone: 45 },
    victoryPoints: 3,
  },
  {
    id: 'gamma',
    name: 'Nebel-Gamma',
    x: 0.72,
    y: 0.35,
    unlocked: false,
    fogCost: 1500,
    hqLevel: 6,
    rewards: { gold: 400, wood: 220, stone: 90 },
    victoryPoints: 5,
  },
  {
    id: 'delta',
    name: 'Nebel-Delta',
    x: 0.82,
    y: 0.58,
    unlocked: false,
    fogCost: 2500,
    hqLevel: 8,
    rewards: { gold: 650, wood: 380, stone: 140 },
    victoryPoints: 7,
  },
];
