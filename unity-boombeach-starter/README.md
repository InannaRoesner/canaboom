# Canaboom — Unity Boom-Beach-Starter

Starter-Skripte für ein mobiles Strategiespiel im Stil von Boom Beach.  
Liegt im **Canaboom-Monorepo** neben dem Expo-Prototyp `../mobile/` — beide teilen Konzept und Backend, sind aber getrennte Clients.

> **Repo:** [github.com/InannaRoesner/canaboom](https://github.com/InannaRoesner/canaboom) · Übersicht im Root-`README.md`

## Voraussetzungen

- Unity **2022.3 LTS** oder **Unity 6 LTS**
- Neues **3D (URP)**-Projekt in Unity Hub anlegen
- Diesen Ordner `unity-boombeach-starter/Assets/Scripts/` in dein Projekt kopieren

## Projektstruktur

```
Assets/Scripts/
├── Canaboom.Starter.asmdef
├── Core/
│   └── GameManager.cs
├── Grid/
│   ├── GridSystem.cs
│   ├── GridOverlayDrawer.cs      ← optionale Gizmos im Editor
│   ├── BuildingPlacementController.cs
│   └── PlacementGhostView.cs
├── Resources/
│   ├── ResourceController.cs     ← UI + passive Produktion (empfohlen)
│   └── ResourceSystem.cs         ← optional, erweitert mit PlayerPrefs
└── Buildings/
    ├── Building.cs
    ├── Headquarters.cs
    └── DefenseTower.cs
```

## Schritt-für-Schritt: Szene einrichten

### 1. Insel (Plane)

1. **GameObject → 3D Object → Plane** erstellen, Name: `Island`
2. Skalierung z. B. `(2, 1, 2)` — passt zum 20×20-Raster
3. **Box Collider** oder **Mesh Collider** muss aktiv sein (für Raycast)
4. Optional: Tag `Island` setzen und Layer `Island` anlegen

### 2. Kamera

1. Main Camera auswählen
2. **Projection:** Orthographic
3. **Size:** ca. `8–12` (je nach Inselgröße)
4. **Rotation:** Yaw ~`45°`, Pitch ~`35°` (isometrischer Blick)
5. Position so setzen, dass die ganze Insel sichtbar ist

### 3. Raster & Manager

Leeres GameObject `GameSystems` anlegen und folgende Scripts hinzufügen:

| Component | Einstellungen |
|-----------|---------------|
| `GridSystem` | Grid Size `20×20`, Cell Size `1`, Grid Origin = Insel-Mitte unten |
| `GridOverlayDrawer` | Optional — zeigt Raster-Gizmos im Scene-Fenster |
| `ResourceController` | Start-Gold `100`, Holz `50`, UI-Texte zuweisen (siehe unten) |
| `GameManager` | HQ-Prefab zuweisen (siehe unten) |
| `BuildingPlacementController` | Camera = Main Camera, Selected Prefab = Test-Gebäude |

**BuildingPlacementController**-Felder:

- **Placement Camera** → `Main Camera`
- **Island Layer Mask** → Layer der Insel (oder „Everything“)
- **Selected Building Prefab** → z. B. Goldmine oder zweites HQ
- **Start In Placement Mode** → `true` für sofortigen Test

### 4. HQ-Prefab erstellen

1. **Cube** oder importiertes Mesh als Platzhalter
2. Skalierung für 4×4-Zellen z. B. `(4, 1, 4)` bei Cell Size 1
3. Scripts hinzufügen:
   - `Headquarters` (erbt von `Building`)
   - `Building`: Size `(4, 4)`, Gold/Wood Cost `0`
4. Als Prefab nach `Assets/Prefabs/HQ.prefab` ziehen
5. Im **GameManager** → `Headquarters Prefab` zuweisen, Position z. B. `(8, 8)`

### 5. Ghost-Materialien (grün / rot)

Erstelle zwei transparente Materialien (URP: Shader **Universal Render Pipeline/Lit**, Surface **Transparent**):

| Material | Farbe (RGBA) | Verwendung |
|----------|--------------|------------|
| `GhostValid` | `(50, 255, 90, 140)` | Platzierung OK |
| `GhostInvalid` | `(255, 60, 50, 140)` | Blockiert |

Im `PlacementGhostView` (wird automatisch am Ghost angehängt) optional zuweisen.  
Ohne Materialien nutzt das Script eingebaute Auto-Farben.

### 6. Test-Gebäude-Prefab

1. Kleiner Cube, `Building`-Script: Size `(2, 2)`, Gold `200`, Holz `100`
2. Prefab speichern, im **BuildingPlacementController** als `Selected Building Prefab`

### 7. UI-Texte verbinden (Canvas)

So zeigst du Gold und Holz oben auf dem Bildschirm an:

1. **GameObject → UI → Canvas** erstellen (falls noch keins da ist)
2. Rechtsklick auf Canvas → **UI → Text - TextMeshPro** *oder* **UI → Legacy → Text**
   - Für `ResourceController` nutze **Legacy Text** (`UnityEngine.UI.Text`)
3. Zwei Text-Objekte anlegen: `GoldText` und `HolzText`
4. Position oben links im **Rect Transform** (Anchor: Top-Left)
5. `GameSystems` auswählen → Component **ResourceController**:
   - **Gold Text** → `GoldText` aus Hierarchy reinziehen
   - **Holz Text** → `HolzText` reinziehen
   - Optional: **Stein Text** für später
6. **Play** drücken — die Zahlen steigen automatisch (`goldProSekunde` / `holzProSekunde`)

> **Tipp:** Wenn Texte leer bleiben, prüfe ob Canvas einen **EventSystem** hat (wird automatisch erstellt) und ob die Text-Referenzen im Inspector gesetzt sind.

## Spiel testen

### Im Unity Editor (Maus)

1. **Play** drücken
2. HQ erscheint automatisch bei Startposition
3. Klicken + Ziehen auf der Insel → Geister-Gebäude folgt der Maus
4. **Grün** = freie Zellen, genug Ressourcen
5. **Rot** = belegt, außerhalb des Rasters oder zu teuer
6. Maustaste loslassen → Gebäude wird platziert, Ghost verschwindet

### Auf dem Handy (Touch)

1. Build Settings → Android oder iOS
2. Szene hinzufügen, Build & Run
3. Finger tippen + ziehen = gleiche Logik wie Maus
4. Finger loslassen = Bestätigung

### Console-Logs

- `[GameManager] HQ platziert bei (8, 8)`
- `[Placement] gold_mine platziert bei (12, 8)`
- `[Resources] Gold: 300 | Holz: 200 | Stein: 0`

## Koordinatensystem

- **XZ-Ebene** (Unity-Standard): Insel liegt flach, Y = Höhe
- Raster-Ursprung `gridOrigin` = Weltposition der Zelle `(0, 0)`
- Mehrzellige Gebäude (HQ 4×4): alle Zellen werden in der Belegungskarte markiert

## Nächste Schritte

Siehe `NEXT_STEPS.md` und `docs/CONCEPT.md`.
