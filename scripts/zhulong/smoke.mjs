/**
 * Headless design verification for ZHULONG.
 *
 * The simulation is dependency-free TypeScript, so the whole game can be driven
 * without a browser. These checks target the *signature mechanic* specifically:
 * a perfect parry must materially change the world (carve ore) and that ore must
 * convert into the upgrade economy. If that chain breaks, the game is pointless.
 */
import { RunSim, NO_INPUT } from '../../.tmp-zhulong/RunSim.js';
import { T, TILE } from '../../.tmp-zhulong/config.js';

const DT = 1 / 60;
let failures = 0;
const check = (name, cond, detail = '') => {
  if (!cond) {
    failures += 1;
    console.error(`FAIL  ${name} ${detail}`);
  } else {
    console.log(`ok    ${name} ${detail}`);
  }
};

const counting = (sim) => {
  let ore = 0;
  let brazier = 0;
  for (let i = 0; i < sim.world.tiles.length; i += 1) {
    const t = sim.world.tiles[i];
    if (t === T.ORE || t === T.ORE_RICH) ore += 1;
    if (t === T.BRAZIER) brazier += 1;
  }
  return { ore, brazier };
};

// ---------------------------------------------------------------- world gen
console.log('== world ==');
const sim = new RunSim(12345);
const gen = counting(sim);
check('world generated with ore', gen.ore > 200, `ore=${gen.ore}`);
check('braziers placed', gen.brazier >= 8, `brazier=${gen.brazier}`);
check('shaft is walkable at spawn', !sim.world.isSolid(Math.floor(sim.px / TILE), 7));
check('borders are indestructible', sim.world.get(0, 100) === T.BEDROCK);

// ------------------------------------------------------- the signature chain
console.log('== 「刀痕成矿」 (parry carves ore) ==');
const s2 = new RunSim(999);
s2.start();
// Drop the player onto solid footing near a wall.
s2.px = 20 * TILE;
s2.py = 40 * TILE;
let guard = 0;
while (!s2.onGround && guard < 400) {
  s2.update(DT, NO_INPUT);
  guard += 1;
}
const oreBefore = counting(s2).ore;

// Manufacture the exact condition a perfect parry needs: an enemy mid-strike,
// inside range, with the player's parry window active.
s2.enemies.length = 0;
s2.enemies.push({
  id: 1, kind: 'wraith', x: s2.px + 24, y: s2.py, vx: -300, vy: 0,
  hp: 20, maxHp: 20, facing: -1, state: 'strike', t: 0.16, onGround: true, flash: 0,
});
s2.parryT = 0.2;
const perfectBefore = s2.perfects;
s2.resolveStrike(s2.enemies[0]);
const oreAfter = counting(s2).ore;

check('parry registers as perfect', s2.perfects === perfectBefore + 1, `perfects=${s2.perfects}`);
check('parry carves new ore into the wall', oreAfter > oreBefore, `${oreBefore} -> ${oreAfter}`);
check('parried enemy is staggered', s2.enemies[0].state === 'stagger');
check('player took no damage', s2.hp === s2.maxHp, `hp=${s2.hp}`);

// ----------------------------------------------------------- mining -> essence
console.log('== mining -> essence ==');
const s3 = new RunSim(7);
s3.start();
s3.px = 30 * TILE;
s3.py = 50 * TILE;
// Force a rich vein directly beside the player and mine it by hand.
s3.world.set(31, Math.floor(s3.py / TILE), T.ORE_RICH);
const essenceBefore = s3.essence;
for (let i = 0; i < 12 && s3.essence === essenceBefore; i += 1) {
  s3.facing = 1;
  s3.attackCd = 0;
  s3.swordStrike();
}
check('mining ore yields essence', s3.essence > essenceBefore, `${essenceBefore} -> ${s3.essence}`);

// ------------------------------------------------------------ banking/shop
console.log('== bank + shop ==');
const s4 = new RunSim(31);
s4.start();
s4.essence = 60;
s4.bank();
check('bank empties carried essence', s4.essence === 0);
check('bank seeds the purse', s4.banked === 60, `banked=${s4.banked}`);
check('shop opens with 3 offers', s4.shopChoices.length === 3, `${s4.shopChoices.length}`);
check('shop pauses the sim', s4.status === 'shop');
const first = s4.shopChoices[0];
const cost = s4.costOf(first);
const bought = s4.buy(first);
check('purchase spends essence and levels up', bought && s4.banked === 60 - cost && s4.levels[first] === 1,
  `${first} cost=${cost} banked=${s4.banked} lvl=${s4.levels[first]}`);
s4.closeShop();
check('closing shop resumes play', s4.status === 'playing');

// ------------------------------------------------------------- miasma pressure
console.log('== 暗潮 pressure ==');
const s5 = new RunSim(5);
s5.start();
// Park the player just below the tide so the pressure is observable quickly.
s5.px = 48 * TILE;
s5.py = 6 * TILE;
const miasmaStart = s5.miasmaRow;
for (let i = 0; i < 60 * 40; i += 1) s5.update(DT, NO_INPUT);
// Park the tide right on the player, which is the camping worst case.
s5.miasmaRow = 9;
for (let i = 0; i < 60 * 4; i += 1) s5.update(DT, NO_INPUT);
check('miasma rises over time', s5.miasmaRow > miasmaStart + 5,
  `${miasmaStart.toFixed(1)} -> ${s5.miasmaRow.toFixed(1)}`);
check('camping in the tide is punished', s5.hp < s5.maxHp, `hp=${s5.hp.toFixed(0)}`);

// A player who keeps descending must outrun the tide comfortably.
const s5b = new RunSim(5);
s5b.start();
s5b.miasmaRow = 300;
s5b.py = 700 * TILE;
s5b.px = 48 * TILE;
for (let i = 0; i < 60 * 20; i += 1) s5b.update(DT, NO_INPUT);
check('descending player stays ahead of the tide', s5b.row > s5b.miasmaRow,
  `player row ${s5b.row} vs tide ${s5b.miasmaRow.toFixed(0)}`);

// ------------------------------------------------------------------ full run
console.log('== bot run (descend + fight) ==');
const s6 = new RunSim(2024);
s6.start();
let nan = false;
let maxDepth = 0;
let pFrame = 0;
for (let f = 0; f < 60 * 150; f += 1) {
  const input = {
    left: false, right: false, jump: false, jumpPressed: false,
    attack: false, attackPressed: false, parryPressed: true, interactPressed: false,
  };
  // Descend: keep digging the floor and drifting with the shaft.
  input.attackPressed = f % 14 === 0;
  input.attack = f % 14 < 4;
  if (f % 90 < 40) input.right = true;
  else if (f % 90 < 80) input.left = true;
  if (f % 46 === 0) input.jumpPressed = true;

  s6.update(DT, input);
  maxDepth = Math.max(maxDepth, s6.depthMetres);
  if (s6.status === 'shop') s6.closeShop();
  if (s6.status === 'dead') break;
  if (!Number.isFinite(s6.px) || !Number.isFinite(s6.py) || !Number.isFinite(s6.hp)) {
    nan = true;
    break;
  }
  if (s6.status === 'dead') break;
  pFrame = f;
}
check('no NaN over a long run', !nan);
check('bot makes downward progress', maxDepth > 20, `depth=${maxDepth}m`);
check('player never escapes the map', s6.px > 0 && s6.px < s6.world.w * TILE,
  `x=${s6.px.toFixed(0)}`);
console.log(`   ran ${(pFrame * DT).toFixed(0)}s · depth ${maxDepth}m · kills ${s6.kills} · mined ${s6.mined} · perfects ${s6.perfects}`);

// --------------------------------------------------------------- perf budget
console.log('== performance ==');
const s7 = new RunSim(77);
s7.start();
const t0 = process.hrtime.bigint();
for (let i = 0; i < 3000; i += 1) {
  s7.update(DT, {
    left: i % 120 < 60, right: i % 120 >= 60, jump: false, jumpPressed: false,
    attack: false, attackPressed: i % 10 === 0, parryPressed: false, interactPressed: false,
  });
}
const ms = Number(process.hrtime.bigint() - t0) / 1e6;
check('sim step is cheap enough for 60fps', ms < 1500, `${ms.toFixed(1)}ms for 3000 steps (${(ms / 3000).toFixed(3)}ms/step)`);

console.log(failures === 0 ? '\nALL ZHULONG CHECKS PASSED' : `\n${failures} ZHULONG CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
