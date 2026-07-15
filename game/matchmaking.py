"""Fair-Play-Matchmaking — Boom-Beach-ähnliche Gegnersuche."""

from __future__ import annotations

import json
import random
from pathlib import Path

from game.config import DATA_DIR

MATCH_FILE = DATA_DIR / "matchmaking.json"


def _load_rules() -> dict:
    if MATCH_FILE.exists():
        return json.loads(MATCH_FILE.read_text(encoding="utf-8"))
    return {
        "vp_range": 40,
        "hq_weight": 120,
        "troop_weight": 15,
        "building_weight": 8,
    }


def compute_power_score(
    *,
    hq_level: int = 1,
    troop_count: int = 0,
    building_count: int = 0,
) -> dict:
    """Berechnet die Matchmaking-Stärke (Victory Points / Power)."""
    rules = _load_rules()
    score = (
        hq_level * rules["hq_weight"]
        + troop_count * rules["troop_weight"]
        + building_count * rules["building_weight"]
    )
    return {
        "power_score": score,
        "hq_level": hq_level,
        "troop_count": troop_count,
        "building_count": building_count,
        "fair_play": True,
    }


def find_opponent(
    player_power: int,
    *,
    planet_id: str = "earth",
) -> dict:
    """Findet einen Gegner innerhalb der VP-Range — simuliert für Prototyp."""
    rules = _load_rules()
    spread = rules["vp_range"]
    low = max(50, player_power - spread)
    high = player_power + spread

    names = [
        "NebulaGrow_42", "MarsHaze_Clan", "OrbitalBud_X", "VenusVapor_7",
        "CosmicLeaf_99", "RocketEmoji_Fan", "HydroAlien_DE", "PlasmaPirate",
    ]
    opp_power = random.randint(low, high)
    return {
        "opponent_id": f"npc_{random.randint(1000, 9999)}",
        "opponent_name": random.choice(names),
        "opponent_power": opp_power,
        "player_power": player_power,
        "planet_id": planet_id,
        "fair_play": True,
        "match_quality": "balanced" if abs(opp_power - player_power) <= spread // 2 else "wide",
        "note": "Die Suche basiert ausschließlich auf Spielfortschritt.",
    }
