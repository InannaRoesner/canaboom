export const ISOMETRIC_3D_PIPELINE = {
  hardware_acceleration: {
    offscreen_alpha_compositing: true,
    render_to_hardware_texture_android: true,
    rasterize_ios: false,
  },
  camera: {
    type: 'orthographic_isometric' as const,
    frustum_home: 16,
    frustum_raid: 13,
  },
  texture_cache: {
    bust_on_version_bump: true,
    preload_building_sprites: true,
  },
  rendering_mode: 'pre_rendered_sprite_billboards',
  map_base: 'galaxy_archipelago',
  ui_theme: 'boom_beach_galaxy',
  depth: {
    fog_near: 18,
    fog_far: 42,
    sprite_y_offset: 0.55,
  },
  bloom: {
    enabled: true,
    emissive_ocean: 0.22,
  },
};
