export type MapTransformation = {
  action: 'replace_layout';
  target_style: 'boom_beach_isometric';
  aesthetic_theme: 'galaxy_ocean_paradise';
  specs: {
    terrain_generation: {
      base: 'island_organic_shape';
      water_texture: 'new_bloom_galaxy_water_08k';
      water_effects: {
        enabled: boolean;
        reflections: boolean;
        particles: boolean;
        bloom_enabled: boolean;
      };
      beach_zone: 'procedural_sand_border';
      forest_zone: 'density_controlled_trees';
      dock_placement: 'anchor_point_fixed';
    };
    ui_layout: {
      top_bar: 'translucent_hud_overlay';
      build_button: 'floating_action_button';
      map_button: 'radar_style_bottom_right';
    };
    grid_system: {
      type: 'isometric_tile_map';
      tile_size: 'scalable';
      collision_mask: 'active';
    };
  };
};

export const MAP_TRANSFORMATIONATION: MapTransformation = {
  action: 'replace_layout',
  target_style: 'boom_beach_isometric',
  aesthetic_theme: 'galaxy_ocean_paradise',
  specs: {
    terrain_generation: {
      base: 'island_organic_shape',
      water_texture: 'new_bloom_galaxy_water_08k',
      water_effects: {
        enabled: true,
        reflections: true,
        particles: true,
        bloom_enabled: true,
      },
      beach_zone: 'procedural_sand_border',
      forest_zone: 'density_controlled_trees',
      dock_placement: 'anchor_point_fixed',
    },
    ui_layout: {
      top_bar: 'translucent_hud_overlay',
      build_button: 'floating_action_button',
      map_button: 'radar_style_bottom_right',
    },
    grid_system: {
      type: 'isometric_tile_map',
      tile_size: 'scalable',
      collision_mask: 'active',
    },
  },
};

/** Fraction of optional edge-tree slots rendered around the buildable meadow. */
export const TREE_DENSITY = 0.72;

export const WATER_EFFECTS =
  MAP_TRANSFORMATIONATION.specs.terrain_generation.water_effects;

export default MAP_TRANSFORMATIONATION;
