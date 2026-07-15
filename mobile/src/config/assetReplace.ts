/** Bump to bust RN image / GL texture caches after swapping PNGs. */
export const ASSET_CACHE_VERSION = 5;

export const OCEAN_ASSET_REPLACE = {
  renderPipeline: {
    enableBloom: true,
    bloomIntensity: 0.35,
    bloomThreshold: 0.72,
    shaderType: 'galaxy_nebula_water',
    textureFilter: 'linear_mipmap',
  },
  assetPath: 'assets/images/base/ocean_bloom_seamless.png',
} as const;
