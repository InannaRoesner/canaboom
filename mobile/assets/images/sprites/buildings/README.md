# Gebäude-Sprites (Pre-Rendered)

Lege **isometrische Octane/Cinema4D-PNG-Render** hier ab. **Dateiname = Sprite-ID** (ohne `.png`).

## Dateien

| Datei | Gebäude | Octane-Prompt (Kurz) |
|-------|---------|----------------------|
| `hq_main.png` | Hauptquartier | `isometric Boom Beach HQ command post, wooden fortified shack, tropical island, 30° camera, baked soft shadow, transparent PNG, 512px` |
| `troop_tent.png` | Truppenzelt | `isometric military tent on grass, canvas olive green, rope stakes, Boom Beach style, transparent PNG` |
| `gold_mine.png` | Goldmine | `isometric gold mine entrance, wooden frame, ore cart, tropical base, Octane render look, transparent PNG` |
| `rocket_launcher.png` | Raketenwerfer | `isometric coastal rocket launcher turret, metal barrels, sandbags, defense building, transparent PNG` |
| `bunker.png` | Bunker | `isometric concrete bunker pillbox, heavy armor, grass edge, Boom Beach defense, transparent PNG` |
| `radar.png` | Radar | `isometric radar dish tower, rotating antenna, blue metal, support building, transparent PNG` |
| `sawmill.png` | Sägewerk | `isometric sawmill with log pile and conveyor, wood production, tropical, transparent PNG` |
| `stone_quarry.png` | Steinbruch | `isometric stone quarry with rocks and crane, production building, transparent PNG` |
| `landing_craft.png` | Landungsboot | `isometric landing craft boat, military grey, docked at pier, transparent PNG` |
| `pier.png` | Pier / Steg | `isometric wooden pier segment, dock planks, rope posts, transparent PNG` |

## Anforderungen

- Transparenter Hintergrund (Alpha)
- Höhe **256–512 px**, Schatten im Bild mitbaken
- Kamera: **~30° isometrisch**, ein Hero-Winkel
- Stil: Boom Beach / Supercell — satte Farben, weiche Kanten

## Platzhalter neu erzeugen

```bash
py scripts/gen_placeholders.py
```

Nach Austausch: `ASSET_CACHE_VERSION` in `src/config/assetReplace.ts` erhöhen.

Vollständige Prompts: `PROMPT_GUIDE.md` → Pre-Rendered Sprites.
