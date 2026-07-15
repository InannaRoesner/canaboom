/** Layout calibration for boom_beach_island_master.png (isometric home island). */
export const BOOM_BEACH_ISLAND = {
  /** Master backdrop – visual ground truth */
  masterAsset: require('../../assets/images/base/boom_beach_island_master.png'),
  /** Grass-building grid anchor as fraction of image (0–1) */
  gridAnchorX: 0.405,
  gridAnchorY: 0.295,
  /** Pixels per isometric tile at 1× zoom (image width = 1.0) */
  tileScale: 0.028,
  /** Zoom limits */
  minZoom: 0.92,
  maxZoom: 1.55,
  defaultZoom: 1.0 as number,
  /** Parallax multipliers while panning */
  waterParallax: 0.15,
  shimmerBoostOnMove: 0.35,
} as const;

/** Boom Beach tropical palette (home island water near shore) */
export const BOOM_BEACH_PALETTE = {
  waterShallow: '#5ec8e8',
  waterDeep: '#1a6fa8',
  sand: '#f5edd8',
  grass: '#6db33f',
  uiBlue: '#1e6fd9',
  uiBlueDark: '#0d4a9e',
} as const;
