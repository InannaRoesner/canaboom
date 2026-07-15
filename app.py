"""CanaBoom — FINIX.AI Weltraum-Strategie."""

from __future__ import annotations

import json
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).resolve().parent / ".env")

from game.config import (  # noqa: E402
    AI_MODEL,
    AI_PROVIDER,
    APP_NAME,
    BASE_URL,
    LEGAL_ADDRESS,
    LEGAL_BRAND,
    LEGAL_EMAIL,
    LEGAL_FOUNDER,
    ai_available,
)
from game.ai_engine import generate_combat_commentary, generate_dialog, generate_tutorial_steps
from game.combat import simulate_attack, simulate_raid
from game.dialog import get_bark, get_crew, get_tutorial, load_dialog
from game.matchmaking import compute_power_score, find_opponent
from game.world import get_buildings, get_planets, get_troops, load_world

ROOT = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(ROOT / "templates"))

app = FastAPI(
    title=APP_NAME,
    description="Kostenloses Sonnensystem-Strategiespiel — Grow-HQ, Blüten und Dünger.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=str(ROOT / "static")), name="static")


def _ctx(request: Request, **extra) -> dict:
    return {
        "request": request,
        "app_name": APP_NAME,
        "founder": LEGAL_FOUNDER,
        "email": LEGAL_EMAIL,
        "address": LEGAL_ADDRESS,
        "brand": LEGAL_BRAND,
        "free_to_play": True,
        **extra,
    }


class BarkRequest(BaseModel):
    trigger: str
    context: str = Field(default="", max_length=500)


class AiDialogRequest(BaseModel):
    trigger: str = Field(default="idle", max_length=64)
    context: str = Field(default="", max_length=500)
    player_name: str = Field(default="Kommandant", max_length=64)


class CombatRequest(BaseModel):
    weapon: str = Field(default="plasma_thrower")
    target_building: str = Field(default="gewaechshaus")
    target_x: float = 0.0
    target_z: float = 0.0


class RaidRequest(BaseModel):
    troops: list[dict] = Field(default_factory=list)


class MatchmakingRequest(BaseModel):
    hq_level: int = Field(default=1, ge=1, le=30)
    troop_count: int = Field(default=0, ge=0)
    building_count: int = Field(default=0, ge=0)
    planet_id: str = Field(default="earth")


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "app": APP_NAME,
        "ai_engine": ai_available(),
        "ai_provider": AI_PROVIDER,
        "ai_model": AI_MODEL,
        "base_url": BASE_URL,
    }


@app.get("/play", response_class=HTMLResponse)
def play_page(request: Request) -> HTMLResponse:
    world = load_world()
    return templates.TemplateResponse(
        request,
        "play.html",
        context=_ctx(request, world=world, world_json=json.dumps(world, ensure_ascii=False)),
    )


@app.get("/", response_class=HTMLResponse)
def home(request: Request) -> HTMLResponse:
    world = load_world()
    return templates.TemplateResponse(
        request,
        "index.html",
        context=_ctx(request, world=world, world_json=json.dumps(world, ensure_ascii=False)),
    )


@app.get("/shop", response_class=HTMLResponse)
def shop_page(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(request, "shop.html", context=_ctx(request))


@app.get("/impressum", response_class=HTMLResponse)
def impressum(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(request, "impressum.html", context=_ctx(request))


@app.get("/datenschutz", response_class=HTMLResponse)
def datenschutz(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(request, "datenschutz.html", context=_ctx(request))


# --- Game API ---

@app.get("/api/v1/world")
def api_world() -> dict:
    return load_world()


@app.get("/api/v1/planets")
def api_planets() -> list:
    return get_planets()


@app.get("/api/v1/buildings")
def api_buildings() -> list:
    return get_buildings()


@app.get("/api/v1/troops")
def api_troops() -> list:
    return get_troops()


@app.get("/api/v1/dialog/tutorial")
def api_tutorial() -> list:
    return get_tutorial()


@app.get("/api/v1/dialog/crew")
def api_crew() -> list:
    return get_crew()


@app.post("/api/v1/dialog/bark")
def api_bark(payload: BarkRequest) -> dict:
    line = generate_dialog(payload.trigger, context=payload.context)
    if line.get("line"):
        return line
    bark = get_bark(payload.trigger)
    if not bark:
        raise HTTPException(404, "Kein Dialog für diesen Trigger.")
    return bark


# --- KI-Engine ---

@app.get("/api/v1/ai/status")
def api_ai_status() -> dict:
    return {
        "available": ai_available(),
        "provider": AI_PROVIDER,
        "model": AI_MODEL,
        "mode": "llm" if AI_PROVIDER != "local" else "local_fallback",
    }


@app.post("/api/v1/ai/dialog")
def api_ai_dialog(payload: AiDialogRequest) -> dict:
    return generate_dialog(payload.trigger, context=payload.context)


@app.get("/api/v1/ai/tutorial")
def api_ai_tutorial(player_name: str = "Kommandant") -> list:
    return generate_tutorial_steps(player_name)


@app.post("/api/v1/ai/combat-commentary")
def api_combat_commentary(payload: dict) -> dict:
    return generate_combat_commentary(
        payload.get("event", "hit"),
        damage=float(payload.get("damage", 0)),
        building=payload.get("building", ""),
    )


# --- Kampf & 3D-Effekte ---

@app.post("/api/v1/combat/attack")
def api_combat_attack(payload: CombatRequest) -> dict:
    return simulate_attack(
        weapon=payload.weapon,
        target_building=payload.target_building,
        target_x=payload.target_x,
        target_z=payload.target_z,
    )


@app.post("/api/v1/combat/raid")
def api_combat_raid(payload: RaidRequest) -> dict:
    troops = payload.troops or [
        {"id": "plasma_werfer", "weapon": "plasma_thrower"},
        {"id": "flammen_rakete", "weapon": "flame_rocket"},
    ]
    return simulate_raid(troops)


# --- Fair-Play Matchmaking ---

@app.post("/api/v1/matchmaking/power")
def api_matchmaking_power(payload: MatchmakingRequest) -> dict:
    return compute_power_score(
        hq_level=payload.hq_level,
        troop_count=payload.troop_count,
        building_count=payload.building_count,
    )


@app.post("/api/v1/matchmaking/find")
def api_matchmaking_find(payload: MatchmakingRequest) -> dict:
    power = compute_power_score(
        hq_level=payload.hq_level,
        troop_count=payload.troop_count,
        building_count=payload.building_count,
    )
    return find_opponent(power["power_score"], planet_id=payload.planet_id)


