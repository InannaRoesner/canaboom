"""CanaBoom — Konfiguration."""

from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"


def _env(key: str, default: str = "") -> str:
    return os.environ.get(key, default).strip().strip('"').strip("'")


APP_NAME = _env("APP_NAME", "CanaBoom")
BASE_URL = _env("BASE_URL", "http://127.0.0.1:8080")
STRIPE_PUBLISHABLE_KEY = _env("STRIPE_PUBLISHABLE_KEY")
STRIPE_SECRET_KEY = _env("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = _env("STRIPE_WEBHOOK_SECRET")
STRIPE_SUCCESS_URL = _env("STRIPE_SUCCESS_URL", f"{BASE_URL}/shop/success?session_id={{CHECKOUT_SESSION_ID}}")
STRIPE_CANCEL_URL = _env("STRIPE_CANCEL_URL", f"{BASE_URL}/shop")

LEGAL_FOUNDER = _env("LEGAL_FOUNDER", "Inanna Roesner")
LEGAL_EMAIL = _env("LEGAL_EMAIL", "inannaroesner07@gmail.com")
LEGAL_ADDRESS = _env("LEGAL_ADDRESS", "Hauptstraße 40, 88677 Markdorf, Deutschland")
LEGAL_BRAND = _env("LEGAL_BRAND", "FINIX.AI / CanaBoom")

# Eingebaute KI (Ollama lokal oder OpenAI-kompatibel)
AI_PROVIDER = _env("AI_PROVIDER", "local")  # local | ollama | openai | openrouter | custom
AI_BASE_URL = _env("AI_BASE_URL", "http://127.0.0.1:11434")
AI_MODEL = _env("AI_MODEL", "llama3.2")
AI_API_KEY = _env("AI_API_KEY") or _env("OPENAI_API_KEY")


def ai_available() -> bool:
    if AI_PROVIDER == "local":
        return True
    if AI_PROVIDER == "ollama":
        return bool(AI_BASE_URL)
    return bool(AI_API_KEY and AI_BASE_URL)


def stripe_configured() -> bool:
    k = STRIPE_SECRET_KEY
    return k.startswith(("sk_test_", "sk_live_")) and len(k) > 20
