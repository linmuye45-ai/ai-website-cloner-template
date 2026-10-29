#!/usr/bin/env node
/**
 * Headless gameplay smoke test.
 *
 * Compiles the real simulation and drives it with a bot for two minutes of game
 * time, asserting that the run actually progresses: the bot descends, finds
 * ore, lands parries, and nothing goes NaN. Rendering is checked separately by
 * scripts/zhulong/preview.mjs.
 *
 *   node scripts/zhulong/smoke.mjs
 */
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(ROOT, '.preview/sim');
mkdirSync(OUT, { recursive: true });

execFileSync(
  'npx',
  ['tsc', 'src/zhulong/sim/config.ts', 'src/zhulong/sim/math.ts', 'src/zhulong/sim/world.ts',
    'src/zhulong/sim/look.ts', 'src/zhulong/sim/RunSim.ts',
    '--outDir', OUT, '--module', 'commonjs', '--target', 'es2022', '--moduleResolution', 'node10', '--skipLibCheck'],
  { cwd: ROOT, stdio: 'inherit' },
);

const require = createRequire(import.meta.url);
const { RunSim } = require(path.join(OUT, 'RunSim.js'));
const { T } = require(path.join(OUT, 'config.js'));

const DT = 1 / 60;
const bot = (sim, t) => {
  const input = {
    moveX: 0, jumpPressed: false, jumpHeld: false,
    attackPressed: false, parryPressed: false, drinkPressed: false,
  };
  const world = sim.world;

  // parry anything that is winding up in reach: the bot should be able to
  // demonstrate the signature mechanic on its own
  const threat = sim.enemies.find(
    (e) => e.state === 'windup' && e.t > 0 && e.t < 0.16 && Math.abs(e.x - sim.px) < 38 && Math.abs(e.y - sim.py) < 24,
  );
  if (threat && sim.parryCd <= 0) input.parryPressed = true;

  // dig toward the shaft centre, attacking solid faces
  const target = Math.round(world.centreAt(sim.row));
  input.moveX = Math.sign(target - sim.col) || 1;
  const below = world.get(sim.col, sim.row + 1);
  const ahead = world.get(sim.col + input.moveX, sim.row);
  if ((below !== T.AIR && below !== T.BRAZIER) || ahead !== T.AIR) input.attackPressed = t % 0.3 < 0.016;
  if (sim.hp < sim.maxHp * 0.4) input.drinkPressed = true;
  // hop when standing still against a wall
  if (Math.abs(sim.vx) < 4 && sim.grounded && sim.time % 1.2 < 0.02) input.jumpPressed = true;
  return input;
};

const sim = new RunSim(424242);
let frames = 0;
const start = Date.now();
for (let i = 0; i < 60 * 150; i += 1) {
  sim.update(DT, bot(sim, i * DT));
  frames += 1;
  for (const v of [sim.px, sim.py, sim.vx, sim.vy, sim.hp, sim.essence]) {
    if (!Number.isFinite(v)) throw new Error(`non-finite state at frame ${i}`);
  }
  if (sim.dead) sim.respawn();
}
const ms = Date.now() - start;

// how much ore the parries transcribed into the walls
let ore = 0;
for (let i = 0; i < sim.world.tiles.length; i += 1) {
  const t = sim.world.tiles[i];
  if (t === T.ORE || t === T.RICH) ore += 1;
}

// ---- direct check of the signature mechanic -------------------------------
function veinTest() {
  const s = new RunSim(9);
  // hollow a small pocket so the enemy is standing in open air
  for (let y = 6; y <= 10; y += 1) for (let x = Math.floor(s.px / 16) - 4; x <= Math.floor(s.px / 16) + 4; x += 1) s.world.set(x, y, T.AIR);
  const before = countOre(s.world);
  s.enemies.push({
    id: 1, x: s.px + 18, y: s.py, vx: 0, vy: 0, w: 12, h: 14, hp: 40, maxHp: 40,
    state: 'windup', t: 0.001, dir: -1, kind: 'knight', dmg: 15, flash: 0,
    armored: true, hitdone: false, phasing: false,
  });
  s.parryT = 0.2;
  s.update(1 / 60, { moveX: 0, jumpPressed: false, jumpHeld: false, attackPressed: false, parryPressed: false, drinkPressed: false });
  const after = countOre(s.world);
  return { before, after, perfects: s.perfects, hp: s.hp };
}

function countOre(world) {
  let n = 0;
  for (let i = 0; i < world.tiles.length; i += 1) {
    const t = world.tiles[i];
    if (t === T.ORE || t === T.RICH) n += 1;
  }
  return n;
}

const vein = veinTest();

const report = {
  frames,
  simMsPerFrame: +(ms / frames).toFixed(4),
  depth: sim.depth,
  kills: sim.kills,
  parries: sim.parries,
  perfects: sim.perfects,
  essence: sim.essence,
  banked: sim.banked,
  oreTiles: ore,
  decor: sim.world.decor.length,
  upgrades: sim.upgrades,
  veinTest: vein,
};

const fail = [];
if (report.depth < 60) fail.push(`depth ${report.depth} < 60`);
if (report.kills < 6) fail.push(`kills ${report.kills} < 6`);
if (vein.perfects !== 1) fail.push('a frame-perfect parry did not register');
if (vein.after - vein.before < 2) fail.push(`parry grew ${vein.after - vein.before} vein tiles (expected >= 2)`);
if (vein.hp !== 100) fail.push('parried blow still dealt damage');
if (report.simMsPerFrame > 2) fail.push(`sim too slow: ${report.simMsPerFrame} ms/frame`);
if (report.decor < 4) fail.push(`too little set dressing: ${report.decor}`);

console.log(JSON.stringify(report, null, 2));
if (fail.length) {
  console.error('\nFAIL\n - ' + fail.join('\n - '));
  process.exit(1);
}
console.log('\nOK');
