# Planeten-Assets

Lege transparente, quadratische PNG-Dateien in diesem Ordner ab. Erwartete Namen:

- `earth.png`
- `planet_01.png` bis `planet_20.png`
- `galaxy_archipelago_bg.png` — vollflächiger Hintergrund der Galaxie-Weltkarte

`planet_volcanic.png` ist das erste gelieferte Asset und wird derzeit als Vulkan sowie als
Fallback für Planeten ohne eigenes PNG verwendet. Sobald eine neue Datei vorhanden ist,
muss ihr statisches `require(...)` in `src/map/planetAssets.ts` aktiviert werden.

Empfehlung: 512 × 512 px, transparenter Hintergrund und das Planetenmotiv mit etwas
Innenabstand, damit Schatten und Auswahlrahmen nicht abgeschnitten werden.

`galaxy_archipelago_bg.png` ist davon ausgenommen: Es soll eine deckende, quadratische
Top-down-Weltkarte ohne Transparenz sein. Aktuell liegt dort vorübergehend eine Kopie von
`../base/ocean_bloom_seamless.png`; sie kann direkt durch das finale PNG ersetzt werden.
