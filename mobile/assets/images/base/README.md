# CanaBoom tropical military home-base sprites

Add transparent PNG sprites here. The current screen uses layered React Native
fallback art so it runs before these files are available.

Expected files:

- `hq_boombeach.png` — timber-and-stone military headquarters with flag, three-quarter isometric view
- `boom_cannon.png` — heavy coastal cannon with armored shield
- `rocket_launcher.png` — military multi-tube rocket defense
- `mortar.png` — recessed circular mortar emplacement with sandbags
- `mg_nest.png` — human machine-gun nest with sandbags
- `sniper_tower.png` — tall timber lookout with long rifle
- `lieutenant.png` — saluting professional human officer, transparent background
- `soldier.png` — small human infantry patrol sprite
- `flag.png` — large wind-swept CanaBoom faction flag
- `pier.png` — weathered wooden pier, viewed isometrically
- `landing_craft.png` — weathered tropical landing craft
- `palm_tree.png` — isolated palm with a soft ground shadow
- `ocean_bloom_seamless.png` — seamless 8K bloom galaxy-water texture for asset
  `new_bloom_galaxy_water_08k` (accepted alternate: `ocean_nebula_seamless.png`)

Until the ocean texture is supplied, `GalaxyWaterEffects` renders the PNG
`ocean_bloom_seamless.png` with animated distortion, particles, and bloom; no
flat solid-color ocean fallback is used. Render a future texture edge-to-edge
with `resizeMode="cover"`. Prefer the highest quality `expo-image` filtering
when that package is installed, otherwise use React Native `Image` with
`resizeMode="cover"`.

After any asset-cache bump (`force_replace_v10` or later), clear Metro and
reload offline:

```bash
npx expo start --offline --clear
```

Or use the npm shortcut: `npm run start:refresh`.

Recommended export: transparent background, saturated tropical palette,
consistent upper-left sunlight, soft ambient shadow, and 2x or 3x resolution.
Keep empty padding tight so grid placement and touch targets remain aligned.
All home-base art must stay grounded in a human WWII-inspired tropical military
style: no alien anatomy, neon glows, purple sci-fi materials, or futuristic tech.
