export type Planet = {
  id: string;
  name: string;
  order: number;
  unlockHqLevel: number;
  theme: string;
  description: string;
  color: string;
  emoji: string;
};

/** Sonnensystem-Planeten (Boom-Beach-Inseln-Ersatz) */
export const PLANETS: Planet[] = [
  {
    id: 'earth',
    name: 'Erde',
    order: 1,
    unlockHqLevel: 1,
    theme: 'orbital_greenhouse',
    description: 'Startplanet — baue dein erstes Grow-HQ.',
    color: '#22c55e',
    emoji: '🌍',
  },
  {
    id: 'mars',
    name: 'Mars',
    order: 2,
    unlockHqLevel: 5,
    theme: 'red_dust_hydro',
    description: 'Rote Wüste — erweiterte Trocknungsräume.',
    color: '#ef4444',
    emoji: '🔴',
  },
  {
    id: 'mercury',
    name: 'Merkur',
    order: 3,
    unlockHqLevel: 8,
    theme: 'solar_flare',
    description: 'Extreme Sonnennähe — Plasma-Werfer-Forschung.',
    color: '#fbbf24',
    emoji: '☀️',
  },
  {
    id: 'venus',
    name: 'Venus',
    order: 4,
    unlockHqLevel: 12,
    theme: 'acid_cloud',
    description: 'Dichte Atmosphäre — Elite-Gewächshaus-Kuppeln.',
    color: '#f472b6',
    emoji: '🌸',
  },
  {
    id: 'jupiter_moon',
    name: 'Europa (Jupiter)',
    order: 5,
    unlockHqLevel: 15,
    theme: 'ice_hydro',
    description: 'Eisige Monde — maximale Hydro-Kultur.',
    color: '#38bdf8',
    emoji: '🧊',
  },
];

export function getPlanet(id: string): Planet | undefined {
  return PLANETS.find((p) => p.id === id);
}
