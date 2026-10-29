/**
 * Extracts the cavern's masonry material from Frogatto's
 * `images/tiles/old/walls.png`.
 *
 * That sheet is authored on a 48px grid, so it cannot be used as a 32px
 * autotile. But it contains one window that is a plain continuous brick course
 * with no pillar, ornament or corner in it; tiled 4x4 it is seamless. That window
 * becomes the single material for all rock mass, drawn on a 48px world grid so
 * the courses line up across the whole cavern regardless of the 32px collision
 * grid.
 *
 * Earlier passes tiled `dungeon-walls`, which is loose boulders: repeated, it
 * read as bubble wrap. Continuous masonry plus a hard lit rim is the look.
 *
 * Usage:  node scripts/zhulong/make-brick.mjs [source.png]
 * Output: public/vendor/frogatto/brick-48.png
 *
 * Source PNG:
 *   gh api repos/frogatto/frogatto/contents/images/tiles/old/walls.png \
 *     -H "Accept: application/vnd.github.raw" > /tmp/frogatto-walls.png
 */
import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(ROOT, 'public/vendor/frogatto');
const SRC = process.argv[2] ?? '/tmp/frogatto-walls.png';
const CELL = 48;
/** Verified seam-free brick window in the 48px block. */
const WIN = { x: 176, y: 194 };

if (!fs.existsSync(SRC)) {
  console.error(`missing source sheet: ${SRC}`);
  process.exit(1);
}

const im = await loadImage(SRC);
const c = createCanvas(CELL, CELL);
const x = c.getContext('2d');
x.imageSmoothingEnabled = false;
x.drawImage(im, WIN.x, WIN.y, CELL, CELL, 0, 0, CELL, CELL);

fs.writeFileSync(path.join(OUT, 'brick-48.png'), c.toBuffer('image/png'));
console.log(`brick-48.png  ${CELL}x${CELL}  from ${WIN.x},${WIN.y}`);

/**
 * Phase sheet.
 *
 * The collision grid is 32px but the masonry is authored on 48px. A 32px tile
 * can begin at only three offsets inside a 48px brick (0, 16, 32), so the whole
 * infinite wall is exactly 3x3 = 9 distinct 32px crops. Baking those nine here
 * lets the game draw one frame per tile and still get a perfectly continuous
 * course across the entire map — no seams, no scaling, no per-tile special case.
 *
 * frame index = (ox / 16) + (oy / 16) * 3
 */
const field = createCanvas(CELL * 2, CELL * 2);
{
  const f = field.getContext('2d');
  f.imageSmoothingEnabled = false;
  for (let j = 0; j < 2; j += 1) for (let i = 0; i < 2; i += 1) f.drawImage(c, i * CELL, j * CELL);
}
const phases = createCanvas(32 * 3, 32 * 3);
{
  const p = phases.getContext('2d');
  p.imageSmoothingEnabled = false;
  for (let j = 0; j < 3; j += 1) {
    for (let i = 0; i < 3; i += 1) p.drawImage(field, i * 16, j * 16, 32, 32, i * 32, j * 32, 32, 32);
  }
}
fs.writeFileSync(path.join(OUT, 'brick-phases.png'), phases.toBuffer('image/png'));
console.log('brick-phases.png  96x96 (3x3 of 32px)');
