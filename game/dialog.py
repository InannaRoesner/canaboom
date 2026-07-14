"""Alien-Crew Dialog — Tutorial & Zwischenrufe."""

from __future__ import annotations

import json
from pathlib import Path

from game.config import DATA_DIR


def load_dialog() -> dict:
    return json.loads((DATA_DIR / "dialog.json").read_text(encoding="utf-8"))


def get_tutorial() -> list[dict]:
    return load_dialog()["tutorial"]


def get_bark(trigger: str) -> dict | None:
    for bark in load_dialog()["barks"]:
        if bark["trigger"] == trigger:
            return bark
    return None


def get_crew() -> list[dict]:
    return load_dialog()["crew"]
