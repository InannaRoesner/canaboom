# Spielkonzept — Canaboom (Unity-Starter)

## Vision

Ein mobiles Strategiespiel im Stil von **Boom Beach**: Der Spieler baut auf einer tropischen Insel ein Hauptquartier (HQ), sammelt Ressourcen (Gold, Holz — später Stein), errichtet Verteidigungen und erobert später andere Inseln auf einer Weltkarte.

Dieser Unity-Starter ist bewusst **minimal** — er liefert Raster, Ressourcen, Gebäude-Basisklassen und Touch-Platzierung. Die Expo-App unter `canaboom/mobile` bleibt ein separates React-Native-Prototyp.

## Kern-Gameplay (MVP)

| Element | Beschreibung |
|---------|--------------|
| **Insel-Basis** | Flache Insel auf der XZ-Ebene, isometrische Kamera |
| **HQ** | Herzstück, 4×4 Zellen, bestimmt Freischalt-Stufe |
| **Ressourcen** | Gold + Holz mit passivem Einkommen von Produktionsgebäuden |
| **Verteidigung** | Türme mit Reichweite und Schaden (Stub) |
| **Platzierung** | Touch/Maus mit Ghost-Vorschau (grün/rot) |
| **Weltkarte** | Später — Reisen zu NPC-Inseln, Raids |

## Architektur-Überblick

```
┌─────────────────────────────────────────────────────┐
│                   GameManager                       │
│  Start-HQ · Ressourcen-Log · Platzierungs-API       │
└──────────┬──────────────────────┬─────────────────┘
           │                      │
┌──────────▼──────────┐  ┌────────▼────────────────────┐
│    GridSystem       │  │  BuildingPlacementController │
│  Belegungskarte     │◄─┤  Touch/Maus · Ghost · Snap   │
│  Grid↔Welt          │  └─────────────────────────────┘
└──────────┬──────────┘
           │
┌──────────▼──────────┐  ┌─────────────────────────────┐
│  Building (Basis)   │  │      ResourceSystem          │
│  HQ · Turm · Mine   │  │  Gold/Wood · PlayerPrefs     │
└─────────────────────┘  └─────────────────────────────┘
```

### Namespaces

- `Canaboom.Grid` — Raster, Platzierung, Ghost
- `Canaboom.Resources` — Wirtschaft
- `Canaboom.Buildings` — Gebäude-Hierarchie
- `Canaboom.Core` — GameManager

### Koordinatensystem

- **XZ-Ebene** (Y = Höhe) — Unity-3D-Standard
- Isometrisches Diamant-Raster *oder* orthogonales Raster (umschaltbar im Inspector)
- `GridSystem.GridToWorld()` / `WorldToGrid()` für alle Conversions

## Enthaltene Systeme

### GridSystem
- Belegungskarte (`Dictionary<Vector2Int, Building>`)
- `CanPlace`, `PlaceBuilding`, `RemoveBuilding`, `IsCellOccupied`
- Mehrzellige Gebäude (2×2, 4×4)

### BuildingPlacementController
- Raycast von Kamera durch Touch/Maus auf Insel-Collider
- Ghost mit `PlacementGhostView` (grün/rot)
- Snap auf Raster, Bestätigung beim Loslassen

### ResourceSystem
- `AddResource`, `SpendResource`, `CanAfford`
- Produktions-Tick alle 1 Sekunde
- Optionale `PlayerPrefs`-Persistenz

### Gebäude-Hierarchie
- `Building` — Basis mit Kosten, HP, Produktion
- `Headquarters` — Freischalt-Stufe, Verlustbedingung
- `DefenseTower` — `Attack()`-Stub mit Reichweite

## Unity Hub — Projekt öffnen

1. **Unity Hub** → **New Project** → Template **3D (URP)**
2. Name z. B. `CanaboomUnity`, Editor **2022.3 LTS** oder **6000 LTS**
3. Ordner `canaboom/unity-boombeach-starter/Assets/Scripts/` nach `Assets/Scripts/` kopieren
4. Szene nach `README.md` aufbauen
5. Play drücken und Gebäude per Maus/Touch platzieren

## Abgrenzung zu canaboom/mobile

| | Unity-Starter | Expo mobile |
|--|---------------|-------------|
| Plattform | Unity (C#) | React Native / Expo |
| Rendering | 3D/URP, Meshes | 2D/Three.js-Sprites |
| Ziel | Produktions-Spielengine | Schneller UI-Prototyp |
| Geteilt | Spielkonzept, Gebäude-Namen | — |

Beide Projekte können parallel existieren; Gameplay-Design-Entscheidungen sollten in `docs/CONCEPT.md` gepflegt werden.
