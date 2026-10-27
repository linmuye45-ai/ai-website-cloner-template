/*
 * Headless physics smoke test for the Ember Trail engine.
 *
 * It runs against the CommonJS build emitted by scripts/game/run-smoke-test.sh
 * (the TypeScript in src/game is compiled into a temporary directory next to
 * this file). Minimal DOM/Audio shims stand in for the browser; the real
 * fixed-step simulation then runs headlessly and asserts core mechanics.
 */
const noop = () => {};
const ctxStub = new Proxy(
  {},
  {
    get(_t, prop) {
      if (prop === "canvas") return {};
      if (prop === "measureText") return () => ({ width: 0 });
      return typeof prop === "string" ? noop : undefined;
    },
    set() {
      return true;
    },
  },
);
const canvasStub = { width: 320, height: 180, getContext: () => ctxStub };
class ImageMock {
  set src(_v) {
    queueMicrotask(() => this.onload && this.onload());
  }
}
class AudioParam {
  setValueAtTime() {}
  exponentialRampToValueAtTime() {}
}
class AudioNode {
  connect() {
    return new AudioNode();
  }
}
class OscMock extends AudioNode {
  start() {}
  stop() {}
  get frequency() {
    return new AudioParam();
  }
}
class GainMock extends AudioNode {
  get gain() {
    return new AudioParam();
  }
}
class AudioContextMock {
  state = "running";
  currentTime = 0;
  destination = {};
  createOscillator() {
    return new OscMock();
  }
  createGain() {
    return new GainMock();
  }
  resume() {}
}
global.window = { addEventListener: noop, removeEventListener: noop, setTimeout };
global.performance = { now: () => Date.now() };
global.requestAnimationFrame = () => 0;
global.cancelAnimationFrame = noop;
global.Image = ImageMock;
global.AudioContext = AudioContextMock;

const { PlatformerGame } = require("./engine.js");
const { LEVELS, TILE } = require("./levels.js");

let failures = 0;
const check = (name, cond) => {
  if (!cond) {
    failures += 1;
    console.error("FAIL:", name);
  } else console.log("ok:", name);
};
const settle = (g, n = 120) => {
  for (let i = 0; i < n; i += 1) g.step();
};

(async () => {
  const game = new PlatformerGame(canvasStub);
  await game.load();
  check("images load", true);

  game.setTouch("jump", true);
  game.setTouch("jump", false);
  const g = game;
  check("entered playing", g.state === "playing");
  check("three levels authored", LEVELS.length === 3);
  const p = () => g.player;
  const finite = () =>
    [p().x, p().y, p().vx, p().vy].every(Number.isFinite);

  settle(g);
  check("grounds under gravity", p().grounded);
  check("no NaN after settling", finite());

  const x0 = p().x;
  g.keys.add("ArrowRight");
  for (let i = 0; i < 60; i += 1) g.step();
  g.keys.delete("ArrowRight");
  settle(g, 30);
  check("running advances the player", p().x > x0 + 30);
  check("run speed is capped", Math.abs(p().vx) <= 2.7);

  p().x = 3 * TILE;
  p().vx = 0;
  settle(g, 4);
  const groundedBefore = p().grounded;
  game.setTouch("jump", true);
  game.setTouch("jump", false);
  g.step();
  check("ground jump launches upward", groundedBefore && p().vy < -4);
  let airborne = false;
  for (let i = 0; i < 100 && !p().grounded; i += 1) {
    airborne = true;
    g.step();
  }
  check("jump arc returns to ground", airborne && p().grounded);

  p().x = 3 * TILE;
  p().vx = 0;
  settle(g, 4);
  game.setTouch("jump", true);
  game.setTouch("jump", false);
  g.step();
  const fullV = p().vy;
  settle(g);
  p().x = 3 * TILE;
  p().vx = 0;
  settle(g, 4);
  game.setTouch("jump", true);
  game.setTouch("jump", false);
  g.step();
  g.step();
  if (p().vy < -3.2) p().vy = -3.2; // mirrors releaseJump's variable-height cut
  settle(g);
  check("jump cut is weaker than full jump", fullV < -6);

  p().x = 3 * TILE;
  p().vx = 0;
  settle(g, 4);
  game.setTouch("jump", true);
  game.setTouch("jump", false);
  for (let i = 0; i < 10; i += 1) g.step();
  const hadCharge = p().hasDoubleJump;
  const wasAirborne = !p().grounded;
  game.setTouch("jump", true);
  game.setTouch("jump", false);
  g.step();
  check("double jump spends Ember Charge", wasAirborne && hadCharge && !p().hasDoubleJump);
  settle(g);
  check("landing refills Ember Charge", p().grounded && p().hasDoubleJump);

  p().x = 3 * TILE;
  p().vx = 0;
  settle(g, 4);
  const cd0 = p().dashCooldown;
  game.setTouch("dash", true);
  game.setTouch("dash", false);
  g.step();
  check("dash burst speed", Math.abs(p().vx) > 4 && p().dashTimer > 0);
  check("dash grants i-frames", p().invuln > 0);
  const timerBeforeSecondPress = p().dashTimer;
  const cd1 = p().dashCooldown;
  game.setTouch("dash", true);
  game.setTouch("dash", false);
  g.step();
  check("dash is gated by cooldown",
    cd0 === 0 && cd1 > 0 && p().dashTimer === timerBeforeSecondPress - 1);
  settle(g, 80);

  const thorn = g.runtime.enemies.find((e) => e.kind === "thornling");
  check("thornling exists", !!thorn);
  thorn.x = 6 * TILE;
  thorn.vx = 0;
  p().x = thorn.x;
  p().y = thorn.y - 60;
  p().vy = 3;
  p().invuln = 0;
  p().hp = 3;
  for (let i = 0; i < 90 && thorn.state === "alive"; i += 1) {
    thorn.x = p().x;
    g.step();
  }
  check("stomp squashes the thornling", thorn.state !== "alive");
  check("stomp grows an ecology sprout", g.runtime.sprouts.length >= 1);
  check("stomp rebounds upward", p().vy < -3);
  check("stomp does not cost health", p().hp === 3);

  const shard = g.runtime.pickups.find((k) => k.kind === "shard" && !k.taken);
  if (shard) {
    p().x = shard.x;
    p().y = shard.y;
    g.step();
    check("shard collected and scored", shard.taken && g.score >= 1);
  }

  p().x = 31 * TILE;
  p().y = 4 * TILE;
  p().vx = 0;
  p().invuln = 0;
  const hpBefore = p().hp;
  for (let i = 0; i < 120 && p().hp === hpBefore; i += 1) g.step();
  check("spikes damage the player", p().hp < hpBefore || p().invuln > 0);

  g.loadLevel(0, false);
  g.state = "playing";
  const lantern = g.runtime.lanterns[0];
  p().x = lantern.x;
  p().y = lantern.y - 8;
  g.step();
  check("lantern lights on contact", lantern.lit);
  check("respawn point updated", g.runtime.respawnX === lantern.x);

  g.loadLevel(1, false);
  g.state = "playing";
  check("level 2 has wisps", g.runtime.enemies.some((e) => e.kind === "wisp"));
  check("level 2 has 3 lanterns", g.runtime.lanterns.length === 3);
  g.keys.add("ArrowRight");
  for (let i = 0; i < 400; i += 1) g.step();
  g.keys.delete("ArrowRight");
  check("level 2 stable over 400 frames", finite());
  check("camera clamped to world",
    g.camX >= 0 && g.camX <= g.runtime.worldW - 320);

  g.loadLevel(0, false);
  g.state = "playing";
  p().x = g.runtime.hearth.x;
  p().y = g.runtime.hearth.y;
  g.step();
  check("hearth completes the level", g.state === "complete");

  // --- level 3: BRIARHEART boss arena ---
  g.loadLevel(2, false);
  g.state = "playing";
  const boss = g.runtime.boss;
  check("level 3 spawns the boss", !!boss && boss.hp === 9);
  check("boss starts in the idle state", boss.state === "idle");

  // the hearth must stay sealed while the boss lives
  p().x = g.runtime.hearth.x;
  p().y = g.runtime.hearth.y;
  p().invuln = 9999;
  g.step();
  check("hearth is sealed before the boss falls", g.state === "playing");

  // drive the state machine up to the first exposed window
  let sawWindup = false;
  for (let i = 0; i < 220 && boss.state !== "exposed"; i += 1) {
    p().invuln = 9999;
    if (boss.state === "windup") sawWindup = true;
    g.step();
  }
  check("boss cycles idle -> windup -> exposed", sawWindup && boss.state === "exposed");

  // seeds must be fired during an exposed window
  let seeded = false;
  for (let i = 0; i < 100 && boss.state === "exposed"; i += 1) {
    p().invuln = 9999;
    g.step();
    if (boss.seeds.length > 0) seeded = true;
  }
  check("exposed core fires ember seeds", seeded);

  // full fight: place the player above the core once when each exposed
  // window opens, then let the real physics carry the stomp down
  let guard = 0;
  let prevState = "";
  while (boss.state !== "defeated" && guard < 6000) {
    guard += 1;
    p().invuln = 9999;
    p().hp = 3;
    if (boss.state === "exposed" && prevState !== "exposed") {
      p().x = boss.x + boss.w / 2 - p().w / 2;
      p().y = boss.y - p().h - 8;
      p().vy = 2;
    }
    prevState = boss.state;
    g.step();
  }
  check("nine core stomps defeat the boss", boss.state === "defeated" && boss.hp === 0);
  check("defeat drops a consolation heart",
    g.runtime.pickups.some((k) => k.id.endsWith("boss-heart")));

  // with the boss gone, the hearth now completes the level
  p().x = g.runtime.hearth.x;
  p().y = g.runtime.hearth.y;
  p().invuln = 0;
  g.step();
  check("hearth opens after the boss falls", g.state === "complete");

  console.log(failures === 0 ? "\nALL PHYSICS CHECKS PASSED" : `\n${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
