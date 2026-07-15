# CanaBoom — Render Deploy

## 1-Klick Blueprint (nach GitHub-Push)

Öffne im Browser (Render-Login erforderlich):

**https://dashboard.render.com/blueprint/new**

- Repository: `InannaRoesner/canaboom`
- Branch: `main`
- Blueprint Path: `render.yaml`
- Klicke **Deploy Blueprint**

Alternativ:

**https://render.com/deploy?repo=https://github.com/InannaRoesner/canaboom**

## Env-Variablen in Render setzen

Nach dem Deploy unter **canaboom → Environment**:

| Variable | Wert |
|----------|------|
| `BASE_URL` | `https://canaboom.onrender.com` (oder deine Render-URL) |

## Testen

```bash
curl https://canaboom.onrender.com/health
```

Erwartung: `{"status":"ok","app":"CanaBoom",...}`

## Mobile App → Production API

```powershell
$env:EXPO_PUBLIC_API_URL="https://canaboom.onrender.com"
cd mobile
npx expo start
```
