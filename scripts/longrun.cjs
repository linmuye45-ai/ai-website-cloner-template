// 5-minute natural simulation: boss spawns, chests, level-ups at scale.
const path = require("path");
function makeCtx() {
  const grad = { addColorStop() {} };
  return new Proxy(
    {},
    {
      get(_t, prop) {
        if (prop === "createRadialGradient" || prop === "createLinearGradient") return () => grad;
        if (prop === "measureText") return () => ({ width: 10 });
        if (prop === "getImageData") return (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h });
        if (typeof prop === "string" && /^[a-z]/.test(prop)) return () => {};
        return undefined;
      },
      set() {
        return true;
      },
    },
  );
}
function makeCanvas() {
  return {
    width: 960,
    height: 540,
    style: {},
    getContext: () => makeCtx(),
    getBoundingClientRect: () => ({ width: 960, height: 540, left: 0, top: 0 }),
    addEventListener() {},
    removeEventListener() {},
  };
}
globalThis.window = {
  devicePixelRatio: 1, innerWidth: 1280, innerHeight: 720,
  addEventListener() {}, removeEventListener() {},
  setTimeout, clearTimeout, setInterval, clearInterval,
};
globalThis.document = { hidden: false, createElement: () => makeCanvas(), addEventListener() {}, removeEventListener() {} };
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const { GameEngine } = require(path.join(process.cwd(), ".smoke-build/engine.js"));
const events = { level: 0, chest: 0, banners: [], ach: [] };
const engine = new GameEngine(makeCanvas(), {
  characterId: "aldric",
  stageId: "graveyard",
  endless: false,
  callbacks: {
    onLevelUp: (c) => {
      events.level++;
      // sensible-player heuristic: upgrade an owned weapon first, then an
      // owned passive, then take whatever is offered first
      const owned = c.find((x) => x.kind === "weapon" && !x.isNew) ?? c.find((x) => x.kind === "passive" && !x.isNew) ?? c[0];
      engine.pickUpgrade(owned);
    },
    onChest: (r) => {
      events.chest++;
      engine.closeChest();
    },
    onEnd: (s) => console.log("ENDED", s.victory, "time", s.time, "kills", s.kills, "level", s.level),
    onBanner: (t, sub) => events.banners.push(t),
    onToast() {},
    onAchievement: (id) => events.ach.push(id),
    onSeen() {},
    onPauseChange() {},
  },
});
// Human-like kite state machine: short farming bursts, hard retreats when
// a tight ring forms, then back to looting.
const t0 = Date.now();
const FRAMES = 15 * 60 * 60 + 60; // full 15-minute stage
let maxEnemies = 0;
let farming = true;
let phaseFrames = 0;
for (let f = 0; f < FRAMES; f++) {
  phaseFrames++;
  const px = engine.px;
  const py = engine.py;
  let cx = 0, cy = 0, near = 0;
  let nearest = null, nd = Infinity;
  for (const e of engine.enemies) {
    const dx = e.x - px, dy = e.y - py;
    const d = Math.hypot(dx, dy);
    if (d < 150) { near++; cx += dx; cy += dy; }
    if (d < nd) { nd = d; nearest = e; }
  }
  if (farming && (near >= 5 || phaseFrames > 75)) farming = false;
  if (!farming && (near <= 1 || phaseFrames > 180)) {
    farming = true;
    phaseFrames = 0;
  }
  let vx = 0, vy = 0;
  if (!farming) {
    const l = Math.hypot(cx, cy) || 1;
    vx = -cx / l; vy = -cy / l;
  } else {
    let gem = null, gd = Infinity;
    for (const g of engine.gems) {
      const d = (g.x - px) ** 2 + (g.y - py) ** 2;
      if (d < gd) { gd = d; gem = g; }
    }
    const t = gem && gd < 280 * 280 ? gem : nearest;
    if (t) {
      const l = Math.hypot(t.x - px, t.y - py) || 1;
      vx = (t.x - px) / l; vy = (t.y - py) / l;
    }
  }
  engine.setTouch(vx, vy);
  engine.update(1 / 60);
  engine.render();
  if (engine.enemies.length > maxEnemies) maxEnemies = engine.enemies.length;
}
engine.clearTouch();
const ms = Date.now() - t0;
const hud = engine.getHud();
console.log(JSON.stringify({
  time: hud.time,
  level: hud.level,
  kills: hud.kills,
  coins: hud.coins,
  maxEnemies,
  levelUps: events.level,
  chests: events.chest,
  banners: events.banners,
  bossAlive: !!engine.bossRef,
  weapons: hud.weapons.map((w) => `${w.id}:${w.level}`),
  passives: hud.passives.map((p) => `${p.id}:${p.level}`),
  simMs: ms,
  perFrameMs: (ms / FRAMES).toFixed(3),
}, null, 1));
engine.destroy();
