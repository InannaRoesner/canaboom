"""Eingebaute KI-Schnittstelle für Alien-Crew-Dialoge."""

from __future__ import annotations

import json
import random
import re
from typing import Any

import httpx

from game.config import AI_BASE_URL, AI_MODEL, AI_PROVIDER, APP_NAME
from game.dialog import get_crew, load_dialog

ALIEN_PERSONAS = {
    "zorp": "Zorp — verpeilter Navigator, redet in Weltraum-Slang.",
    "mira": "Mira — strenge Taktikerin, trocken und sarkastisch.",
    "blip": "Blip — enthusiastischer Grow-Experte, liebt Neon-Blätter.",
}


def _crew_names() -> list[str]:
    return [c["name"] for c in get_crew()] or list(ALIEN_PERSONAS.keys())


def _fallback_line(trigger: str, context: str = "") -> dict:
    """Lokale Dialog-Engine ohne externes LLM."""
    dialog = load_dialog()
    pool = [b for b in dialog["barks"] if b["trigger"] == trigger]
    if pool:
        pick = random.choice(pool)
        return {"speaker": pick["speaker"], "line": pick["line"], "source": "local_bark"}

    templates = {
        "tutorial": [
            "Willkommen im Sonnensystem! Bau zuerst dein Grow-HQ — ohne HQ kein Dünger, ohne Dünger kein Drama.",
            "Siehst du die Astronauten-Rakete im Orbit? Die ist nicht nur Deko — die bringt deine Truppen auf feindliche Basen.",
            "Plasma-Werfer für Nahkampf, Flammen-Raketen für Spektakel. Beides verbrennt feindliche Gewächshäuser. Wissenschaft!",
        ],
        "attack_start": [
            "Landungsboote starten! Ich hab ein gutes Gefühl — oder Hunger. Eins von beidem.",
            "Feuer frei! Die feindliche Basis sieht aus wie ein überreifes Gewächshaus. Perfekt.",
            "Orbit freigegeben. Raketen emoji-mäßig rot-weiß und bereit zum Abschuss!",
        ],
        "attack_hit": [
            "Treffer! Die Flammen-Partikel rendern sich gerade in Echtzeit — schöner Anblick.",
            "Noch ein Treffer! Die Hydro-Kuppel brennt heller als unsere Marketing-Neonreklame.",
            "Direkt in die Bewässerungsanlage! Das ist kein Bug, das ist Feature.",
        ],
        "victory": [
            "Basis erobert! Blütenregen incoming. Die Crew feiert mit synthetischem Kaffee.",
            "Sieg! Fair Play bestätigt — der Gegner hatte ähnliche HQ-Stärke. Respekt.",
            "Planet gesichert! Nächster Halt: Mars. Pack die Trocknungsräume ein.",
        ],
        "defeat": [
            "Rückzug! Nicht schlimm — Dünger ist für die Seele, nicht nur für Gewächshäuser.",
            "Okay, die haben mehr Flammen-Raketen. Wir upgraden und kommen zurück.",
            "Verloren, aber stylish. Die Raketen-Emoji-Ästhetik war trotzdem on point.",
        ],
        "build": [
            "Neues Gebäude steht! Die neon-leuchtenden Blätter sind rein dekorativ. Oder doch nicht?",
            "Gewächshaus online. Blüten-Produktion startet — die Wirtschaft im All lebt!",
            "Trocknungsraum fertig. Endlich kann Dünger legal im Sonnensystem produziert werden.",
        ],
        "idle": [
            "Alles ruhig im Orbit. Vielleicht kurz das Grow-HQ polieren?",
            "Crew-Check: Alle Aliens verpeilt, alle Systeme nominal. Standard.",
            "Zwischenruf der Crew: Wer hat die Plasma-Werfer wieder auf 'Grill' gestellt?",
        ],
    }
    lines = templates.get(trigger, templates["idle"])
    speaker = random.choice(_crew_names())
    line = random.choice(lines)
    if context:
        line = f"{line} ({context[:80]})"
    return {"speaker": speaker, "line": line, "source": "local_ai"}


def _build_prompt(trigger: str, context: str, extra: dict[str, Any]) -> str:
    crew_desc = "; ".join(f"{c['name']}: {c['role']}" for c in get_crew())
    return (
        f"Du schreibst Dialoge für das 3D-Mobilegame {APP_NAME} (Boom-Beach-Mechanik, "
        f"Weltraum-Grow-Setting). Crew: {crew_desc}. "
        f"Trigger: {trigger}. Kontext: {context or 'keiner'}. "
        f"Zusatz: {json.dumps(extra, ensure_ascii=False)}. "
        "Antworte NUR als JSON: {\"speaker\": \"Name\", \"line\": \"ein witziger Satz auf Deutsch, max 160 Zeichen\"}."
    )


def _parse_llm_json(text: str) -> dict | None:
    text = text.strip()
    match = re.search(r"\{[^{}]*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        data = json.loads(match.group())
        if "line" in data and data["line"]:
            return {
                "speaker": data.get("speaker") or random.choice(_crew_names()),
                "line": str(data["line"])[:200],
                "source": "llm",
            }
    except json.JSONDecodeError:
        return None
    return None


def _call_ollama(prompt: str) -> dict | None:
    url = f"{AI_BASE_URL.rstrip('/')}/api/generate"
    payload = {"model": AI_MODEL, "prompt": prompt, "stream": False, "format": "json"}
    try:
        with httpx.Client(timeout=25.0) as client:
            resp = client.post(url, json=payload)
            resp.raise_for_status()
            body = resp.json()
            return _parse_llm_json(body.get("response", ""))
    except Exception:
        return None


def _call_openai_compatible(prompt: str) -> dict | None:
    from game.config import AI_API_KEY

    if not AI_API_KEY:
        return None
    url = f"{AI_BASE_URL.rstrip('/')}/v1/chat/completions"
    headers = {"Authorization": f"Bearer {AI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": AI_MODEL,
        "messages": [
            {"role": "system", "content": f"Alien-Crew-Dialog für {APP_NAME}. Kurz, witzig, Deutsch."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 120,
        "temperature": 0.9,
    }
    try:
        with httpx.Client(timeout=25.0) as client:
            resp = client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
            return _parse_llm_json(content)
    except Exception:
        return None


def generate_dialog(
    trigger: str,
    *,
    context: str = "",
    extra: dict[str, Any] | None = None,
) -> dict:
    """Dynamischer Alien-Dialog — LLM wenn verfügbar, sonst lokale Engine."""
    extra = extra or {}
    prompt = _build_prompt(trigger, context, extra)

    result: dict | None = None
    if AI_PROVIDER == "ollama":
        result = _call_ollama(prompt)
    elif AI_PROVIDER in ("openai", "openrouter", "custom"):
        result = _call_openai_compatible(prompt)

    if result:
        return result
    return _fallback_line(trigger, context)


def generate_tutorial_steps(player_name: str = "Kommandant") -> list[dict]:
    """Flexibles Tutorial — KI-generiert oder Fallback-Kette."""
    steps = []
    triggers = ["tutorial", "build", "attack_start"]
    for i, trig in enumerate(triggers):
        line = generate_dialog(trig, context=f"Schritt {i + 1} für {player_name}")
        steps.append({**line, "step": i + 1})
    return steps


def generate_combat_commentary(event: str, *, damage: float = 0, building: str = "") -> dict:
    ctx = f"Schaden {damage:.0f} auf {building}" if building else event
    trigger_map = {
        "wave_start": "attack_start",
        "hit": "attack_hit",
        "victory": "victory",
        "defeat": "defeat",
    }
    return generate_dialog(trigger_map.get(event, "attack_hit"), context=ctx, extra={"event": event})
