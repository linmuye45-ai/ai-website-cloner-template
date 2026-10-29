/**
 * Generates the four soft-light textures the renderer uses for lantern glow,
 * windup tells and the ember rim. These are pure radial falloff maps — not art —
 * so they are produced here instead of being downloaded, which keeps the
 * project free of third-party light packs. Output is 256px white alpha so the
 * scene can tint and additive-blend them.
 */
import { createCanvas } from '@napi-rs/canvas';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public/vendor/frogatto/light');
fs.mkdirSync(OUT, { recursive: true });

const S = 256;
const half = S / 2;

function bake(name, stops, noise = 0) {
  const c = createCanvas(S, S);
  const x = c.getContext('2d');
  const g = x.createRadialGradient(half, half, 0, half, half, half);
  for (const [at, a] of stops) g.addColorStop(at, `rgba(255,255,255,${a})`);
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);

  if (noise > 0) {
    const img = x.getImageData(0, 0, S, S);
    const d = img.data;
    let seed = 1337;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const n = 1 - noise + (seed / 0x7fffffff) * noise * 2;
      d[i + 3] = Math.max(0, Math.min(255, d[i + 3] * n));
    }
    x.putImageData(img, 0, 0);
  }

  fs.writeFileSync(path.join(OUT, `${name}.png`), c.toBuffer('image/png'));
  console.log(`light/${name}.png`);
}

bake('circle_a', [
  [0, 1],
  [0.45, 0.55],
  [0.78, 0.16],
  [1, 0],
]);

bake(
  'circle_b',
  [
    [0, 0.85],
    [0.6, 0.3],
    [1, 0],
  ],
  0.35,
);

bake(
  'circle_a_noise',
  [
    [0, 0.9],
    [0.5, 0.4],
    [0.82, 0.1],
    [1, 0],
  ],
  0.5,
);

/** Elliptical streaks: the "something is winding up" tell. */
const streak = createCanvas(S, S);
{
  const x = streak.getContext('2d');
  const g = x.createRadialGradient(half, half, 0, half, half, half);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  const img = x.getImageData(0, 0, S, S);
  const d = img.data;
  for (let y = 0; y < S; y += 1) {
    for (let px = 0; px < S; px += 1) {
      const i = (y * S + px) * 4;
      if (!d[i + 3]) continue;
      const dx = (px - half) / half;
      const dy = (y - half) / half;
      const r = Math.sqrt(dx * dx + dy * dy);
      // 7 radial spokes, fading out at the rim
      const a = Math.atan2(dy, dx);
      const spoke = 0.45 + 0.55 * Math.pow(Math.abs(Math.cos(a * 3.5)), 6);
      d[i + 3] = Math.max(0, Math.min(255, d[i + 3] * spoke * (1 - r * 0.35)));
    }
  }
  x.putImageData(img, 0, 0);
}
fs.writeFileSync(path.join(OUT, 'circle_a_streaks.png'), streak.toBuffer('image/png'));
console.log('light/circle_a_streaks.png');
