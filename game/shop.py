"""In-App-Shop — Boom-Beach-Preisstufen."""

from __future__ import annotations

import json
from pathlib import Path

from game.config import DATA_DIR


def load_shop() -> dict:
    return json.loads((DATA_DIR / "shop_packages.json").read_text(encoding="utf-8"))


def find_package(package_id: str) -> tuple[str, dict] | None:
    shop = load_shop()
    for category, items in shop["packages"].items():
        for item in items:
            if item["id"] == package_id:
                return category, item
    return None


def list_all_packages() -> list[dict]:
    shop = load_shop()
    out: list[dict] = []
    for category, items in shop["packages"].items():
        for item in items:
            out.append({**item, "category": category})
    return out
