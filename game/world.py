"""Spielwelt — Sonnensystem, Gebäude, Truppen."""

from __future__ import annotations

import json
from pathlib import Path

from game.config import DATA_DIR


def load_world() -> dict:
    return json.loads((DATA_DIR / "world.json").read_text(encoding="utf-8"))


def get_planets() -> list[dict]:
    return load_world()["planets"]


def get_buildings() -> list[dict]:
    return load_world()["buildings"]


def get_troops() -> list[dict]:
    return load_world()["troops"]
