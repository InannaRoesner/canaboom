# Boom Beach – Technische Notizen

Kurze Recherche, wie Supercells **Boom Beach** technisch aufgebaut ist – relevant für unsere isometrische 3D-Heimatbasis.

## Engine

| Aspekt | Details |
|--------|---------|
| **Engine** | **Titan** – proprietäre Cross-Platform-Engine von Supercell |
| **Rendering-Stack** | **THOR** (Low-Level-Grafik über Metal/Vulkan/OpenGL), darauf **ODIN** (multithreaded Scene-Rendering) |
| **Client** | Objective-C + **C++** (Performance-kritisch: Rendering, Pathfinding, Physik) |
| **Server** | Java + Rust, AWS (EC2, Kinesis, …) |
| **Plattformen** | iOS, Android, macOS, Windows – eine Engine für alle Supercell-Titel |

Quellen: [Supercell – Titan Engine](https://supercell.com/en/news/game-engine-called-titan/), [MacSources – Clash of Clans Tech](https://macsources.com/the-technology-behind-clash-of-clans/)

## 2D vs. Echtzeit-3D

Supercell nutzt **zwei unterschiedliche Grafik-Pipelines**:

1. **Clash of Clans / Hay Day** – sehen 3D aus, sind aber **2D**: 3D-Modelle werden offline gerendert und als **Sprite-Atlanten** (Texture Sheets) ausgeliefert. Spart Performance und Download-Größe.
2. **Boom Beach (2014)** – Supercells **erstes echtes Echtzeit-3D-Spiel**. Vollständige 3D-Szene mit animierten Einheiten, Gebäuden und Wasser-Mesh.

Early-Beta-Analyse (2013): Wasser = großes Mesh mit Wellen-Oszillation; Bäume/Felsen teils schwächer als Wasser. Kein Unity – definitiv Titan.

Quelle: [Both Guns Blazing – Beta Deconstruction](https://bothgunsblazingblog.wordpress.com/2013/11/16/boom-beach-beta-deconstruction/)

## Kamera

- **Isometrische „Eagle-Eye“-Perspektive** – klassische Strategie-Ansicht von schräg oben.
- Technisch: **OrthographicCamera** (keine Perspektiv-Verkürzung).
- Standard-Isometrie-Winkel:
  - **Yaw (Rotation um Y):** 45°
  - **Pitch (Neigung):** ~35,264° = `arctan(1/√2)` („Magic Angle“)
- Ergebnis: Alle drei Achsen gleich stark verkürzt (echte Isometrie, nicht 2:1-Dimetrie).

Referenz: [GameDev StackExchange – Isometric projection](https://gamedev.stackexchange.com/questions/74782/rendering-models-in-isometric-view)

## Art-Pipeline

- 3D-Modelle in DCC-Tools (Maya o.ä.) → Echtzeit-Rendering in Titan
- **Stylized PBR-ähnlich**: handgemalte Texturen, starke Silhouetten, AO/Contact Shadows
- Gebäude: klare Lesbarkeit bei kleiner Bildschirmgröße (Mobile-First)
- Wasser: animiertes Shader-Mesh, Reflexionen, Schaum an der Küste

## Was wir daraus für Canaboom übernehmen

| Boom Beach | Canaboom (Expo SDK 54) |
|------------|------------------------|
| Titan + THOR | `expo-gl` + **three.js** (ohne R3F/expo-three wegen Peer-Konflikten) |
| Orthographic isometric camera | `THREE.OrthographicCamera` @ 45° / 35,264° |
| Echtzeit-3D-Insel | Einfache Meshes aus Grid-State |
| Galaxy/Lila-Ozean (unser Twist) | `ocean_bloom_seamless.png` als Plane-Textur |
| RN UI Overlays | Ressourcen-Leiste, Build-Menü, Harbor bleiben native Views |

## Fallback-Strategie

Expo Go + `expo-gl` kann auf Emulatoren/Simulator scheitern. Deshalb: bei GL-Fehler automatisch auf `GalaxyWaterEffects` (2D-Shader-Look) zurückfallen.
