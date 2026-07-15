import { BOT_AVATAR_PLACEHOLDER } from '../assets/images';

export type BotProfile = {
  id: string;
  displayName: string;
  avatarUrl: string;
  avatarLocal?: number;
  planetId: string;
  power: number;
  hqLevel: number;
};

const BOT_NAMES = [
  'CosmicBlaze42',
  'MarsGrower_X',
  'OrbitKing99',
  'HanfHunter',
  'WeedWarden',
  'PlasmaPete',
  'GalaxyGardener',
  'NebulaNinja',
  'SaturnSprout',
  'AstroAlien_DE',
  'GreenComet',
  'RocketRosa',
  'DüngerDynamo',
  'BlütenBoss',
  'SpaceBud77',
  'LunarLeaf',
  'HydroHexe',
  'CometKush',
  'AstroMango',
  'VenusViolet',
  'EuropaEddy',
  'NovaNora',
  'QuasarQueen',
  'OrbitOtto',
  'MarsMartha',
  'PlutoPunk',
];

function avatarFor(seed: string): string {
  return `https://api.dicebear.com/7.x/bottts-neutral/png?seed=${encodeURIComponent(seed)}&backgroundColor=1e293b`;
}

function pick<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < count && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

/** Simulierte Fake-Gegner für Matchmaking & Planetenkarte */
export function generateBotProfiles(planetId: string, count = 3): BotProfile[] {
  const names = pick(BOT_NAMES, count);
  return names.map((name, idx) => ({
    id: `bot_${planetId}_${idx}_${name.toLowerCase()}`,
    displayName: name,
    avatarUrl: avatarFor(name),
    avatarLocal: idx === 0 ? BOT_AVATAR_PLACEHOLDER : undefined,
    planetId,
    power: 180 + Math.floor(Math.random() * 420) + idx * 40,
    hqLevel: 2 + Math.floor(Math.random() * 6),
  }));
}

/** Vorbefüllte Bot-Belegung pro Planet (Platzhalter bis echtes Matchmaking) */
export function getMapBots(): BotProfile[] {
  return [
    'earth', 'luna', 'mars', 'venus', 'mercury', 'phobos', 'europa', 'io', 'titan',
    'ganymede', 'enceladus', 'triton', 'ceres', 'callisto', 'kepler', 'vulcan',
    'neptune', 'saturn', 'pluto', 'eris', 'nova',
  ].flatMap((planetId) => generateBotProfiles(planetId, planetId === 'earth' ? 2 : 3));
}
