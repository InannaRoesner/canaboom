# CanaBoom Audio-Assets

Lege die folgenden Dateien in diesen Ordner (`mobile/assets/audio/`):

| Dateiname | Verwendung |
|-----------|------------|
| `rocket_launch.mp3` | Raketen-Start beim Ladescreen / erstem App-Start |
| `space_ambient_loop.mp3` | Entspannte Space-Hintergrundmusik (Loop) |
| `combat_diamond_hit.mp3` | Diamant-Aufprall bei Angriffen (lila/grün) |
| `combat_explosion.mp3` | Kampf-Explosion / Salve |
| `tutorial_alien_blip.mp3` | Tutorial-Alien Sprach-/UI-Blip |
| `npc_gift_collect.mp3` | Marsmensch-Geschenk einsammeln |

Nach dem Hinzufügen der Dateien in `src/audio/sounds.ts` die Zeile
`export const AUDIO_ASSETS_READY = true` setzen.

Empfohlene Formate: MP3 oder M4A, kurz gehalten (< 30 s für SFX, Loop für Musik).
