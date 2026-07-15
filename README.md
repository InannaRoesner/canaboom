# CanaBoom

**FINIX.AI** — Kostenloses 3D-Mobile-Strategiespiel (iOS & Android) mit Boom-Beach-Mechanik im intergalaktischen Grow-Setting.

Eigenständiges Projekt — **unabhängig von NanoBanane3**.

## Projektstruktur

```
canaboom/                          # (= CanaBoom auf Windows)
├── mobile/                        # Expo React Native — schneller Prototyp (iOS & Android)
├── unity-boombeach-starter/       # Unity C# — nativer Boom-Beach-Client (Grid, Ressourcen, Gebäude)
│   └── Assets/Scripts/            # ResourceController, GridSystem, BuildingPlacementController …
├── app.py                         # FastAPI Mobile-Backend
├── game/                          # KI-Engine, Kampf und Matchmaking
├── data/                          # Welt, Karten und Dialog
└── render.yaml                    # Backend-Deploy auf Render
```

### Mobile vs. Unity

| Pfad | Rolle |
|------|-------|
| `mobile/` | **Expo-Prototyp** — React Native, Three.js, isometrische Basis, Weltkarte, UI-Flows. Teilt Konzept und Backend-API mit Unity. |
| `unity-boombeach-starter/` | **Unity-Starter** — C#-Skripte für den nativen Client: Raster (`GridSystem`), Touch-Platzierung (`BuildingPlacementController`), Wirtschaft (`ResourceController`). Kein vollständiges Unity-Projekt — Skripte in ein neues URP-Projekt kopieren (siehe `unity-boombeach-starter/README.md`). |

Beide Clients nutzen dasselbe Spielkonzept (Gold, Holz, HQ, Insel-Basis). Geheimnisse (API-Keys, Stripe) liegen nur in `.env` am Repo-Root — **niemals committen**. Mobile liest `EXPO_PUBLIC_*` zur Laufzeit; Unity hat derzeit keine Backend-Anbindung.

Details: `unity-boombeach-starter/docs/CONCEPT.md`

## Schnellstart

### Backend

```bash
cd canaboom
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8080
```

### Mobile

```bash
cd mobile
npm install
set EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
npx expo start
```

## GitHub

```bash
git add .
git commit -m "CanaBoom: 3D mobile iOS/Android + FastAPI backend"
git push -u origin main
```
