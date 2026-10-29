#!/usr/bin/env node
/**
 * Import Frogatto art into ZHULONG.
 *
 * Frogatto & Friends ships raw sprite sheets that use an olive colour-key
 * background instead of an alpha channel, and draws red 1px boxes around every
 * animation frame as editor guides. This script turns those sheets into clean
 * PNGs:
 *
 *   1. olive key (111,109,81) -> alpha 0
 *   2. red guide (249,48,61)  -> alpha 0
 *   3. frames are located from the red boxes themselves (connected components),
 *      so the slicing is exact rather than guessed
 *
 * Tiles are just 32x32 cells of the same sheets, so they get keyed the same way.
 *
 * Usage:  node scripts/zhulong/import-frogatto.mjs [path-to-frogatto-clone]
 * Output: public/vendor/frogatto/**
 */
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const SRC = process.argv[2] ?? '/tmp/frog';
const OUT = path.join(ROOT, 'public/vendor/frogatto');

if (!existsSync(path.join(SRC, 'images'))) {
  console.error(`no Frogatto checkout at ${SRC} (pass the path as argv[2])`);
  process.exit(1);
}

const KEY_TOL = 8;

/**
 * Identify the authoring background plate.
 *
 * The plate is whatever colour dominates the *border* of the sheet. That is a
 * better test than overall dominance (a floor atlas is mostly stone) and better
 * than connectivity (the plate sits in enclosed pockets between tiles). Returns
 * null when the border is transparent, which means the sheet is already clean.
 */
function plateColour(data, w, h) {
  const hist = new Map();
  let opaqueBorder = 0;
  const add = (x, y) => {
    const i = (y * w + x) * 4;
    if (data[i + 3] < 200) return;
    opaqueBorder += 1;
    const k = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    hist.set(k, (hist.get(k) ?? 0) + 1);
  };
  for (let x = 0; x < w; x += 1) {
    add(x, 0);
    add(x, h - 1);
  }
  for (let y = 0; y < h; y += 1) {
    add(0, y);
    add(w - 1, y);
  }
  if (opaqueBorder < (w + h) * 0.2) return null;
  let best = 0;
  let bestN = -1;
  for (const [k, n] of hist) if (n > bestN) { bestN = n; best = k; }
  // the plate should own most of the border, not just be the largest speck
  if (bestN < opaqueBorder * 0.5) return null;
  return [(best >> 16) & 0xff, (best >> 8) & 0xff, best & 0xff];
}

/** Dominant opaque colour of a sheet: the olive plate the art sits on. */
function dominant(data) {
  const hist = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const k = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    hist.set(k, (hist.get(k) ?? 0) + 1);
  }
  let best = 0;
  let bestN = -1;
  for (const [k, n] of hist) if (n > bestN) { bestN = n; best = k; }
  return [(best >> 16) & 0xff, (best >> 8) & 0xff, best & 0xff];
}

const near = (d, i, c, tol) =>
  Math.abs(d[i] - c[0]) <= tol && Math.abs(d[i + 1] - c[1]) <= tol && Math.abs(d[i + 2] - c[2]) <= tol;

/**
 * Guide colour = the sheet's most used saturated red. Frogatto uses a different
 * red per pack (249,48,61 / 255,0,47 / ...), so it is measured, not hard-coded.
 */
function guideColour(data) {
  const isRed = (i) =>
    data[i] > 225 && data[i + 1] < 75 && data[i + 2] < 95 && data[i] - data[i + 1] > 170;
  const hist = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0 || !isRed(i)) continue;
    const k = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    hist.set(k, (hist.get(k) ?? 0) + 1);
  }
  let best = null;
  let bestN = 40;
  for (const [k, n] of hist) if (n > bestN) { bestN = n; best = k; }
  return best === null ? null : [(best >> 16) & 0xff, (best >> 8) & 0xff, best & 0xff];
}

/**
 * A frame box is a 1 px hollow rectangle, so its pixel count equals its
 * perimeter. That test rejects art that merely happens to use the same red.
 */
function frameBoxes(data, w, h, guide) {
  const isGuide = (i) => near(data, i, guide, 10);
  const seen = new Uint8Array(w * h);
  const boxes = [];
  const erase = [];
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      if (seen[y * w + x] || !isGuide(i)) continue;
      const st = [[x, y]];
      seen[y * w + x] = 1;
      const cells = [];
      let x0 = x; let x1 = x; let y0 = y; let y1 = y;
      while (st.length) {
        const [cx, cy] = st.pop();
        cells.push([cx, cy]);
        if (cx < x0) x0 = cx;
        if (cx > x1) x1 = cx;
        if (cy < y0) y0 = cy;
        if (cy > y1) y1 = cy;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const k = ny * w + nx;
          if (seen[k] || !isGuide(k * 4)) continue;
          seen[k] = 1;
          st.push([nx, ny]);
        }
      }
      const bw = x1 - x0 + 1;
      const bh = y1 - y0 + 1;
      const perimeter = 2 * (bw + bh) - 4;
      if (bw >= 10 && bh >= 10 && Math.abs(cells.length - perimeter) <= perimeter * 0.3) {
        boxes.push({ x: x0 + 1, y: y0 + 1, w: bw - 2, h: bh - 2 });
        erase.push(...cells);
      }
    }
  }
  boxes.sort((a, b) => a.y - b.y || a.x - b.x);
  return { boxes, erase };
}

/**
 * Tile sheets mark variants with thick red grouping boxes rather than 1 px
 * frame guides, so they are cleared by hue instead: the stone and cave art
 * contains no saturated pure red, only grey/teal rock.
 */
async function loadTilesheet(p) {
  const im = await loadImage(p);
  const c = createCanvas(im.width, im.height);
  const x = c.getContext('2d');
  x.drawImage(im, 0, 0);
  const img = x.getImageData(0, 0, im.width, im.height);
  const d = img.data;
  // Tile sheets are a fixed palette: the authoring plate is one olive tone and
  // none of the stone/teal/moss art uses it. Verify the share before clearing.
  const OLIVE = [111, 109, 81];
  let oliveN = 0;
  let opaqueN = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    opaqueN += 1;
    if (near(d, i, OLIVE, 9)) oliveN += 1;
  }
  const clearOlive = opaqueN > 0 && oliveN / opaqueN > 0.05;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    if (clearOlive && near(d, i, OLIVE, 9)) {
      d[i + 3] = 0;
      continue;
    }
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    // Guide reds are near-pure (249,48,61 / 255,0,47). The test must be strict:
    // the stone art is warm beige and a loose "reddish" test deletes the floor.
    if (r > 225 && g < 75 && b < 95 && r - g > 170) {
      d[i + 3] = 0;
      continue;
    }
    // Editor anchor markers are pure blue; the mossy teal art is not.
    if (b > 200 && r < 80 && g < 140) {
      d[i + 3] = 0;
      continue;
    }
    // Editor anchor glyphs read as (3,22,35) / (22,32,44): strongly blue-green
    // in a palette that is otherwise pure warm grey. Left in, they multiply into
    // faint magenta squares all over the wall.
    if (b - r > 20 && b > 26 && g < 60 && r < 60) {
      d[i + 3] = 0;
      continue;
    }
    // `cave` paints moss over a flat black backdrop. As a solid cell that reads
    // as a black box, so the backdrop becomes transparent and the moss becomes
    // a decal over the rock mass.
    if (r < 26 && g < 30 && b < 34) d[i + 3] = 0;
  }
  const clean = createCanvas(im.width, im.height);
  const cx = clean.getContext('2d');
  const out = cx.createImageData(im.width, im.height);
  out.data.set(d);
  cx.putImageData(out, 0, 0);
  return { w: im.width, h: im.height, canvas: clean };
}

/** Load a sheet, drop the olive plate, and erase the frame guides. */
async function loadKeyed(p) {
  const im = await loadImage(p);
  const c = createCanvas(im.width, im.height);
  const x = c.getContext('2d');
  x.drawImage(im, 0, 0);
  const img = x.getImageData(0, 0, im.width, im.height);
  const d = img.data;
  // Tile sheets are a fixed palette: the authoring plate is the one olive tone,
  // and none of the stone/teal/moss art uses it. Verify rather than assume:
  // only clear it if it really is a large share of the opaque pixels.
  const OLIVE = [111, 109, 81];
  let oliveN = 0;
  let opaqueN = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    opaqueN += 1;
    if (near(d, i, OLIVE, 9)) oliveN += 1;
  }
  const useOlive = opaqueN > 0 && oliveN / opaqueN > 0.05;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    if (useOlive && near(d, i, OLIVE, 9)) d[i + 3] = 0;
  }
  const guide = guideColour(d);
  let boxes = [];
  if (guide) {
    const r = frameBoxes(d, im.width, im.height, guide);
    boxes = r.boxes;
    for (const [px, py] of r.erase) d[(py * im.width + px) * 4 + 3] = 0;
  }
  const clean = createCanvas(im.width, im.height);
  const cx = clean.getContext('2d');
  const out = cx.createImageData(im.width, im.height);
  out.data.set(d);
  cx.putImageData(out, 0, 0);
  return { w: im.width, h: im.height, canvas: clean, boxes };
}

function writeSheet(name, keyed, boxes) {
  if (boxes.length === 0) return null;
  const fw = Math.max(...boxes.map((b) => b.w));
  const fh = Math.max(...boxes.map((b) => b.h));
  const canvas = createCanvas(fw * boxes.length, fh);
  const ctx = canvas.getContext('2d');
  const src = keyed.canvas;
  boxes.forEach((b, i) => {
    // align every frame to the bottom of its cell so feet stay planted
    ctx.drawImage(src, b.x, b.y, b.w, b.h, i * fw + Math.floor((fw - b.w) / 2), fh - b.h, b.w, b.h);
  });
  mkdirSync(OUT, { recursive: true });
  writeFileSync(path.join(OUT, `${name}.png`), canvas.toBuffer('image/png'));
  return { name, frames: boxes.length, fw, fh };
}

/** Slice a tile sheet on a 32x32 grid and drop fully empty cells. */
function writeTiles(name, keyed, cell = 32) {
  // Cells are written back at their authored indices: src/zhulong/sim/look.ts
  // addresses them by number, so repacking would silently break the map.
  {
    mkdirSync(OUT, { recursive: true });
    writeFileSync(path.join(OUT, `${name}.png`), keyed.canvas.toBuffer('image/png'));
    return { name, cols: Math.floor(keyed.w / cell), rows: Math.floor(keyed.h / cell) };
  }
  /* eslint-disable no-unreachable */

  const cols = Math.floor(keyed.w / cell);
  const rows = Math.floor(keyed.h / cell);
  const src = keyed.canvas;
  // repack into a compact atlas: only cells with any opacity
  const keep = [];
  const probeCanvas = createCanvas(cell, cell);
  const probe = probeCanvas.getContext('2d');
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      probe.clearRect(0, 0, cell, cell);
      probe.drawImage(src, x * cell, y * cell, cell, cell, 0, 0, cell, cell);
      const d = probe.getImageData(0, 0, cell, cell).data;
      let solid = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] > 8) solid += 1;
      if (solid > cell * cell * 0.02) keep.push({ x, y, solid });
    }
  }
  if (keep.length === 0) {
    console.warn(`  ${name}: no solid 32x32 cells (sheet may be all background)`);
    return null;
  }
  const perRow = 8;
  const outRows = Math.ceil(keep.length / perRow);
  const canvas = createCanvas(perRow * cell, outRows * cell);
  const ctx = canvas.getContext('2d');
  keep.forEach((k, i) => {
    ctx.drawImage(src, k.x * cell, k.y * cell, cell, cell, (i % perRow) * cell, Math.floor(i / perRow) * cell, cell, cell);
  });
  mkdirSync(OUT, { recursive: true });
  writeFileSync(path.join(OUT, `${name}.png`), canvas.toBuffer('image/png'));
  return { name, tiles: keep.length, cols: perRow };
}

const SPRITES = [
  'kitty-ninja', 'kitty-sword', 'kitty-butler', 'kitty-spear',
  'bat-black', 'beetle-black-armor', 'beetle-black',
  'mushroom-walker-green', 'jellybug-green', 'maggot-grey',
  'moth-black', 'skeeter', 'spider-hanging-black', 'hornbug-red', 'fumper',
];
const HEROES = ['pato-spritesheet1', 'nene-spritesheet1', 'kinguin-spritesheet1'];
/** Props keep their authored layout (frame grids are read from the red guides). */
const PROPS = ['brazier', 'torch', 'coin-gold-enormous', 'cave-foreground-stalagmites', 'crumbling-bricks-grey-rock'];
const TILESHEETS = ['dungeon-walls', 'dungeon-floor-cement', 'dungeon-pillars', 'dungeon-parallax-wall', 'dungeon-parallax-floor', 'cave'];

mkdirSync(OUT, { recursive: true });
const report = { sprites: [], tiles: [] };

for (const [dir, list] of [['enemies', SPRITES], ['characters', HEROES]]) {
for (const name of list) {
  const p = path.join(SRC, 'images', dir, `${name}.png`);
  if (!existsSync(p)) continue;
  const keyed = await loadKeyed(p);
  const r = writeSheet(name, keyed, keyed.boxes);
  if (r) report.sprites.push(r);
}
}

for (const name of PROPS) {
  const p = path.join(SRC, 'images/props', `${name}.png`);
  if (!existsSync(p)) continue;
  const keyed = await loadKeyed(p);
  const dir = path.join(OUT, 'props');
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, `${name}.png`), keyed.canvas.toBuffer('image/png'));
  report.sprites.push({ name: `props/${name}`, frames: keyed.boxes.length, fw: keyed.w, fh: keyed.h });
}

for (const name of TILESHEETS) {
  const p = path.join(SRC, 'images/tiles', `${name}.png`);
  if (!existsSync(p)) continue;
  const keyed = await loadTilesheet(p);
  const r = writeTiles(name, keyed);
  if (r) report.tiles.push(r);
}

writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
