// Endgame balance validation: god-mode kite (HP refilled every frame by the
// TEST ONLY) so pathing limitations don't mask DPS / boss / chest curves.
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
    width: 960, height: 540, style: {},
    getContext: () => makeCtx(),
    getBoundingClientRect: () => ({ width: 960, height: 540, left: 0, top: 0 }),
    addEventListener() {}, removeEventListener() {},
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
const events = { level: 0, chest: 0, banners: [], bossKills: 0 };
let lastBoss = null;
const engine = new GameEngine(makeCanvas(), {
  characterId: "vesna",
  stageId: "thicket",
  endless: false,
  callbacks: {
    onLevelUp: (c) => {
      events.level++;
      const owned = c.find((x) => x.kind === "weapon" && !x.isNew) ?? c.find((x) => x.kind === "passive" && !x.isNew) ?? c[0];
      engine.pickUpgrade(owned);
    },
    onChest: (r) => {
      events.chest++;
      engine.closeChest();
    },
    onEnd: (s) => console.log("ENDED victory=" + s.victory, "time", s.time, "kills", s.kills, "level", s.level, "coins", s.coins),
    onBanner: (t) => events.banners.push(t),
    onToast() {},
    onAchievement() {},
    onSeen() {},
    onPauseChange() {},
  },
});

let farming = true, phase = 0;
const FRAMES = 15 * 60 * 60 + 120;
let maxEnemies = 0, prevKills = 0;
const samples = [];
for (let f = 0; f < FRAMES && !engine.gameEnded; f++) {
  engine.hp = engine.maxHp; // TEST-ONLY god mode
  phase++;
  const px = engine.px, py = engine.py;
  let cx = 0, cy = 0, near = 0, nearest = null, nd = Infinity;
  for (const e of engine.enemies) {
    const d = Math.hypot(e.x - px, e.y - py);
    if (d < 150) { near++; cx += e.x - px; cy += e.y - py; }
    if (d < nd) { nd = d; nearest = e; }
  }
  if (farming && (near >= 6 || phase > 90)) farming = false;
  if (!farming && (near <= 2 || phase > 200)) { farming = true; phase = 0; }
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
  if (f % 60 === 0) engine.render(); // stub renders are pixel-iteration heavy
  if (engine.enemies.length > maxEnemies) maxEnemies = engine.enemies.length;
  if (engine.bossRef !== lastBoss) {
    if (lastBoss) events.bossKills++;
    lastBoss = engine.bossRef;
  }
  if (f % (60 * 60) === 0) {
    samples.push({ min: f / 3600, kills: engine.kills - prevKills, level: engine.level, alive: engine.enemies.length });
    prevKills = engine.kills;
  }
}
if (lastBoss === null && events.bannerBossCount !== 0) events.bossKills++;
console.log(JSON.stringify({
  endTime: engine.time.toFixed(1),
  totalKills: engine.kills,
  level: engine.level,
  coins: engine.coins,
  maxEnemies,
  levelUps: events.level,
  chests: events.chest,
  bossKills: events.bossKills,
  banners: events.banners,
  weapons: engine.getHud().weapons.map((w) => `${w.id}:${w.level}`),
  passives: engine.getHud().passives.map((p) => `${p.id}:${p.level}`),
  hourly: samples,
}, null, 1));
engine.destroy();
