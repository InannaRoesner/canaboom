# Nächste Schritte

Kurze Roadmap nach dem Starter-Setup.

## 1. Kamera & UX
- Smooth Pan/Zoom (Pinch auf Mobile, Scroll im Editor)
- Kamera-Grenzen an Insel-Rand koppeln
- Gebäude-Rotation beim Platzieren (Q/E oder zwei Finger)

## 2. Art & Assets
- Echte Meshes oder Billboard-Sprites für HQ, Goldmine, Turm
- Insel-Mesh mit Sand/Küste statt Plane
- Partikeleffekte beim Platzieren und Zerstören

## 3. Save System
- `PlayerPrefs` → JSON-Datei oder Cloud Save
- Gebäude-Positionen, Level, Ressourcen speichern/laden
- Offline-Produktion berechnen (Zeit seit letztem Login)

## 4. Kampf & Raids
- Truppen spawnen vom Landungsboot
- `DefenseTower.Attack()` mit Ziel-Priorität
- HQ-Zerstörung = Sieg/Niederlage
- Loot-Berechnung nach Raid

## 5. Weltkarte
- Sector-Map mit freischaltbaren Inseln
- Reisekosten (Gold als „Treibstoff“)
- NPC-Basen mit generiertem Layout

## 6. Wirtschaft & Progression
- Bau-Menü mit HQ-Freischaltungen
- Upgrade-Timer und Bauqueues
- Stein als dritte Ressource aktivieren

## 7. Mobile Polish
- Haptic Feedback bei Platzierung
- UI-Leiste für Gold/Holz
- Build-Modus-Button statt `startInPlacementMode`
