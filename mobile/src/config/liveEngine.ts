import { ISOMETRIC_3D_PIPELINE } from '../engine/Isometric3DPipeline';

export const LIVE_ENGINE = {
  system_command: 'CMD_FORCE_REPLACE',
  animation_mode: 'Active',
  enabled: true,
  force_refresh: true,
  texture_cache: ISOMETRIC_3D_PIPELINE.texture_cache,
  hardware_acceleration: ISOMETRIC_3D_PIPELINE.hardware_acceleration,
  engine_settings: {
    rendering_mode: ISOMETRIC_3D_PIPELINE.rendering_mode,
    map_base: ISOMETRIC_3D_PIPELINE.map_base,
    ui_theme: ISOMETRIC_3D_PIPELINE.ui_theme,
    depth: ISOMETRIC_3D_PIPELINE.depth,
    bloom: ISOMETRIC_3D_PIPELINE.bloom,
    layer_stack: {
      layer_0_background: 'animated_galaxy_water_shader',
      layer_1_environment: 'isometric_depth_island_mesh',
      layer_2_entities: 'skeletal_animation_units',
    },
    animation_parameters: {
      water_flow: 'sine_wave_distort_slow',
      boat_bob: 'harbor_motion_sine_loop_1700ms',
      tree_sway: 'palm_sway_sine_loop_2100ms',
      shore_foam: 'opacity_scale_pulse_2100ms',
      unit_idle_state: 'breathing_animation',
      unit_walk_state: 'loop_cycle_walk',
      unit_attack_state: 'loop_cycle_attack',
    },
  },
} as const;

export type LiveEngineSettings = typeof LIVE_ENGINE;

export default LIVE_ENGINE;
