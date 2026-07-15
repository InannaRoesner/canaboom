import type { ImageSourcePropType } from 'react-native';

// React Native requires static image paths. Add each future planet PNG here after
// copying it into assets/images/planets.
const VOLCANIC_PLANET = require('../../assets/images/planets/planet_volcanic.png');

export function getPlanetAsset(assetKey: string): ImageSourcePropType | null {
  if (assetKey === 'earth') return null;
  return VOLCANIC_PLANET;
}

export const PLANET_COLORS = [
  '#38bdf8',
  '#f97316',
  '#f472b6',
  '#fbbf24',
  '#a78bfa',
  '#67e8f9',
  '#fb7185',
  '#4ade80',
];
