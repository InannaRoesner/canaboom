export type MapNpc = {
  id: string;
  name: string;
  planetId: string;
  emoji: string;
  giftLabel: string;
  blueten: number;
  duenger: number;
  diamanten: number;
  xPercent: number;
  yPercent: number;
};

/** Marsmenschen statt Schatztruhen auf der Planetenkarte */
export const MAP_NPCS: MapNpc[] = [
  {
    id: 'mars_npc_1',
    name: 'Zoggy der Marsbewohner',
    planetId: 'mars',
    emoji: '👽',
    giftLabel: 'Mars-Kristall-Geschenk',
    blueten: 120,
    duenger: 30,
    diamanten: 5,
    xPercent: 62,
    yPercent: 38,
  },
  {
    id: 'mars_npc_2',
    name: 'Glip aus Valles Marineris',
    planetId: 'mars',
    emoji: '🛸',
    giftLabel: 'Rotes Staub-Bonus',
    blueten: 80,
    duenger: 50,
    diamanten: 2,
    xPercent: 28,
    yPercent: 55,
  },
  {
    id: 'earth_npc_1',
    name: 'Dock-Alien Mox',
    planetId: 'earth',
    emoji: '🤖',
    giftLabel: 'Raumhafen-Willkommensgeschenk',
    blueten: 50,
    duenger: 20,
    diamanten: 1,
    xPercent: 75,
    yPercent: 72,
  },
];

export function getNpcsForPlanet(planetId: string): MapNpc[] {
  return MAP_NPCS.filter((n) => n.planetId === planetId);
}
