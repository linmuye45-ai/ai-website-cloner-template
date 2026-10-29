/**
 * Headless balance + invariant harness for ECHOWEAVE.
 *
 * The whole simulation is plain TypeScript with no Phaser/DOM dependency, so
 * we can compile it and drive full 8-minute runs with scripted "bots" to make
 * sure the design actually holds up before anything is drawn on screen.
 */
import { RunSim } from '../../.tmp-echo/RunSim.js';

const DT = 1 / 60;

/** Keeps a run going, auto-picking upgrades so builds actually develop. */
function playRun({ strategy, seconds = 500, seed = 1, verbose = false }) {
  const sim = new RunSim(seed);
  sim.start();
  const cx = 1500;
  const cy = 1000;
  let frames = 0;
  let nanSeen = false;
  let worstHp = sim.hp;

  const maxFrames = Math.ceil(seconds / DT);
  for (let f = 0; f < maxFrames; f += 1) {
    const t = f * DT;
    let tx = sim.px;
    let ty = sim.py;

    if (strategy === 'idle') {
      // Stand still: the design says you must move to weave.
    } else if (strategy === 'circle') {
      const a = t * 0.85;
      tx = cx + Math.cos(a) * 430;
      ty = cy + Math.sin(a) * 430;
    } else if (strategy === 'weave') {
      tx = cx + Math.sin(t * 0.62) * 700;
      ty = cy + Math.sin(t * 1.05 + 1.1) * 460;
    } else if (strategy === 'flee') {
      // Run directly away from the densest nearby cluster.
      let sx = 0;
      let sy = 0;
      for (const e of sim.enemies) {
        const dx = sim.px - e.x;
        const dy = sim.py - e.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 420) {
          sx += (dx / d) * (420 - d);
          sy += (dy / d) * (420 - d);
        }
      }
      tx = sim.px + sx;
      ty = sim.py + sy;
    }

    let ix = tx - sim.px;
    let iy = ty - sim.py;
    const m = Math.hypot(ix, iy);
    if (m > 1) {
      ix /= m;
      iy /= m;
    }
    sim.update(DT, { x: ix, y: iy });

    let guard = 0;
    while (sim.status === 'levelup' && guard < 12) {
      // Behave like someone who read the tutorial: unlock elements first,
      // then deepen whatever the build is already good at.
      const picks = sim.pendingChoices;
      let idx = picks.findIndex((id) => id.startsWith('el'));
      if (idx < 0) idx = picks.findIndex((id) => id === 'echoRate' || id === 'resonance');
      if (idx < 0) idx = 0;
      sim.chooseUpgrade(idx);
      guard += 1;
    }
    sim.resolveWin();
    sim.events.length = 0;

    frames = f;
    if (sim.hp < worstHp) worstHp = sim.hp;

    if (!Number.isFinite(sim.px) || !Number.isFinite(sim.py) || !Number.isFinite(sim.hp)) {
      nanSeen = true;
      break;
    }
    for (const e of sim.enemies) {
      if (!Number.isFinite(e.x) || !Number.isFinite(e.y)) {
        nanSeen = true;
        break;
      }
    }
    if (nanSeen) break;

    if (verbose && f % 1800 === 0) {
      console.log(
        `   t=${t.toFixed(0).padStart(3)}s hp=${sim.hp.toFixed(0).padStart(4)} ` +
          `lv=${String(sim.level).padStart(2)} kills=${String(sim.kills).padStart(4)} ` +
          `foes=${String(sim.enemies.length).padStart(3)} res=${String(sim.resonances).padStart(4)} ` +
          `weave=${Math.round(sim.weave)}`,
      );
    }
    if (sim.status === 'dead' || sim.status === 'win') break;
  }

  return {
    strategy,
    alive: sim.status !== 'dead',
    win: sim.status === 'win',
    survived: sim.time,
    kills: sim.kills,
    level: sim.level,
    resonances: sim.resonances,
    weave: Math.round(sim.weave),
    echoes: sim.echoesBorn,
    nan: nanSeen,
    worstHp,
    enemies: sim.enemies.length,
    frames,
  };
}

let failures = 0;
const check = (name, cond, detail = '') => {
  if (!cond) {
    failures += 1;
    console.error(`FAIL  ${name} ${detail}`);
  } else {
    console.log(`ok    ${name} ${detail}`);
  }
};

console.log('== drive runs ==');
const idle = playRun({ strategy: 'idle', seconds: 200, seed: 7 });
const circle = playRun({ strategy: 'circle', seconds: 500, seed: 3 });
const weave = playRun({ strategy: 'weave', seconds: 500, seed: 5, verbose: true });
const flee = playRun({ strategy: 'flee', seconds: 500, seed: 9 });

const fmt = (r) =>
  `${r.strategy.padEnd(6)} survived=${r.survived.toFixed(0).padStart(3)}s ` +
  `kills=${String(r.kills).padStart(4)} lv=${String(r.level).padStart(2)} ` +
  `res=${String(r.resonances).padStart(4)} weave=${String(r.weave).padStart(6)} ` +
  `echoes=${String(r.echoes).padStart(3)} ${r.win ? 'WIN' : r.alive ? 'alive' : 'dead'}`;
console.log('   ' + fmt(idle));
console.log('   ' + fmt(circle));
console.log('   ' + fmt(weave));
console.log('   ' + fmt(flee));

console.log('== invariants ==');
for (const r of [idle, circle, weave, flee]) {
  check(`${r.strategy}: no NaN`, !r.nan);
  check(`${r.strategy}: hp never absurd`, r.worstHp <= 400, `worst=${r.worstHp.toFixed(1)}`);
  check(`${r.strategy}: enemies bounded`, r.enemies <= 300, `n=${r.enemies}`);
}

check('idle player eventually dies (movement is mandatory)', !idle.alive, `survived=${idle.survived.toFixed(0)}s`);
check('moving player kills things', circle.kills > 50, `kills=${circle.kills}`);
check('echoes are actually produced', circle.echoes > 20, `echoes=${circle.echoes}`);
check('weaving triggers resonance', weave.resonances > 10, `res=${weave.resonances}`);
check(
  'weaving detonates far more than circling',
  weave.resonances / weave.survived > circle.resonances / circle.survived + 0.05,
  `weave=${(weave.resonances / weave.survived).toFixed(2)}/s vs circle=${(circle.resonances / circle.survived).toFixed(2)}/s`,
);
check('circling levels up repeatedly', circle.level >= 8, `lv=${circle.level}`);

console.log(failures === 0 ? '\nALL ECHO CHECKS PASSED' : `\n${failures} ECHO CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
