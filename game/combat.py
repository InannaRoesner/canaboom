"""Kampfsimulation — Feuer/Plasma-Schaden & Partikel-Daten für 3D-Client."""

from __future__ import annotations

import random
from typing import Any


WEAPON_PROFILES = {
    "plasma_thrower": {
        "damage_min": 18,
        "damage_max": 32,
        "fire_spread": 0.4,
        "particle_count": 45,
        "color": "#ff6b35",
        "burn_duration_ms": 2200,
    },
    "flame_rocket": {
        "damage_min": 55,
        "damage_max": 95,
        "fire_spread": 1.2,
        "particle_count": 120,
        "color": "#ff4500",
        "burn_duration_ms": 4500,
    },
    "orbit_fire_salvo": {
        "damage_min": 70,
        "damage_max": 110,
        "fire_spread": 1.5,
        "particle_count": 150,
        "color": "#ff4500",
        "burn_duration_ms": 5000,
    },
    "orbit_laser_salvo": {
        "damage_min": 45,
        "damage_max": 75,
        "fire_spread": 0.8,
        "particle_count": 90,
        "color": "#3b82f6",
        "burn_duration_ms": 3200,
    },
}


def simulate_attack(
    *,
    weapon: str = "plasma_thrower",
    target_building: str = "gewaechshaus",
    target_x: float = 0.0,
    target_z: float = 0.0,
) -> dict[str, Any]:
    profile = WEAPON_PROFILES.get(weapon, WEAPON_PROFILES["plasma_thrower"])
    damage = random.uniform(profile["damage_min"], profile["damage_max"])
    spread = profile["fire_spread"]

    particles = []
    count = profile["particle_count"]
    for _ in range(count):
        particles.append({
            "x": target_x + random.uniform(-spread, spread),
            "y": random.uniform(0.2, 2.5),
            "z": target_z + random.uniform(-spread, spread),
            "vx": random.uniform(-0.8, 0.8),
            "vy": random.uniform(0.5, 2.2),
            "vz": random.uniform(-0.8, 0.8),
            "life": random.uniform(0.4, 1.0),
            "size": random.uniform(0.05, 0.18),
            "color": profile["color"],
        })

    return {
        "weapon": weapon,
        "target_building": target_building,
        "damage": round(damage, 1),
        "fire": {
            "intensity": min(1.0, damage / 100),
            "burn_duration_ms": profile["burn_duration_ms"],
            "particles": particles,
            "origin": {"x": target_x, "y": 0.5, "z": target_z},
        },
        "effects": ["smoke", "ember", "heat_distortion"],
    }


def simulate_raid(
    troops: list[dict],
    *,
    base_layout: list[dict] | None = None,
) -> dict[str, Any]:
    """Simuliert einen Angriff mit mehreren Truppen — liefert Events für 3D + KI."""
    base_layout = base_layout or [
        {"id": "gewaechshaus", "x": -2, "z": 1},
        {"id": "bewaesserung", "x": 0, "z": -1},
        {"id": "grow_hq", "x": 2, "z": 0},
    ]
    events = []
    total_damage = 0.0
    destroyed = []

    for troop in troops:
        weapon = troop.get("weapon", "plasma_thrower")
        target = random.choice(base_layout)
        hit = simulate_attack(
            weapon=weapon,
            target_building=target["id"],
            target_x=target.get("x", 0),
            target_z=target.get("z", 0),
        )
        total_damage += hit["damage"]
        events.append({"troop": troop.get("id", "unit"), **hit})
        if hit["damage"] > 70 and target["id"] not in destroyed:
            destroyed.append(target["id"])

    victory = len(destroyed) >= 1 or total_damage > 150
    return {
        "events": events,
        "total_damage": round(total_damage, 1),
        "destroyed_buildings": destroyed,
        "victory": victory,
    }
