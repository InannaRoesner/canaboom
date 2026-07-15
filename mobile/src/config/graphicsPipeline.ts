import { OCEAN_ASSET_REPLACE } from './assetReplace';

export const GRAPHICS_PIPELINE = {
  bloom: {
    enabled: OCEAN_ASSET_REPLACE.renderPipeline.enableBloom,
    intensity: OCEAN_ASSET_REPLACE.renderPipeline.bloomIntensity,
    threshold: OCEAN_ASSET_REPLACE.renderPipeline.bloomThreshold,
  },
  waterDistortion: {
    shaderType: OCEAN_ASSET_REPLACE.renderPipeline.shaderType,
    frequency: 'slow_nebula_warp',
    amplitude: 0.065,
    speed: 0.18,
  },
  textureFilter: OCEAN_ASSET_REPLACE.renderPipeline.textureFilter,
  layers: ['background', 'reflection', 'bloom'] as const,
};
