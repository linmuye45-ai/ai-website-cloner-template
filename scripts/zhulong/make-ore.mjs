/**
 * Builds the ore texture from Frogatto's `cave.png` by palette substitution.
 *
 * Frogatto recolours its own art through palette swaps, and that is exactly what
 * this does: each source cell is reduced to luminance and re-mapped onto a
 * copper→gold ramp, so the crackle of the authored rock is kept while the colour
 * says "ore" instead of "moss". Nothing here is hand-drawn: the shape, the
 * crackle and the highlights are all the original artist's pixels.
 *
 * Usage:  node scripts/zhulong/make-ore.mjs
 * Output: public/vendor/frogatto/ore-cells.png  (4 frames, 32x32)
 */
import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(ROOT, 'public/vendor/frogatto');
const SRC = path.join(OUT, 'cave.png');
const CELLS = [1, 5, 7, 13];

const RAMP = [
  [0, [8, 8, 14]],
  [0.34, [62, 40, 18]],
  [0.58, [138, 92, 26]],
  [0.78, [206, 152, 48]],
  [0.92, [246, 206, 108]],
  [1, [255, 246, 208]],
];

function rampAt(t) {
  for (let i = 1; i < RAMP.length; i += 1) {
    const [p1, c1] = RAMP[i];
    if (t <= p1) {
      const [p0, c0] = RAMP[i - 1];
      const k = (t - p0) / (p1 - p0 || 1);
      return [
        Math.round(c0[0] + (c1[0] - c0[0]) * k),
        Math.round(c0[1] + (c1[1] - c0[1]) * k),
        Math.round(c0[2] + (c1[2] - c0[2]) * k),
      ];
    }
  }
  return RAMP[RAMP.length - 1][1];
}

const im = await loadImage(SRC);
const scratch = createCanvas(im.width, im.height);
const sx = scratch.getContext('2d');
sx.imageSmoothingEnabled = false;
sx.drawImage(im, 0, 0);

const strip = createCanvas(32 * CELLS.length, 32);
const sc = strip.getContext('2d');

CELLS.forEach((cell, i) => {
  const cx = (cell % 8) * 32;
  const cy = Math.floor(cell / 8) * 32;
  const src = sx.getImageData(cx, cy, 32, 32);
  const out = sc.createImageData(32, 32);
  const d = src.data;
  for (let p = 0; p < d.length; p += 4) {
    if (d[p + 3] < 16) {
      out.data[p + 3] = 0;
      continue;
    }
    // luminance, then a gentle S-curve so mid tones separate into strata
    const l = (d[p] * 0.3 + d[p + 1] * 0.59 + d[p + 2] * 0.11) / 255;
    const t = Math.min(1, Math.max(0, (l - 0.12) / 0.7)) ** 0.85;
    const [r, g, b] = rampAt(t);
    out.data[p] = r;
    out.data[p + 1] = g;
    out.data[p + 2] = b;
    out.data[p + 3] = Math.min(255, d[p + 3] * 1.35);
  }
  sc.putImageData(out, i * 32, 0);
});

fs.writeFileSync(path.join(OUT, 'ore-cells.png'), strip.toBuffer('image/png'));
console.log(`ore-cells.png  ${CELLS.length} frames from cave cells ${CELLS.join(',')}`);
