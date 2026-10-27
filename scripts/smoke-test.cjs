// Headless smoke test: stubs the DOM/canvas, drives the real GameEngine for
// thousands of frames and asserts core systems behave. Run after compiling
// src/game with tsconfig.smoke.json.
const path = require("path");

function makeCtx() {
  const grad = { addColorStop() {} };
  const handler = {
    get(_t, prop) {
      if (prop === "createRadialGradient" || prop === "createLinearGradient") return () => grad;
      if (prop === "measureText") return () => ({ width: 10 });
      if (prop === "getImageData")
        return (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h });
      if (typeof prop === "string") {
        // any method becomes a no-op, any property stays assignable
        return typeof prop === "string" && /^[a-z]/.test(prop) ? () => {} : undefined;
      }
      return undefined;
    },
    set() {
      return true;
    },
  };
  return new Proxy({}, handler);
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

const listeners = {};
globalThis.window = {
  devicePixelRatio: 1,
  innerWidth: 1280,
  innerHeight: 720,
  AudioContext: undefined,
  addEventListener: (k, fn) => (listeners[k] = fn),
  removeEventListener() {},
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
};
globalThis.document = {
  hidden: false,
  createElement: () => makeCanvas(),
  addEventListener() {},
  removeEventListener() {},
};
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const { GameEngine } = require(path.join(process.cwd(), ".smoke-build/engine.js"));
const { getSprite, ensureSprites } = require(path.join(process.cwd(), ".smoke-build/sprites.js"));
const { CHARACTERS, STAGES, ENEMIES, WEAPONS, PASSIVES } = require(path.join(
  process.cwd(),
  ".smoke-build/content.js",
));
const { commitRun, loadSave } = require(path.join(process.cwd(), ".smoke-build/storage.js"));

let failures = 0;
const assert = (cond, msg) => {
  if (!cond) {
    failures++;
    console.error("  ✗", msg);
  } else {
    console.log("  ✓", msg);
  }
};

// 1. Every sprite referenced by content exists and is not the fallback
ensureSprites();
const referenced = new Set();
for (const c of CHARACTERS) referenced.add(c.sprite);
for (const e of Object.values(ENEMIES)) referenced.add(e.sprite);
for (const w of Object.values(WEAPONS)) referenced.add(w.icon);
for (const p of Object.values(PASSIVES)) referenced.add(p.icon);
for (const s of STAGES) s.props.forEach((p) => referenced.add(p));
["gem_1", "gem_5", "gem_10", "coin", "chicken", "chest", "chest_open", "magnet", "proj_dagger", "proj_axe", "proj_book", "icon_skull", "icon_clock", "icon_trophy", "icon_star", "icon_sword", "icon_coin", "icon_book"].forEach((k) => referenced.add(k));
let missing = [];
for (const key of referenced) {
  const spr = getSprite(key);
  if (!spr || !spr.frames.length || spr.frames[0].width <= 8) missing.push(key);
}
assert(missing.length === 0, `all ${referenced.size} referenced sprites resolve (missing: ${missing.join(", ") || "none"})`);

// 2. Full engine run for every character × stage combo
const DT = 1 / 60;
for (const char of CHARACTERS) {
  for (const stage of STAGES) {
    const events = { level: 0, chest: 0, end: 0, banner: 0, ach: [] };
    const canvas = makeCanvas();
    const engine = new GameEngine(canvas, {
      characterId: char.id,
      stageId: stage.id,
      endless: false,
      callbacks: {
        onLevelUp: () => events.level++,
        onChest: () => events.chest++,
        onEnd: () => events.end++,
        onBanner: () => events.banner++,
        onToast: () => {},
        onAchievement: (id) => events.ach.push(id),
        onSeen: () => {},
        onPauseChange: () => {},
      },
    });
    engine.keys.add("d");
    engine.keys.add("s");
    for (let f = 0; f < 1200; f++) {
      engine.update(DT);
      engine.render();
    }
    const hud = engine.getHud();
    const damaged = engine.enemies.some((e) => e.hp < e.maxHp);
    assert(hud.time > 18, `${char.id}/${stage.id}: time advances (${hud.time.toFixed(1)}s)`);
    assert(engine.enemies.length > 0, `${char.id}/${stage.id}: enemies spawn (${engine.enemies.length} alive)`);
    assert(engine.kills > 0 || engine.projectiles.length > 0 || damaged, `${char.id}/${stage.id}: combat runs (kills=${engine.kills})`);
    engine.destroy();
  }
}

// 3. Level-up / upgrade system
{
  const engine = new GameEngine(makeCanvas(), {
    characterId: "vesna",
    stageId: "graveyard",
    endless: false,
    callbacks: {
      onLevelUp() {},
      onChest() {},
      onEnd() {},
      onBanner() {},
      onToast() {},
      onAchievement() {},
      onSeen() {},
      onPauseChange() {},
    },
  });
  engine.gainXp(600);
  assert(engine.levelUpQueue > 0 && engine.paused, "level gain pauses and queues upgrade choices");
  let guard = 0;
  while (engine.levelUpQueue > 0 && guard++ < 20) {
    const choices = engine.buildChoices();
    assert(choices.length >= 3 && choices.length <= 4, `choice count valid (${choices.length})`);
    engine.pickUpgrade(choices[0]);
  }
  assert(engine.level > 5, `multiple levels applied (level ${engine.level})`);
  assert(engine.weaponStates.size >= 1, "weapon slots populated");

  // max every base weapon and every relic → all eight evolutions enter the draft
  for (const def of Object.values(WEAPONS)) {
    if (def.evolvedFrom) continue;
    engine.weaponStates.set(def.id, { id: def.id, level: def.maxLevel, timer: 0, pendingSlashes: [], whipSide: 1, orbitHits: new Map() });
  }
  for (const id of Object.keys(PASSIVES)) engine.passiveLevels.set(id, PASSIVES[id].maxLevel);
  // every draft guarantees an evolution slot while any is eligible, and
  // repeated drafts eventually surface all eight evolutions
  const seenEvo = new Set();
  let everyDraftHasEvo = true;
  for (let i = 0; i < 60; i++) {
    const draft = engine.buildChoices();
    const offered = draft.filter((c) => c.evolution);
    if (offered.length === 0) everyDraftHasEvo = false;
    offered.forEach((c) => seenEvo.add(c.id));
  }
  assert(everyDraftHasEvo, "eligible evolution is guaranteed a slot in every draft");
  assert(seenEvo.size === 8, `all eight evolutions surface across drafts (got ${seenEvo.size})`);
  // once the evolved forms are owned too, nothing remains but Healing Salve
  for (const def of Object.values(WEAPONS)) {
    if (!def.evolvedFrom) continue;
    engine.weaponStates.set(def.id, { id: def.id, level: 1, timer: 0, pendingSlashes: [], whipSide: 1, orbitHits: new Map() });
  }
  const fallback = engine.buildChoices();
  assert(fallback[0].id === "heal_salve", "fully maxed build offers Healing Salve");
  engine.destroy();
}

// 4. Chest flow
{
  const engine = new GameEngine(makeCanvas(), {
    characterId: "aldric",
    stageId: "graveyard",
    endless: false,
    callbacks: {
      onLevelUp() {},
      onChest() {},
      onEnd() {},
      onBanner() {},
      onToast() {},
      onAchievement() {},
      onSeen() {},
      onPauseChange() {},
    },
  });
  const coinsBefore = engine.coins;
  engine.openChest();
  assert(engine.paused && engine.chestPending !== null, "chest pauses engine and builds reward");
  engine.closeChest();
  assert(!engine.paused && engine.coins > coinsBefore, "chest reward granted and run resumes");
  engine.destroy();
}

// 5. Death → end callback
{
  let ended = null;
  const engine = new GameEngine(makeCanvas(), {
    characterId: "crow",
    stageId: "library",
    endless: false,
    callbacks: {
      onLevelUp() {},
      onChest() {},
      onEnd: (s) => (ended = s),
      onBanner() {},
      onToast() {},
      onAchievement() {},
      onSeen() {},
      onPauseChange() {},
    },
  });
  engine.hp = 0;
  for (let f = 0; f < 120 && !ended; f++) engine.update(DT);
  assert(ended !== null && ended.victory === false, "death emits defeat run stats");
  engine.destroy();
}

// 6. Victory path
{
  let ended = null;
  const engine = new GameEngine(makeCanvas(), {
    characterId: "aldric",
    stageId: "graveyard",
    endless: false,
    callbacks: {
      onLevelUp() {},
      onChest() {},
      onEnd: (s) => (ended = s),
      onBanner() {},
      onToast() {},
      onAchievement() {},
      onSeen() {},
      onPauseChange() {},
    },
  });
  engine.time = 899;
  for (let f = 0; f < 600 && !ended; f++) engine.update(DT);
  assert(ended !== null && ended.victory === true, "reaching stage duration emits victory");
  engine.continueEndless();
  assert(engine.gameEnded === false, "endless continuation revives the run");
  for (let f = 0; f < 300; f++) engine.update(DT);
  assert(engine.gameEnded === false, "endless run does not re-trigger the victory ending");
  engine.destroy();
}

// 6b. New enemy archetypes
{
  const mkCb = () => ({ onLevelUp() {}, onChest() {}, onEnd() {}, onBanner() {}, onToast() {}, onAchievement() {}, onSeen() {}, onPauseChange() {} });
  const craft = (id, x, y) => {
    const def = ENEMIES[id];
    return {
      uid: engine_uid(), def, x, y, hp: def.hp * 4, maxHp: def.hp * 4,
      speed: def.speed, damage: def.damage, radius: def.radius, xpValue: def.xp,
      coinValue: def.coin, hitFlash: 0, knockX: 0, knockY: 0, phase: 0, frameT: 0,
      scale: 1, boss: false, touchCd: 0, spawnAnim: 0,
    };
  };
  let uid = 9000;
  function engine_uid() { return ++uid; }

  // ranged cultist fires bullets
  {
    const engine = new GameEngine(makeCanvas(), { characterId: "vesna", stageId: "graveyard", endless: false, callbacks: mkCb() });
    engine.enemies.push(craft("cultist", engine.px + 180, engine.py));
    let sawBullets = 0;
    for (let f = 0; f < 300; f++) { engine.update(DT); sawBullets = Math.max(sawBullets, engine.enemyBullets.length); }
    assert(sawBullets > 0, "cultist casts enemy projectiles");
    engine.destroy();
  }

  // charger beetle enters a dash phase
  {
    const engine = new GameEngine(makeCanvas(), { characterId: "vesna", stageId: "graveyard", endless: false, callbacks: mkCb() });
    const beetle = craft("beetle", engine.px + 120, engine.py);
    engine.enemies.push(beetle);
    let dashed = false;
    for (let f = 0; f < 400 && !dashed; f++) { engine.update(DT); if (beetle.charge && beetle.charge.phase === "dash") dashed = true; }
    assert(dashed, "grave beetle telegraphs then dashes");
    engine.destroy();
  }

  // exploder detonates near the player and leaves a light ring
  {
    const engine = new GameEngine(makeCanvas(), { characterId: "aldric", stageId: "graveyard", endless: false, callbacks: mkCb() });
    const bloater = craft("bloater", engine.px + 30, engine.py);
    engine.enemies.push(bloater);
    const ringsBefore = engine.rings.length;
    for (let f = 0; f < 200 && bloater.hp > 0; f++) engine.update(DT);
    assert(bloater.hp <= 0, "bloater detonates on its fuse");
    assert(engine.rings.some((r) => r.light && r.color === "#fb923c"), "explosion spawns a light burst ring");
    assert(engine.rings.length > ringsBefore, "explosion adds scene rings");
    engine.destroy();
  }

  // splitter slime breaks into two smaller slimes
  {
    const engine = new GameEngine(makeCanvas(), { characterId: "vesna", stageId: "graveyard", endless: false, callbacks: mkCb() });
    const slime = craft("slime", engine.px, engine.py);
    engine.enemies.push(slime);
    const before = engine.enemies.length;
    engine.damageEnemy(slime, 99999, 0);
    const children = engine.enemies.filter((e) => e.noSplit);
    assert(children.length === 2, `slime splits into two minis (got ${children.length})`);
    assert(engine.enemies.length >= before + 1, "splitter children join the horde");
    engine.destroy();
  }

  // reroll and skip meta controls
  {
    const engine = new GameEngine(makeCanvas(), { characterId: "vesna", stageId: "graveyard", endless: false, callbacks: mkCb() });
    engine.gainXp(600);
    const first = engine.buildChoices();
    assert(first.length >= 3, "initial draft is well-formed before reroll");
    const rerolled = engine.rerollChoices();
    assert(rerolled !== null && engine.rerollsLeft === 1, "reroll returns fresh choices and decrements the budget");
    assert(Array.isArray(rerolled) && rerolled.length >= 3, "rerolled draft is well-formed");
    const queued = engine.levelUpQueue;
    engine.skipUpgrade();
    assert(engine.levelUpQueue === queued - 1, "skip resolves one pending level-up");
    engine.destroy();
  }
}

// 6c. Weapon evolution and boss phase 2
{
  const mkCb = (extra = {}) => ({
    onLevelUp() {},
    onChest() {},
    onEnd() {},
    onBanner() {},
    onToast() {},
    onAchievement() {},
    onSeen() {},
    onPauseChange() {},
    ...extra,
  });

  // evolution eligibility and in-place slot replacement
  {
    let banners = 0;
    const ach = [];
    const engine = new GameEngine(makeCanvas(), {
      characterId: "vesna",
      stageId: "graveyard",
      endless: false,
      callbacks: mkCb({
        onBanner: () => banners++,
        onAchievement: (id) => ach.push(id),
      }),
    });
    engine.weaponStates.set("bolt", {
      id: "bolt", level: WEAPONS.bolt.maxLevel, timer: 0,
      pendingSlashes: [], whipSide: 1, orbitHits: new Map(),
    });
    // negative: relic one rank short → evolution withheld
    engine.passiveLevels.set("cooldown", PASSIVES.cooldown.maxLevel - 1);
    assert(
      engine.buildChoices().every((c) => c.id !== "bolt_evo"),
      "evolution withheld until the paired relic is also maxed",
    );
    // positive: max both → Tempest Scepter enters the draft
    engine.passiveLevels.set("cooldown", PASSIVES.cooldown.maxLevel);
    const evo = engine.buildChoices().find((c) => c.id === "bolt_evo");
    assert(!!evo && evo.evolution === true, "maxed weapon + maxed relic offers an evolution choice");
    const slotsBefore = engine.weaponStates.size;
    engine.pickUpgrade(evo);
    assert(!engine.weaponStates.has("bolt") && engine.weaponStates.has("bolt_evo"), "evolution replaces the base weapon in place");
    assert(engine.weaponStates.size === slotsBefore, "evolution reuses the slot, no slot bloat");
    assert(ach.includes("evolve_weapon") && banners > 0, "evolution fires achievement and banner");
    // evolved weapon keeps firing through the behavior-based weapon router
    let proj = 0;
    for (let f = 0; f < 240; f++) {
      engine.update(DT);
      proj = Math.max(proj, engine.projectiles.length);
    }
    assert(proj > 0, "evolved bolt weapon fires projectiles in combat");
    engine.destroy();
  }

  // every evolution definition resolves to a real base weapon, relic and behavior
  {
    let bad = [];
    for (const def of Object.values(WEAPONS)) {
      if (!def.evolvedFrom) continue;
      if (!WEAPONS[def.evolvedFrom] || !PASSIVES[def.requires] || def.maxLevel !== 1 || def.levels.length !== 1) {
        bad.push(def.id);
      }
    }
    assert(bad.length === 0, `all eight evolution defs are well-formed (bad: ${bad.join(",") || "none"})`);
  }

  // boss enrage at half health: stat spike, radial bullets and summon swarm
  {
    const engine = new GameEngine(makeCanvas(), {
      characterId: "aldric",
      stageId: "graveyard",
      endless: false,
      callbacks: mkCb(),
    });
    const def = ENEMIES.reaper;
    const boss = {
      uid: 5001, def, x: engine.px + 90, y: engine.py, hp: 10000, maxHp: 10000,
      speed: def.speed, damage: def.damage, radius: def.radius, xpValue: def.xp,
      coinValue: def.coin, hitFlash: 0, knockX: 0, knockY: 0, phase: 0, frameT: 0,
      scale: 1.5, boss: true, touchCd: 1, spawnAnim: 0,
    };
    engine.enemies.push(boss);
    engine.bossRef = boss;
    const enemiesBefore = engine.enemies.length;
    const speedBefore = boss.speed;
    engine.damageEnemy(boss, 5200, 0);
    assert(boss.enraged === true, "boss flips into enrage at half health");
    assert(boss.speed > speedBefore, "enrage raises movement speed");
    assert(engine.enemyBullets.length >= 10, "enrage unleashes a radial bullet burst");
    assert(engine.enemies.length >= enemiesBefore + 5, "enrage summons a minion swarm");
    assert(engine.getHud().bossEnraged === true, "HUD exposes the enrage flag");
    // the radial volley repeats on a timer
    const n0 = engine.enemyBullets.length;
    boss.castTimer = 0.05;
    for (let f = 0; f < 12; f++) engine.update(DT);
    assert(engine.enemyBullets.length >= n0 + 8, "enraged boss fires repeated radial volleys");
    // stability: enraged boss stays alive and simulating never throws
    for (let f = 0; f < 360; f++) {
      engine.update(DT);
      engine.hp = engine.maxHp;
    }
    assert(boss.hp > 0 && boss.enraged, "enraged boss persists through extended combat");
    engine.destroy();
  }

  // mercy rule: even an absurd hit cannot remove more than 45% of max HP
  {
    const engine = new GameEngine(makeCanvas(), {
      characterId: "vesna",
      stageId: "graveyard",
      endless: false,
      callbacks: mkCb(),
    });
    const max = engine.maxHp;
    engine.hp = max;
    engine.hurtPlayerAt(99999, 0, engine.px, engine.py);
    assert(engine.hp >= max * 0.54, `single-hit damage capped at 45% of max HP (${engine.hp}/${max} remaining)`);
    assert(engine.hp > 0, "capped hit can never one-shot a full-health build");
    engine.destroy();
  }
}

// 7. Storage / achievements
{
  const save = loadSave();
  const result = commitRun(save, {
    time: 900,
    kills: 520,
    level: 24,
    coins: 300,
    damageTaken: 40,
    gems: 400,
    victory: true,
    stageId: "graveyard",
    characterId: "aldric",
    weapons: ["whip"],
  });
  assert(result.save.coins >= 300, "coins banked after run");
  const expected = ["first_blood", "kill_100", "kill_500", "survive_5", "survive_10", "win_one", "level_20"];
  const allGranted = expected.every((id) => result.save.achievements.includes(id));
  assert(allGranted, `achievements evaluated (got: ${result.save.achievements.join(", ")})`);
}

console.log(failures === 0 ? "\nALL SMOKE TESTS PASSED" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
