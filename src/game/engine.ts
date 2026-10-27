import { audio } from "./audio";
import {
  CHARACTERS,
  ENEMIES,
  MAX_PASSIVE_SLOTS,
  MAX_WEAPON_SLOTS,
  PASSIVES,
  STAGES,
  WEAPONS,
} from "./content";
import { getSprite, getTintedSprite, makeGroundTile, type SpriteSheet } from "./sprites";
import type {
  CharacterDef,
  EnemyDef,
  HudState,
  RunStats,
  StageDef,
  UpgradeChoice,
} from "./types";

interface Enemy {
  uid: number;
  def: EnemyDef;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  radius: number;
  xpValue: number;
  coinValue: number;
  hitFlash: number;
  knockX: number;
  knockY: number;
  phase: number;
  frameT: number;
  scale: number;
  boss: boolean;
  touchCd: number;
  spawnAnim: number;
  castTimer?: number;
  charge?: { phase: "wind" | "dash"; t: number; dirX: number; dirY: number; cooldown: number };
  fuse?: number;
  noSplit?: boolean;
  enraged?: boolean;
}

interface EnemyBullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  life: number;
  color: string;
}

interface Projectile {
  kind: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  pierce: number;
  radius: number;
  life: number;
  angle: number;
  spin: number;
  hit: Set<number>;
  color: string;
  sprite?: SpriteSheet;
  homing?: boolean;
  arc?: { fx: number; fy: number; tx: number; ty: number; t: number; dur: number };
  area?: number;
}

interface Gem {
  x: number;
  y: number;
  value: number;
  bob: number;
  pulled: boolean;
}

interface Pickup {
  x: number;
  y: number;
  kind: "coin" | "chicken" | "chest" | "magnet";
  value: number;
  bob: number;
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
  ambient?: boolean;
}

interface DamageText {
  x: number;
  y: number;
  life: number;
  text: string;
  color: string;
  size: number;
}

interface Slash {
  x: number;
  y: number;
  side: number;
  life: number;
  maxLife: number;
  radius: number;
  damage: number;
  hit: Set<number>;
  color: string;
}

interface Zone {
  kind: "lightning" | "nova";
  x: number;
  y: number;
  life: number;
  maxLife: number;
  radius: number;
  damage: number;
  hit: Set<number>;
  color: string;
  delay: number;
}

interface Ring {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
  light?: number;
}

interface WeaponState {
  id: string;
  level: number;
  timer: number;
  pendingSlashes: number[];
  whipSide: number;
  orbitHits: Map<number, number>;
}

export interface ChestReward {
  coins: number;
  heal: number;
  upgrade: { id: string; name: string; icon: string; level: number } | null;
}

export interface EngineCallbacks {
  onLevelUp: (choices: UpgradeChoice[]) => void;
  onChest: (reward: ChestReward) => void;
  onEnd: (stats: RunStats) => void;
  onBanner: (text: string, sub?: string) => void;
  onToast: (text: string) => void;
  onAchievement: (id: string) => void;
  onSeen: (enemyId: string) => void;
  onPauseChange: (paused: boolean) => void;
}

const TAU = Math.PI * 2;

function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

function dist2(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function hash2(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

function xpNeeded(level: number): number {
  const n = level - 1;
  return Math.floor(6 + n * 2.4 + Math.pow(n, 1.45) * 0.9);
}

const whiteCache = new WeakMap<SpriteSheet, SpriteSheet>();

function getWhite(src: SpriteSheet): SpriteSheet {
  const cached = whiteCache.get(src);
  if (cached) return cached;
  const frames = src.frames.map((fc) => {
    const c = document.createElement("canvas");
    c.width = fc.width;
    c.height = fc.height;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(fc, 0, 0);
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 0) {
        d[i] = 255;
        d[i + 1] = 255;
        d[i + 2] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  });
  const sheet: SpriteSheet = { frames, w: src.w, h: src.h };
  whiteCache.set(src, sheet);
  return sheet;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cb: EngineCallbacks;
  private character: CharacterDef;
  private stage: StageDef;
  private endless: boolean;

  private raf = 0;
  private lastTs = 0;
  private dpr = 1;
  private viewW = 960;
  private viewH = 540;
  private groundPattern: CanvasPattern | null = null;

  // world state
  private px = 0;
  private py = 0;
  private hp = 100;
  private maxHp = 100;
  private xp = 0;
  private level = 1;
  private facing = 1;
  private walkT = 0;
  private regenAcc = 0;
  private invuln = 0;
  private camX = 0;
  private camY = 0;
  private shake = 0;
  private timeScale = 1;
  private time = 0;
  private kills = 0;
  private coins = 0;
  private damageTaken = 0;
  private gemsCollected = 0;
  private gameEnded = false;
  private victoryDone = false;
  private endTimer = 0;
  private pendingEnd: RunStats | null = null;
  private bossRef: Enemy | null = null;
  private bossSpawnedAt: number[] = [];
  private spawnAcc = 0;
  private levelUpQueue = 0;
  private magnetTimer = 0;
  private hitStop = 0;
  private rerollsLeft = 2;
  private weatherAcc = 0;
  private lastFuseToast = -10;
  private lightCanvas: HTMLCanvasElement;
  private lightCtx: CanvasRenderingContext2D;

  paused = false;
  private destroyed = false;

  private keys = new Set<string>();
  private touchVec: { x: number; y: number } | null = null;

  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private enemyBullets: EnemyBullet[] = [];
  private gems: Gem[] = [];
  private pickups: Pickup[] = [];
  private particles: Particle[] = [];
  private texts: DamageText[] = [];
  private slashes: Slash[] = [];
  private zones: Zone[] = [];
  private rings: Ring[] = [];
  private weaponStates = new Map<string, WeaponState>();
  private passiveLevels = new Map<string, number>();
  private seen = new Set<string>();
  private uidSeq = 1;
  private chestPending: ChestReward | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    opts: {
      characterId: string;
      stageId: string;
      endless: boolean;
      callbacks: EngineCallbacks;
    },
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.cb = opts.callbacks;
    this.character = CHARACTERS.find((c) => c.id === opts.characterId) ?? CHARACTERS[0];
    this.stage = STAGES.find((s) => s.id === opts.stageId) ?? STAGES[0];
    this.endless = opts.endless;

    this.maxHp = this.character.stats.maxHp;
    this.hp = this.maxHp;
    this.weaponStates.set(this.character.weapon, {
      id: this.character.weapon,
      level: 1,
      timer: 0.4,
      pendingSlashes: [],
      whipSide: 1,
      orbitHits: new Map(),
    });

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    document.addEventListener("visibilitychange", this.onVisibility);

    const tile = makeGroundTile(
      this.stage.ground.base,
      this.stage.ground.speckle,
      this.stage.ground.tile,
      this.stage.id.length * 999 + 7,
    );
    this.groundPattern = this.ctx.createPattern(tile, "repeat");
    this.lightCanvas = document.createElement("canvas");
    this.lightCtx = this.lightCanvas.getContext("2d")!;
    this.lightCanvas.width = Math.floor(this.viewW * this.dpr);
    this.lightCanvas.height = Math.floor(this.viewH * this.dpr);

    this.camX = this.px;
    this.camY = this.py;
    this.lastTs = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  // -------------------------------------------------------------------------
  // public API
  // -------------------------------------------------------------------------

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }

  setPaused(p: boolean): void {
    if (this.gameEnded || this.destroyed) return;
    this.paused = p;
    this.cb.onPauseChange(p);
  }

  togglePause(): void {
    if (this.levelUpQueue > 0 || this.chestPending) return;
    this.setPaused(!this.paused);
  }

  setTouch(x: number, y: number): void {
    this.touchVec = { x, y };
  }

  clearTouch(): void {
    this.touchVec = null;
  }

  getHud(): HudState {
    return {
      hp: Math.max(0, Math.ceil(this.hp)),
      maxHp: Math.round(this.maxHp),
      xpPct: clamp(this.xp / xpNeeded(this.level), 0, 1),
      level: this.level,
      time: this.time,
      kills: this.kills,
      coins: this.coins,
      bossHp: this.bossRef ? clamp(this.bossRef.hp / this.bossRef.maxHp, 0, 1) : null,
      bossName: this.bossRef ? this.bossRef.def.name : null,
      bossEnraged: this.bossRef?.enraged ?? false,
      paused: this.paused,
      rerolls: this.rerollsLeft,
      weapons: [...this.weaponStates.values()].map((w) => ({
        id: w.id,
        level: w.level,
        icon: WEAPONS[w.id].icon,
      })),
      passives: [...this.passiveLevels.entries()].map(([id, level]) => ({
        id,
        level,
        icon: PASSIVES[id].icon,
      })),
    };
  }

  pickUpgrade(choice: UpgradeChoice): void {
    if (choice.id === "heal_salve") {
      this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.3);
      this.spawnRing(this.px, this.py, 60, "#4ade80");
    } else if (choice.kind === "weapon") {
      const evoDef = WEAPONS[choice.id];
      if (evoDef.evolvedFrom) {
        // evolution consumes the base weapon's slot rather than adding one
        const old = this.weaponStates.get(evoDef.evolvedFrom);
        this.weaponStates.delete(evoDef.evolvedFrom);
        this.weaponStates.set(choice.id, {
          id: choice.id,
          level: 1,
          timer: 0.2,
          pendingSlashes: [],
          whipSide: old?.whipSide ?? 1,
          orbitHits: new Map(),
        });
        this.spawnRing(this.px, this.py, 150, evoDef.color);
        this.burst(this.px, this.py, 34, evoDef.color, 230);
        this.burst(this.px, this.py, 16, "#fde68a", 150);
        this.shake = 12;
        audio.play("unlock");
        this.cb.onBanner(evoDef.name, "Weapon evolved");
        this.cb.onAchievement("evolve_weapon");
      } else {
        const existing = this.weaponStates.get(choice.id);
        if (existing) existing.level = choice.level;
        else {
          this.weaponStates.set(choice.id, {
            id: choice.id,
            level: 1,
            timer: 0.3,
            pendingSlashes: [],
            whipSide: 1,
            orbitHits: new Map(),
          });
        }
        if (choice.level >= WEAPONS[choice.id].maxLevel) {
          this.cb.onAchievement("max_weapon");
        }
      }
    } else {
      this.passiveLevels.set(choice.id, choice.level);
      if (choice.id === "maxHp") {
        this.maxHp = this.computeStats().maxHp;
        this.hp = Math.min(this.maxHp, this.hp + 20);
      }
    }
    this.resolveLevelUp();
  }

  rerollChoices(): UpgradeChoice[] | null {
    if (this.rerollsLeft <= 0) return null;
    this.rerollsLeft -= 1;
    audio.play("click");
    return this.buildChoices();
  }

  skipUpgrade(): void {
    // bank a quarter of the current level's XP instead
    this.gainXp(Math.round(xpNeeded(this.level) * 0.25));
    this.resolveLevelUp();
  }

  private resolveLevelUp(): void {
    this.levelUpQueue -= 1;
    audio.play("open");
    if (this.levelUpQueue <= 0) {
      this.levelUpQueue = 0;
      this.paused = false;
      this.cb.onPauseChange(false);
    } else {
      this.cb.onLevelUp(this.buildChoices());
    }
  }

  closeChest(): void {
    const reward = this.chestPending;
    if (!reward) return;
    this.coins += reward.coins;
    this.hp = Math.min(this.maxHp, this.hp + reward.heal);
    if (reward.upgrade) {
      const w = this.weaponStates.get(reward.upgrade.id);
      if (w) w.level = reward.upgrade.level;
    }
    this.chestPending = null;
    this.paused = false;
    this.cb.onPauseChange(false);
    audio.play("open");
  }

  // -------------------------------------------------------------------------
  // stats
  // -------------------------------------------------------------------------

  private computeStats() {
    const base = { ...this.character.stats };
    const pl = (id: string): number => this.passiveLevels.get(id) ?? 0;
    return {
      maxHp: base.maxHp + 20 * pl("maxHp"),
      speed: base.speed + 10 * pl("speed"),
      armor: base.armor + pl("armor"),
      might: base.might + 0.1 * pl("might"),
      cooldown: Math.max(0.35, base.cooldown * (1 - 0.08 * pl("cooldown"))),
      area: base.area + 0.1 * pl("area"),
      magnet: base.magnet + 25 * pl("magnet"),
      regen: base.regen + 0.5 * pl("regen"),
      growth: base.growth + 0.1 * pl("growth"),
      luck: base.luck + 0.1 * pl("luck"),
    };
  }

  // -------------------------------------------------------------------------
  // input
  // -------------------------------------------------------------------------

  private onKeyDown = (e: KeyboardEvent): void => {
    const k = e.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
    if (k === "escape" || k === "p") {
      this.togglePause();
      return;
    }
    this.keys.add(k);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.key.toLowerCase());
  };

  private onVisibility = (): void => {
    if (document.hidden && !this.paused && !this.gameEnded) this.setPaused(true);
  };

  private resize = (): void => {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.viewW = Math.max(320, rect.width);
    this.viewH = Math.max(240, rect.height);
    this.canvas.width = Math.floor(this.viewW * this.dpr);
    this.canvas.height = Math.floor(this.viewH * this.dpr);
    if (this.lightCanvas) {
      this.lightCanvas.width = Math.floor(this.viewW * this.dpr);
      this.lightCanvas.height = Math.floor(this.viewH * this.dpr);
    }
  };

  private inputVector(): { x: number; y: number } {
    let x = 0;
    let y = 0;
    if (this.keys.has("a") || this.keys.has("arrowleft")) x -= 1;
    if (this.keys.has("d") || this.keys.has("arrowright")) x += 1;
    if (this.keys.has("w") || this.keys.has("arrowup")) y -= 1;
    if (this.keys.has("s") || this.keys.has("arrowdown")) y += 1;
    if (this.touchVec) {
      x += this.touchVec.x;
      y += this.touchVec.y;
    }
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    return { x, y };
  }

  // -------------------------------------------------------------------------
  // main loop
  // -------------------------------------------------------------------------

  private loop = (ts: number): void => {
    if (this.destroyed) return;
    const rawDt = Math.min(0.05, (ts - this.lastTs) / 1000);
    this.lastTs = ts;
    if (!this.paused) {
      if (this.hitStop > 0) {
        // freeze-frame juice: world pauses for a beat on heavy hits
        this.hitStop -= rawDt;
      } else {
        this.update(rawDt * this.timeScale);
      }
    }
    this.render();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    if (this.gameEnded) {
      this.endTimer -= dt;
      this.updateParticles(dt);
      if (this.endTimer <= 0 && this.pendingEnd) {
        const stats = this.pendingEnd;
        this.pendingEnd = null;
        this.cb.onEnd(stats);
      }
      return;
    }

    this.time += dt;
    const stats = this.computeStats();
    const minute = this.time / 60;

    // victory
    if (!this.victoryDone && this.time >= this.stage.duration) {
      this.finishRun(true, 1.6);
      return;
    }

    // music intensity ramps with time
    audio.setIntensity(this.time > 300 ? 2 : this.time > 90 ? 1 : 0);

    // movement
    const iv = this.inputVector();
    if (iv.x !== 0) this.facing = iv.x > 0 ? 1 : -1;
    this.px += iv.x * stats.speed * dt;
    this.py += iv.y * stats.speed * dt;
    if (iv.x !== 0 || iv.y !== 0) this.walkT += dt * 9;

    // regen
    if (stats.regen > 0 && this.hp < this.maxHp) {
      this.regenAcc += stats.regen * dt;
      if (this.regenAcc >= 1) {
        const heal = Math.floor(this.regenAcc);
        this.hp = Math.min(this.maxHp, this.hp + heal);
        this.regenAcc -= heal;
      }
    }
    this.invuln = Math.max(0, this.invuln - dt);
    this.shake = Math.max(0, this.shake - dt * 26);

    this.updateSpawning(dt, minute);
    this.updateWeapons(dt, stats);
    this.updateEnemies(dt, stats);
    this.updateProjectiles(dt);
    this.updateEnemyBullets(dt, stats);
    this.updateZones(dt);
    this.updatePickups(dt, stats);
    this.updateWeather(dt);
    this.updateParticles(dt);
    this.updateTexts(dt);
    this.updateRings(dt);
    if (this.magnetTimer > 0) this.magnetTimer -= dt;

    // camera
    this.camX += (this.px - this.camX) * Math.min(1, dt * 8);
    this.camY += (this.py - this.camY) * Math.min(1, dt * 8);

    if (this.hp <= 0) {
      this.finishRun(false, 1.4);
    }
  }

  // -------------------------------------------------------------------------
  // spawning director
  // -------------------------------------------------------------------------

  private updateSpawning(dt: number, minute: number): void {
    // bosses
    for (const b of this.stage.bosses) {
      if (this.time >= b.at && !this.bossSpawnedAt.includes(b.at)) {
        this.bossSpawnedAt.push(b.at);
        this.spawnBoss(b.enemy);
      }
    }

    const rate = Math.min(42, (1.1 + this.time / 28) * (1 + this.stage.hpScale * 0.25));
    this.spawnAcc += rate * dt;
    const budget = Math.min(320 - this.enemies.length, 6);
    while (this.spawnAcc >= 1 && budget > 0) {
      this.spawnAcc -= 1;
      const batch = 1 + (Math.random() < 0.35 ? 1 : 0) + (Math.random() < 0.12 ? 1 : 0);
      for (let i = 0; i < batch && this.enemies.length < 320; i++) this.spawnEnemy(minute);
    }
  }

  private pickEnemyId(minute: number): string {
    const available = this.stage.spawns.filter((s) => ENEMIES[s.enemy].minMinute <= minute);
    const pool = available.length ? available : this.stage.spawns;
    const total = pool.reduce((a, s) => a + s.weight, 0);
    let roll = Math.random() * total;
    for (const s of pool) {
      roll -= s.weight;
      if (roll <= 0) return s.enemy;
    }
    return pool[0].enemy;
  }

  private scaledEnemy(def: EnemyDef, minute: number) {
    const hpMul = this.stage.hpScale * (1 + minute * 0.22 + minute * minute * 0.008) * (this.endless ? 1 + Math.max(0, minute - 15) * 0.12 : 1);
    const dmgMul = this.stage.dmgScale * (1 + minute * 0.085);
    return {
      hp: Math.round(def.hp * hpMul),
      damage: Math.max(1, Math.round(def.damage * dmgMul)),
      speed: def.speed * (0.92 + Math.random() * 0.16),
    };
  }

  private spawnEnemy(minute: number): void {
    const id = this.pickEnemyId(minute);
    const def = ENEMIES[id];
    if (!def || def.boss) return;
    if (!this.seen.has(id)) {
      this.seen.add(id);
      this.cb.onSeen(id);
    }
    const ang = Math.random() * TAU;
    const radius = Math.max(this.viewW, this.viewH) / 2 + 56;
    const s = this.scaledEnemy(def, minute);
    this.enemies.push({
      uid: this.uidSeq++,
      def,
      x: this.px + Math.cos(ang) * radius,
      y: this.py + Math.sin(ang) * radius,
      hp: s.hp,
      maxHp: s.hp,
      speed: s.speed,
      damage: s.damage,
      radius: def.radius,
      xpValue: def.xp,
      coinValue: def.coin,
      hitFlash: 0,
      knockX: 0,
      knockY: 0,
      phase: Math.random() * TAU,
      frameT: Math.random(),
      scale: def.elite ? 1.28 : 1,
      boss: false,
      touchCd: 0,
      spawnAnim: 0.35,
    });
  }

  private spawnBoss(id: string): void {
    const def = ENEMIES[id];
    if (!def) return;
    if (!this.seen.has(id)) {
      this.seen.add(id);
      this.cb.onSeen(id);
    }
    const minute = this.time / 60;
    const s = this.scaledEnemy(def, minute);
    const boss: Enemy = {
      uid: this.uidSeq++,
      def,
      x: this.px,
      y: this.py - Math.max(this.viewW, this.viewH) / 2 - 80,
      hp: Math.round(s.hp * 1.15),
      maxHp: Math.round(s.hp * 1.15),
      speed: def.speed,
      damage: s.damage,
      radius: def.radius,
      xpValue: def.xp,
      coinValue: def.coin,
      hitFlash: 0,
      knockX: 0,
      knockY: 0,
      phase: 0,
      frameT: 0,
      scale: 1.5,
      boss: true,
      touchCd: 0,
      spawnAnim: 0.8,
    };
    this.enemies.push(boss);
    this.bossRef = boss;
    this.shake = 14;
    audio.play("boss");
    this.cb.onBanner(def.name, "A boss approaches");
  }

  // -------------------------------------------------------------------------
  // weapons
  // -------------------------------------------------------------------------

  private stateByBehavior(behavior: string): WeaponState | undefined {
    for (const ws of this.weaponStates.values()) {
      if (WEAPONS[ws.id].behavior === behavior) return ws;
    }
    return undefined;
  }

  private updateWeapons(dt: number, stats: ReturnType<GameEngine["computeStats"]>): void {
    for (const ws of this.weaponStates.values()) {
      const def = WEAPONS[ws.id];
      const lvl = def.levels[ws.level - 1];
      ws.timer -= dt;
      if (def.behavior === "aura") {
        this.updateAura(ws, lvl, stats);
        continue;
      }
      if (def.behavior === "orbital") {
        this.updateOrbital(dt, ws, lvl, stats);
        continue;
      }
      if (def.behavior === "whip") {
        while (ws.pendingSlashes.length && ws.pendingSlashes[0] <= this.time) {
          ws.pendingSlashes.shift();
          this.spawnWhipSlash(ws);
        }
      }
      if (ws.timer <= 0) {
        ws.timer = lvl.cooldown * stats.cooldown;
        this.fireWeapon(ws.id, ws.level, stats);
      }
    }
  }

  private nearestEnemy(x: number, y: number, maxDist = Infinity): Enemy | null {
    let best: Enemy | null = null;
    let bestD = maxDist * maxDist;
    for (const e of this.enemies) {
      const d = dist2(x, y, e.x, e.y);
      if (d < bestD) {
        bestD = d;
        best = e;
      }
    }
    return best;
  }

  private fireWeapon(id: string, level: number, stats: ReturnType<GameEngine["computeStats"]>): void {
    const def = WEAPONS[id];
    const lvl = def.levels[level - 1];
    const dmg = lvl.damage * stats.might;

    switch (def.behavior) {
      case "bolt": {
        const count = lvl.count;
        for (let i = 0; i < count; i++) {
          const target = this.nearestEnemy(this.px, this.py);
          const ang = target
            ? Math.atan2(target.y - this.py, target.x - this.px) + (i - (count - 1) / 2) * 0.25
            : (this.facing > 0 ? 0 : Math.PI) + i * 0.3;
          this.projectiles.push({
            kind: "bolt",
            x: this.px,
            y: this.py,
            vx: Math.cos(ang) * (lvl.speed ?? 330),
            vy: Math.sin(ang) * (lvl.speed ?? 330),
            damage: dmg,
            pierce: lvl.pierce ?? 0,
            radius: 7,
            life: 2.4,
            angle: ang,
            spin: 0,
            hit: new Set(),
            color: def.color,
            homing: true,
          });
        }
        audio.play("shoot");
        break;
      }
      case "dagger": {
        const count = lvl.count;
        const baseAng =
          this.inputVector().x !== 0 || this.inputVector().y !== 0
            ? Math.atan2(this.inputVector().y, this.inputVector().x)
            : this.nearestEnemy(this.px, this.py)
              ? Math.atan2(
                  this.nearestEnemy(this.px, this.py)!.y - this.py,
                  this.nearestEnemy(this.px, this.py)!.x - this.px,
                )
              : this.facing > 0
                ? 0
                : Math.PI;
        for (let i = 0; i < count; i++) {
          const ang = baseAng + (i - (count - 1) / 2) * 0.13;
          this.projectiles.push({
            kind: "dagger",
            x: this.px + Math.cos(ang) * 12,
            y: this.py + Math.sin(ang) * 12,
            vx: Math.cos(ang) * (lvl.speed ?? 400),
            vy: Math.sin(ang) * (lvl.speed ?? 400),
            damage: dmg,
            pierce: lvl.pierce ?? 0,
            radius: 6,
            life: 1.4,
            angle: ang,
            spin: 0,
            hit: new Set(),
            color: def.color,
            sprite: getSprite("proj_dagger"),
          });
        }
        audio.play("shoot");
        break;
      }
      case "axe": {
        const count = lvl.count;
        for (let i = 0; i < count; i++) {
          const target = this.nearestEnemy(this.px, this.py, 520 * 520);
          const ang = Math.random() * TAU;
          const dist = target ? Math.hypot(target.x - this.px, target.y - this.py) : 140 + Math.random() * 120;
          const tx = this.px + Math.cos(ang) * dist;
          const ty = this.py + Math.sin(ang) * dist;
          this.projectiles.push({
            kind: "axe",
            x: this.px,
            y: this.py,
            vx: 0,
            vy: 0,
            damage: dmg,
            pierce: 3,
            radius: (lvl.area ?? 16) * stats.area,
            life: 1.1,
            angle: 0,
            spin: 9,
            hit: new Set(),
            color: def.color,
            sprite: getSprite("proj_axe"),
            arc: { fx: this.px, fy: this.py, tx, ty, t: 0, dur: 0.85 },
          });
        }
        audio.play("shoot");
        break;
      }
      case "whip": {
        const count = lvl.count;
        const ws = this.weaponStates.get(id)!;
        for (let i = 0; i < count; i++) ws.pendingSlashes.push(this.time + i * 0.09);
        break;
      }
      case "lightning": {
        const onScreen = this.enemies.filter(
          (e) => Math.abs(e.x - this.camX) < this.viewW / 2 + 20 && Math.abs(e.y - this.camY) < this.viewH / 2 + 20,
        );
        const targets = onScreen.sort(() => Math.random() - 0.5).slice(0, lvl.count);
        targets.forEach((e) => {
          this.zones.push({
            kind: "lightning",
            x: e.x,
            y: e.y,
            life: (lvl.duration ?? 0.2) + 0.18,
            maxLife: (lvl.duration ?? 0.2) + 0.18,
            radius: 26 * stats.area,
            damage: dmg,
            hit: new Set(),
            color: def.color,
            delay: 0.18,
          });
        });
        if (targets.length) audio.play("lightning");
        break;
      }
      case "nova": {
        this.zones.push({
          kind: "nova",
          x: this.px,
          y: this.py,
          life: lvl.duration ?? 0.4,
          maxLife: lvl.duration ?? 0.4,
          radius: (lvl.area ?? 120) * stats.area,
          damage: dmg,
          hit: new Set(),
          color: def.color,
          delay: 0,
        });
        this.rings.push({
          x: this.px,
          y: this.py,
          life: lvl.duration ?? 0.4,
          maxLife: lvl.duration ?? 0.4,
          radius: (lvl.area ?? 120) * stats.area,
          color: def.color,
        });
        audio.play("nova");
        break;
      }
      default:
        break;
    }
  }

  private spawnWhipSlash(ws: WeaponState): void {
    const def = WEAPONS[ws.id];
    const lvl = def.levels[ws.level - 1];
    const stats = this.computeStats();
    const side = this.facing * ws.whipSide;
    ws.whipSide *= -1;
    this.slashes.push({
      x: this.px,
      y: this.py - 4,
      side,
      life: lvl.duration ?? 0.2,
      maxLife: lvl.duration ?? 0.2,
      radius: (lvl.area ?? 64) * stats.area,
      damage: lvl.damage * stats.might,
      hit: new Set(),
      color: def.color,
    });
    audio.play("whip");
  }

  private updateAura(ws: WeaponState, lvl: { damage: number; cooldown: number; area?: number }, stats: ReturnType<GameEngine["computeStats"]>): void {
    if (ws.timer > 0) return;
    ws.timer = lvl.cooldown;
    const radius = (lvl.area ?? 58) * stats.area;
    const dmg = lvl.damage * stats.might;
    let hitAny = false;
    for (const e of this.enemies) {
      if (dist2(e.x, e.y, this.px, this.py) < radius * radius) {
        this.damageEnemy(e, dmg, 0);
        hitAny = true;
      }
    }
    this.rings.push({ x: this.px, y: this.py, life: 0.32, maxLife: 0.32, radius, color: "#4ade80" });
    if (hitAny) audio.play("hit");
  }

  private updateOrbital(
    dt: number,
    ws: WeaponState,
    lvl: { damage: number; area?: number; count: number },
    stats: ReturnType<GameEngine["computeStats"]>,
  ): void {
    const orbitR = (lvl.area ?? 52) * stats.area;
    const dmg = lvl.damage * stats.might;
    const count = lvl.count;
    const speed = 2.6;
    const t = this.time * speed;
    // expire old hit cooldowns
    for (const [uid, cd] of ws.orbitHits) {
      if (cd <= 0) ws.orbitHits.delete(uid);
      else ws.orbitHits.set(uid, cd - dt);
    }
    for (let i = 0; i < count; i++) {
      const ang = t + (i / count) * TAU;
      const ox = this.px + Math.cos(ang) * orbitR;
      const oy = this.py + Math.sin(ang) * orbitR;
      for (const e of this.enemies) {
        const rr = e.radius * e.scale + 9;
        if (dist2(ox, oy, e.x, e.y) < rr * rr && !ws.orbitHits.has(e.uid)) {
          ws.orbitHits.set(e.uid, 0.5);
          this.damageEnemy(e, dmg, 3);
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // enemies
  // -------------------------------------------------------------------------

  private updateEnemies(dt: number, stats: ReturnType<GameEngine["computeStats"]>): void {
    const n = this.enemies.length;
    for (const e of this.enemies) {
      e.hitFlash = Math.max(0, e.hitFlash - dt);
      e.touchCd = Math.max(0, e.touchCd - dt);
      e.frameT += dt;
      e.spawnAnim = Math.max(0, e.spawnAnim - dt);

      // enraged bosses keep the bullet pressure on between summons
      if (e.boss && e.enraged) {
        e.castTimer = (e.castTimer ?? 3) - dt;
        if ((e.castTimer ?? 0) <= 0) {
          e.castTimer = 3.2;
          this.bossRadialBurst(e, 10);
        }
      }

      const dx = this.px - e.x;
      const dy = this.py - e.y;
      const d = Math.hypot(dx, dy) || 1;
      let mx = dx / d;
      let my = dy / d;
      let speedMul = 1;
      const behavior = e.def.behavior ?? "chaser";

      if (behavior === "ranged") {
        // kite at ~230px, strafe, and lob arcane bolts
        if (!e.castTimer && e.castTimer !== 0) e.castTimer = (e.def.castInterval ?? 2.8) * (0.7 + Math.random() * 0.6);
        e.castTimer = (e.castTimer ?? 2.8) - dt;
        if (d > 260) {
          mx = dx / d;
          my = dy / d;
        } else if (d < 170) {
          mx = -dx / d;
          my = -dy / d;
        } else {
          const dir = Math.sin(e.phase) > 0 ? 1 : -1;
          mx = (-dy / d) * dir;
          my = (dx / d) * dir;
        }
        if ((e.castTimer ?? 0) <= 0 && d < 460) {
          e.castTimer = (e.def.castInterval ?? 2.8) * (0.8 + Math.random() * 0.5);
          const bs = 158;
          this.enemyBullets.push({
            x: e.x,
            y: e.y,
            vx: (dx / d) * bs,
            vy: (dy / d) * bs,
            radius: 7,
            damage: e.damage,
            life: 4,
            color: "#f0abfc",
          });
          this.burst(e.x, e.y, 4, "#f0abfc", 60);
          audio.play("shoot");
        }
      } else if (behavior === "charger") {
        if (!e.charge) e.charge = { phase: "wind", t: 0, dirX: mx, dirY: my, cooldown: 1.4 + Math.random() };
        const ch = e.charge;
        ch.cooldown -= dt;
        if (ch.phase === "wind") {
          ch.t += dt;
          speedMul = 0.12;
          e.hitFlash = 0.05; // menacing shimmer while telegraphing
          if (ch.t >= 0.55) {
            ch.phase = "dash";
            ch.t = 0;
            ch.dirX = dx / d;
            ch.dirY = dy / d;
            audio.play("whip");
          }
        } else {
          ch.t += dt;
          mx = ch.dirX;
          my = ch.dirY;
          speedMul = 3.4;
          if (ch.t >= 0.42) {
            ch.phase = "wind";
            ch.t = 0;
            ch.cooldown = 2.4 + Math.random() * 0.8;
          }
        }
      } else if (behavior === "exploder") {
        if (e.fuse === undefined && d < (e.def.fuseRadius ?? 88) * 0.85) {
          e.fuse = 0.9;
          audio.play("lightning");
          if (this.time - this.lastFuseToast > 2.5) {
            this.lastFuseToast = this.time;
            this.cb.onToast("Something is about to blow!");
          }
        }
        if (e.fuse !== undefined) {
          e.fuse -= dt;
          speedMul = 0.4;
          if (e.fuse <= 0) {
            this.explode(e);
            continue;
          }
        }
      } else if (e.def.id === "bat" || e.def.id === "moth" || e.def.id === "wisp" || e.def.id === "inkwisp") {
        const sway = Math.sin(this.time * 3 + e.phase) * 0.7;
        const px = -my;
        const py = mx;
        mx += px * sway;
        my += py * sway;
        const nl = Math.hypot(mx, my) || 1;
        mx /= nl;
        my /= nl;
      }

      // separation
      for (let j = 0; j < n; j++) {
        const o = this.enemies[j];
        if (o === e) continue;
        const ddx = e.x - o.x;
        const ddy = e.y - o.y;
        const dd = ddx * ddx + ddy * ddy;
        const min = (e.radius + o.radius) * 0.9;
        if (dd > 0.01 && dd < min * min) {
          const l = Math.sqrt(dd);
          const push = (min - l) / min;
          mx += (ddx / l) * push * 0.6;
          my += (ddy / l) * push * 0.6;
        }
      }
      const nl = Math.hypot(mx, my) || 1;
      e.x += (mx / nl) * e.speed * speedMul * dt + e.knockX * dt;
      e.y += (my / nl) * e.speed * speedMul * dt + e.knockY * dt;
      e.knockX *= Math.pow(0.001, dt);
      e.knockY *= Math.pow(0.001, dt);

      // contact damage
      const touchR = e.radius * e.scale + 10;
      if (e.touchCd <= 0 && this.invuln <= 0 && dist2(e.x, e.y, this.px, this.py) < touchR * touchR) {
        e.touchCd = 0.85;
        this.hurtPlayer(e.damage, stats.armor, e);
      }
    }
    // remove dead
    this.enemies = this.enemies.filter((e) => e.hp > 0);
    if (this.bossRef && this.bossRef.hp <= 0) this.bossRef = null;
  }

  private updateEnemyBullets(dt: number, stats: ReturnType<GameEngine["computeStats"]>): void {
    for (const b of this.enemyBullets) {
      b.life -= dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (this.invuln <= 0 && dist2(b.x, b.y, this.px, this.py) < (b.radius + 9) * (b.radius + 9)) {
        b.life = 0;
        this.hurtPlayerAt(b.damage, stats.armor, b.x, b.y);
      }
    }
    this.enemyBullets = this.enemyBullets.filter((b) => b.life > 0);
  }

  private explode(e: Enemy): void {
    const radius = e.def.fuseRadius ?? 88;
    this.rings.push({ x: e.x, y: e.y, life: 0.42, maxLife: 0.42, radius, color: "#fb923c", light: 1 });
    this.burst(e.x, e.y, 22, "#fb923c", 210);
    this.burst(e.x, e.y, 10, "#fde047", 140);
    this.shake = Math.min(18, this.shake + 8);
    audio.play("nova");
    if (this.invuln <= 0 && dist2(e.x, e.y, this.px, this.py) < radius * radius) {
      this.hurtPlayerAt(e.damage, 0, e.x, e.y);
    }
    e.hp = 0;
    this.killEnemy(e);
  }

  private hurtPlayer(raw: number, armor: number, source: Enemy): void {
    this.hurtPlayerAt(raw, armor, source.x, source.y);
  }

  private hurtPlayerAt(raw: number, armor: number, sx: number, sy: number): void {
    const effective = Math.max(1, raw - armor);
    // Mercy rule: no single hit removes more than 45% of max HP. Even an
    // enraged endgame boss cannot one-shot a full-health build — there is
    // always a window to escape between the 0.45s invulnerability frames.
    const hitCap = Math.max(1, Math.round(this.maxHp * 0.45));
    const dmg = Math.min(effective, hitCap);
    this.hp -= dmg;
    this.invuln = 0.45;
    this.damageTaken += dmg;
    this.shake = Math.min(16, this.shake + 7);
    this.addText(this.px, this.py - 18, `-${dmg}`, "#f87171", 15);
    this.burst(this.px, this.py, 8, "#f87171", 120);
    audio.play("hurt");
    const ang = Math.atan2(this.py - sy, this.px - sx);
    this.px += Math.cos(ang) * 10;
    this.py += Math.sin(ang) * 10;
  }

  private damageEnemy(e: Enemy, dmg: number, knock: number): void {
    if (e.hp <= 0) return;
    e.hp -= dmg;
    e.hitFlash = 0.09;
    if (knock > 0 && !e.boss) {
      const d = Math.hypot(e.x - this.px, e.y - this.py) || 1;
      e.knockX += ((e.x - this.px) / d) * knock * 12;
      e.knockY += ((e.y - this.py) / d) * knock * 12;
    }
    if (Math.random() < 0.55 || e.boss) {
      this.addText(e.x + (Math.random() - 0.5) * 8, e.y - e.radius, String(Math.round(dmg)), e.boss ? "#fde047" : "#fef3c7", e.boss ? 14 : 11);
    }
    this.burst(e.x, e.y, e.boss ? 6 : 3, e.boss ? "#fde047" : "#e5e7eb", 70);
    audio.play("hit");
    if (e.boss && !e.enraged && e.hp > 0 && e.hp <= e.maxHp * 0.5) {
      this.enrageBoss(e);
    }
    if (e.hp <= 0) this.killEnemy(e);
  }

  // Phase 2: at half health the boss enrages — faster, hit harder, summons a
  // swarm and unleashes a radial bullet burst, then keeps firing volleys.
  private enrageBoss(e: Enemy): void {
    e.enraged = true;
    e.speed *= 1.45;
    e.damage = Math.round(e.damage * 1.35);
    e.castTimer = 2.4;
    this.shake = 16;
    audio.play("boss");
    this.cb.onBanner(`${e.def.name} enrages`, "Phase 2 — swarm and bullet hell");
    this.spawnRing(e.x, e.y, 140, "#f87171");
    this.burst(e.x, e.y, 36, "#f87171", 240);
    this.burst(e.x, e.y, 14, "#fde047", 160);
    this.bossRadialBurst(e, 14);
    // summon a protective swarm of six stage-appropriate minions
    const minute = this.time / 60;
    for (let i = 0; i < 6; i++) {
      const id = this.pickEnemyId(minute);
      const def = ENEMIES[id];
      if (!def || def.boss) continue;
      const ang = (i / 6) * TAU + Math.random() * 0.4;
      this.spawnMinionAt(def, e.x + Math.cos(ang) * 70, e.y + Math.sin(ang) * 70, minute);
    }
  }

  private bossRadialBurst(e: Enemy, count: number): void {
    const bs = 172;
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * TAU + (e.phase ?? 0);
      this.enemyBullets.push({
        x: e.x,
        y: e.y,
        vx: Math.cos(ang) * bs,
        vy: Math.sin(ang) * bs,
        radius: 8,
        damage: e.damage,
        life: 5,
        color: "#f87171",
      });
    }
    this.burst(e.x, e.y, 10, "#f87171", 120);
    audio.play("shoot");
  }

  private spawnMinionAt(def: EnemyDef, x: number, y: number, minute: number): void {
    const s = this.scaledEnemy(def, minute);
    this.enemies.push({
      uid: this.uidSeq++,
      def,
      x,
      y,
      hp: s.hp,
      maxHp: s.hp,
      speed: s.speed,
      damage: s.damage,
      radius: def.radius,
      xpValue: def.xp,
      coinValue: def.coin,
      hitFlash: 0,
      knockX: 0,
      knockY: 0,
      phase: Math.random() * TAU,
      frameT: Math.random(),
      scale: def.elite ? 1.28 : 1,
      boss: false,
      touchCd: 0.6,
      spawnAnim: 0.35,
    });
  }

  private killEnemy(e: Enemy): void {
    this.kills += 1;
    audio.play("kill");
    this.burst(e.x, e.y, e.boss ? 30 : 10, e.def.boss ? "#fde047" : "#9ca3af", e.boss ? 220 : 130);
    // freeze-frame punch, scaled by threat
    this.hitStop = Math.min(0.14, Math.max(this.hitStop, e.boss ? 0.12 : e.def.elite ? 0.07 : 0.025));
    if (!e.boss) {
      this.rings.push({ x: e.x, y: e.y, life: 0.25, maxLife: 0.25, radius: 22, color: "#cbd5e1" });
    }
    // splitters break into smaller kin
    if ((e.def.behavior ?? "chaser") === "splitter" && !e.noSplit) {
      for (let i = 0; i < 2; i++) {
        const ang = Math.random() * TAU;
        const childHp = Math.max(1, Math.round(e.maxHp * 0.3));
        this.enemies.push({
          ...e,
          uid: this.uidSeq++,
          x: e.x + Math.cos(ang) * 12,
          y: e.y + Math.sin(ang) * 12,
          hp: childHp,
          maxHp: childHp,
          radius: e.radius * 0.72,
          scale: e.scale * 0.62,
          xpValue: 1,
          noSplit: true,
          hitFlash: 0,
          knockX: Math.cos(ang) * 90,
          knockY: Math.sin(ang) * 90,
          touchCd: 0.5,
          spawnAnim: 0.2,
          fuse: undefined,
          charge: undefined,
          castTimer: undefined,
        });
      }
    }
    // xp gem
    this.gems.push({ x: e.x, y: e.y, value: e.xpValue, bob: Math.random() * TAU, pulled: false });
    if (e.boss) {
      // chest + coin shower
      this.pickups.push({ x: e.x, y: e.y, kind: "chest", value: 0, bob: 0 });
      for (let i = 0; i < 8; i++) {
        const ang = Math.random() * TAU;
        this.pickups.push({
          x: e.x + Math.cos(ang) * 40,
          y: e.y + Math.sin(ang) * 40,
          kind: "coin",
          value: Math.round(e.coinValue / 8),
          bob: Math.random() * TAU,
        });
      }
      this.shake = 18;
      this.spawnRing(e.x, e.y, 120, "#fde047");
    } else {
      const luck = this.computeStats().luck;
      if (Math.random() < 0.16 + luck * 0.12) {
        this.pickups.push({ x: e.x, y: e.y, kind: "coin", value: e.coinValue, bob: Math.random() * TAU });
      }
      if (Math.random() < 0.012) {
        this.pickups.push({ x: e.x, y: e.y, kind: "chicken", value: 30, bob: Math.random() * TAU });
      }
      if (e.def.elite && Math.random() < 0.35) {
        this.pickups.push({ x: e.x, y: e.y, kind: "magnet", value: 0, bob: Math.random() * TAU });
      }
    }
    if (this.kills === 1) this.cb.onAchievement("first_blood");
    if (this.kills === 100) this.cb.onAchievement("kill_100");
    if (this.kills === 500) this.cb.onAchievement("kill_500");
  }

  // -------------------------------------------------------------------------
  // projectiles / zones
  // -------------------------------------------------------------------------

  private updateProjectiles(dt: number): void {
    for (const p of this.projectiles) {
      p.life -= dt;
      if (p.kind === "bolt" && p.homing) {
        const target = this.nearestEnemy(p.x, p.y, 620 * 620);
        if (target) {
          const ang = Math.atan2(target.y - p.y, target.x - p.x);
          const cur = Math.atan2(p.vy, p.vx);
          let diff = ang - cur;
          while (diff > Math.PI) diff -= TAU;
          while (diff < -Math.PI) diff += TAU;
          const speed = Math.hypot(p.vx, p.vy);
          const next = cur + clamp(diff, -6 * dt, 6 * dt);
          p.vx = Math.cos(next) * speed;
          p.vy = Math.sin(next) * speed;
          p.angle = next;
        }
        if (Math.random() < 0.6) this.particles.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: 0.22, maxLife: 0.22, color: p.color, size: 3 });
      }
      if (p.arc) {
        p.arc.t += dt / p.arc.dur;
        const t = clamp(p.arc.t, 0, 1);
        p.x = p.arc.fx + (p.arc.tx - p.arc.fx) * t;
        p.y = p.arc.fy + (p.arc.ty - p.arc.fy) * t - Math.sin(t * Math.PI) * 130;
        p.angle += p.spin * dt;
        if (t >= 1) p.life = 0;
      } else {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.angle += p.spin * dt;
      }
      for (const e of this.enemies) {
        if (p.hit.has(e.uid)) continue;
        const rr = e.radius * e.scale + p.radius;
        if (dist2(p.x, p.y, e.x, e.y) < rr * rr) {
          p.hit.add(e.uid);
          this.damageEnemy(e, p.damage, p.kind === "axe" ? 5 : 2);
          if (p.pierce <= 0) {
            p.life = 0;
            break;
          }
          p.pierce -= 1;
        }
      }
    }
    this.projectiles = this.projectiles.filter((p) => p.life > 0);

    // whip slashes
    for (const s of this.slashes) {
      s.life -= dt;
      for (const e of this.enemies) {
        if (s.hit.has(e.uid)) continue;
        const dx = e.x - s.x;
        const dy = e.y - s.y;
        const d = Math.hypot(dx, dy);
        if (d < s.radius + e.radius * e.scale && dx * s.side > -6) {
          s.hit.add(e.uid);
          this.damageEnemy(e, s.damage, 4);
        }
      }
    }
    this.slashes = this.slashes.filter((s) => s.life > 0);
  }

  private updateZones(dt: number): void {
    for (const z of this.zones) {
      z.life -= dt;
      if (z.delay > 0) {
        z.delay -= dt;
        continue;
      }
      const r = z.kind === "nova" ? z.radius * (1 - z.life / z.maxLife) : z.radius;
      for (const e of this.enemies) {
        if (z.hit.has(e.uid)) continue;
        const d = Math.hypot(e.x - z.x, e.y - z.y);
        const inside = z.kind === "lightning" ? d < z.radius + e.radius : d < r + e.radius && d > r - 36;
        if (inside) {
          z.hit.add(e.uid);
          this.damageEnemy(e, z.damage, z.kind === "nova" ? 6 : 2);
        }
      }
    }
    this.zones = this.zones.filter((z) => z.life > 0);
  }

  // -------------------------------------------------------------------------
  // pickups
  // -------------------------------------------------------------------------

  private updatePickups(dt: number, stats: ReturnType<GameEngine["computeStats"]>): void {
    const magnetR = this.magnetTimer > 0 ? 9999 : stats.magnet;
    this.gems = this.gems.filter((g) => {
      g.bob += dt * 4;
      const d2 = dist2(g.x, g.y, this.px, this.py);
      if (g.pulled || d2 < magnetR * magnetR) {
        g.pulled = true;
        const d = Math.sqrt(d2) || 1;
        const speed = clamp(900 - d, 180, 760);
        g.x += ((this.px - g.x) / d) * speed * dt;
        g.y += ((this.py - g.y) / d) * speed * dt;
      }
      if (d2 < 15 * 15) {
        this.gemsCollected += 1;
        this.gainXp(g.value);
        this.burst(this.px, this.py - 6, 2, "#7dd3fc", 50);
        audio.play("gem");
        return false;
      }
      return true;
    });

    for (const p of this.pickups) {
      p.bob += dt * 4;
      const d2 = dist2(p.x, p.y, this.px, this.py);
      if (p.kind !== "chest" && d2 < magnetR * magnetR) {
        const d = Math.sqrt(d2) || 1;
        p.x += ((this.px - p.x) / d) * 300 * dt;
        p.y += ((this.py - p.y) / d) * 300 * dt;
      }
      if (d2 < 17 * 17) {
        this.collectPickup(p);
        p.value = -1;
      }
    }
    this.pickups = this.pickups.filter((p) => p.value !== -1);
  }

  private collectPickup(p: Pickup): void {
    switch (p.kind) {
      case "coin":
        this.coins += p.value;
        this.addText(this.px, this.py - 20, `+${p.value}`, "#fbbf24", 12);
        audio.play("coin");
        break;
      case "chicken":
        this.hp = Math.min(this.maxHp, this.hp + 30);
        this.addText(this.px, this.py - 20, "+30 HP", "#4ade80", 14);
        this.spawnRing(this.px, this.py, 50, "#4ade80");
        audio.play("gem");
        break;
      case "magnet":
        this.magnetTimer = 6;
        this.cb.onToast("Lodestone surge — all gems drawn in!");
        audio.play("unlock");
        break;
      case "chest":
        this.openChest();
        break;
    }
  }

  private openChest(): void {
    const owned = [...this.weaponStates.values()].filter((w) => w.level < WEAPONS[w.id].maxLevel);
    const upgrade = owned.length
      ? (() => {
          const w = owned[Math.floor(Math.random() * owned.length)];
          return { id: w.id, name: WEAPONS[w.id].name, icon: WEAPONS[w.id].icon, level: w.level + 1 };
        })()
      : null;
    const reward: ChestReward = {
      coins: 40 + Math.floor(Math.random() * 40),
      heal: 25,
      upgrade,
    };
    this.chestPending = reward;
    this.paused = true;
    this.cb.onPauseChange(true);
    this.cb.onChest(reward);
    audio.play("chest");
  }

  private gainXp(raw: number): void {
    const amount = Math.max(1, Math.round(raw * this.computeStats().growth));
    this.xp += amount;
    while (this.xp >= xpNeeded(this.level)) {
      this.xp -= xpNeeded(this.level);
      this.level += 1;
      this.levelUpQueue += 1;
    }
    if (this.levelUpQueue > 0 && !this.paused) {
      this.paused = true;
      this.cb.onPauseChange(true);
      audio.play("levelup");
      this.spawnRing(this.px, this.py, 90, "#7dd3fc");
      this.cb.onLevelUp(this.buildChoices());
      if (this.level === 20) this.cb.onAchievement("level_20");
    }
  }

  buildChoices(): UpgradeChoice[] {
    const choices: UpgradeChoice[] = [];
    const luck = this.computeStats().luck;
    const want = 3 + (luck >= 0.35 ? 1 : 0);

    const weaponPool: UpgradeChoice[] = [];
    for (const def of Object.values(WEAPONS)) {
      if (def.evolvedFrom) continue; // evolutions only enter the draft via the evo pool
      const owned = this.weaponStates.get(def.id);
      if (owned) {
        if (owned.level < def.maxLevel) {
          weaponPool.push({
            kind: "weapon",
            id: def.id,
            level: owned.level + 1,
            maxLevel: def.maxLevel,
            name: def.name,
            desc: def.desc,
            icon: def.icon,
            color: def.color,
            isNew: false,
          });
        }
      } else if (this.weaponStates.size < MAX_WEAPON_SLOTS) {
        weaponPool.push({
          kind: "weapon",
          id: def.id,
          level: 1,
          maxLevel: def.maxLevel,
          name: def.name,
          desc: def.desc,
          icon: def.icon,
          color: def.color,
          isNew: true,
        });
      }
    }
    const passivePool: UpgradeChoice[] = [];
    for (const def of Object.values(PASSIVES)) {
      const lvl = this.passiveLevels.get(def.id) ?? 0;
      if (lvl === 0 && this.passiveLevels.size >= MAX_PASSIVE_SLOTS) continue;
      if (lvl < def.maxLevel) {
        passivePool.push({
          kind: "passive",
          id: def.id,
          level: lvl + 1,
          maxLevel: def.maxLevel,
          name: def.name,
          desc: def.desc,
          icon: def.icon,
          color: "#a5b4fc",
          isNew: lvl === 0,
        });
      }
    }
    // Evolution pool: maxed base weapon + maxed paired passive. These are
    // build-defining spikes, so once eligible they outweigh ordinary picks.
    const evoPool: UpgradeChoice[] = [];
    for (const def of Object.values(WEAPONS)) {
      if (!def.evolvedFrom || !def.requires) continue;
      if (this.weaponStates.has(def.id)) continue;
      const base = this.weaponStates.get(def.evolvedFrom);
      if (!base || base.level < WEAPONS[def.evolvedFrom].maxLevel) continue;
      const reqLevel = this.passiveLevels.get(def.requires) ?? 0;
      if (reqLevel < PASSIVES[def.requires].maxLevel) continue;
      evoPool.push({
        kind: "weapon",
        id: def.id,
        level: 1,
        maxLevel: 1,
        name: def.name,
        desc: def.desc,
        icon: def.icon,
        color: def.color,
        isNew: true,
        evolution: true,
      });
    }
    // An eligible evolution is guaranteed a slot in the draft — build spikes
    // should never be buried by ordinary raffle luck.
    if (evoPool.length) {
      const guaranteed = evoPool.splice(Math.floor(Math.random() * evoPool.length), 1)[0];
      choices.push(guaranteed);
    }
    // Weighted raffle: upgrades for gear you already own dominate the pool,
    // so builds cohere instead of drifting across sixteen level-1 items.
    const weighted: { choice: UpgradeChoice; weight: number }[] = [
      ...evoPool.map((c) => ({ choice: c, weight: 10 })),
      ...weaponPool.map((c) => ({ choice: c, weight: c.isNew ? 2 : 4 })),
      ...passivePool.map((c) => ({ choice: c, weight: c.isNew ? 1.5 : 3 })),
    ];
    while (choices.length < want && weighted.length) {
      const total = weighted.reduce((a, x) => a + x.weight, 0);
      let roll = Math.random() * total;
      let idx = 0;
      for (let i = 0; i < weighted.length; i++) {
        roll -= weighted[i].weight;
        if (roll <= 0) {
          idx = i;
          break;
        }
      }
      choices.push(weighted.splice(idx, 1)[0].choice);
    }
    if (choices.length === 0) {
      choices.push({
        kind: "passive",
        id: "heal_salve",
        level: 1,
        maxLevel: 1,
        name: "Healing Salve",
        desc: "Restore 30% of your maximum health.",
        icon: "icon_heart",
        color: "#4ade80",
        isNew: false,
      });
    }
    return choices;
  }

  // -------------------------------------------------------------------------
  // particles / texts / rings
  // -------------------------------------------------------------------------

  private burst(x: number, y: number, count: number, color: string, speed: number): void {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * TAU;
      const sp = speed * (0.4 + Math.random() * 0.8);
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        life: 0.35 + Math.random() * 0.3,
        maxLife: 0.6,
        color,
        size: 2 + Math.random() * 2,
      });
    }
  }

  private addText(x: number, y: number, text: string, color: string, size: number): void {
    if (this.texts.length > 70) this.texts.shift();
    this.texts.push({ x, y, life: 0.8, text, color, size });
  }

  private spawnRing(x: number, y: number, radius: number, color: string): void {
    this.rings.push({ x, y, life: 0.45, maxLife: 0.45, radius, color });
  }

  private updateParticles(dt: number): void {
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (!p.ambient) {
        p.vx *= Math.pow(0.02, dt);
        p.vy *= Math.pow(0.02, dt);
      } else if (p.vy > 0) {
        // drifting spores/embers sway gently as they fall or rise
        p.vx += Math.sin(this.time * 2 + p.y * 0.05) * 6 * dt;
      }
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  private updateWeather(dt: number): void {
    const interval = this.stage.weather === "embers" ? 0.16 : 0.1;
    this.weatherAcc += dt;
    while (this.weatherAcc >= interval) {
      this.weatherAcc -= interval;
      if (this.particles.length > 360) continue;
      const x = this.camX + (Math.random() - 0.5) * this.viewW;
      const y = this.camY + (Math.random() - 0.5) * this.viewH;
      if (this.stage.weather === "fog") {
        this.particles.push({
          x, y, vx: 14 + Math.random() * 12, vy: (Math.random() - 0.5) * 6,
          life: 2.8, maxLife: 2.8, color: "#94a3b8", size: 2, ambient: true,
        });
      } else if (this.stage.weather === "spores") {
        this.particles.push({
          x, y, vx: (Math.random() - 0.5) * 8, vy: 12 + Math.random() * 10,
          life: 3.2, maxLife: 3.2, color: "#86efac", size: 2, ambient: true,
        });
      } else {
        this.particles.push({
          x, y, vx: (Math.random() - 0.5) * 10, vy: -(16 + Math.random() * 18),
          life: 2.4, maxLife: 2.4, color: Math.random() < 0.5 ? "#fb923c" : "#f5c542", size: 2, ambient: true,
        });
      }
    }
  }

  private updateTexts(dt: number): void {
    for (const t of this.texts) {
      t.life -= dt;
      t.y -= 34 * dt;
    }
    this.texts = this.texts.filter((t) => t.life > 0);
  }

  private updateRings(dt: number): void {
    for (const r of this.rings) r.life -= dt;
    this.rings = this.rings.filter((r) => r.life > 0);
  }

  // -------------------------------------------------------------------------
  // run end
  // -------------------------------------------------------------------------

  private finishRun(victory: boolean, delay: number): void {
    if (this.gameEnded) return;
    this.gameEnded = true;
    if (victory) this.victoryDone = true;
    this.timeScale = 0.35;
    this.endTimer = delay;
    this.burst(this.px, this.py, 40, victory ? "#fde047" : "#f87171", 260);
    this.spawnRing(this.px, this.py, 160, victory ? "#fde047" : "#f87171");
    this.shake = 20;
    audio.play(victory ? "victory" : "gameover");
    this.pendingEnd = {
      time: Math.floor(this.time),
      kills: this.kills,
      level: this.level,
      coins: this.coins,
      damageTaken: this.damageTaken,
      gems: this.gemsCollected,
      victory,
      stageId: this.stage.id,
      characterId: this.character.id,
      weapons: [...this.weaponStates.keys()],
    };
    if (victory) this.cb.onBanner("Stage Cleared", this.stage.name);
  }

  continueEndless(): void {
    if (!this.gameEnded) return;
    this.gameEnded = false;
    this.timeScale = 1;
    this.pendingEnd = null;
    this.endTimer = 0;
    this.endless = true;
    // victoryDone stays true so the duration check never re-fires; endless
    // difficulty scaling keeps ramping through scaledEnemy() instead.
  }

  // -------------------------------------------------------------------------
  // rendering
  // -------------------------------------------------------------------------

  private render(): void {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = this.stage.ground.base;
    ctx.fillRect(0, 0, this.viewW, this.viewH);

    const shX = this.shake > 0 ? (Math.random() - 0.5) * this.shake : 0;
    const shY = this.shake > 0 ? (Math.random() - 0.5) * this.shake : 0;
    const camX = this.camX + shX;
    const camY = this.camY + shY;
    const left = camX - this.viewW / 2;
    const top = camY - this.viewH / 2;

    // ground
    if (this.groundPattern) {
      ctx.save();
      ctx.translate(-Math.floor(left), -Math.floor(top));
      ctx.fillStyle = this.groundPattern;
      ctx.fillRect(Math.floor(left), Math.floor(top), this.viewW + 2, this.viewH + 2);
      ctx.restore();
    }

    // props
    this.renderProps(ctx, left, top);

    // depth-sorted draw list
    type Draw = { y: number; fn: () => void };
    const draws: Draw[] = [];

    for (const g of this.gems) {
      if (g.x < left - 30 || g.x > left + this.viewW + 30 || g.y < top - 30 || g.y > top + this.viewH + 30) continue;
      draws.push({ y: g.y, fn: () => this.drawGem(ctx, g, camX, camY) });
    }
    for (const p of this.pickups) {
      if (p.x < left - 40 || p.x > left + this.viewW + 40 || p.y < top - 40 || p.y > top + this.viewH + 40) continue;
      draws.push({ y: p.y, fn: () => this.drawPickup(ctx, p, camX, camY) });
    }
    for (const e of this.enemies) {
      if (e.x < left - 80 || e.x > left + this.viewW + 80 || e.y < top - 80 || e.y > top + this.viewH + 80) continue;
      draws.push({ y: e.y, fn: () => this.drawEnemy(ctx, e, camX, camY) });
    }
    draws.push({ y: this.py, fn: () => this.drawPlayer(ctx, camX, camY) });

    draws.sort((a, b) => a.y - b.y);
    for (const d of draws) d.fn();

    // projectiles & effects above characters
    this.drawProjectiles(ctx, camX, camY);
    this.drawSlashes(ctx, camX, camY);
    this.drawZones(ctx, camX, camY);
    for (const r of this.rings) this.drawRing(ctx, r, camX, camY);
    this.drawParticles(ctx, camX, camY);
    this.drawTexts(ctx, camX, camY);

    // aura visual (always under HUD overlays)
    const aura = this.stateByBehavior("aura");
    if (aura) {
      const def = WEAPONS[aura.id];
      const lvl = def.levels[aura.level - 1];
      const radius = (lvl.area ?? 58) * this.computeStats().area;
      const pulse = 1 + Math.sin(this.time * 6) * 0.04;
      ctx.save();
      ctx.translate(this.px - camX, this.py - camY);
      const grad = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius * pulse);
      grad.addColorStop(0, "rgba(74, 222, 128, 0)");
      grad.addColorStop(0.85, "rgba(74, 222, 128, 0.08)");
      grad.addColorStop(1, "rgba(74, 222, 128, 0.28)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, radius * pulse, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "rgba(134, 239, 172, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // orbitals
    const orbital = this.stateByBehavior("orbital");
    if (orbital) {
      const def = WEAPONS[orbital.id];
      const lvl = def.levels[orbital.level - 1];
      const orbitR = (lvl.area ?? 52) * this.computeStats().area;
      const book = getSprite("proj_book");
      for (let i = 0; i < lvl.count; i++) {
        const ang = this.time * 2.6 + (i / lvl.count) * TAU;
        const ox = this.px + Math.cos(ang) * orbitR - camX;
        const oy = this.py + Math.sin(ang) * orbitR - camY;
        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate(ang + Math.PI / 2);
        ctx.drawImage(book.frames[0], -7, -7, 14, 14);
        ctx.restore();
      }
    }

    // fog vignette
    const vg = ctx.createRadialGradient(
      this.viewW / 2,
      this.viewH / 2,
      Math.min(this.viewW, this.viewH) * 0.32,
      this.viewW / 2,
      this.viewH / 2,
      Math.max(this.viewW, this.viewH) * 0.72,
    );
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, this.stage.fog);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, this.viewW, this.viewH);

    this.drawEnemyBullets(ctx, camX, camY);
    this.renderLighting(ctx, camX, camY);

    // low hp pulse
    if (this.hp / this.maxHp < 0.3 && !this.gameEnded) {
      const a = 0.18 + Math.sin(this.time * 6) * 0.08;
      ctx.fillStyle = `rgba(220, 38, 38, ${a})`;
      ctx.fillRect(0, 0, this.viewW, this.viewH);
    }
  }

  private punchLight(lctx: CanvasRenderingContext2D, x: number, y: number, radius: number, strength: number): void {
    const g = lctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
    g.addColorStop(0, `rgba(0,0,0,${strength})`);
    g.addColorStop(0.7, `rgba(0,0,0,${strength * 0.7})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    lctx.fillStyle = g;
    lctx.beginPath();
    lctx.arc(x, y, radius, 0, TAU);
    lctx.fill();
  }

  private renderLighting(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    const lctx = this.lightCtx;
    lctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    lctx.clearRect(0, 0, this.viewW, this.viewH);
    lctx.globalCompositeOperation = "source-over";
    // night deepens over the first eight minutes, fades in over first seconds
    const target = 0.32 + Math.min(0.36, (this.time / 480) * 0.36);
    const alpha = target * clamp(this.time / 6, 0.15, 1);
    lctx.fillStyle = `rgba(${this.stage.dark},${alpha})`;
    lctx.fillRect(0, 0, this.viewW, this.viewH);

    lctx.globalCompositeOperation = "destination-out";
    const sx = this.px - camX + this.viewW / 2;
    const sy = this.py - camY + this.viewH / 2;
    const flicker = 1 + Math.sin(this.time * 11) * 0.03 + Math.sin(this.time * 23) * 0.02;
    this.punchLight(lctx, sx, sy, 178 * flicker, 1);

    for (const p of this.projectiles) {
      const r = p.kind === "bolt" ? 34 : p.kind === "axe" ? 24 : 16;
      this.punchLight(lctx, p.x - camX + this.viewW / 2, p.y - camY + this.viewH / 2, r, 0.8);
    }
    for (const b of this.enemyBullets) {
      this.punchLight(lctx, b.x - camX + this.viewW / 2, b.y - camY + this.viewH / 2, 26, 0.65);
    }
    for (const z of this.zones) {
      if (z.kind === "lightning" && z.delay <= 0) {
        this.punchLight(lctx, z.x - camX + this.viewW / 2, z.y - camY + this.viewH / 2, 85, 0.95);
      }
    }
    for (const r of this.rings) {
      if (r.light) {
        const t = 1 - r.life / r.maxLife;
        this.punchLight(lctx, r.x - camX + this.viewW / 2, r.y - camY + this.viewH / 2, r.radius * (0.5 + t * 0.6), 0.9);
      }
    }
    for (const p of this.pickups) {
      if (p.kind === "chest") {
        this.punchLight(lctx, p.x - camX + this.viewW / 2, p.y - camY + this.viewH / 2, 58, 0.85);
      }
    }
    lctx.globalCompositeOperation = "source-over";
    ctx.drawImage(this.lightCanvas, 0, 0, this.viewW, this.viewH);
  }

  private drawEnemyBullets(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    for (const b of this.enemyBullets) {
      const x = b.x - camX + this.viewW / 2;
      const y = b.y - camY + this.viewH / 2;
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(x, y, b.radius + 4, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fdf4ff";
      ctx.beginPath();
      ctx.arc(x, y, b.radius * 0.55, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private renderProps(ctx: CanvasRenderingContext2D, left: number, top: number): void {
    const cell = 110;
    const x0 = Math.floor(left / cell) - 1;
    const x1 = Math.floor((left + this.viewW) / cell) + 1;
    const y0 = Math.floor(top / cell) - 1;
    const y1 = Math.floor((top + this.viewH) / cell) + 1;
    for (let cx = x0; cx <= x1; cx++) {
      for (let cy = y0; cy <= y1; cy++) {
        const h = hash2(cx, cy);
        if (h > 0.16) continue;
        const wx = cx * cell + Math.floor(hash2(cx + 7, cy) * cell);
        const wy = cy * cell + Math.floor(hash2(cx, cy + 11) * cell);
        if (Math.hypot(wx, wy) < 90) continue;
        const key = this.stage.props[Math.floor(hash2(cx + 3, cy + 5) * this.stage.props.length)];
        const spr = getSprite(key);
        const frame = spr.frames[0];
        const screenX = wx - this.camX + this.viewW / 2;
        const screenY = wy - this.camY + this.viewH / 2;
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + 2, frame.width * 0.42, 3, 0, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.drawImage(frame, Math.round(screenX - frame.width / 2), Math.round(screenY - frame.height + 3));
      }
    }
  }

  private drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.38, 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    const spr = getSprite(this.character.sprite);
    const frame = spr.frames[Math.floor(this.walkT) % 2];
    const x = this.px - camX + this.viewW / 2;
    const y = this.py - camY + this.viewH / 2;
    const bob = Math.round(Math.sin(this.walkT * 2) * 1.2);
    this.drawShadow(ctx, x, y + 8, 9);
    if (this.invuln > 0 && Math.floor(this.time * 20) % 2 === 0) ctx.globalAlpha = 0.45;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y - 6 + bob));
    ctx.scale(this.facing, 1);
    ctx.drawImage(frame, -frame.width / 2, -frame.height / 2);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  private drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, camX: number, camY: number): void {
    const x = e.x - camX + this.viewW / 2;
    const y = e.y - camY + this.viewH / 2;
    const spr = e.def.tint ? getTintedSprite(e.def.sprite, e.def.tint) : getSprite(e.def.sprite);
    const frameIdx = spr.frames.length > 1 ? Math.floor(e.frameT * (e.boss ? 3 : 6)) % spr.frames.length : 0;
    const frame = spr.frames[frameIdx];
    let scale = e.scale * (e.spawnAnim > 0 ? 1 - (e.spawnAnim / 0.8) * 0.5 : 1);
    if (e.fuse !== undefined) scale *= 1 + Math.sin(this.time * 18) * 0.09;
    const w = frame.width * scale;
    const h = frame.height * scale;

    // spawn portal
    if (e.spawnAnim > 0) {
      const t = 1 - e.spawnAnim / 0.8;
      ctx.globalAlpha = 0.7 * (1 - t);
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 6 + t * 16, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    this.drawShadow(ctx, x, y + e.radius * scale * 0.7, e.radius * scale);
    ctx.save();
    if (e.spawnAnim > 0) ctx.globalAlpha = 1 - e.spawnAnim / 1.2;
    if (e.hitFlash > 0) {
      const white = getWhite(spr);
      const wf = white.frames[Math.min(frameIdx, white.frames.length - 1)];
      ctx.drawImage(wf, Math.round(x - w / 2), Math.round(y - h + h * 0.18), w, h);
    } else {
      ctx.drawImage(frame, Math.round(x - w / 2), Math.round(y - h + h * 0.18), w, h);
    }
    ctx.restore();

    // charger wind-up marker
    if (e.charge?.phase === "wind") {
      ctx.font = "bold 13px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#fca5a5";
      ctx.fillText("!", x, y - h - 2);
    }
    // fuse countdown ring
    if (e.fuse !== undefined) {
      ctx.strokeStyle = "#fb923c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, e.radius * scale + 5, 0, TAU * clamp(1 - e.fuse / 0.9, 0, 1));
      ctx.stroke();
    }
    // health bar for toughened non-boss enemies
    if (!e.boss && e.hp < e.maxHp && e.maxHp >= 24) {
      const bw = Math.max(18, e.radius * 2);
      const bx = x - bw / 2;
      const by = y - h - 7;
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(bx - 1, by - 1, bw + 2, 5);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(bx, by, bw * clamp(e.hp / e.maxHp, 0, 1), 3);
    }
    if (e.boss) {
      // handled via HUD bar; enraged bosses pulse a furious red aura
      ctx.globalAlpha = e.enraged ? 0.45 + Math.sin(this.time * 9) * 0.2 : 0.25 + Math.sin(this.time * 4) * 0.1;
      ctx.strokeStyle = e.enraged
        ? "#ef4444"
        : e.def.id === "voidreaper" || e.def.id === "blightmoth"
          ? "#c4b5fd"
          : "#fca5a5";
      ctx.lineWidth = e.enraged ? 3 : 2;
      ctx.beginPath();
      ctx.arc(x, y, e.radius * scale + (e.enraged ? 8 + Math.sin(this.time * 9) * 2 : 5), 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  private drawGem(ctx: CanvasRenderingContext2D, g: Gem, camX: number, camY: number): void {
    const key = g.value >= 10 ? "gem_10" : g.value >= 5 ? "gem_5" : "gem_1";
    const spr = getSprite(key);
    const x = g.x - camX + this.viewW / 2;
    const y = g.y - camY + this.viewH / 2 + Math.sin(g.bob) * 2;
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = key === "gem_1" ? "#38bdf8" : key === "gem_5" ? "#34d399" : "#f87171";
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.drawImage(spr.frames[0], Math.round(x - 8), Math.round(y - 8));
  }

  private drawPickup(ctx: CanvasRenderingContext2D, p: Pickup, camX: number, camY: number): void {
    const x = p.x - camX + this.viewW / 2;
    const y = p.y - camY + this.viewH / 2 + Math.sin(p.bob) * 2;
    if (p.kind === "coin") {
      const spr = getSprite("coin");
      const squash = Math.abs(Math.sin(p.bob * 1.4));
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(0.35 + squash * 0.65, 1);
      ctx.drawImage(spr.frames[0], -8, -8);
      ctx.restore();
      return;
    }
    const key =
      p.kind === "chicken" ? "chicken" : p.kind === "chest" ? "chest" : "magnet";
    const spr = getSprite(key);
    if (p.kind === "chest") {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.arc(x, y, 13 + Math.sin(this.time * 5) * 2, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.drawImage(spr.frames[0], Math.round(x - 8), Math.round(y - 8));
  }

  private drawProjectiles(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    for (const p of this.projectiles) {
      const x = p.x - camX + this.viewW / 2;
      const y = p.y - camY + this.viewH / 2;
      if (p.kind === "bolt") {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.radius + 3, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#f0f9ff";
        ctx.beginPath();
        ctx.arc(x, y, p.radius * 0.55, 0, TAU);
        ctx.fill();
      } else if (p.sprite) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.angle + (p.kind === "axe" ? 0 : Math.PI / 2));
        const s = p.kind === "axe" ? 1.5 : 1.2;
        ctx.drawImage(p.sprite.frames[0], -p.sprite.w * s * 0.5, -p.sprite.h * s * 0.5, p.sprite.w * s, p.sprite.h * s);
        ctx.restore();
      }
    }
  }

  private drawSlashes(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    for (const s of this.slashes) {
      const t = 1 - s.life / s.maxLife;
      const x = s.x - camX + this.viewW / 2;
      const y = s.y - camY + this.viewH / 2;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s.side, 1);
      ctx.globalAlpha = 1 - t * 0.5;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 5 - t * 2;
      ctx.beginPath();
      ctx.arc(0, 0, s.radius * (0.6 + t * 0.5), -0.9, 0.9);
      ctx.stroke();
      ctx.strokeStyle = "#fffbeb";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, s.radius * (0.6 + t * 0.5), -0.7, 0.7);
      ctx.stroke();
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  private drawZones(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    for (const z of this.zones) {
      const x = z.x - camX + this.viewW / 2;
      const y = z.y - camY + this.viewH / 2;
      if (z.kind === "lightning") {
        if (z.delay > 0) {
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = z.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, z.radius, 0, TAU);
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          ctx.strokeStyle = z.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          let cy = y - 120;
          ctx.moveTo(x + (Math.random() - 0.5) * 10, cy);
          while (cy < y) {
            cy += 14;
            ctx.lineTo(x + (Math.random() - 0.5) * 16, cy);
          }
          ctx.stroke();
          ctx.globalAlpha = 0.4;
          ctx.fillStyle = z.color;
          ctx.beginPath();
          ctx.arc(x, y, z.radius, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      } else {
        const t = 1 - z.life / z.maxLife;
        const r = z.radius * t;
        ctx.strokeStyle = z.color;
        ctx.lineWidth = 6 * (1 - t) + 2;
        ctx.globalAlpha = 1 - t * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  private drawRing(ctx: CanvasRenderingContext2D, r: Ring, camX: number, camY: number): void {
    const t = 1 - r.life / r.maxLife;
    const x = r.x - camX + this.viewW / 2;
    const y = r.y - camY + this.viewH / 2;
    ctx.strokeStyle = r.color;
    ctx.globalAlpha = 1 - t;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, r.radius * t, 0, TAU);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  private drawParticles(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    for (const p of this.particles) {
      ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1) * (p.ambient ? 0.32 : 1);
      ctx.fillStyle = p.color;
      ctx.fillRect(
        Math.round(p.x - camX + this.viewW / 2 - p.size / 2),
        Math.round(p.y - camY + this.viewH / 2 - p.size / 2),
        p.size,
        p.size,
      );
    }
    ctx.globalAlpha = 1;
  }

  private drawTexts(ctx: CanvasRenderingContext2D, camX: number, camY: number): void {
    ctx.textAlign = "center";
    for (const t of this.texts) {
      const x = t.x - camX + this.viewW / 2;
      const y = t.y - camY + this.viewH / 2;
      ctx.globalAlpha = clamp(t.life / 0.8, 0, 1);
      ctx.font = `bold ${t.size}px ui-monospace, monospace`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(18,17,26,0.85)";
      ctx.strokeText(t.text, x, y);
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, x, y);
    }
    ctx.globalAlpha = 1;
  }
}
