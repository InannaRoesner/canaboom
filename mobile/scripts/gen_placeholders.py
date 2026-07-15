"""Generate placeholder PNG sprites for CanaBoom. Run: py scripts/gen_placeholders.py"""
from __future__ import annotations

import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def crc32(data: bytes) -> int:
    return zlib.crc32(data) & 0xFFFFFFFF


def chunk(tag: bytes, data: bytes) -> bytes:
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc32(tag + data))


def write_png(path: Path, width: int, height: int, rgba_fn) -> None:
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        for x in range(width):
            r, g, b, a = rgba_fn(x, y, width, height)
            raw.extend((r, g, b, a))

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(png)


def iso_diamond(x, y, cx, cy, rw, rh) -> bool:
    return abs(x - cx) / rw + abs(y - cy) / rh <= 1


def building_sprite(rgb):
    r, g, b = rgb

    def fn(x, y, w, h):
        cx, cy = w / 2, h * 0.58
        if iso_diamond(x, y, cx, cy - h * 0.28, w * 0.18, h * 0.12):
            return min(255, r + 40), min(255, g + 40), min(255, b + 40), 255
        if iso_diamond(x, y, cx, cy - h * 0.12, w * 0.28, h * 0.22):
            return r, g, b, 255
        if iso_diamond(x, y, cx, cy, w * 0.38, h * 0.14):
            return max(0, r - 30), max(0, g - 30), max(0, b - 30), 255
        if y > h * 0.72 and abs(x - cx) < w * 0.35:
            return 0, 0, 0, 60
        return 0, 0, 0, 0

    return fn


def unit_sprite(rgb):
    r, g, b = rgb

    def fn(x, y, w, h):
        cx, cy = w / 2, h * 0.55
        if ((x - cx) ** 2) / (w * 0.06) ** 2 + ((y - (cy - h * 0.22)) ** 2) / (h * 0.08) ** 2 <= 1:
            return 255, 220, 180, 255
        if ((x - cx) ** 2) / (w * 0.08) ** 2 + ((y - cy) ** 2) / (h * 0.22) ** 2 <= 1:
            return r, g, b, 255
        if y > h * 0.78 and abs(x - cx) < w * 0.2:
            return 0, 0, 0, 50
        return 0, 0, 0, 0

    return fn


BUILDINGS = {
    "hq_main": (120, 90, 60),
    "troop_tent": (180, 120, 70),
    "gold_mine": (220, 180, 40),
    "rocket_launcher": (100, 110, 130),
    "bunker": (90, 95, 100),
    "radar": (70, 130, 180),
    "sawmill": (160, 110, 60),
    "stone_quarry": (140, 140, 150),
    "landing_craft": (80, 100, 140),
    "pier": (100, 80, 60),
}

UNITS = {
    "cyber_infanterist": (60, 180, 120),
    "rifleman": (80, 140, 90),
    "heavy_gunner": (110, 80, 70),
}


def main() -> None:
    for name, color in BUILDINGS.items():
        write_png(
            ROOT / "assets/images/sprites/buildings" / f"{name}.png",
            128,
            160,
            building_sprite(color),
        )
    for name, color in UNITS.items():
        write_png(
            ROOT / "assets/images/sprites/units" / f"{name}.png",
            96,
            128,
            unit_sprite(color),
        )

    write_png(
        ROOT / "assets/images/base/ocean_bloom_seamless.png",
        256,
        256,
        lambda x, y, w, h: (
            int(90 + __import__("math").sin(x * 0.08) * __import__("math").cos(y * 0.06) * 20),
            int(40 + __import__("math").sin(x * 0.08) * __import__("math").cos(y * 0.06) * 15),
            int(160 + __import__("math").sin(x * 0.08) * __import__("math").cos(y * 0.06) * 30),
            255,
        ),
    )
    write_png(
        ROOT / "assets/icon.png",
        64,
        64,
        lambda x, y, w, h: (140, 90, 255, 255) if abs(x - w / 2) + abs(y - h / 2) < w * 0.35 else (9, 5, 45, 255),
    )
    print("Generated placeholder sprites + ocean texture.")


if __name__ == "__main__":
    main()
