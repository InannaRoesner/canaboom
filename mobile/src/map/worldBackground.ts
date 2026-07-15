import type { ImageSourcePropType } from 'react-native';

/**
 * Kept in one module so replacing the world-map artwork never requires
 * touching the screen layout.
 */
export const WORLD_BG: ImageSourcePropType | null =
  require('../../assets/images/planets/galaxy_archipelago_bg.png');
