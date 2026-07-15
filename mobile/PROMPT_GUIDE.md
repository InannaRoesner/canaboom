# CanaBoom – Art & Asset Prompt Guide

## Home Island Master Backdrop

`assets/images/base/boom_beach_island_master.png` — **visual ground truth** copied from Boom Beach reference.
Beach left, grass center, jungle/cliffs/waterfall back, pier + landing craft right.
HomeBase uses this PNG directly via `BoomBeachIslandView`; building sprites overlay the grass clearing.

---

CanaBoom uses **pre-rendered isometric PNG sprites** (Octane/Cinema4D/Blender) displayed as billboards in `IslandScene3D` and as 2D overlays in `BuildingRenderer`. Drop finished PNGs into:

```
assets/images/sprites/buildings/<sprite_id>.png
assets/images/sprites/units/<sprite_id>.png
```

Then bump `ASSET_CACHE_VERSION` in `src/config/assetReplace.ts`.

### Building Prompt Template (Octane)

```
Isometric mobile strategy game building sprite, [BUILDING NAME], tropical military base
with subtle sci-fi galaxy accents, Boom Beach art style, 30-degree isometric camera,
single hero angle, vibrant colors, crisp edges, baked soft ground shadow, transparent PNG
background, no text, no UI, high detail stylized 3D render look, 512px tall
```

**Examples:**
- HQ: `... fortified command HQ with flag pole and sandbags, level 12 badge area on roof ...`
- Gold Mine: `... gold ore conveyor and mine entrance on grassy island tile ...`
- Rocket Launcher: `... coastal defense rocket turret with metallic barrels ...`

### Unit Prompt Template

```
Isometric mobile strategy game unit sprite, [UNIT NAME], single character facing
camera-right, stylized 3D render, transparent PNG, soft shadow under boots,
Boom Beach proportions, galaxy-tropical color palette, no weapon muzzle flash, 256px tall
```

### Registered Sprite IDs

**Buildings:** `hq_main`, `troop_tent`, `gold_mine`, `rocket_launcher`, `bunker`, `radar`, `sawmill`, `stone_quarry`, `landing_craft`, `pier`

**Units:** `cyber_infanterist`, `rifleman`, `heavy_gunner`

### Regenerate Placeholders

```bash
node scripts/gen-placeholders.mjs
```

---

## Galaxy Water Theme

Ocean texture: `assets/images/base/ocean_bloom_seamless.png` — purple nebula water with subtle wave tiling. Replace with a seamless 512×512 PNG for production.

## Camera

Orthographic isometric (Boom Beach): configured in `src/utils/threeHelpers.ts` → `createIsometricCamera`.
