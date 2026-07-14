# CanaBoom

**FINIX.AI** — Kostenloses 3D-Mobile-Strategiespiel (iOS & Android) mit Boom-Beach-Mechanik im intergalaktischen Grow-Setting.

Eigenständiges Projekt — **unabhängig von NanoBanane3**.

## Projektstruktur

```
canaboom/                 # (= CanaBoom auf Windows)
├── mobile/               # Expo React Native App (iOS & Android)
├── app.py                # FastAPI Mobile-Backend
├── game/                 # KI-Engine, Kampf, Matchmaking, Stripe
├── data/                 # Welt, Shop (BB-Preise), Dialog
└── render.yaml           # Backend-Deploy auf Render
```

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
