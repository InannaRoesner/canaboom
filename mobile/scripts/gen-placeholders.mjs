/**
 * Generates placeholder PNG sprites + ocean texture for CanaBoom.
 * Run: node scripts/gen-placeholders.mjs
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function writePng(filePath, width, height, rgbaFn) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = rgbaFn(x, y, width, height);
      const i = row + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, png);
}

function isoDiamond(x, y, w, h, cx, cy, rw, rh) {
  const nx = Math.abs(x - cx) / rw + Math.abs(y - cy) / rh;
  return nx <= 1;
}

function buildingSprite([r, g, b], label) {
  return (x, y, w, h) => {
    const cx = w / 2;
    const cy = h * 0.58;
    const onBase = isoDiamond(x, y, w, h, cx, cy, w * 0.38, h * 0.14);
    const onBody = isoDiamond(x, y, w, h, cx, cy - h * 0.12, w * 0.28, h * 0.22);
    const onRoof = isoDiamond(x, y, w, h, cx, cy - h * 0.28, w * 0.18, h * 0.12);
    if (onRoof) return [Math.min(255, r + 40), Math.min(255, g + 40), Math.min(255, b + 40), 255];
    if (onBody) return [r, g, b, 255];
    if (onBase) return [Math.max(0, r - 30), Math.max(0, g - 30), Math.max(0, b - 30), 255];
    if (y > h * 0.72 && Math.abs(x - cx) < w * 0.35) return [0, 0, 0, 60];
    return [0, 0, 0, 0];
  };
}

function unitSprite([r, g, b]) {
  return (x, y, w, h) => {
    const cx = w / 2;
    const cy = h * 0.55;
    const body = (x - cx) ** 2 / (w * 0.08) ** 2 + (y - cy) ** 2 / (h * 0.22) ** 2 <= 1;
    const head = (x - cx) ** 2 / (w * 0.06) ** 2 + (y - (cy - h * 0.22)) ** 2 / (h * 0.08) ** 2 <= 1;
    if (head) return [255, 220, 180, 255];
    if (body) return [r, g, b, 255];
    if (y > h * 0.78 && Math.abs(x - cx) < w * 0.2) return [0, 0, 0, 50];
    return [0, 0, 0, 0];
  };
}

const buildings = {
  hq_main: [120, 90, 60],
  troop_tent: [180, 120, 70],
  gold_mine: [220, 180, 40],
  rocket_launcher: [100, 110, 130],
  bunker: [90, 95, 100],
  radar: [70, 130, 180],
  sawmill: [160, 110, 60],
  stone_quarry: [140, 140, 150],
  landing_craft: [80, 100, 140],
  pier: [100, 80, 60],
};

const units = {
  cyber_infanterist: [60, 180, 120],
  rifleman: [80, 140, 90],
  heavy_gunner: [110, 80, 70],
};

for (const [id, color] of Object.entries(buildings)) {
  writePng(
    path.join(root, 'assets/images/sprites/buildings', `${id}.png`),
    128,
    160,
    buildingSprite(color, id),
  );
}

for (const [id, color] of Object.entries(units)) {
  writePng(
    path.join(root, 'assets/images/sprites/units', `${id}.png`),
    96,
    128,
    unitSprite(color),
  );
}

writePng(path.join(root, 'assets/images/base/ocean_bloom_seamless.png'), 256, 256, (x, y) => {
  const wave = Math.sin(x * 0.08) * Math.cos(y * 0.06);
  const r = Math.floor(90 + wave * 20);
  const g = Math.floor(40 + wave * 15);
  const b = Math.floor(160 + wave * 30);
  return [r, g, b, 255];
});

writePng(path.join(root, 'assets/icon.png'), 64, 64, (x, y, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  const d = Math.abs(x - cx) + Math.abs(y - cy);
  if (d < w * 0.35) return [140, 90, 255, 255];
  return [9, 5, 45, 255];
});

console.log('Generated placeholder sprites + ocean texture.');
