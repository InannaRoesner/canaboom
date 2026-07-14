"""Stripe Sandbox — IAP Checkout (Testmodus)."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from game.config import (
    APP_NAME,
    DATA_DIR,
    STRIPE_CANCEL_URL,
    STRIPE_SECRET_KEY,
    STRIPE_SUCCESS_URL,
    stripe_configured,
)
from game.shop import find_package

PURCHASE_LOG = DATA_DIR / "purchases.jsonl"


def create_checkout_session(package_id: str, *, player_id: str = "guest") -> dict:
    if not stripe_configured():
        raise RuntimeError("Stripe nicht konfiguriert — STRIPE_SECRET_KEY in .env setzen.")

    found = find_package(package_id)
    if not found:
        raise ValueError(f"Paket '{package_id}' nicht gefunden.")

    category, package = found
    import stripe

    stripe.api_key = STRIPE_SECRET_KEY
    amount_cents = int(round(package["price_eur"] * 100))

    session = stripe.checkout.Session.create(
        mode="payment",
        line_items=[{
            "price_data": {
                "currency": "eur",
                "unit_amount": amount_cents,
                "product_data": {
                    "name": f"{APP_NAME} — {package['name']}",
                    "description": f"In-App-Kauf ({category}) — Sandbox Testmodus",
                },
            },
            "quantity": 1,
        }],
        success_url=STRIPE_SUCCESS_URL,
        cancel_url=STRIPE_CANCEL_URL,
        metadata={
            "app": APP_NAME,
            "package_id": package_id,
            "category": category,
            "player_id": player_id,
            "sandbox": "true",
        },
    )

    _log_purchase({
        "event": "checkout_created",
        "package_id": package_id,
        "session_id": session.id,
        "player_id": player_id,
        "amount_eur": package["price_eur"],
        "ts": datetime.now(timezone.utc).isoformat(),
    })

    return {
        "checkout_url": session.url,
        "session_id": session.id,
        "package_id": package_id,
        "amount_eur": package["price_eur"],
        "sandbox": True,
    }


def _log_purchase(entry: dict) -> None:
    PURCHASE_LOG.parent.mkdir(parents=True, exist_ok=True)
    with PURCHASE_LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
