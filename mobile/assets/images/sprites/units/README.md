# Einheiten-Sprites (Pre-Rendered)

Lege **isometrische Octane-PNG-Render** hier ab. **Dateiname = Sprite-ID**.

## Dateien

| Datei | Einheit | Octane-Prompt (Kurz) |
|-------|---------|----------------------|
| `cyber_infanterist.png` | Cyber-Infanterist | `isometric sci-fi infantry soldier, green armor, rifle, Boom Beach proportions, transparent PNG, 256px` |
| `rifleman.png` | Schütze | `isometric rifleman soldier, tropical camo, standing pose, soft ground shadow, transparent PNG` |
| `heavy_gunner.png` | Schwerer Schütze | `isometric heavy gunner with minigun, bulky armor, isometric hero angle, transparent PNG` |

## Anforderungen

- Transparenter Hintergrund
- Ein Charakter, Blick leicht nach rechts-unten (isometrisch)
- Weicher Bodenschatten mitbaken
- Höhe **192–320 px**

## Platzhalter neu erzeugen

```bash
py scripts/gen_placeholders.py
```

Registry: `src/sprites/SpriteRegistry.ts` → `getUnitSprite(id)`
