#!/usr/bin/env node
/**
 * Offline visual check for ZHULONG.
 *
 * There is no browser in the sandbox, so this compiles the real simulation with
 * tsc and re-draws it with @napi-rs/canvas using the same tile rules, the same
 * light-mask plates and the same prop files the Phaser scene uses. If a frame
 * looks wrong here, it looks wrong in the browser.
 *
 *   node scripts/zhulong/preview.mjs
 */
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(tmpdir(), 'zhulong-preview');
const SIM_OUT = path.join(OUT, 'sim');

const VIEW = { w: 1280, h: 720 };
// TILE / ZOOM / band table come from the compiled sim config, never duplicated
// here: a stale copy silently renders the world at the wrong scale.

const T = { AIR: 0, ROCK: 1, DEEP: 2, ORE: 3, RICH: 4, BRAZIER: 5, BEDROCK: 6 };
const C = {
  void: '#05030a', paper: '#e8e3f0', dim: '#7c7893', line: '#2c2540',
  ember: '#ff7a2f', emberHot: '#ffc46b', jade: '#49a8b0', jadeLight: '#9fe3dd',
  gold: '#f7c948', blood: '#9c3540', bloodLight: '#d15c52', tide: '#b02a3c',
  stone: '#8b8aa3',
};
const hexOf = (n) => `#${n.toString(16).padStart(6, '0')}`;

const BAND_FROM = [0, 240, 560, 900, 1180];

function frameAt(time, count) {
  return Math.floor(time * 8) % count;
}

function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return (h ^ (h >>> 16)) >>> 0;
}

function bandIndex(row) {
  let b = 0;
  for (let i = 0; i < BANDS.length; i += 1) if (row >= BANDS[i].from) b = i;
  return b;
}

mkdirSync(SIM_OUT, { recursive: true });
execFileSync(
  'npx',
  ['tsc', 'src/zhulong/sim/config.ts', 'src/zhulong/sim/math.ts', 'src/zhulong/sim/world.ts', 'src/zhulong/sim/look.ts', 'src/zhulong/sim/RunSim.ts',
    '--outDir', SIM_OUT, '--module', 'commonjs', '--target', 'es2022', '--moduleResolution', 'node10', '--skipLibCheck'],
  { cwd: ROOT, stdio: 'inherit' },
);

const { createRequire } = await import('node:module');
const require = createRequire(import.meta.url);
const { RunSim } = require(path.join(SIM_OUT, 'RunSim.js'));
const { TILE, ZOOM, BANDS } = require(path.join(SIM_OUT, 'config.js'));
const { tileLook, ledgeLook, MOSS } = require(path.join(SIM_OUT, 'look.js'));
const MOSS_DECAL = [1, 5, 7, 13, 15, 19, 30, 31, 39, 46, 47];

GlobalFonts.registerFromPath(path.join(ROOT, 'public/vendor/sunnyland/fonts/VonwaonBitmap-16px.ttf'), 'Vonwaon');
const lightFile = (n) => path.join(ROOT, 'public/vendor/frogatto/light', `${n}.png`);

const img = new Map();
async function preload() {
  for (const n of ['brazier', 'coin-gold-enormous']) img.set(`p_${n}`, await loadImage(path.join(ROOT, 'public/vendor/frogatto/props', `${n}.png`)));
  img.set('brick-phases', await loadImage(path.join(ROOT, 'public/vendor/frogatto/brick-phases.png')));
  img.set('ore-cells', await loadImage(path.join(ROOT, 'public/vendor/frogatto/ore-cells.png')));
  for (const n of ['dungeon-walls', 'dungeon-floor-cement', 'cave', 'dungeon-pillars', 'parallax-wall']) {
    img.set(`t_${n}`, await loadImage(path.join(ROOT, 'public/vendor/frogatto', `${n}.png`)));
  }
  for (const n of ['nene-spritesheet1', 'bat-black', 'beetle-black-armor', 'mushroom-walker-green', 'jellybug-green', 'maggot-grey', 'moth-black']) {
    img.set(`s_${n}`, await loadImage(path.join(ROOT, 'public/vendor/frogatto', `${n}.png`)));
  }
  for (const n of ['circle_a', 'circle_b', 'circle_a_noise', 'circle_a_streaks']) img.set(`l_${n}`, await loadImage(lightFile(n)));
}

/**
 * Frogatto sheets are packed as fixed-width horizontal strips by the importer,
 * so a frame is just (index * frameWidth, 0, frameWidth, height).
 */
const stripCache = new Map();
function frameStrip(key, frameW, frameIndex) {
  const ck = `${key}|${frameIndex}`;
  if (stripCache.has(ck)) return stripCache.get(ck);
  const sheet = img.get(key);
  const c = createCanvas(frameW, sheet.height);
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  x.drawImage(sheet, frameIndex * frameW, 0, frameW, sheet.height, 0, 0, frameW, sheet.height);
  stripCache.set(ck, c);
  return c;
}

const FRAME_W = {
  's_nene-spritesheet1': 51,
  's_bat-black': 26,
  's_beetle-black-armor': 25,
  's_mushroom-walker-green': 31,
  's_jellybug-green': 37,
  's_maggot-grey': 28,
  's_moth-black': 39,
};

function enemyFrame(e, time) {
  const map = {
    knight: 's_beetle-black-armor',
    imp: 's_moth-black',
    slime: 's_jellybug-green',
    skeleton: 's_maggot-grey',
    ghoul: 's_bat-black',
  };
  const key = map[e.kind] ?? 's_bat-black';
  const fw = FRAME_W[key];
  const sheet = img.get(key);
  const count = Math.max(1, Math.floor(sheet.width / fw));
  const rate = e.state === 'windup' ? 18 : e.state === 'chase' ? 10 : 5;
  return frameStrip(key, fw, Math.floor(time * rate) % count);
}

const sliceCache = new Map();
const CELLS_PER_ROW = 8;
/** One tinted 32x32 cell out of a Frogatto tile atlas. */
function cellSlice(key, sheet, cell, color) {
  const ck = `${key}|${cell}|${color}`;
  if (sliceCache.has(ck)) return sliceCache.get(ck);
  const base = img.get(key);
  const sx = (cell % CELLS_PER_ROW) * TILE;
  const sy = Math.floor(cell / CELLS_PER_ROW) * TILE;
  const c = createCanvas(TILE, TILE);
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  x.drawImage(base, sx, sy, TILE, TILE, 0, 0, TILE, TILE);
  x.globalCompositeOperation = 'multiply';
  x.fillStyle = color;
  x.fillRect(0, 0, TILE, TILE);
  x.globalCompositeOperation = 'destination-in';
  x.drawImage(base, sx, sy, TILE, TILE, 0, 0, TILE, TILE);
  sliceCache.set(ck, c);
  return c;
}

function rgbHex(n) {
  return `#${n.toString(16).padStart(6, '0')}`;
}

function mulHex(n, mul) {
  const r = Math.min(255, Math.round(((n >> 16) & 0xff) * mul));
  const g = Math.min(255, Math.round(((n >> 8) & 0xff) * mul));
  const b = Math.min(255, Math.round((n & 0xff) * mul));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function drawWorld(ctx, sim, cam, opts = {}) {
  const world = sim.world;
  const z = ZOOM;
  ctx.save();
  ctx.scale(z, z);
  ctx.translate(-cam.x, -cam.y);

  const band = bandIndex(Math.floor((sim.py + 14) / TILE));
  const bandNum = BANDS[band] ? BANDS[band].tint : 0xffffff;
  const tx0 = Math.floor(cam.x / TILE);
  const tx1 = Math.ceil((cam.x + VIEW.w / z) / TILE);
  const ty0 = Math.floor(cam.y / TILE);
  const ty1 = Math.ceil((cam.y + VIEW.h / z) / TILE);

  ctx.imageSmoothingEnabled = false;
  const rims = [];
  const glows = [];
  // ---- rock mass -------------------------------------------------------
  // One continuous masonry material on a 48px world grid, clipped to the solid
  // tiles. Tiling boulder cells at 32px made the wall read as bubble wrap; a
  // continuous brick field plus a lit rim reads as carved stone.
  // 48px masonry sampled through a 3x3 phase sheet: nine frames cover every
  // possible 32px tile origin inside a 48px brick, so the course is continuous
  // across the map with no seams and no scaling.
  const phases = img.get('brick-phases');
  const worldL = tx0 * TILE;
  const worldT = ty0 * TILE;
  const worldW = (tx1 - tx0 + 1) * TILE;
  const worldH = (ty1 - ty0 + 1) * TILE;

  const solidMask = createCanvas(worldW, worldH);
  {
    const m = solidMask.getContext('2d');
    m.fillStyle = '#fff';
    for (let ty = ty0; ty <= ty1; ty += 1) {
      for (let tx = tx0; tx <= tx1; tx += 1) {
        const t = world.get(tx, ty);
        if (t === T.AIR || t === T.BRAZIER) continue;
        m.fillRect(tx * TILE - worldL, ty * TILE - worldT, TILE, TILE);
      }
    }
  }

  const mass = createCanvas(worldW, worldH);
  {
    const mx = mass.getContext('2d');
    mx.imageSmoothingEnabled = false;
    // Native 48px, no scaling (scaling 1.5x banded the brick), and odd courses
    // offset by half a tile so the repetition never lines up into a grid.
    for (let ty = ty0; ty <= ty1; ty += 1) {
      for (let tx = tx0; tx <= tx1; tx += 1) {
        const t = world.get(tx, ty);
        if (t === T.AIR || t === T.BRAZIER) continue;
        const ox = ((tx * TILE) % 48) / 16;
        const oy = ((ty * TILE) % 48) / 16;
        mx.drawImage(phases, ox * 32, oy * 32, 32, 32, tx * TILE - worldL, ty * TILE - worldT, 32, 32);
      }
    }
    // One vertical grade over the whole field, never per tile or per block:
    // any per-cell plate prints a checkerboard over continuous masonry.
    mx.globalAlpha = 1;
    mx.fillStyle = 'rgba(6,8,16,0.35)';
    mx.fillRect(0, 0, worldW, worldH);
    const dg = mx.createLinearGradient(0, 0, 0, worldH);
    dg.addColorStop(0, 'rgba(3,4,9,0.42)');
    dg.addColorStop(1, 'rgba(3,4,9,0.06)');
    mx.fillStyle = dg;
    mx.fillRect(0, 0, worldW, worldH);
    mx.globalAlpha = 1;
    mx.globalCompositeOperation = 'destination-in';
    mx.drawImage(solidMask, 0, 0);
  }
  ctx.drawImage(mass, worldL, worldT);

  for (let ty = ty0; ty <= ty1; ty += 1) {
    for (let tx = tx0; tx <= tx1; tx += 1) {
      const t = world.get(tx, ty);
      if (t === T.AIR || t === T.BRAZIER) continue;
      const look = tileLook((x, y) => world.get(x, y), tx, ty, bandNum);
      rims.push({ tx, ty, o: look.open, tint: look.tint, deep: t === 2 });
    }
  }

  // ore: Frogatto's cave crackle, re-mapped onto a copper→gold ramp by
  // scripts/zhulong/make-ore.mjs. Drawn over the masonry it was carved out of.
  const oreSheet = img.get('ore-cells');
  for (let ty = ty0; ty <= ty1; ty += 1) {
    for (let tx = tx0; tx <= tx1; tx += 1) {
      const t = world.get(tx, ty);
      if (t !== T.ORE && t !== T.RICH) continue;
      const rich = t === T.RICH;
      const f = (hash2(tx, ty) >>> 2) % 4;
      ctx.globalAlpha = 1;
      ctx.drawImage(oreSheet, f * 32, 0, 32, 32, tx * TILE, ty * TILE, 32, 32);
      glows.push({ tx, ty, r: rich ? 2 : 1 });
    }
  }

  // rim light: the only thing separating rock from cave
  for (const r of rims) {
    const x = r.tx * TILE; const y = r.ty * TILE;
    // Lit rim: the single brightest thing on a rock face, and the only cue the
    // player needs to read a platform in a dark shaft.
    if (r.o[0]) {
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = '#a8f8e2';
      ctx.fillRect(x, y, TILE, 2);
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#5fc9b4';
      ctx.fillRect(x, y + 2, TILE, 2);
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = '#3d8f86';
      ctx.fillRect(x, y + 4, TILE, 3);
    }
    if (r.o[1]) { ctx.globalAlpha = 0.30; ctx.fillStyle = '#5f8fa8'; ctx.fillRect(x + TILE - 2, y, 2, TILE); }
    if (r.o[3]) { ctx.globalAlpha = 0.14; ctx.fillStyle = '#5f8fa8'; ctx.fillRect(x, y, 2, TILE); }
    if (r.o[2]) { ctx.globalAlpha = 0.42; ctx.fillStyle = '#2a3348'; ctx.fillRect(x, y + TILE - 2, TILE, 2); }
    ctx.globalAlpha = 1;
  }

  // Directional seam tell: the parry leaves a streak on the side the force went,
  // so the player reads *which wall* got the ore without any tutorial text.
  if (sim.lastVein) {
    const v = sim.lastVein;
    const a = Math.max(0, v.t / 1.1);
    const cx = v.x * TILE + 16;
    const cy = v.y * TILE + 16;
    ctx.globalAlpha = a * 0.75;
    ctx.strokeStyle = '#ffe08a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - v.dir * 26, cy);
    ctx.lineTo(cx + v.dir * 18, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + v.dir * 18, cy);
    ctx.lineTo(cx + v.dir * 10, cy - 6);
    ctx.moveTo(cx + v.dir * 18, cy);
    ctx.lineTo(cx + v.dir * 10, cy + 6);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ore is emissive, so it gets a soft bloom before the darkness pass
  for (const o of glows) {
    const cx = o.tx * TILE + 8;
    const cy = o.ty * TILE + 8;
    const rad = o.r === 2 ? 20 : 12;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    g.addColorStop(0, o.r === 2 ? 'rgba(255,196,107,0.75)' : 'rgba(247,201,72,0.55)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
    // a hard bright core so a vein is unmistakable in the dark
    ctx.fillStyle = o.r === 2 ? '#ffefc0' : '#ffe08a';
    ctx.fillRect(cx - 2, cy - 2, 4, 4);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(cx - 3, cy - 3, 6, 6);
    ctx.globalAlpha = 1;
  }

  // set dressing

  // braziers: real Frogatto prop, 50x64 cells, frame 0 unlit, 8+ lit loop
  const brazier = img.get('p_brazier');
  for (let ty = ty0; ty <= ty1; ty += 1) {
    for (let tx = tx0; tx <= tx1; tx += 1) {
      if (world.get(tx, ty) !== T.BRAZIER) continue;
      const f = 8 + (Math.floor(sim.time * 11 + tx * 3) % 7);
      const sx = (f % 8) * 50 + 1;
      const sy = Math.floor(f / 8) * 64 + 1;
      // the prop is 48x48 and the bowl's base sits on the tile floor
      // 34px: big enough to read as a built object, small enough that the hero
      // (24px) is never hidden behind it.
      ctx.drawImage(brazier, sx, sy, 48, 48, tx * TILE - 2, (ty + 1) * TILE - 34, 34, 34);
    }
  }

  // enemies
  for (const e of sim.enemies) {
    if (e.state === 'dead' && e.t > 1.2) continue;
    const src = enemyFrame(e, sim.time);
    ctx.save();
    ctx.globalAlpha = e.state === 'dead' ? Math.max(0, 1 - e.t / 1.4) : 1;
    ctx.translate(e.x + e.w / 2, e.y + e.h / 2);
    if (e.state === 'windup') {
      const k = 1 + (1 - Math.max(0, e.t) / 0.46) * 0.35;
      ctx.scale(k, k);
    }
    if (e.dir < 0) ctx.scale(-1, 1);
    ctx.drawImage(src, -18, -18, 36, 36);
    ctx.restore();
    if (e.state === 'windup') {
      const p = 1 - Math.max(0, e.t) / 0.46;
      ctx.strokeStyle = p > 0.55 ? C.bloodLight : C.blood;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.4 + p * 0.6;
      ctx.beginPath();
      ctx.arc(e.x + e.w / 2, e.y + e.h / 2, 9 + p * 9, e.dir > 0 ? -0.7 : Math.PI + 0.7, e.dir > 0 ? 0.7 : Math.PI - 0.7, e.dir < 0);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  // essence chips
  for (const c of sim.chips) {
    ctx.fillStyle = c.kind === 1 ? '#ffe08a' : c.kind === 2 ? '#ffb0a0' : '#9fe3dd';
    ctx.fillRect(c.x - 2, c.y - 2, 4, 4);
    ctx.globalAlpha = 0.4;
    ctx.fillRect(c.x - 4, c.y - 4, 8, 8);
    ctx.globalAlpha = 1;
  }

  // slash + pulses
  if (sim.attackT > 0) {
    const p = 1 - sim.attackT / 0.24;
    const reach = (20 + (sim.upgrades.includes('reach') ? 5 : 0)) * (0.5 + p);
    ctx.strokeStyle = C.emberHot;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.9 - p * 0.9;
    ctx.beginPath();
    ctx.arc(sim.px + 5, sim.py + 7, reach, sim.face > 0 ? -1.1 : Math.PI + 1.1, sim.face > 0 ? 1.1 : Math.PI - 1.1, sim.face < 0);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  for (const p of sim.pulses) {
    ctx.strokeStyle = p.kind === 1 ? C.jadeLight : p.kind === 2 ? C.emberHot : C.gold;
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife) * 0.8;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  for (const p of sim.particles) {
    ctx.fillStyle = p.kind === 1 ? C.emberHot : p.kind === 2 ? C.jadeLight : C.stone;
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillRect(p.x, p.y, p.size, p.size);
    ctx.globalAlpha = 1;
  }

  ctx.restore();

  // ---- darkness plate, exactly like the scene's RenderTexture -------------
  if (opts.light !== false) {
    const plate = createCanvas(VIEW.w, VIEW.h);
    const p = plate.getContext('2d');
    p.fillStyle = 'rgba(3,4,12,0.22)';
    p.fillRect(0, 0, VIEW.w, VIEW.h);
    p.globalCompositeOperation = 'destination-out';
    const screen = (wx, wy) => ({ x: (wx - cam.x) * z, y: (wy - cam.y) * z });
    const hole = (wx, wy, radius, texture) => {
      const s = screen(wx, wy);
      const d = radius * 2 * z;
      p.drawImage(img.get(texture), s.x - d / 2, s.y - d / 2, d, d);
    };
    hole(sim.px + 9, sim.py + 12, 230, 'l_circle_a');
    hole(sim.px + 9, sim.py + 12, 96, 'l_circle_b');
    for (const e of sim.enemies) if (e.state === 'windup') hole(e.x + e.w / 2, e.y + e.h / 2, 40, 'l_circle_a_streaks');
    for (const pu of sim.pulses) hole(pu.x, pu.y, pu.r * 1.6, 'l_circle_b');
    for (let ty = ty0; ty <= ty1; ty += 1) {
      for (let tx = tx0; tx <= tx1; tx += 1) {
        const t = world.get(tx, ty);
        if (t === T.BRAZIER) hole(tx * TILE + 16, ty * TILE + 16, 150, 'l_circle_a_noise');
        else if (t === T.ORE) hole(tx * TILE + 16, ty * TILE + 16, 30, 'l_circle_b');
        else if (t === T.RICH) hole(tx * TILE + 16, ty * TILE + 16, 44, 'l_circle_b');
      }
    }
    ctx.drawImage(plate, 0, 0);

    ctx.globalCompositeOperation = 'lighter';
    const warm = (wx, wy, radius, color, alpha) => {
      const s = screen(wx, wy);
      const d = radius * 2 * z;
      const layer = createCanvas(VIEW.w, VIEW.h);
      const lx = layer.getContext('2d');
      lx.globalAlpha = alpha;
      lx.drawImage(img.get('l_circle_a_noise'), s.x - d / 2, s.y - d / 2, d, d);
      lx.globalCompositeOperation = 'source-in';
      lx.fillStyle = color;
      lx.fillRect(0, 0, VIEW.w, VIEW.h);
      ctx.globalAlpha = 1;
      ctx.drawImage(layer, 0, 0);
    };
    warm(sim.px + 9, sim.py + 12, 120, C.ember, 0.3);
    warm(sim.px + 9, sim.py + 12, 240, C.emberDeep, 0.12);
    for (let ty = ty0; ty <= ty1; ty += 1) {
      for (let tx = tx0; tx <= tx1; tx += 1) {
        if (world.get(tx, ty) === T.BRAZIER) warm(tx * TILE + 16, ty * TILE + 12, 90, C.emberHot, 0.26);
      }
    }
    // the tide: a red-black press coming down the shaft
    if (sim.tideActive > 0) {
      const front = (sim.tideFront - cam.y) * z;
      const top = Math.max(0, front - 300);
      const h = Math.max(0, Math.min(front, VIEW.h) - top);
      const grad = ctx.createLinearGradient(0, top, 0, front);
      grad.addColorStop(0, 'rgba(12,3,8,0.97)');
      grad.addColorStop(0.82, 'rgba(52,6,16,0.9)');
      grad.addColorStop(1, 'rgba(120,20,34,0.5)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, top, VIEW.w, h);
      if (front > 0 && front < VIEW.h) {
        ctx.fillStyle = 'rgba(214,74,68,0.85)';
        ctx.fillRect(0, front - 2, VIEW.w, 2);
        ctx.fillStyle = 'rgba(255,140,110,0.25)';
        ctx.fillRect(0, front - 8, VIEW.w, 6);
      }
    }
    ctx.globalCompositeOperation = 'source-over';

    // The hero is the one thing the darkness never swallows.
    ctx.save();
    const hs = { x: (sim.px + 9 - cam.x) * z, y: (sim.py + 12 - cam.y) * z };
    ctx.translate(hs.x, hs.y);
    if (sim.face < 0) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = sim.iframes > 0 && Math.floor(sim.iframes * 24) % 2 === 0 ? 0.5 : 1;
    ctx.drawImage(frameStrip('s_nene-spritesheet1', 51, frameAt(sim.time, 6)), -30, -34, 60, 62);
    ctx.restore();
  }
}

function text(ctx, x, y, body, size, color, align = 'left', alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `${size}px Vonwaon`;
  ctx.textAlign = align;
  ctx.fillText(body, x, y);
  ctx.restore();
}

function drawHud(ctx, sim) {
  const W = VIEW.w;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(20, 18, 268, 62);
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(20.5, 18.5, 267, 61);
  ctx.fillStyle = C.blood;
  ctx.fillRect(30, 30, 200 * (sim.hp / sim.maxHp), 9);
  text(ctx, 238, 44, `${Math.ceil(sim.hp)}`, 15, C.paper);
  ctx.fillStyle = '#8a2030';
  ctx.fillRect(34, 50, 10, 12);
  ctx.fillStyle = '#d15c52';
  ctx.fillRect(35, 51, 8, 5);
  ctx.fillStyle = '#c9c4dd';
  ctx.fillRect(38, 46, 2, 5);
  text(ctx, 54, 61, `烛血 ${sim.flask}`, 15, C.paper);

  text(ctx, W - 24, 42, `${sim.depth} m`, 24, C.paper, 'right');
  text(ctx, W - 24, 68, `${BANDS[bandIndex(sim.row)].name}　${sim.upgrades.length} 式`, 14, C.dim, 'right');

  // Bottom-left resource panel. Width is measured against the widest line it
  // holds (essence + banked + chain label) so the plate never clips its text.
  const PANEL_W = 318;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(20, VIEW.h - 84, PANEL_W, 64);
  ctx.strokeStyle = C.line;
  ctx.strokeRect(20.5, VIEW.h - 83.5, PANEL_W - 1, 63);
  // 「刀势」: the live cut, as pips in the bottom panel. Placed here rather than by
  // the combo counter so it reads as a resource, next to what it pays out.
  {
    const n = Math.min(5, sim.chain);
    for (let i = 0; i < 5; i += 1) {
      ctx.globalAlpha = i < n ? 0.95 : 0.16;
      ctx.fillStyle = i < n ? '#ffd98a' : '#8a86a8';
      ctx.fillRect(40 + i * 18, VIEW.h - 58, 12, 5);
    }
    ctx.globalAlpha = 1;
    text(ctx, 40 + 5 * 18 + 12, VIEW.h - 62, n > 0 ? `刀势 ×${n}` : '刀势 断', 12, n > 0 ? C.emberHot : C.dim);
  }

  text(ctx, 40, VIEW.h - 34, `精魂 ${sim.essence}`, 17, C.jadeLight);
  text(ctx, 158, VIEW.h - 33, `入炉 ${sim.banked}　精进 ${sim.upgrades.length}`, 12, C.dim);

  if (sim.combo > 1) text(ctx, W / 2, 56, `${sim.combo} 连`, 28, C.emberHot, 'center');


  sim.log.slice(0, 3).forEach((l, i) => {
    const a = Math.min(1, 3.6 - (sim.time - l.t));
    text(ctx, W / 2, VIEW.h - 130 + i * 22, l.text, 16, i === 0 ? C.emberHot : C.paper, 'center', a);
  });

  const braz = sim.world.brazierNear(sim.px, sim.py);
  if (braz) text(ctx, W / 2, VIEW.h - 176, '按 F：入炉精魂 / 刀法精进', 14, C.paper, 'center');
  if (sim.tideWarn > 0) {
    ctx.fillStyle = C.tide;
    ctx.globalAlpha = 0.12;
    ctx.fillRect(0, 0, W, 90);
    ctx.globalAlpha = 1;
    text(ctx, W / 2, 96, '暗潮将起', 17, C.bloodLight, 'center');
  }
}

function drawBackdrop(ctx, cam, sim) {
  // Open air is a cold blue haze. Without it a mined tunnel looks exactly like
  // the rock it was cut from, which is the fastest way to lose a player.
  const g = ctx.createLinearGradient(0, 0, 0, VIEW.h);
  g.addColorStop(0, '#05070e');
  g.addColorStop(0.55, '#070a12');
  g.addColorStop(1, '#080d18');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);

  // Parallax shafts: the dungeon pillars set, dropped into the background at
  // low alpha. Without them the open air reads as blank void; with them the
  // cavern has depth and the corridor feels like it is inside a structure.
  if (img.has('t_dungeon-pillars')) {
    const pil = img.get('t_dungeon-pillars');
    const ps = 2;
    const pw = pil.width * ps;
    const ph = pil.height * ps;
    const px0 = -(((cam.x * 0.3) % (pw * 2)) + pw * 2) % (pw * 2);
    const py0 = -(((cam.y * 0.22) % ph) + ph) % ph;
    ctx.globalAlpha = 0.10;
    ctx.imageSmoothingEnabled = false;
    for (let y = py0; y < VIEW.h; y += ph) {
      for (let x = px0; x < VIEW.w; x += pw * 2) ctx.drawImage(pil, x, y, pw, ph);
    }
    ctx.globalAlpha = 1;
  }

  // far wall: the same stone mass, pushed back by parallax and fog
  if (!img.has('far')) {
    const base = img.get('t_parallax-wall');
    const c = createCanvas(base.width, base.height);
    const x = c.getContext('2d');
    x.drawImage(base, 0, 0);
    x.globalCompositeOperation = 'multiply';
    x.fillStyle = '#4c4468';
    x.fillRect(0, 0, c.width, c.height);
    x.globalCompositeOperation = 'destination-in';
    x.drawImage(base, 0, 0);
    img.set('far', c);
  }
  const far = img.get('far');
  const scale = 2;
  const w = far.width * scale;
  const hh = far.height * scale;
  const ox = -(((cam.x * 0.45) % w) + w) % w;
  const oy = -(((cam.y * 0.45) % hh) + hh) % hh;
  ctx.globalAlpha = 0.6;
  ctx.imageSmoothingEnabled = false;
  for (let y = oy; y < VIEW.h; y += hh) {
    for (let x = ox; x < VIEW.w; x += w) ctx.drawImage(far, x, y, w, hh);
  }
  ctx.globalAlpha = 1;

  // dust motes drifting up through the shaft
  for (let i = 0; i < 70; i += 1) {
    const seed = i * 127.1;
    const bx = (seed * 13.37) % VIEW.w;
    const speed = 10 + (i % 5) * 4;
    const by = (VIEW.h - ((sim.time * speed + seed * 7.1) % VIEW.h)) % VIEW.h;
    const sway = Math.sin(sim.time * 0.8 + i) * 10;
    ctx.globalAlpha = 0.1 + (i % 4) * 0.05;
    ctx.fillStyle = i % 7 === 0 ? C.emberHot : '#8a86a8';
    ctx.fillRect(Math.round(bx + sway), Math.round(by), 2, 2);
  }
  ctx.globalAlpha = 1;
}

const BOT = {
  update(sim, t) {
    const input = { moveX: 0, jumpPressed: false, jumpHeld: false, attackPressed: false, parryPressed: false, drinkPressed: false };
    const below = sim.world.get(sim.col, sim.row + 1);
    if (below !== 0 && below !== 5) input.attackPressed = t % 0.36 < 0.016;
    const target = Math.round(sim.world.centreAt(sim.row));
    input.moveX = Math.sign(target - sim.col) || 1;
    if (sim.vy > 40 && sim.grounded) input.jumpPressed = false;
    return input;
  },
};

async function main() {
  await preload();
  const sim = new RunSim(20261029);
  const views = [];

  const canvas = createCanvas(VIEW.w, VIEW.h);
  const ctx = canvas.getContext('2d');

  const shoot = (name) => {
    const cam = {
      x: sim.px + 5 - VIEW.w / (2 * ZOOM),
      y: sim.py + 7 - VIEW.h / (2 * ZOOM),
    };
    cam.x = Math.max(0, Math.min(sim.world.w * TILE - VIEW.w / ZOOM, cam.x));
    cam.y = Math.max(0, Math.min(sim.world.h * TILE - VIEW.h / ZOOM, cam.y));
    ctx.clearRect(0, 0, VIEW.w, VIEW.h);
    drawBackdrop(ctx, cam, sim);
    drawWorld(ctx, sim, cam);
    drawHud(ctx, sim);
    const file = path.join(OUT, `${name}.png`);
    writeFileSync(file, canvas.toBuffer('image/png'));
    views.push(file);
    console.log('wrote', file, `${VIEW.w}x${VIEW.h}`, `depth=${sim.depth}`, `enemies=${sim.enemies.length}`);
  };

  // 1. entry hall
  for (let i = 0; i < 30; i += 1) sim.update(1 / 60, BOT.update(sim, i / 60));
  shoot('01-entry');

  // 2. dig down for a while
  for (let i = 0; i < 60 * 14; i += 1) sim.update(1 / 60, BOT.update(sim, i / 60));
  shoot('02-dig');

  // 3. teleport to a brazier so the firelight read can be checked
  for (let y = 40; y < sim.world.h - 20; y += 1) {
    let found = false;
    for (let x = 2; x < sim.world.w - 2; x += 1) {
      if (sim.world.get(x, y) === T.BRAZIER && sim.world.get(x, y + 1) !== T.AIR) {
        // stand on the rock under the brazier instead of teleporting mid-air
        sim.px = x * TILE + 3;
        sim.py = (y + 1) * TILE - 24 - 0.01;
        sim.vx = 0;
        sim.vy = 0;
        sim.enemies.length = 0;
        found = true;
        break;
      }
    }
    if (found) break;
  }
  sim.essence = 12;
  sim.upgrades.push('edge');
  for (let i = 0; i < 40; i += 1) sim.update(1 / 60, { moveX: 0, jumpPressed: false, jumpHeld: false, attackPressed: false, parryPressed: false, drinkPressed: false });
  shoot('03-brazier');
  if (process.env.ZH_DEBUG) {
    const z = ZOOM; const px = Math.floor(sim.px / TILE); const py = Math.floor(sim.py / TILE);
    console.log('player tile', px, py);
    for (let y = py - 3; y <= py + 4; y += 1) {
      let row = '';
      for (let x = px - 8; x <= px + 8; x += 1) row += '.123456'[sim.world.get(x, y)];
      console.log(String(y).padStart(4), row);
    }
  }

  // 4. force a parry with a wall behind the player, so 「刀痕成矿」 carves into
  //    stone where the seam is actually legible
  {
    const py = Math.floor(sim.py / TILE);
    let best = null;
    for (let ty = py - 20; ty <= py + 20 && !best; ty += 1) {
      for (let tx = 6; tx < sim.world.w - 8; tx += 1) {
        if (sim.world.get(tx, ty) !== T.AIR) continue;
        // air pocket with solid stone immediately to the left, two rows tall
        if (sim.world.get(tx - 1, ty) === T.ROCK && sim.world.get(tx, ty + 1) !== T.AIR) {
          best = { tx, ty };
          break;
        }
      }
    }
    if (best) {
      sim.px = best.tx * TILE + 6;
      sim.py = (best.ty + 1) * TILE - 24 - 0.01;
      sim.vx = 0;
      sim.vy = 0;
    }
  }
  sim.enemies.length = 0;
  const e = {
    id: 999, x: sim.px + 18, y: sim.py, vx: 0, vy: 0, w: 12, h: 14, hp: 40, maxHp: 40,
    state: 'windup', t: 0.08, dir: -1, kind: 'knight', dmg: 15, flash: 0, armored: true, hitdone: false,
  };
  sim.enemies.push(e);
  sim.parryT = 0.2;
  sim.forceParry(e);
  for (let i = 0; i < 8; i += 1) sim.update(1 / 60, { moveX: 0, jumpPressed: false, jumpHeld: false, attackPressed: false, parryPressed: false, drinkPressed: false });
  shoot('04-vein');

  // 5. the tide pressing down on the player
  sim.tideActive = 4;
  sim.tideFront = sim.py - 40;
  shoot('05-tide');
}

await main();
