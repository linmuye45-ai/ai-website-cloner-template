/**
 * Offline frame previewer.
 *
 * There is no browser engine in this sandbox, so this mirrors the draw rules of
 * ZhulongScene against the *real* simulation state and rasterises them with
 * Canvas2D. It exists to catch composition problems (too dark, unreadable,
 * empty shaft) that headless logic tests cannot see.
 *
 * Keep the draw order and constants in lockstep with EchoScene/ZhulongScene.
 */
import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';
import { RunSim } from '../../.tmp-zhulong/RunSim.js';
import { PAL, PLAYER, T, TILE, VIEW, bandAt } from '../../.tmp-zhulong/config.js';

const hex = (n) => `#${n.toString(16).padStart(6, '0')}`;
const mix = (a, b, t) => {
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const c = (x, y) => Math.max(0, Math.min(255, Math.round(x + (y - x) * k)));
  return (c(ar, br) << 16) | (c(ag, bg) << 8) | c(ab, bb);
};
const hash = (x, y) => {
  let n = (x * 73856093) ^ (y * 19349663);
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
};

const W = VIEW.w;
const H = VIEW.h;
const ZOOM = 1.75;
/** Convert world coords to screen coords at the game's camera zoom. */
const sxOf = (wx, camX) => (wx - camX) * ZOOM;
const syOf = (wy, camY) => (wy - camY) * ZOOM;

function renderBackdrop(ctx, sim, camX, camY, now) {
  const viewW = W / ZOOM;
  const viewH = H / ZOOM;
  const band = bandAt(Math.floor(sim.py / TILE));
  const far = (wx) => wx + camX * 0.75;
  const near = (wx) => wx + camX * 0.45;
  const farY = (wy) => wy + camY * 0.75;
  const nearY = (wy) => wy + camY * 0.45;

  ctx.fillStyle = hex(mix(0x06040b, band.wallDark, 0.35));
  ctx.fillRect(0, 0, W, H);

  const top = Math.floor((camY * 0.25) / 64) * 64;
  const rows = Math.ceil(viewH / 64) + 6;

  const farBase = mix(band.wallDark, PAL.ink, 0.72);
  for (let r = 0; r < rows; r += 1) {
    const wy = top + r * 64;
    const h = hash(7, Math.floor(wy / 64));
    if (h < 0.4) continue;
    const py = syOf(farY(wy), camY);
    const px = sxOf(far(camX - 200), camX);
    const wpx = (viewW + 400) * ZOOM;
    ctx.fillStyle = hex(farBase);
    ctx.globalAlpha = 0.55;
    ctx.fillRect(px, py, wpx, 56 * ZOOM);
    ctx.fillStyle = hex(mix(farBase, PAL.stone4, 0.16));
    ctx.globalAlpha = 0.4;
    ctx.fillRect(px, py, wpx, 2 * ZOOM);
    ctx.fillStyle = hex(mix(farBase, PAL.ink, 0.5));
    ctx.globalAlpha = 0.5;
    ctx.fillRect(px, py + 54 * ZOOM, wpx, 2 * ZOOM);
    const off = ((h * 97) % 60) * ZOOM;
    ctx.fillStyle = hex(mix(farBase, PAL.ink, 0.4));
    ctx.globalAlpha = 0.35;
    for (let vx = 0; vx < wpx; vx += 60 * ZOOM) {
      ctx.fillRect(px + vx + off, py + 4 * ZOOM, 2 * ZOOM, 48 * ZOOM);
    }
    ctx.globalAlpha = 1;
  }

  for (let r = 0; r < Math.ceil(rows / 3); r += 1) {
    const wy = top + r * 192;
    const h = hash(23, Math.floor(wy / 192));
    if (h < 0.55) continue;
    const px = sxOf(far(camX + ((h * 811) % Math.max(1, viewW))), camX);
    const py = syOf(farY(wy), camY);
    const w = (120 + h * 90) * ZOOM;
    ctx.fillStyle = hex(mix(band.wallDark, PAL.ink, 0.62));
    ctx.globalAlpha = 0.5;
    ctx.fillRect(px, py, w, 170 * ZOOM);
    ctx.fillStyle = hex(mix(0x06040b, band.wallDark, 0.2));
    ctx.globalAlpha = 0.85;
    ctx.fillRect(px + 14 * ZOOM, py + 34 * ZOOM, w - 28 * ZOOM, 136 * ZOOM);
    ctx.globalAlpha = 1;
  }

  for (let r = 0; r < rows; r += 1) {
    const wy = top + r * 64;
    const h = hash(13, Math.floor(wy / 64));
    if (h < 0.62) continue;
    const x = (((h * 613) % 13) - 6) * 74;
    const px = sxOf(near(camX + viewW / 2 + x), camX);
    const py = syOf(nearY(wy), camY);
    const len = (80 + h * 260) * ZOOM;
    const col = mix(band.wall, PAL.ink, 0.7);
    ctx.fillStyle = hex(col);
    ctx.globalAlpha = 0.75;
    ctx.fillRect(px, py, 3 * ZOOM, len);
    ctx.fillStyle = hex(mix(col, PAL.stone5, 0.18));
    ctx.globalAlpha = 0.6;
    for (let k = 0; k < len; k += 14 * ZOOM) {
      ctx.fillRect(px - 2 * ZOOM, py + k, 7 * ZOOM, 4 * ZOOM);
    }
    ctx.globalAlpha = 1;
  }

  const t = now / 1000;
  for (let i = 0; i < 26; i += 1) {
    const seed = hash(i, Math.floor(sim.py / 400));
    const px = ((seed * 7331 + t * (6 + seed * 14)) % (viewW + 40)) * ZOOM - 20;
    const py = ((seed * 4217 + t * (10 + seed * 9)) % (viewH + 40)) * ZOOM - 20;
    ctx.fillStyle = hex(PAL.ember2);
    ctx.globalAlpha = 0.18 + seed * 0.22;
    ctx.fillRect(px, py, 2, 2);
    ctx.globalAlpha = 1;
  }
}

function renderWorld(ctx, sim, camX, camY, now) {
  ctx.fillStyle = hex(PAL.ink);
  ctx.fillRect(0, 0, W, H);

  const world = sim.world;
  const viewW = W / ZOOM;
  const viewH = H / ZOOM;
  const x0 = Math.max(0, Math.floor(camX / TILE) - 1);
  const x1 = Math.min(world.w - 1, Math.ceil((camX + viewW) / TILE) + 1);
  const y0 = Math.max(0, Math.floor(camY / TILE) - 1);
  const y1 = Math.min(world.h - 1, Math.ceil((camY + viewH) / TILE) + 1);
  const S = TILE * ZOOM;
  const pulse = 0.72 + Math.sin(now / 340) * 0.28;

  for (let ty = y0; ty <= y1; ty += 1) {
    const band = bandAt(ty);
    for (let tx = x0; tx <= x1; tx += 1) {
      const i = ty * world.w + tx;
      const tile = world.tiles[i];
      if (tile === T.AIR) continue;
      const px = (tx * TILE - camX) * ZOOM;
      const py = (ty * TILE - camY) * ZOOM;

      if (tile === T.ORE || tile === T.ORE_RICH) {
        const rich = tile === T.ORE_RICH;
        const base = rich ? PAL.ember3 : PAL.teal4;
        const hot = rich ? PAL.ember5 : PAL.teal6;
        ctx.fillStyle = hex(mix(base, PAL.ink, 0.62));
        ctx.fillRect(px, py, S, S);
        ctx.fillStyle = hex(mix(base, PAL.ink, 0.35));
        ctx.fillRect(px + 2, py + 2, S - 4, S - 4);
        const h = hash(tx, ty);
        const cw = (6 + Math.floor(h * 5)) * ZOOM;
        const cx = px + (5 + Math.floor(h * 12)) * ZOOM;
        ctx.fillStyle = hex(base);
        ctx.fillRect(cx, py + 6 * ZOOM, cw, S - 12 * ZOOM);
        ctx.fillStyle = hex(hot);
        ctx.globalAlpha = 0.75 + pulse * 0.25;
        ctx.fillRect(cx + ZOOM, py + 9 * ZOOM, Math.max(2, cw - 4 * ZOOM), S - 20 * ZOOM);
        ctx.globalAlpha = 1;
        ctx.fillStyle = hex(mix(base, PAL.ink, 0.5));
        ctx.fillRect(px, py + S - 3 * ZOOM, S, 3 * ZOOM);
        ctx.fillRect(px + S - 3 * ZOOM, py, 3 * ZOOM, S);
        continue;
      }
      if (tile === T.BRAZIER) {
        ctx.fillStyle = hex(PAL.stone1);
        ctx.fillRect(px + 3 * ZOOM, py + 11 * ZOOM, S - 6 * ZOOM, S - 13 * ZOOM);
        ctx.fillStyle = hex(PAL.metal3);
        ctx.fillRect(px + 4 * ZOOM, py + 12 * ZOOM, S - 8 * ZOOM, 4 * ZOOM);
        ctx.fillStyle = hex(PAL.ember2);
        ctx.fillRect(px + 6 * ZOOM, py + 14 * ZOOM, S - 12 * ZOOM, S - 18 * ZOOM);
        ctx.fillStyle = hex(PAL.ember3);
        ctx.fillRect(px + 8 * ZOOM, py + 16 * ZOOM, S - 16 * ZOOM, S - 22 * ZOOM);
        ctx.fillStyle = hex(PAL.ember5);
        ctx.globalAlpha = pulse;
        ctx.fillRect(px + 12 * ZOOM, py + 18 * ZOOM, S - 24 * ZOOM, S - 28 * ZOOM);
        ctx.globalAlpha = 1;
        continue;
      }
      if (tile === T.BEDROCK) {
        ctx.fillStyle = '#0a0812';
        ctx.fillRect(px, py, S, S);
        ctx.fillStyle = '#120e1c';
        ctx.fillRect(px + 4 * ZOOM, py + 4 * ZOOM, S - 8 * ZOOM, S - 8 * ZOOM);
        continue;
      }

      const h = hash(tx, ty);
      const deepBlock = tile === T.DEEP;
      let base = deepBlock ? band.wallDark : band.wall;
      const big = hash(Math.floor(tx / 8), Math.floor(ty / 8));
      const mid = hash(Math.floor(tx / 3), Math.floor(ty / 3));
      base = mix(base, PAL.stone6, 0.42 + (big - 0.5) * 0.55 + (mid - 0.5) * 0.2);
      base = mix(base, PAL.ink, h * 0.07);
      ctx.fillStyle = hex(base);
      ctx.fillRect(px, py, S, S);
      if (h > 0.55) {
        ctx.fillStyle = hex(mix(base, PAL.ink, 0.28));
        ctx.fillRect(px + (4 + Math.floor(h * 20)) * ZOOM, py + (6 + Math.floor(mid * 16)) * ZOOM, 3 * ZOOM, 2 * ZOOM);
      }
      if (big > 0.66 && h > 0.3) {
        ctx.fillStyle = hex(mix(base, PAL.stone7, 0.16));
        ctx.fillRect(px + (2 + Math.floor(mid * 22)) * ZOOM, py + (3 + Math.floor(h * 20)) * ZOOM, 2 * ZOOM, 3 * ZOOM);
      }
      if (world.tiles[i - world.w] === T.AIR) {
        ctx.fillStyle = hex(mix(base, PAL.stone7, 0.62));
        ctx.fillRect(px, py, S, 3 * ZOOM);
        ctx.fillStyle = hex(mix(base, PAL.stone6, 0.22));
        ctx.fillRect(px, py + 3 * ZOOM, S, 3 * ZOOM);
      }
      if (world.tiles[i + world.w] === T.AIR) {
        ctx.fillStyle = hex(mix(base, PAL.ink, 0.7));
        ctx.fillRect(px, py + S - 4 * ZOOM, S, 4 * ZOOM);
      }
      if (world.tiles[i - 1] === T.AIR) {
        ctx.fillStyle = hex(mix(base, PAL.stone6, 0.3));
        ctx.fillRect(px, py, 2 * ZOOM, S);
      }
      if (world.tiles[i + 1] === T.AIR) {
        ctx.fillStyle = hex(mix(base, PAL.ink, 0.45));
        ctx.fillRect(px + S - 2 * ZOOM, py, 2 * ZOOM, S);
      }
    }
  }

  // Rising tide.
  const tideY = syOf(sim.miasmaY, camY);
  if (tideY > -200 && tideY < H + 200) {
    const a = 0.35 * (0.75 + Math.sin(now / 220) * 0.25);
    ctx.fillStyle = hex(PAL.red1);
    ctx.globalAlpha = a;
    ctx.fillRect(0, tideY - 420, W, 420);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = hex(PAL.red2);
    ctx.fillRect(0, tideY - 120, W, 120);
    ctx.globalAlpha = 1;
    ctx.fillStyle = hex(PAL.red3);
    ctx.fillRect(0, tideY - 3, W, 5);
  }
}

function renderActors(ctx, sim, camX, camY, now = 1000) {
  for (const e of sim.enemies) {
    const x = sxOf(e.x, camX);
    const y = syOf(e.y, camY);
    if (x < -60 || x > W + 60 || y < -60 || y > H + 60) continue;
    const windup = e.state === 'windup';
    const body =
      e.state === 'stagger' ? PAL.stone5
        : e.flash > 0 ? PAL.parch2
          : e.kind === 'lancer' ? PAL.red3
            : e.kind === 'lantern' ? PAL.ember3
              : PAL.red2;
    if (windup) {
      const prog = 1 - Math.max(0, e.t) / 0.5;
      ctx.strokeStyle = hex(PAL.red4);
      ctx.globalAlpha = 0.35 + prog * 0.6;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const a0 = e.facing > 0 ? -0.9 : Math.PI - 0.9;
      ctx.arc(x, y, 22 + prog * 18, a0, a0 + 1.8);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = hex(PAL.ink);
    ctx.fillRect(x - 17, y - 25, 34, 50);
    ctx.fillStyle = hex(body);
    ctx.fillRect(x - 13, y - 22, 26, 44);
    ctx.fillStyle = hex(mix(body, PAL.ink, 0.45));
    ctx.fillRect(x - 13, y + 10, 26, 12);
    ctx.fillStyle = hex(mix(body, PAL.parch2, 0.35));
    ctx.fillRect(x - 13, y - 22, 26, 5);
    ctx.fillStyle = hex(PAL.ember5);
    ctx.fillRect(x + e.facing * 6 - 2, y - 12, 5, 5);
  }

  // Player.
  const px = sxOf(sim.px, camX);
  const py = syOf(sim.py, camY);
  if (sim.parryT > 0) {
    ctx.strokeStyle = hex(PAL.teal6);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(px, py, 26 + (1 - sim.parryT / 0.2) * 14, 0, Math.PI * 2);
    ctx.stroke();
  }
  const moving = Math.abs(sim.vx) > 12 && sim.onGround;
  const phase = sim.time * 11;
  const stride = moving ? Math.sin(phase) : 0;
  const lift = sim.onGround ? 0 : 3;
  const sway = moving ? Math.sin(phase) * 2 : Math.sin(now / 700) * 1.2;

  ctx.fillStyle = hex(PAL.ink);
  ctx.fillRect(px - 10 + stride * 4, py + 20, 9, 13 + lift);
  ctx.fillRect(px + 1 - stride * 4, py + 20, 9, 13 + lift);
  ctx.fillStyle = hex(PAL.teal1);
  ctx.fillRect(px - 8 + stride * 4, py + 22, 6, 9 + lift);
  ctx.fillRect(px + 3 - stride * 4, py + 22, 6, 9 + lift);

  ctx.fillStyle = hex(PAL.ink);
  ctx.fillRect(px - 17 + sway, py - 31, 34, 58);
  ctx.fillStyle = hex(PAL.teal2);
  ctx.fillRect(px - 14 + sway, py - 28, 28, 52);
  ctx.fillStyle = hex(PAL.teal3);
  ctx.fillRect(px - 14 + sway, py - 28, 28, 34);
  ctx.fillStyle = hex(PAL.teal5);
  ctx.fillRect(px - 14 + sway, py - 28, 28, 9);
  ctx.fillStyle = hex(PAL.teal6);
  ctx.fillRect(px + (sim.facing > 0 ? 9 : -11) + sway, py - 25, 2, 16);
  ctx.fillStyle = hex(PAL.teal1);
  ctx.fillRect(px - 14 + sway, py + 14, 9, 12);
  ctx.fillRect(px + 1 + sway, py + 18, 12, 8);
  ctx.fillStyle = hex(PAL.teal1);
  ctx.fillRect(px - (sim.facing > 0 ? 20 : -12) - stride * 3, py - 14, 8, 20);

  ctx.fillStyle = hex(PAL.ink);
  ctx.fillRect(px - 13 + sway, py - 46, 26, 20);
  ctx.fillStyle = hex(PAL.teal1);
  ctx.fillRect(px - 9 + sway, py - 42, 18, 13);
  ctx.fillStyle = hex(PAL.parch1);
  ctx.fillRect(px + (sim.facing > 0 ? 2 : -6) + sway, py - 37, 4, 4);

  if (sim.attackT > 0) {
    const prog = 1 - sim.attackT / PLAYER.attackDur;
    const a0 = sim.facing > 0 ? -1.15 : Math.PI - 0.55;
    ctx.strokeStyle = hex(PAL.parch2);
    ctx.globalAlpha = 0.9 * (1 - prog);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(px, py, sim.reach * 0.85, a0, a0 + 1.7 * (0.4 + prog));
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

/** Torchlight mask: clear hole near the player, ink outside. */
const MASK_CLEAR = 0.3;
function renderLight(ctx, sim, camX, camY) {
  const sx = sxOf(sim.px, camX);
  const sy = syOf(sim.py, camY);
  const lr = sim.lightRadius;
  const reach = Math.hypot(W, H) / 2;
  const scale = Math.max(lr / (MASK_CLEAR * 512), (reach * 2) / 512);
  const R = (512 * scale) / 2;
  const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, R);
  g.addColorStop(0, 'rgba(6,4,11,0)');
  g.addColorStop(MASK_CLEAR, 'rgba(6,4,11,0)');
  g.addColorStop(0.46, 'rgba(6,4,11,0.10)');
  g.addColorStop(0.62, 'rgba(5,3,10,0.40)');
  g.addColorStop(0.8, 'rgba(4,2,8,0.74)');
  g.addColorStop(0.93, 'rgba(3,1,6,0.94)');
  g.addColorStop(1, 'rgba(3,1,6,0.97)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function renderHud(ctx, sim) {
  const hpPct = Math.max(0, Math.min(1, sim.hp / sim.maxHp));
  const barW = 220;
  const bx = W - 28 - barW;
  ctx.fillStyle = hex(PAL.ink);
  ctx.globalAlpha = 0.85;
  ctx.fillRect(bx, 66, barW, 9);
  ctx.globalAlpha = 1;
  ctx.fillStyle = hex(hpPct > 0.5 ? PAL.red4 : hpPct > 0.25 ? PAL.ember3 : PAL.red3);
  ctx.fillRect(bx, 66, barW * hpPct, 9);

  ctx.fillStyle = hex(PAL.parch2);
  ctx.font = '20px monospace';
  ctx.fillText(`${sim.depthMetres} m`, 28, 38);
  ctx.fillStyle = hex(PAL.ember4);
  ctx.font = '15px sans-serif';
  ctx.fillText(bandAt(sim.row).name, 28, 62);
  ctx.fillStyle = hex(PAL.stone5);
  ctx.font = '14px sans-serif';
  const line = bandAt(sim.row).line;
  ctx.fillText(line, W / 2 - ctx.measureText(line).width / 2, 40);
  ctx.fillStyle = hex(PAL.stone6);
  ctx.font = '12px monospace';
  const hp = `${Math.ceil(sim.hp)} / ${sim.maxHp}`;
  ctx.fillText(hp, W - 28 - ctx.measureText(hp).width, 28);
  const soul = `精魄 ${sim.essence}  ·  盆 ${sim.banked}`;
  ctx.fillStyle = hex(PAL.ember4);
  ctx.fillText(soul, W - 28 - ctx.measureText(soul).width, 50);
}

function shoot(sim, name, { camX, camY, now = 1000, hud = true }) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  renderBackdrop(ctx, sim, camX, camY, now);
  renderWorld(ctx, sim, camX, camY, now);
  renderActors(ctx, sim, camX, camY, now);
  renderLight(ctx, sim, camX, camY);
  if (hud) renderHud(ctx, sim);
  writeFileSync(`/tmp/${name}.png`, canvas.toBuffer('image/png'));
  const lum = averageLuma(ctx);
  console.log(`${name}.png  luma=${lum.toFixed(1)}  depth=${sim.depthMetres}m  enemies=${sim.enemies.length}`);
  return lum;
}

function averageLuma(ctx) {
  const d = ctx.getImageData(0, 0, W, H).data;
  let sum = 0;
  for (let i = 0; i < d.length; i += 4 * 16) {
    sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
  }
  return sum / (d.length / (4 * 16));
}

// ---- shallow: player at spawn -------------------------------------------
const a = new RunSim(2024);
a.start();
for (let i = 0; i < 240; i += 1) {
  a.update(1 / 60, {
    left: false, right: false, jump: false, jumpPressed: false,
    attack: false, attackPressed: false, parryPressed: false, interactPressed: false,
  });
}
shoot(a, 'zh-01-spawn', {
  camX: Math.max(0, Math.min(a.world.w * TILE - W / ZOOM, a.px - (W / ZOOM) / 2)),
  camY: Math.max(0, Math.min(a.world.h * TILE - H / ZOOM, a.py - (H / ZOOM) / 2)),
});

// ---- deeper with enemies ------------------------------------------------
const b = new RunSim(99);
b.start();
b.px = (b.world.w / 2) * TILE;
b.py = 420 * TILE;
b.miasmaRow = 330;
for (let i = 0; i < 60 * 40; i += 1) {
  b.update(1 / 60, {
    left: i % 240 < 100, right: i % 240 >= 120, jump: i % 40 === 0, jumpPressed: i % 40 === 0,
    attack: true, attackPressed: i % 8 === 0, parryPressed: i % 23 === 0, interactPressed: false,
  });
  if (b.status === 'shop') b.closeShop();
  if (b.status === 'dead') break;
  if (b.enemies.length >= 3 && b.depthMetres > 380) break;
}
shoot(b, 'zh-02-deep', {
  camX: Math.max(0, Math.min(b.world.w * TILE - W / ZOOM, b.px - (W / ZOOM) / 2)),
  camY: Math.max(0, Math.min(b.world.h * TILE - H / ZOOM, b.py - (H / ZOOM) / 2)),
});

// ---- same frame with the torch mask off, to judge raw tile readability ---
{
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const camX = Math.max(0, Math.min(b.world.w * TILE - W / ZOOM, b.px - (W / ZOOM) / 2));
  const camY = Math.max(0, Math.min(b.world.h * TILE - H / ZOOM, b.py - (H / ZOOM) / 2));
  renderBackdrop(ctx, b, camX, camY, 1000);
  renderWorld(ctx, b, camX, camY, 1000);
  renderActors(ctx, b, camX, camY, 1000);
  renderHud(ctx, b);
  writeFileSync('/tmp/zh-03-nolight.png', canvas.toBuffer('image/png'));
  console.log(`zh-03-nolight.png  luma=${averageLuma(ctx).toFixed(1)}  (no torch mask)`);
}
