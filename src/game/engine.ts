// Hearthwarden: Ember Trail — self-contained 2.5D platformer engine.
// Fixed 60 Hz simulation, integer-scaled pixel output, locked art palette.
import { drawText, measureText } from "./font";
import {
  LEVELS,
  SOLID_TILES,
  TILE,
  type LevelData,
  type TileChar,
} from "./levels";

export const VIEW_W = 320;
export const VIEW_H = 180;

const GRAVITY = 0.45;
const MAX_FALL = 9;
const RUN_ACCEL = 0.4;
const AIR_ACCEL = 0.28;
const RUN_MAX = 2.6;
const GROUND_FRICTION = 0.35;
const JUMP_V = -8.6;
const JUMP_CUT = -3.2;
const DOUBLE_JUMP_V = -8;
const WALL_SLIDE_MAX = 1.1;
const WALL_JUMP_X = 3.1;
const WALL_JUMP_Y = -8.2;
const DASH_SPEED = 5.6;
const DASH_FRAMES = 8;
const DASH_COOLDOWN = 50;
const COYOTE_FRAMES = 6;
const BUFFER_FRAMES = 6;
const STOMP_V = -7.2;
const INVULN_FRAMES = 90;
const WALL_LOCK_FRAMES = 6;
const BOSS_W = 40;
const BOSS_H = 44;
const BOSS_MAX_HP = 9;
const BOSS_HITS_PER_PHASE = 3;

type GameState = "title" | "playing" | "paused" | "complete" | "finished";
type TouchControl = "left" | "right" | "jump" | "dash";

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Images {
  hero: HTMLImageElement;
  thornling: HTMLImageElement;
  wisp: HTMLImageElement;
  tiles: HTMLImageElement;
  shard: HTMLImageElement;
  heart: HTMLImageElement;
  lantern: HTMLImageElement;
  hearth: HTMLImageElement;
  sprout: HTMLImageElement;
  briarheart: HTMLImageElement;
  seed: HTMLImageElement;
  sky: HTMLImageElement;
  far: HTMLImageElement;
  mid: HTMLImageElement;
  fore: HTMLImageElement;
}

interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  facing: 1 | -1;
  grounded: boolean;
  wallDir: -1 | 0 | 1;
  coyote: number;
  jumpBuffer: number;
  hasDoubleJump: boolean;
  dashTimer: number;
  dashCooldown: number;
  wallLock: number;
  invuln: number;
  hp: number;
  animTime: number;
  trail: { x: number; y: number; facing: 1 | -1 }[];
}

interface Enemy {
  id: number;
  kind: "thornling" | "wisp";
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  dir: 1 | -1;
  baseX: number;
  baseY: number;
  animTime: number;
  state: "alive" | "squashed" | "dead";
  squashTimer: number;
}

interface Pickup {
  id: string;
  kind: "shard" | "heart";
  x: number;
  y: number;
  taken: boolean;
  animTime: number;
}

interface Lantern {
  id: number;
  x: number;
  y: number;
  lit: boolean;
}

interface Sprout {
  x: number;
  y: number;
  timer: number;
  harvested: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

type BossState = "idle" | "windup" | "exposed" | "hurt" | "defeated";

interface Seed {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Boss {
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  state: BossState;
  timer: number;
  volleyStep: number;
  animTime: number;
  seeds: Seed[];
}

interface RuntimeLevel {
  data: LevelData;
  worldW: number;
  worldH: number;
  enemies: Enemy[];
  pickups: Pickup[];
  lanterns: Lantern[];
  hearth: { x: number; y: number };
  sprouts: Sprout[];
  boss: Boss | null;
  respawnX: number;
  respawnY: number;
  persistentTaken: Set<string>;
  litLanterns: Set<number>;
}

const HEX = {
  ink: "#16131F",
  panel: "#211C2E",
  stone2: "#3A3646",
  ember3: "#E8782C",
  ember4: "#F7B733",
  ember5: "#FFE9A8",
  teal5: "#49A8B0",
  red3: "#9C3540",
  parch1: "#D8C9A3",
  parch2: "#F0E6C8",
  fol5: "#6AA252",
};

class Sfx {
  private ctx: AudioContext | null = null;
  muted = false;

  private ensure(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx) {
      try {
        this.ctx = new AudioContext();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  private blip(
    freq: number,
    duration: number,
    type: OscillatorType,
    slideTo?: number,
    volume = 0.08,
  ): void {
    const ctx = this.ensure();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(30, slideTo),
        ctx.currentTime + duration,
      );
    }
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  jump(): void {
    this.blip(320, 0.14, "square", 620);
  }
  doubleJump(): void {
    this.blip(480, 0.16, "triangle", 880);
  }
  dash(): void {
    this.blip(220, 0.16, "sawtooth", 90, 0.06);
  }
  stomp(): void {
    this.blip(180, 0.12, "square", 70);
  }
  coin(): void {
    this.blip(740, 0.07, "square");
    window.setTimeout(() => this.blip(990, 0.1, "square"), 70);
  }
  heart(): void {
    this.blip(520, 0.18, "sine", 780);
  }
  hurt(): void {
    this.blip(160, 0.25, "sawtooth", 60, 0.1);
  }
  checkpoint(): void {
    this.blip(440, 0.12, "triangle");
    window.setTimeout(() => this.blip(660, 0.16, "triangle"), 110);
  }
  goal(): void {
    [523, 659, 784, 1047].forEach((f, i) =>
      window.setTimeout(() => this.blip(f, 0.2, "triangle", undefined, 0.09), i * 130),
    );
  }
  bossHit(): void {
    this.blip(240, 0.14, "square", 90, 0.09);
  }
  bossRoar(): void {
    this.blip(110, 0.4, "sawtooth", 55, 0.1);
  }
}

export class PlatformerGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private images: Images | null = null;
  private raf = 0;
  private lastTime = 0;
  private accumulator = 0;
  private state: GameState = "title";
  private levelIndex = 0;
  private runtime: RuntimeLevel | null = null;
  private player: Player | null = null;
  private particles: Particle[] = [];
  private camX = 0;
  private camY = 0;
  private shake = 0;
  private globalTime = 0;
  private score = 0;
  private stompCombo = 0;
  private comboTimer = 0;
  private touch = { left: false, right: false, jump: false, dash: false };
  private keys = new Set<string>();
  private sfx = new Sfx();
  private readonly stepMs = 1000 / 60;
  private gpAxis = 0;
  private gpPrev = new Set<number>();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas context unavailable");
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;
  }

  async load(): Promise<void> {
    const names = {
      hero: "hero.png",
      thornling: "thornling.png",
      wisp: "wisp.png",
      tiles: "tiles.png",
      shard: "shard.png",
      heart: "heart.png",
      lantern: "lantern.png",
      hearth: "hearth.png",
      sprout: "sprout.png",
      briarheart: "briarheart.png",
      seed: "ember-seed.png",
      sky: "bg-sky.png",
      far: "bg-far.png",
      mid: "bg-mid.png",
      fore: "bg-fore.png",
    } as const;
    const entries = await Promise.all(
      Object.entries(names).map(
        ([key, file]) =>
          new Promise<[string, HTMLImageElement]>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve([key, img]);
            img.onerror = () => reject(new Error(`failed to load ${file}`));
            img.src = `/images/game/${file}`;
          }),
      ),
    );
    this.images = Object.fromEntries(entries) as unknown as Images;
  }

  start(): void {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.lastTime = performance.now();
    this.raf = window.requestAnimationFrame(this.loop);
  }

  destroy(): void {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  setTouch(control: TouchControl, pressed: boolean): void {
    this.touch[control] = pressed;
    if (pressed && control === "jump") this.queueJump();
    if (pressed && control === "dash") this.tryDash();
    if (pressed && (this.state === "title" || this.state === "complete" || this.state === "finished")) {
      this.confirm();
    }
  }

  togglePause(): void {
    if (this.state === "playing") this.state = "paused";
    else if (this.state === "paused") this.state = "playing";
  }

  toggleMute(): boolean {
    return this.sfx.toggleMute();
  }

  // -- input -------------------------------------------------------------

  private onKeyDown = (e: KeyboardEvent): void => {
    const code = e.code;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(code)) {
      e.preventDefault();
    }
    if (e.repeat) return;
    this.keys.add(code);
    if (code === "Space" || code === "ArrowUp" || code === "KeyW") this.queueJump();
    if (code === "ShiftLeft" || code === "ShiftRight" || code === "KeyJ") this.tryDash();
    if (code === "KeyP" || code === "Escape") this.togglePause();
    if (code === "KeyM") this.sfx.toggleMute();
    if (code === "Enter") this.confirm();
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
    if (["Space", "ArrowUp", "KeyW"].includes(e.code)) this.releaseJump();
  };

  private inputAxis(): -1 | 0 | 1 {
    const left = this.keys.has("ArrowLeft") || this.keys.has("KeyA") || this.touch.left;
    const right = this.keys.has("ArrowRight") || this.keys.has("KeyD") || this.touch.right;
    if (left && !right) return -1;
    if (right && !left) return 1;
    if (this.gpAxis < -0.25) return -1;
    if (this.gpAxis > 0.25) return 1;
    return 0;
  }

  // -- gamepad -----------------------------------------------------------

  private pollGamepad(): void {
    const navigatorRef = globalThis.navigator as
      | (Navigator & { getGamepads?: () => (Gamepad | null)[] })
      | undefined;
    const pads = navigatorRef?.getGamepads?.() ?? [];
    const pad = pads.find((g): g is Gamepad => g !== null);
    if (!pad) {
      this.gpAxis = 0;
      this.gpPrev.clear();
      return;
    }
    const stick = pad.axes[0] ?? 0;
    const dpadL = pad.buttons[14]?.pressed ?? false;
    const dpadR = pad.buttons[15]?.pressed ?? false;
    this.gpAxis = dpadL ? -1 : dpadR ? 1 : Math.abs(stick) > 0.25 ? stick : 0;

    const pressed = new Set<number>();
    pad.buttons.forEach((btn, i) => {
      if (btn.pressed) pressed.add(i);
    });
    const edge = (id: number): boolean => pressed.has(id) && !this.gpPrev.has(id);
    const jumpEdge = edge(0) || edge(1);
    const dashEdge = edge(2) || edge(3) || edge(5);
    const startEdge = edge(9);

    if (this.state === "playing") {
      if (jumpEdge) this.queueJump();
      if (dashEdge) this.tryDash();
      if (startEdge) this.togglePause();
    } else if (startEdge || jumpEdge) {
      this.confirm();
    }
    this.gpPrev = pressed;
  }

  private confirm(): void {
    if (this.state === "title") {
      this.levelIndex = 0;
      this.score = 0;
      this.loadLevel(0, false);
      this.state = "playing";
    } else if (this.state === "complete") {
      if (this.levelIndex + 1 < LEVELS.length) {
        this.levelIndex += 1;
        this.loadLevel(this.levelIndex, true);
        this.state = "playing";
      } else {
        this.state = "finished";
      }
    } else if (this.state === "finished") {
      this.state = "title";
    }
  }

  private queueJump(): void {
    if (this.state !== "playing" || !this.player) return;
    this.player.jumpBuffer = BUFFER_FRAMES;
  }

  private releaseJump(): void {
    if (this.player && this.player.vy < JUMP_CUT) this.player.vy = JUMP_CUT;
  }

  private tryDash(): void {
    const p = this.player;
    if (!p || this.state !== "playing") return;
    if (p.dashCooldown > 0 || p.dashTimer > 0) return;
    const axis = this.inputAxis();
    p.facing = axis === 0 ? p.facing : axis;
    p.dashTimer = DASH_FRAMES;
    p.dashCooldown = DASH_COOLDOWN;
    p.vy = 0;
    p.invuln = Math.max(p.invuln, DASH_FRAMES + 4);
    this.sfx.dash();
    this.burst(p.x + p.w / 2, p.y + p.h / 2, HEX.teal5, 8);
  }

  // -- level setup -------------------------------------------------------

  private loadLevel(index: number, carryProgress: boolean): void {
    const data = LEVELS[index];
    const worldW = data.width * TILE;
    const worldH = data.height * TILE;
    let spawnX = 2 * TILE;
    let spawnY = 9 * TILE;
    const enemies: Enemy[] = [];
    const pickups: Pickup[] = [];
    const lanterns: Lantern[] = [];
    let hearth = { x: worldW - 2 * TILE, y: 7 * TILE };
    let bossSpawn: { x: number; y: number } | null = null;
    let enemyId = 0;
    let lanternId = 0;
    for (const s of data.spawns) {
      const px = s.tx * TILE;
      const py = s.ty * TILE;
      if (s.kind === "player") {
        spawnX = px;
        spawnY = py;
      } else if (s.kind === "thornling") {
        enemies.push({
          id: enemyId++, kind: "thornling", x: px + 4, y: py - 4, w: 24, h: 24,
          vx: 0.6, vy: 0, dir: 1, baseX: px, baseY: py, animTime: 0,
          state: "alive", squashTimer: 0,
        });
      } else if (s.kind === "wisp") {
        enemies.push({
          id: enemyId++, kind: "wisp", x: px, y: py, w: 24, h: 26,
          vx: 0, vy: 0, dir: 1, baseX: px, baseY: py, animTime: 0,
          state: "alive", squashTimer: 0,
        });
      } else if (s.kind === "shard" || s.kind === "heart") {
        pickups.push({
          id: `${index}:${s.kind}:${s.tx},${s.ty}`, kind: s.kind,
          x: px, y: py, taken: false, animTime: Math.random() * 40,
        });
      } else if (s.kind === "lantern") {
        lanterns.push({ id: lanternId++, x: px, y: py, lit: false });
      } else if (s.kind === "hearth") {
        hearth = { x: px, y: py };
      } else if (s.kind === "boss") {
        bossSpawn = { x: px, y: py };
      }
    }
    const previous = carryProgress ? this.runtime : null;
    const runtime: RuntimeLevel = {
      data, worldW, worldH, enemies, pickups, lanterns, hearth,
      sprouts: [],
      boss: bossSpawn
        ? {
            x: bossSpawn.x,
            // rest the 44px-tall body on the ground row (row 10)
            y: 10 * TILE - BOSS_H,
            w: BOSS_W,
            h: BOSS_H,
            hp: BOSS_MAX_HP,
            maxHp: BOSS_MAX_HP,
            state: "idle",
            timer: 90,
            volleyStep: 0,
            animTime: 0,
            seeds: [],
          }
        : null,
      respawnX: spawnX, respawnY: spawnY,
      persistentTaken: previous ? new Set(previous.persistentTaken) : new Set<string>(),
      litLanterns: previous ? new Set(previous.litLanterns) : new Set<number>(),
    };
    for (const id of runtime.persistentTaken) {
      const pk = runtime.pickups.find((p) => p.id === id);
      if (pk) pk.taken = true;
    }
    runtime.lanterns.forEach((l) => {
      l.lit = runtime.litLanterns.has(l.id);
    });
    this.runtime = runtime;
    this.particles = [];
    this.stompCombo = 0;
    this.spawnPlayer(spawnX, spawnY);
    this.camX = 0;
    this.camY = 0;
  }

  private spawnPlayer(x: number, y: number): void {
    this.player = {
      x, y: y - 6, w: 16, h: 38, vx: 0, vy: 0, facing: 1,
      grounded: false, wallDir: 0, coyote: 0, jumpBuffer: 0,
      hasDoubleJump: true, dashTimer: 0, dashCooldown: 0, wallLock: 0,
      invuln: 0, hp: 3, animTime: 0, trail: [],
    };
  }

  // -- tile helpers ------------------------------------------------------

  private tileAt(tx: number, ty: number): TileChar {
    const rt = this.runtime;
    if (!rt) return " ";
    if (tx < 0 || tx >= rt.data.width || ty < 0 || ty >= rt.data.height) return " ";
    return rt.data.tiles[ty][tx];
  }

  private isSolidAtPx(px: number, py: number): boolean {
    return SOLID_TILES.has(this.tileAt(Math.floor(px / TILE), Math.floor(py / TILE)));
  }

  // -- main loop ---------------------------------------------------------

  private loop = (now: number): void => {
    this.raf = window.requestAnimationFrame(this.loop);
    let delta = now - this.lastTime;
    this.lastTime = now;
    if (delta > 100) delta = 100;
    this.pollGamepad();
    this.accumulator += delta;
    while (this.accumulator >= this.stepMs) {
      if (this.state === "playing") this.step();
      this.accumulator -= this.stepMs;
    }
    this.render();
  };

  private step(): void {
    const p = this.player;
    const rt = this.runtime;
    if (!p || !rt) return;
    this.globalTime += 1;
    if (this.shake > 0) this.shake -= 1;
    if (this.comboTimer > 0) {
      this.comboTimer -= 1;
      if (this.comboTimer === 0) this.stompCombo = 0;
    }
    this.updatePlayer(p);
    if (this.overlapsSpike(p)) this.damagePlayer(false);
    this.updateEnemies(rt);
    if (rt.boss) this.updateBoss(rt, rt.boss, p);
    this.updatePickups(rt, p);
    this.updateLanterns(rt, p);
    this.updateSprouts(rt, p);
    this.updateHearth(rt, p);
    this.updateParticles();
    this.updateCamera(p, rt);
  }

  // -- player physics ----------------------------------------------------

  private updatePlayer(p: Player): void {
    p.animTime += 1;
    if (p.invuln > 0) p.invuln -= 1;
    if (p.dashCooldown > 0) p.dashCooldown -= 1;
    if (p.wallLock > 0) p.wallLock -= 1;
    if (p.jumpBuffer > 0) p.jumpBuffer -= 1;

    const axis = p.wallLock > 0 ? 0 : this.inputAxis();
    const accel = p.grounded ? RUN_ACCEL : AIR_ACCEL;

    if (p.dashTimer > 0) {
      p.dashTimer -= 1;
      p.vx = p.facing * DASH_SPEED;
      p.vy = 0;
      if (p.dashTimer % 2 === 0) {
        p.trail.push({ x: p.x, y: p.y, facing: p.facing });
      }
    } else {
      if (axis !== 0) {
        p.vx += axis * accel;
        p.vx = Math.max(-RUN_MAX, Math.min(RUN_MAX, p.vx));
        p.facing = axis;
      } else if (p.grounded) {
        if (Math.abs(p.vx) <= GROUND_FRICTION) p.vx = 0;
        else p.vx -= Math.sign(p.vx) * GROUND_FRICTION;
      }
      p.vy = Math.min(MAX_FALL, p.vy + GRAVITY);
    }
    if (p.trail.length > 6) p.trail.shift();

    // wall detection before horizontal move
    p.grounded = false;
    p.wallDir = 0;
    this.moveX(p);
    this.moveY(p);
    // ground skin probe: keep grounded while resting within 2px of a solid
    // floor so gravity's first fractional step cannot cause 1-frame jitter
    if (!p.grounded && p.vy >= 0) {
      const ty = Math.floor((p.y + p.h + 1) / TILE);
      const left = Math.floor((p.x + 1) / TILE);
      const right = Math.floor((p.x + p.w - 2) / TILE);
      for (let tx = left; tx <= right; tx += 1) {
        if (SOLID_TILES.has(this.tileAt(tx, ty))) {
          p.grounded = true;
          p.y = ty * TILE - p.h;
          p.vy = 0;
          break;
        }
      }
    }

    // wall slide
    if (!p.grounded && p.wallDir !== 0 && axis === p.wallDir && p.vy > WALL_SLIDE_MAX) {
      p.vy = WALL_SLIDE_MAX;
    }

    // coyote time
    if (p.grounded) {
      p.coyote = COYOTE_FRAMES;
      p.hasDoubleJump = true;
    } else if (p.coyote > 0) {
      p.coyote -= 1;
    }

    // jumping: buffered ground/coyote jump, wall jump, then double jump
    if (p.jumpBuffer > 0) {
      if (!p.grounded && p.wallDir !== 0 && axis === p.wallDir) {
        p.vx = -p.wallDir * WALL_JUMP_X;
        p.vy = WALL_JUMP_Y;
        p.facing = (-p.wallDir) as 1 | -1;
        p.wallLock = WALL_LOCK_FRAMES;
        p.jumpBuffer = 0;
        p.hasDoubleJump = true;
        this.sfx.jump();
        this.burst(p.x + p.w / 2, p.y + p.h, HEX.parch1, 5);
      } else if (p.grounded || p.coyote > 0) {
        p.vy = JUMP_V;
        p.grounded = false;
        p.coyote = 0;
        p.jumpBuffer = 0;
        this.sfx.jump();
        this.burst(p.x + p.w / 2, p.y + p.h, HEX.fol5, 5);
      } else if (p.hasDoubleJump) {
        p.vy = DOUBLE_JUMP_V;
        p.hasDoubleJump = false;
        p.jumpBuffer = 0;
        this.sfx.doubleJump();
        this.ring(p.x + p.w / 2, p.y + p.h, HEX.teal5);
      }
    }

    // pit fall
    if (p.y > (this.runtime?.worldH ?? 192) + 24) {
      this.damagePlayer(true);
    }
  }

  private moveX(p: Player): void {
    p.x += p.vx;
    const top = Math.floor(p.y / TILE);
    const bottom = Math.floor((p.y + p.h - 1) / TILE);
    if (p.vx > 0) {
      const tx = Math.floor((p.x + p.w - 1) / TILE);
      for (let ty = top; ty <= bottom; ty += 1) {
        if (SOLID_TILES.has(this.tileAt(tx, ty))) {
          p.x = tx * TILE - p.w;
          p.vx = 0;
          p.wallDir = 1;
          break;
        }
      }
    } else if (p.vx < 0) {
      const tx = Math.floor(p.x / TILE);
      for (let ty = top; ty <= bottom; ty += 1) {
        if (SOLID_TILES.has(this.tileAt(tx, ty))) {
          p.x = (tx + 1) * TILE;
          p.vx = 0;
          p.wallDir = -1;
          break;
        }
      }
    }
    const rt = this.runtime;
    if (rt) p.x = Math.max(0, Math.min(rt.worldW - p.w, p.x));
  }

  private moveY(p: Player): void {
    const prevBottom = p.y + p.h;
    p.y += p.vy;
    const left = Math.floor(p.x / TILE);
    const right = Math.floor((p.x + p.w - 1) / TILE);
    if (p.vy >= 0) {
      const ty = Math.floor((p.y + p.h - 1) / TILE);
      for (let tx = left; tx <= right; tx += 1) {
        const tile = this.tileAt(tx, ty);
        const solid = SOLID_TILES.has(tile);
        const oneWay = tile === "P" && prevBottom <= ty * TILE + 4;
        if (solid || oneWay) {
          p.y = ty * TILE - p.h;
          p.vy = 0;
          p.grounded = true;
          break;
        }
      }
    } else if (p.vy < 0) {
      const ty = Math.floor(p.y / TILE);
      for (let tx = left; tx <= right; tx += 1) {
        if (SOLID_TILES.has(this.tileAt(tx, ty))) {
          p.y = (ty + 1) * TILE;
          p.vy = 0;
          break;
        }
      }
    }
  }

  // -- enemies -----------------------------------------------------------

  private updateEnemies(rt: RuntimeLevel): void {
    const p = this.player;
    if (!p) return;
    for (const e of rt.enemies) {
      e.animTime += 1;
      if (e.state === "squashed") {
        e.squashTimer -= 1;
        if (e.squashTimer <= 0) e.state = "dead";
        continue;
      }
      if (e.state === "dead") continue;

      if (e.kind === "thornling") {
        e.vx = e.dir * 0.55;
        e.vy = Math.min(MAX_FALL, e.vy + GRAVITY);
        e.x += e.vx;
        // wall turn: probe the body-height column just ahead
        const aheadX = e.dir > 0 ? e.x + e.w + 1 : e.x - 1;
        if (this.isSolidAtPx(aheadX, e.y + 6)) {
          e.dir = (e.dir * -1) as 1 | -1;
          e.x += e.dir * 2;
        }
        e.y += e.vy;
        if (this.isSolidAtPx(e.x + e.w / 2, e.y + e.h + 1)) {
          e.vy = 0;
          e.y = Math.floor((e.y + e.h) / TILE) * TILE - e.h;
          // ledge turn: no ground one step ahead
          const footX = e.dir > 0 ? e.x + e.w + 2 : e.x - 2;
          if (!this.isSolidAtPx(footX, e.y + e.h + 2)) {
            e.dir = (e.dir * -1) as 1 | -1;
          }
        }
      } else {
        // wisp: sine patrol around its anchor
        const t = e.animTime * 0.04;
        e.x = e.baseX + Math.sin(t * 0.7) * 26;
        e.y = e.baseY + Math.sin(t * 1.3) * 18;
        e.dir = Math.cos(t * 0.7) >= 0 ? 1 : -1;
      }

      if (!this.aabb(p, e)) continue;
      const playerFalling = p.vy > 0.5;
      const playerAbove = p.y + p.h - e.y < 12;
      if (p.dashTimer > 0) {
        this.defeatEnemy(rt, e, false);
      } else if (playerFalling && playerAbove) {
        this.defeatEnemy(rt, e, true);
        this.stompCombo += 1;
        this.comboTimer = 90;
        p.vy = Math.min(STOMP_V - (this.stompCombo - 1) * 0.6, -5.4);
        p.y = e.y - p.h - 1;
        this.sfx.stomp();
      } else {
        this.damagePlayer(false);
      }
    }
  }

  private defeatEnemy(rt: RuntimeLevel, e: Enemy, squash: boolean): void {
    if (squash) {
      e.state = "squashed";
      e.squashTimer = 22;
      rt.sprouts.push({ x: e.x + e.w / 2 - 8, y: e.y + e.h - 6, timer: 0, harvested: false });
    } else {
      e.state = "dead";
    }
    this.burst(e.x + e.w / 2, e.y + e.h / 2, HEX.ember4, 10);
  }

  private overlapsSpike(p: Player): boolean {
    const rt = this.runtime;
    if (!rt) return false;
    const x0 = Math.floor(p.x / TILE);
    const x1 = Math.floor((p.x + p.w - 1) / TILE);
    const y0 = Math.floor(p.y / TILE);
    const y1 = Math.floor((p.y + p.h - 1) / TILE);
    for (let ty = y0; ty <= y1; ty += 1) {
      for (let tx = x0; tx <= x1; tx += 1) {
        if (this.tileAt(tx, ty) === "^") return true;
      }
    }
    return false;
  }

  private aabb(a: Box, b: Box): boolean {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  private damagePlayer(fromPit: boolean): void {
    const p = this.player;
    const rt = this.runtime;
    if (!p || !rt) return;
    if (p.invuln > 0 && !fromPit) return;
    p.hp -= 1;
    this.shake = 10;
    this.sfx.hurt();
    this.burst(p.x + p.w / 2, p.y + p.h / 2, HEX.red3, 8);
    if (p.hp <= 0 || fromPit) {
      this.respawn(rt);
      return;
    }
    p.invuln = INVULN_FRAMES;
    p.vx = -p.facing * 2.4;
    p.vy = -4.2;
  }

  private respawn(rt: RuntimeLevel): void {
    this.spawnPlayer(rt.respawnX, rt.respawnY);
    const p = this.player!;
    p.hp = 3;
    p.invuln = 60;
    // reset enemies and un-persisted pickups
    for (const e of rt.enemies) {
      if (e.kind === "thornling") {
        e.state = "alive";
        e.x = e.baseX + 4;
        e.y = e.baseY - 4;
        e.dir = 1;
        e.vy = 0;
      } else {
        e.state = "alive";
      }
    }
    for (const pk of rt.pickups) {
      if (!rt.persistentTaken.has(pk.id)) pk.taken = false;
    }
    rt.sprouts = [];
    this.particles = [];
  }

  // -- pickups, lanterns, sprouts, goal ----------------------------------

  private updatePickups(rt: RuntimeLevel, p: Player): void {
    for (const pk of rt.pickups) {
      if (pk.taken) continue;
      pk.animTime += 1;
      const box: Box = { x: pk.x, y: pk.y, w: 16, h: 16 };
      if (!this.aabb(p, box)) continue;
      pk.taken = true;
      rt.persistentTaken.add(pk.id);
      if (pk.kind === "shard") {
        this.score += 1;
        this.sfx.coin();
        this.burst(pk.x + 8, pk.y + 8, HEX.ember4, 6);
      } else {
        p.hp = Math.min(3, p.hp + 1);
        this.sfx.heart();
        this.burst(pk.x + 8, pk.y + 8, HEX.red3, 8);
      }
    }
  }

  private updateLanterns(rt: RuntimeLevel, p: Player): void {
    for (const l of rt.lanterns) {
      const box: Box = { x: l.x, y: l.y - 8, w: 16, h: 24 };
      if (!l.lit && this.aabb(p, box)) {
        l.lit = true;
        rt.litLanterns.add(l.id);
        rt.respawnX = l.x;
        rt.respawnY = l.y;
        this.sfx.checkpoint();
        this.ring(l.x + 8, l.y + 4, HEX.ember5);
      }
    }
  }

  private updateSprouts(rt: RuntimeLevel, p: Player): void {
    for (const s of rt.sprouts) {
      if (!s.harvested) s.timer += 1;
      const stage = s.harvested ? 2 : Math.min(2, Math.floor(s.timer / 170));
      if (stage === 2 && !s.harvested) {
        const box: Box = { x: s.x, y: s.y - 10, w: 16, h: 16 };
        if (this.aabb(p, box)) {
          s.harvested = true;
          this.score += 3;
          this.sfx.coin();
          this.burst(s.x + 8, s.y - 2, HEX.ember5, 10);
        }
      }
    }
  }

  private updateHearth(rt: RuntimeLevel, p: Player): void {
    // the hearth stays sealed until the arena boss is defeated
    if (rt.boss && rt.boss.state !== "defeated") return;
    const box: Box = { x: rt.hearth.x, y: rt.hearth.y, w: 32, h: 48 };
    if (this.aabb(p, box)) {
      this.state = "complete";
      this.sfx.goal();
    }
  }

  // -- boss: BRIARHEART --------------------------------------------------

  private bossPhase(boss: Boss): number {
    const lost = boss.maxHp - boss.hp;
    return Math.min(3, 1 + Math.floor(lost / BOSS_HITS_PER_PHASE));
  }

  private updateBoss(rt: RuntimeLevel, boss: Boss, p: Player): void {
    boss.animTime += 1;
    if (boss.state === "defeated") {
      this.updateSeeds(rt, boss, p);
      return;
    }
    boss.timer -= 1;

    switch (boss.state) {
      case "idle":
        if (boss.timer <= 0) {
          boss.state = "windup";
          boss.timer = 55;
          boss.volleyStep = 0;
          this.sfx.bossRoar();
        }
        break;
      case "windup":
        if (boss.timer <= 0) {
          boss.state = "exposed";
          boss.timer = 100;
          this.ring(boss.x + boss.w / 2, boss.y + boss.h / 2, HEX.ember5);
        }
        break;
      case "exposed": {
        // staggered seed volleys, denser in later phases
        const fireAt = [15, 50, 85].slice(0, this.bossPhase(boss) + 1);
        if (fireAt.includes(100 - boss.timer) && boss.volleyStep < fireAt.length) {
          this.fireSeeds(boss, p, boss.volleyStep);
          boss.volleyStep += 1;
        }
        if (boss.timer <= 0) {
          boss.state = "idle";
          boss.timer = 110;
        }
        break;
      }
      case "hurt":
        if (boss.timer <= 0) {
          boss.state = boss.hp <= 0 ? "defeated" : "idle";
          boss.timer = boss.state === "defeated" ? 0 : 90;
          if (boss.state === "defeated") this.onBossDefeated(rt, boss);
        }
        break;
      default:
        break;
    }

    this.bossContact(boss, p);
    this.updateSeeds(rt, boss, p);
  }

  private fireSeeds(boss: Boss, p: Player, volley: number): void {
    const originX = boss.x + boss.w / 2;
    const originY = boss.y + 14;
    const dx = p.x + p.w / 2 - originX;
    const base = Math.atan2(p.y - originY, dx);
    const count = this.bossPhase(boss) + 1;
    const speed = 1.7 + this.bossPhase(boss) * 0.35;
    for (let i = 0; i < count; i += 1) {
      const spread = (i - (count - 1) / 2) * 0.32;
      const angle = base + spread + volley * 0.12;
      boss.seeds.push({
        x: originX - 6,
        y: originY - 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        life: 260,
      });
    }
  }

  private updateSeeds(rt: RuntimeLevel, boss: Boss, p: Player): void {
    const remaining: Seed[] = [];
    for (const s of boss.seeds) {
      s.vy = Math.min(5, s.vy + 0.18);
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 1;
      const box: Box = { x: s.x, y: s.y, w: 12, h: 12 };
      // dashing through a seed shatters it (dash already grants i-frames)
      if (p.dashTimer > 0 && this.aabb(p, box)) {
        this.burst(s.x + 6, s.y + 6, HEX.teal5, 5);
        continue;
      }
      if (this.aabb(p, box) && p.invuln === 0) {
        this.damagePlayer(false);
      }
      const floorTileY = Math.floor((s.y + 12) / TILE);
      const tileX = Math.floor((s.x + 6) / TILE);
      const hitFloor = SOLID_TILES.has(this.tileAt(tileX, floorTileY));
      if (s.life > 0 && !hitFloor && s.x > 0 && s.x < rt.worldW) {
        remaining.push(s);
      } else if (hitFloor) {
        this.burst(s.x + 6, s.y + 10, HEX.ember3, 4);
      }
    }
    boss.seeds = remaining;
  }

  private bossContact(boss: Boss, p: Player): void {
    if (!this.aabb(p, boss)) return;
    const landingOnTop = p.vy > 0.5 && p.y + p.h - boss.y < 14;
    if (boss.state === "exposed" && landingOnTop) {
      boss.hp -= 1;
      boss.state = "hurt";
      boss.timer = 26;
      boss.seeds = [];
      p.vy = STOMP_V;
      p.y = boss.y - p.h - 1;
      this.stompCombo += 1;
      this.comboTimer = 90;
      this.sfx.bossHit();
      this.burst(boss.x + boss.w / 2, boss.y + 6, HEX.ember5, 14);
      this.shake = 8;
    } else if (p.dashTimer === 0 && p.invuln === 0) {
      this.damagePlayer(false);
    }
  }

  private onBossDefeated(rt: RuntimeLevel, boss: Boss): void {
    this.shake = 18;
    this.sfx.goal();
    for (let i = 0; i < 5; i += 1) {
      this.burst(
        boss.x + Math.random() * boss.w,
        boss.y + Math.random() * boss.h,
        i % 2 === 0 ? HEX.ember4 : HEX.fol5,
        12,
      );
    }
    this.ring(boss.x + boss.w / 2, boss.y + boss.h / 2, HEX.ember5);
    // consolation heart right where the brute fell
    rt.pickups.push({
      id: `${rt.data.name}:boss-heart`,
      kind: "heart",
      x: boss.x + boss.w / 2 - 8,
      y: boss.y + boss.h - 16,
      taken: false,
      animTime: 0,
    });
  }

  // -- particles ---------------------------------------------------------

  private burst(x: number, y: number, color: string, count: number): void {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 1.4;
      const life = 18 + Math.floor(Math.random() * 14);
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        life, maxLife: life, color,
        size: Math.random() < 0.4 ? 2 : 1,
      });
    }
  }

  private ring(x: number, y: number, color: string): void {
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      this.particles.push({
        x, y, vx: Math.cos(angle) * 1.4, vy: Math.sin(angle) * 1.4,
        life: 16, maxLife: 16, color, size: 1,
      });
    }
  }

  private updateParticles(): void {
    for (const pt of this.particles) {
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.08;
      pt.life -= 1;
    }
    this.particles = this.particles.filter((pt) => pt.life > 0);
  }

  private updateCamera(p: Player, rt: RuntimeLevel): void {
    const targetX = p.x + p.w / 2 - VIEW_W / 2;
    const targetY = p.y + p.h / 2 - VIEW_H / 2;
    this.camX += (targetX - this.camX) * 0.12;
    this.camY += (targetY - this.camY) * 0.12;
    this.camX = Math.max(0, Math.min(rt.worldW - VIEW_W, this.camX));
    this.camY = Math.max(0, Math.min(rt.worldH - VIEW_H, this.camY));
  }

  // -- rendering ---------------------------------------------------------

  private frame(
    img: HTMLImageElement,
    sx: number, sy: number, sw: number, sh: number,
    dx: number, dy: number, flip = false,
  ): void {
    const ctx = this.ctx;
    ctx.save();
    if (flip) {
      ctx.translate(Math.round(dx) + sw, Math.round(dy));
      ctx.scale(-1, 1);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    } else {
      ctx.drawImage(img, sx, sy, sw, sh, Math.round(dx), Math.round(dy), sw, sh);
    }
    ctx.restore();
  }

  private parallax(img: HTMLImageElement, factor: number, yOff = 0): void {
    const offset = -((this.camX * factor) % img.width);
    const y = Math.round(-this.camY * factor * 0.4 + yOff);
    for (let x = offset - img.width; x < VIEW_W; x += img.width) {
      this.ctx.drawImage(img, Math.round(x), y);
    }
  }

  private render(): void {
    const ctx = this.ctx;
    const img = this.images;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = HEX.ink;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    if (!img || !this.runtime || !this.player) {
      this.renderTitleSplash();
      return;
    }
    const rt = this.runtime;
    const shakeX = this.shake > 0 ? (Math.random() * 2 - 1) * 2 : 0;
    const shakeY = this.shake > 0 ? (Math.random() * 2 - 1) * 2 : 0;
    const camX = Math.floor(this.camX + shakeX);
    const camY = Math.floor(this.camY + shakeY);

    this.parallax(img.sky, 0.05);
    this.parallax(img.far, 0.25);
    this.parallax(img.mid, 0.55);

    ctx.save();
    ctx.translate(-camX, -camY);
    this.renderTiles(rt, img, camX, camY);
    this.renderSprouts(rt, img);
    this.renderPickups(rt, img);
    this.renderLanterns(rt, img);
    this.frame(img.hearth, 0, 0, 32, 48, rt.hearth.x, rt.hearth.y);
    this.renderEnemies(rt, img);
    if (rt.boss) this.renderBoss(rt.boss, img);
    this.renderPlayer(img);
    this.renderParticles();
    ctx.restore();

    this.parallax(img.fore, 1.15);
    this.renderHud(rt);
    if (this.state !== "playing") this.renderOverlay();
  }

  private renderTiles(rt: RuntimeLevel, img: Images, camX: number, camY: number): void {
    const x0 = Math.max(0, Math.floor(camX / TILE));
    const x1 = Math.min(rt.data.width - 1, Math.ceil((camX + VIEW_W) / TILE));
    const y0 = Math.max(0, Math.floor(camY / TILE));
    const y1 = Math.min(rt.data.height - 1, Math.ceil((camY + VIEW_H) / TILE));
    const tileIndex: Record<string, number> = {
      "#": 0, "=": 1, S: 2, B: 3, P: 4, "^": 5, W: 6, M: 7,
    };
    for (let ty = y0; ty <= y1; ty += 1) {
      for (let tx = x0; tx <= x1; tx += 1) {
        const ch = rt.data.tiles[ty][tx];
        if (ch === " ") continue;
        const idx = tileIndex[ch];
        this.frame(img.tiles, idx * 16, 0, 16, 16, tx * 16, ty * 16);
      }
    }
  }

  private renderPlayer(img: Images): void {
    const p = this.player!;
    // dash afterimages
    for (const t of p.trail) {
      ctxSetAlpha(this.ctx, 0.25);
      this.frame(img.hero, 5 * 32, 0, 32, 48, t.x - 8, t.y - 10, t.facing === -1);
    }
    ctxSetAlpha(this.ctx, 1);
    // blink while invulnerable
    if (p.invuln > 0 && Math.floor(p.invuln / 4) % 2 === 0 && p.dashTimer === 0) {
      ctxSetAlpha(this.ctx, 0.4);
    }
    let frameIdx = 0;
    if (!p.grounded) {
      frameIdx = p.vy < 0 ? 5 : 6;
    } else if (Math.abs(p.vx) > 0.3) {
      frameIdx = 1 + (Math.floor(p.animTime / 8) % 4);
    }
    this.frame(img.hero, frameIdx * 32, 0, 32, 48, p.x - 8, p.y - 10, p.facing === -1);
    ctxSetAlpha(this.ctx, 1);
  }

  private renderEnemies(rt: RuntimeLevel, img: Images): void {
    for (const e of rt.enemies) {
      if (e.state === "dead") continue;
      if (e.kind === "thornling") {
        if (e.state === "squashed") {
          this.frame(img.thornling, 2 * 32, 0, 32, 32, e.x - 4, e.y - 4);
        } else {
          const f = Math.floor(e.animTime / 14) % 2;
          this.frame(img.thornling, f * 32, 0, 32, 32, e.x - 4, e.y - 4, e.dir === -1);
        }
      } else {
        const f = Math.floor(e.animTime / 10) % 2;
        this.frame(img.wisp, f * 32, 0, 32, 32, e.x - 4, e.y - 3, e.dir === -1);
      }
    }
  }

  private renderPickups(rt: RuntimeLevel, img: Images): void {
    for (const pk of rt.pickups) {
      if (pk.taken) continue;
      const bob = Math.round(Math.sin(pk.animTime * 0.08) * 2);
      if (pk.kind === "shard") {
        const f = Math.floor(pk.animTime / 10) % 4;
        this.frame(img.shard, f * 16, 0, 16, 16, pk.x, pk.y + bob);
      } else {
        this.frame(img.heart, 0, 0, 16, 16, pk.x, pk.y + bob);
      }
    }
  }

  private renderLanterns(rt: RuntimeLevel, img: Images): void {
    for (const l of rt.lanterns) {
      this.frame(img.lantern, l.lit ? 16 : 0, 0, 16, 24, l.x, l.y - 8);
    }
  }

  private renderSprouts(rt: RuntimeLevel, img: Images): void {
    for (const s of rt.sprouts) {
      const stage = s.harvested ? 2 : Math.min(2, Math.floor(s.timer / 170));
      this.frame(img.sprout, stage * 16, 0, 16, 16, s.x, s.y);
    }
  }

  private renderBoss(boss: Boss, img: Images): void {
    if (boss.state !== "defeated") {
      const frame = boss.state === "windup" ? 1 : boss.state === "exposed" ? 2 : 0;
      this.frame(img.briarheart, frame * 48, 0, 48, 48, boss.x - 4, boss.y - 4);
    }
    for (const s of boss.seeds) {
      const spin = Math.floor(boss.animTime / 6) % 2;
      this.frame(img.seed, 0, 0, 12, 12, s.x, s.y, spin === 1);
    }
  }

  private renderParticles(): void {
    const ctx = this.ctx;
    for (const pt of this.particles) {
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color;
      ctx.fillRect(Math.round(pt.x), Math.round(pt.y), pt.size, pt.size);
    }
    ctx.globalAlpha = 1;
  }

  private renderHud(rt: RuntimeLevel): void {
    const ctx = this.ctx;
    // top scrim for legibility
    ctx.fillStyle = "rgba(22,19,31,0.55)";
    ctx.fillRect(0, 0, VIEW_W, 18);
    const p = this.player!;
    for (let i = 0; i < 3; i += 1) {
      if (i < p.hp) this.frame(this.images!.heart, 0, 0, 16, 16, 4 + i * 13, 2);
      else {
        ctx.fillStyle = HEX.stone2;
        ctx.fillRect(5 + i * 13, 4, 10, 9);
      }
    }
    // ember charge + dash pips
    const pipX = 52;
    drawText(ctx, "EMBER", pipX, 5, HEX.parch1, 1);
    ctx.fillStyle = p.hasDoubleJump ? HEX.ember4 : HEX.stone2;
    ctx.fillRect(pipX + 34, 5, 6, 6);
    ctx.fillStyle = p.dashCooldown === 0 ? HEX.teal5 : HEX.stone2;
    ctx.fillRect(pipX + 43, 5, 6, 6);
    // shard counter
    this.frame(this.images!.shard, 0, 0, 16, 16, VIEW_W - 78, 1);
    drawText(ctx, `X ${String(this.score).padStart(2, "0")}`, VIEW_W - 60, 5, HEX.parch2, 1);
    // level name
    const name = rt.data.name;
    drawText(ctx, name, Math.floor((VIEW_W - measureText(name)) / 2), 11, HEX.parch1, 1);

    // boss bar: centered beneath the scrim while BRIARHEART is alive
    if (rt.boss && rt.boss.state !== "defeated") {
      const barW = 128;
      const bx = Math.floor((VIEW_W - barW) / 2);
      const by = 22;
      const label = "BRIARHEART";
      drawText(ctx, label, Math.floor((VIEW_W - measureText(label)) / 2), by - 8, HEX.ember5, 1);
      ctx.fillStyle = HEX.ink;
      ctx.fillRect(bx - 1, by - 1, barW + 2, 8);
      ctx.fillStyle = HEX.stone2;
      ctx.fillRect(bx, by, barW, 6);
      const ratio = Math.max(0, rt.boss.hp / rt.boss.maxHp);
      ctx.fillStyle = HEX.ember3;
      ctx.fillRect(bx, by, Math.round(barW * ratio), 6);
      ctx.fillStyle = HEX.ember4;
      ctx.fillRect(bx, by, Math.round(barW * ratio), 1);
    }
  }

  private renderOverlay(): void {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(22,19,31,0.72)";
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    if (this.state === "title") {
      this.renderTitleSplash();
    } else if (this.state === "paused") {
      this.centered("PAUSED", 70, HEX.parch2, 2);
      this.centered("P TO RESUME", 104, HEX.parch1, 1);
    } else if (this.state === "complete") {
      this.centered("HEARTH LIT", 56, HEX.ember5, 2);
      this.centered(`SHARDS ${this.score}`, 92, HEX.parch2, 1);
      this.centered("ENTER FOR NEXT TRAIL", 116, HEX.parch1, 1);
    } else if (this.state === "finished") {
      this.centered("TRAIL COMPLETE", 56, HEX.ember5, 2);
      this.centered(`FINAL SHARDS ${this.score}`, 92, HEX.parch2, 1);
      this.centered("ENTER TO RETURN", 116, HEX.parch1, 1);
    }
  }

  private renderTitleSplash(): void {
    this.centered("HEARTHWARDEN", 40, HEX.ember5, 3);
    this.centered("EMBER TRAIL", 70, HEX.parch2, 2);
    this.centered("ARROWS MOVE  SPACE JUMP  SHIFT DASH", 102, HEX.parch1, 1);
    this.centered("P PAUSE  M MUTE  -  ENTER OR TAP TO START", 116, HEX.parch1, 1);
    this.centered("GAMEPAD: A JUMP  X DASH  START PAUSE", 130, HEX.teal5, 1);
  }

  private centered(text: string, y: number, color: string, scale: number): void {
    drawText(this.ctx, text, Math.floor((VIEW_W - measureText(text, scale)) / 2), y, color, scale);
  }
}

function ctxSetAlpha(ctx: CanvasRenderingContext2D, alpha: number): void {
  ctx.globalAlpha = alpha;
}
