import {
  BOSS_TIMES,
  ECHO,
  LIMITS,
  PLAYER,
  RESONANCE,
  spawnInterval,
  targetEnemyCount,
  WEB,
  WORLD,
} from './config';
import { resonanceFor, type ElementId } from './elements';
import { clamp, dist, mulberry32, randRange, TAU, type Rng } from './math';
import {
  computeStats,
  emptyLevels,
  rollUpgrades,
  xpForLevel,
  type DerivedStats,
  type UpgradeId,
  type UpgradeLevels,
} from './upgrades';
import type {
  Burst,
  Echo,
  Enemy,
  EnemyKind,
  Field,
  InputState,
  Orb,
  Particle,
  Projectile,
  RunStatus,
  RunSummary,
  SimEvent,
  WebMark,
} from './types';

interface EnemyTemplate {
  hp: number;
  speed: number;
  r: number;
  dmg: number;
  xp: number;
  boss?: boolean;
}

const ENEMY_TEMPLATES: Record<EnemyKind, EnemyTemplate> = {
  crawler: { hp: 22, speed: 52, r: 12, dmg: 6, xp: 1 },
  dasher: { hp: 14, speed: 122, r: 10, dmg: 4, xp: 1 },
  splitter: { hp: 48, speed: 58, r: 17, dmg: 9, xp: 3 },
  shard: { hp: 9, speed: 96, r: 8, dmg: 4, xp: 1 },
  spitter: { hp: 32, speed: 44, r: 13, dmg: 8, xp: 2 },
  brute: { hp: 210, speed: 44, r: 26, dmg: 14, xp: 8 },
  boss: { hp: 900, speed: 42, r: 46, dmg: 24, xp: 60, boss: true },
};

const BOSS_HP = [900, 1500, 2300, 3400];

export class RunSim {
  readonly rng: Rng;

  status: RunStatus = 'title';
  time = 0;
  level = 1;
  xp = 0;
  xpNext = xpForLevel(1);

  px = WORLD.w / 2;
  py = WORLD.h / 2;
  pvx = 0;
  pvy = 0;
  facing = 0;
  hp: number = PLAYER.maxHp;
  invuln = 0;

  levels: UpgradeLevels = emptyLevels();
  stats: DerivedStats = computeStats(emptyLevels());
  pendingChoices: UpgradeId[] = [];

  enemies: Enemy[] = [];
  echoes: Echo[] = [];
  bursts: Burst[] = [];
  particles: Particle[] = [];
  fields: Field[] = [];
  projectiles: Projectile[] = [];
  orbs: Orb[] = [];
  /** Live threads keyed by grid cell — the net you are weaving. */
  web = new Map<number, WebMark>();

  kills = 0;
  resonances = 0;
  weave = 0;
  echoesBorn = 0;

  events: SimEvent[] = [];

  private trail: { x: number; y: number; t: number }[] = [];
  private recordT = 0;
  private echoT = 0;
  private spawnT = 0;
  private echoCounter = 0;
  private bossIndex = 0;
  private nextId = 1;
  private shake = 0;
  private grid = new Map<number, number[]>();
  private readonly cell = 56;
  private scratch: number[] = [];
  private winPending = false;
  private finalBossId = 0;
  private pruneT = 0;
  /** Caps detonations per frame so a dense web cannot spam the screen. */
  private resonanceBudget = 0;

  constructor(seed = Date.now() & 0xffffffff) {
    this.rng = mulberry32(seed);
  }

  /** Camera shake requested by this frame (consumed by the renderer). */
  takeShake(): number {
    const s = this.shake;
    this.shake = 0;
    return s;
  }

  start(): void {
    this.status = 'playing';
    this.time = 0;
    this.level = 1;
    this.xp = 0;
    this.xpNext = xpForLevel(1);
    this.px = WORLD.w / 2;
    this.py = WORLD.h / 2;
    this.pvx = 0;
    this.pvy = 0;
    this.levels = emptyLevels();
    this.stats = computeStats(this.levels);
    this.hp = this.stats.maxHp;
    this.invuln = 0;
    this.enemies = [];
    this.echoes = [];
    this.bursts = [];
    this.particles = [];
    this.fields = [];
    this.projectiles = [];
    this.orbs = [];
    this.web.clear();
    this.trail = [];
    this.kills = 0;
    this.resonances = 0;
    this.weave = 0;
    this.echoesBorn = 0;
    this.echoCounter = 0;
    this.bossIndex = 0;
    this.recordT = 0;
    this.echoT = 0;
    this.spawnT = 0.4;
    this.events = [];
    this.winPending = false;
    this.finalBossId = 0;
    this.pruneT = 0;
    this.resonanceBudget = 0;
    this.bursts.push({
      x: this.px,
      y: this.py,
      r0: 10,
      r1: 220,
      t: 0,
      dur: 0.6,
      color: 0x7dffd4,
      kind: 'steam',
      angle: 0,
    });
  }

  chooseUpgrade(index: number): void {
    if (this.status !== 'levelup') return;
    const id = this.pendingChoices[index];
    if (!id) return;
    this.levels[id] += 1;
    const prevMax = this.stats.maxHp;
    this.stats = computeStats(this.levels);
    this.hp = Math.min(this.stats.maxHp, this.hp + (this.stats.maxHp - prevMax));
    this.pendingChoices = [];
    this.status = 'playing';
    // Banked experience can cross more than one threshold at once.
    this.checkLevelUp();
  }

  getSummary(): RunSummary {
    return {
      survived: this.time,
      kills: this.kills,
      resonances: this.resonances,
      weave: Math.round(this.weave),
      level: this.level,
      win: this.status === 'win',
    };
  }

  // ---------------------------------------------------------------- update

  update(dt: number, input: InputState): void {
    if (this.status !== 'playing') return;
    const step = Math.min(dt, 1 / 30);
    this.time += step;
    this.resonanceBudget = 2;

    this.updatePlayer(step, input);
    this.recordTrail(step);
    this.updateEchoSpawn(step);
    this.rebuildGrid();
    this.updateEnemies(step);
    this.updateEchoes(step);
    this.updateFields(step);
    this.updateProjectiles(step);
    this.updateOrbs(step);
    this.updateBursts(step);
    this.updateParticles(step);
    this.updateDirector(step);
    this.compact();
    this.pruneWeb(step);

    if (this.hp <= 0) {
      this.status = 'dead';
      this.shake = Math.max(this.shake, 18);
      this.events.push({ type: 'dead', x: this.px, y: this.py });
    }
  }

  private updatePlayer(dt: number, input: InputState): void {
    let ix = input.x;
    let iy = input.y;
    const mag = Math.hypot(ix, iy);
    if (mag > 1) {
      ix /= mag;
      iy /= mag;
    }
    const speed = this.stats.speed;
    this.pvx = ix * speed;
    this.pvy = iy * speed;
    this.px = clamp(this.px + this.pvx * dt, PLAYER.radius, WORLD.w - PLAYER.radius);
    this.py = clamp(this.py + this.pvy * dt, PLAYER.radius, WORLD.h - PLAYER.radius);
    if (mag > 0.15) this.facing = Math.atan2(iy, ix);

    if (this.invuln > 0) this.invuln -= dt;
    if (this.stats.regen > 0 && this.hp < this.stats.maxHp) {
      this.hp = Math.min(this.stats.maxHp, this.hp + this.stats.regen * dt);
    }
  }

  private recordTrail(dt: number): void {
    this.recordT -= dt;
    const step = 1 / ECHO.recordHz;
    let guard = 0;
    while (this.recordT <= 0 && guard < 8) {
      this.trail.push({ x: this.px, y: this.py, t: this.time });
      this.recordT += step;
      guard += 1;
    }
    const keepAfter = this.time - this.stats.echoWindow - 1.5;
    let cut = 0;
    while (cut < this.trail.length && this.trail[cut].t < keepAfter) cut += 1;
    if (cut > 0) this.trail.splice(0, cut);
  }

  private updateEchoSpawn(dt: number): void {
    this.echoT -= dt;
    if (this.echoT > 0) return;
    this.echoT = this.stats.echoInterval;
    this.spawnEcho();
  }

  private spawnEcho(): void {
    if (this.echoes.length >= ECHO.maxEchoes) return;
    const from = this.time - this.stats.echoWindow;
    const pts = this.trail.filter((p) => p.t >= from);
    if (pts.length < 4) return;
    const span = pts[pts.length - 1].t - pts[0].t;
    if (span < 0.2) return;

    const path = new Float32Array(pts.length * 2);
    for (let i = 0; i < pts.length; i += 1) {
      path[i * 2] = pts[i].x;
      path[i * 2 + 1] = pts[i].y;
    }
    const elements = this.stats.elements;
    const element: ElementId = elements[this.echoCounter % elements.length];
    this.echoCounter += 1;
    this.echoesBorn += 1;
    this.echoes.push({
      id: this.nextId++,
      element,
      path,
      n: pts.length,
      progress: 0,
      x: path[0],
      y: path[1],
      t: 0,
      // Slower-than-real-time playback spaces echoes out along the trail.
      replayDur: Math.max(0.5, span * ECHO.stretch),
      linger: this.stats.echoLinger,
      alive: true,
      x0: path[0],
      y0: path[1],
      radius: this.stats.echoRadius,
      damage: this.stats.echoDamage,
      born: this.time,
      chainCd: 0,
      lastDir: 0,
    });
    this.events.push({ type: 'echo', x: path[0], y: path[1] });
    this.pushParticles(path[0], path[1], 5, 0xffe14d, 90);
  }

  private rebuildGrid(): void {
    this.grid.clear();
    for (let i = 0; i < this.enemies.length; i += 1) {
      const e = this.enemies[i];
      if (!e.alive) continue;
      const key = Math.floor(e.x / this.cell) * 100003 + Math.floor(e.y / this.cell);
      const arr = this.grid.get(key);
      if (arr) arr.push(i);
      else this.grid.set(key, [i]);
    }
  }

  private queryNear(x: number, y: number, r: number): number[] {
    const out = this.scratch;
    out.length = 0;
    const cs = this.cell;
    const minX = Math.floor((x - r) / cs);
    const maxX = Math.floor((x + r) / cs);
    const minY = Math.floor((y - r) / cs);
    const maxY = Math.floor((y + r) / cs);
    for (let cx = minX; cx <= maxX; cx += 1) {
      for (let cy = minY; cy <= maxY; cy += 1) {
        const arr = this.grid.get(cx * 100003 + cy);
        if (!arr) continue;
        for (let k = 0; k < arr.length; k += 1) out.push(arr[k]);
      }
    }
    return out;
  }

  private updateEnemies(dt: number): void {
    const px = this.px;
    const py = this.py;
    for (let i = 0; i < this.enemies.length; i += 1) {
      const e = this.enemies[i];
      if (!e.alive) continue;

      if (e.flash > 0) e.flash -= dt;
      if (e.hitCd > 0) e.hitCd -= dt;
      if (e.slowT > 0) e.slowT -= dt;
      if (e.freezeT > 0) e.freezeT -= dt;
      if (e.rootT > 0) e.rootT -= dt;
      if (e.burnT > 0) {
        e.burnT -= dt;
        this.damageEnemy(e, e.burnDps * dt);
        if (!e.alive) continue;
      }

      const dx = px - e.x;
      const dy = py - e.y;
      const d = Math.hypot(dx, dy) || 1;
      let speed = e.speed;
      if (e.slowT > 0) speed *= 0.45;
      if (e.freezeT > 0 || e.rootT > 0) speed = 0;

      let tx = dx / d;
      let ty = dy / d;

      if (e.kind === 'spitter') {
        // Hold a firing distance instead of hugging the player.
        const want = 300;
        if (d < want - 40) {
          tx = -tx;
          ty = -ty;
        } else if (d < want + 40) {
          const nx = -ty;
          const ny = tx;
          tx = nx;
          ty = ny;
        }
        if (e.shootT > 0) e.shootT -= dt;
        if (e.shootT <= 0 && d < 620) {
          e.shootT = randRange(this.rng, 1.6, 2.4);
          const sp = 190;
          this.projectiles.push({
            x: e.x,
            y: e.y,
            vx: (dx / d) * sp,
            vy: (dy / d) * sp,
            r: 7,
            dmg: e.dmg * 0.7,
            life: 3.4,
            color: 0xff4fd8,
          });
          if (this.projectiles.length > LIMITS.projectiles) this.projectiles.shift();
        }
      }

      if (e.kind === 'dasher') {
        e.phase += dt * 2.2;
        if (Math.sin(e.phase) > 0.3) speed *= 1.85;
      }

      if (e.boss) {
        if (e.minionT > 0) e.minionT -= dt;
        if (e.minionT <= 0) {
          e.minionT = 4.5;
          for (let k = 0; k < 3; k += 1) {
            const a = this.rng() * TAU;
            this.spawnEnemy('shard', e.x + Math.cos(a) * 70, e.y + Math.sin(a) * 70);
          }
        }
      }

      const accel = 9;
      e.vx += (tx * speed - e.vx) * Math.min(1, accel * dt);
      e.vy += (ty * speed - e.vy) * Math.min(1, accel * dt);

      // Separation keeps the swarm readable instead of stacking into one blob.
      const near = this.queryNear(e.x, e.y, e.r + 22);
      let sx = 0;
      let sy = 0;
      for (let k = 0; k < near.length; k += 1) {
        const o = this.enemies[near[k]];
        if (!o || !o.alive || o.id === e.id) continue;
        const ox = e.x - o.x;
        const oy = e.y - o.y;
        const od = Math.hypot(ox, oy);
        const minD = e.r + o.r;
        if (od > 0 && od < minD) {
          const push = ((minD - od) / minD) * 60;
          sx += (ox / od) * push;
          sy += (oy / od) * push;
        }
      }

      e.x = clamp(e.x + (e.vx + sx) * dt, 6, WORLD.w - 6);
      e.y = clamp(e.y + (e.vy + sy) * dt, 6, WORLD.h - 6);

      // Cut by the web you already wove.
      this.webStrike(e);

      // Contact damage.
      if (dist(this.px, this.py, e.x, e.y) < PLAYER.radius + e.r && this.invuln <= 0) {
        this.hp -= e.dmg;
        this.invuln = PLAYER.invuln;
        this.shake = Math.max(this.shake, 9);
        this.events.push({ type: 'hurt', x: e.x, y: e.y });
        this.pushParticles(this.px, this.py, 10, 0xff3b6b, 140);
      }
    }
  }

  /** Damage from standing inside a stamped thread cell (3x3 neighbourhood). */
  private webStrike(e: Enemy): void {
    if (e.hitCd > 0) return;
    const cs = WEB.cell;
    const cx = Math.floor(e.x / cs);
    const cy = Math.floor(e.y / cs);
    let best: WebMark | null = null;
    for (let ox = -1; ox <= 1; ox += 1) {
      for (let oy = -1; oy <= 1; oy += 1) {
        const m = this.web.get((cx + ox) * 100003 + (cy + oy));
        if (!m) continue;
        if (this.time - m.t > WEB.threadLife) continue;
        if (!best || m.t > best.t) best = m;
      }
    }
    if (!best) return;
    e.hitCd = ECHO.hitCd;
    e.flash = 0.12;
    this.damageEnemy(e, best.dmg);
    if (!e.alive) return;
    this.applyElementStatus(e, best.element, best.dmg);
  }

  private applyElementStatus(e: Enemy, element: ElementId, dmg: number): void {
    switch (element) {
      case 'fire':
        e.burnT = Math.max(e.burnT, 1.4);
        e.burnDps = Math.max(e.burnDps, dmg * 0.5);
        break;
      case 'frost':
        e.slowT = Math.max(e.slowT, 1.3);
        break;
      case 'volt': {
        const link = this.queryNear(e.x, e.y, 150);
        let hits = 0;
        for (let m = 0; m < link.length && hits < 3; m += 1) {
          const o = this.enemies[link[m]];
          if (!o || !o.alive || o.id === e.id) continue;
          if (dist(e.x, e.y, o.x, o.y) > 150) continue;
          o.flash = 0.1;
          this.damageEnemy(o, dmg * 0.5);
          hits += 1;
        }
        break;
      }
      case 'void': {
        const dx = this.px - e.x;
        const dy = this.py - e.y;
        const dd = Math.hypot(dx, dy) || 1;
        e.x += (dx / dd) * 12;
        e.y += (dy / dd) * 12;
        break;
      }
    }
  }

  private updateEchoes(dt: number): void {
    for (let i = 0; i < this.echoes.length; i += 1) {
      const echo = this.echoes[i];
      if (!echo.alive) continue;
      if (echo.chainCd > 0) echo.chainCd -= dt;

      const ox = echo.x;
      const oy = echo.y;
      if (echo.t < echo.replayDur) {
        echo.t += dt;
        echo.progress = Math.min(1, echo.t / echo.replayDur);
        const u = echo.progress * (echo.n - 1);
        const i0 = Math.floor(u);
        const i1 = Math.min(i0 + 1, echo.n - 1);
        const f = u - i0;
        const x0 = echo.path[i0 * 2];
        const y0 = echo.path[i0 * 2 + 1];
        const x1 = echo.path[i1 * 2];
        const y1 = echo.path[i1 * 2 + 1];
        echo.x = x0 + (x1 - x0) * f;
        echo.y = y0 + (y1 - y0) * f;
      } else if (echo.t < echo.replayDur + echo.linger) {
        echo.t += dt;
        echo.progress = 1;
        echo.x = echo.path[(echo.n - 1) * 2];
        echo.y = echo.path[(echo.n - 1) * 2 + 1];
      } else {
        echo.alive = false;
        continue;
      }

      const moved = Math.hypot(echo.x - ox, echo.y - oy);
      this.weave += moved;
      this.stampWeb(ox, oy, echo.x, echo.y, echo);
      this.strike(echo);
    }
  }

  /** Writes the thread the echo just laid down, detonating on element crossings. */
  private stampWeb(ax: number, ay: number, bx: number, by: number, echo: Echo): void {
    const cs = WEB.cell;
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.ceil(len / (cs * 0.6)));
    const dir = len > 0.001 ? Math.atan2(dy, dx) : echo.lastDir;
    echo.lastDir = dir;
    for (let s = 0; s <= steps; s += 1) {
      const t = steps === 0 ? 1 : s / steps;
      const x = ax + dx * t;
      const y = ay + dy * t;
      const cx = Math.floor(x / cs);
      const cy = Math.floor(y / cs);
      const key = cx * 100003 + cy;
      const prev = this.web.get(key);
      if (
        prev &&
        prev.element !== echo.element &&
        this.time - prev.t <= WEB.threadLife &&
        prev.resUntil <= this.time &&
        this.resonanceBudget > 0
      ) {
        // Only genuine crossings detonate. Two threads running alongside each
        // other (small angle) or doubling back (near 180°) are not a crossing.
        const cross = angleDelta(dir, prev.dir);
        if (cross > 0.6 && cross < Math.PI - 0.6) {
          prev.resUntil = this.time + RESONANCE.cooldown;
          this.resonanceBudget -= 1;
          this.detonate(cx * cs + cs / 2, cy * cs + cs / 2, prev.element, echo.element);
        }
      }
      this.web.set(key, {
        x: cx * cs + cs / 2,
        y: cy * cs + cs / 2,
        element: echo.element,
        t: this.time,
        dmg: echo.damage,
        dir,
        resUntil: prev ? prev.resUntil : 0,
      });
    }
  }

  private pruneWeb(dt: number): void {
    this.pruneT -= dt;
    if (this.pruneT > 0) return;
    this.pruneT = 0.5;
    const cutoff = this.time - WEB.threadLife - 1;
    for (const [key, mark] of this.web) {
      if (mark.t < cutoff) this.web.delete(key);
    }
  }

  /** Echo body damage: a moving blade on top of the thread it leaves behind. */
  private strike(echo: Echo): void {
    const reach = echo.radius;
    const near = this.queryNear(echo.x, echo.y, reach + 34);
    for (let k = 0; k < near.length; k += 1) {
      const e = this.enemies[near[k]];
      if (!e || !e.alive || e.hitCd > 0) continue;
      if (dist(echo.x, echo.y, e.x, e.y) > reach + e.r) continue;
      e.hitCd = ECHO.hitCd;
      e.flash = 0.12;
      this.damageEnemy(e, echo.damage * 1.4);
      if (!e.alive) continue;
      this.applyElementStatus(e, echo.element, echo.damage * 1.4);
    }
  }

  // ------------------------------------------------------------ resonance

  private detonate(x: number, y: number, elA: ElementId, elB: ElementId): void {
    const def = resonanceFor(elA, elB);
    const radius = this.stats.resonanceRadius * 1.55 * def.spread;
    const dmg = RESONANCE.burstDamage * this.stats.resonancePower * def.power;

    this.resonances += 1;
    this.weave += 10;
    this.shake = Math.max(this.shake, 7);
    this.events.push({ type: 'resonance', x, y, kind: def.kind });
    this.bursts.push({
      x,
      y,
      r0: 8,
      r1: radius,
      t: 0,
      dur: 0.5,
      color: def.color,
      kind: def.kind,
      angle: this.rng() * TAU,
    });
    this.pushParticles(x, y, 14, def.color, 220);

    const near = this.queryNear(x, y, Math.max(radius, 380));
    switch (def.kind) {
      case 'steam':
      case 'singularity':
      case 'crystal': {
        for (let k = 0; k < near.length; k += 1) {
          const e = this.enemies[near[k]];
          if (!e || !e.alive) continue;
          if (dist(x, y, e.x, e.y) > radius + e.r) continue;
          this.damageEnemy(e, dmg);
          if (!e.alive) continue;
          if (def.kind === 'steam') {
            const ex = e.x - x;
            const ey = e.y - y;
            const dd = Math.hypot(ex, ey) || 1;
            e.x += (ex / dd) * 46;
            e.y += (ey / dd) * 46;
          }
        }
        if (def.kind === 'singularity') {
          this.fields.push({
            x,
            y,
            r: radius * 1.3,
            t: 0,
            dur: 0.9,
            kind: 'pull',
            color: def.color,
            power: 240,
          });
        }
        if (def.kind === 'crystal') {
          this.fields.push({
            x,
            y,
            r: radius * 0.9,
            t: 0,
            dur: 2.4,
            kind: 'crystal',
            color: def.color,
            power: dmg * 0.35,
          });
        }
        break;
      }
      case 'superconduct': {
        for (let k = 0; k < near.length; k += 1) {
          const e = this.enemies[near[k]];
          if (!e || !e.alive) continue;
          if (dist(x, y, e.x, e.y) > radius + e.r) continue;
          e.freezeT = Math.max(e.freezeT, 2.2);
          this.damageEnemy(e, dmg);
        }
        break;
      }
      case 'plasma': {
        const targets: Enemy[] = [];
        for (let k = 0; k < near.length; k += 1) {
          const e = this.enemies[near[k]];
          if (!e || !e.alive) continue;
          if (dist(x, y, e.x, e.y) > 360) continue;
          targets.push(e);
        }
        targets.sort((a, b) => dist(x, y, a.x, a.y) - dist(x, y, b.x, b.y));
        for (let k = 0; k < Math.min(6, targets.length); k += 1) {
          this.damageEnemy(targets[k], dmg);
        }
        break;
      }
      case 'annihilate': {
        const ang = this.rng() * TAU;
        const ax = x - Math.cos(ang) * 260;
        const ay = y - Math.sin(ang) * 260;
        const bx = x + Math.cos(ang) * 260;
        const by = y + Math.sin(ang) * 260;
        for (let k = 0; k < near.length; k += 1) {
          const e = this.enemies[near[k]];
          if (!e || !e.alive) continue;
          if (pointSegDist(e.x, e.y, ax, ay, bx, by) > 54 + e.r) continue;
          this.damageEnemy(e, dmg);
        }
        break;
      }
    }
  }

  private updateFields(dt: number): void {
    for (let i = this.fields.length - 1; i >= 0; i -= 1) {
      const f = this.fields[i];
      f.t += dt;
      const near = this.queryNear(f.x, f.y, f.r);
      for (let k = 0; k < near.length; k += 1) {
        const e = this.enemies[near[k]];
        if (!e || !e.alive) continue;
        if (dist(f.x, f.y, e.x, e.y) > f.r + e.r) continue;
        if (f.kind === 'pull') {
          const dx = f.x - e.x;
          const dy = f.y - e.y;
          const dd = Math.hypot(dx, dy) || 1;
          e.x += (dx / dd) * f.power * dt;
          e.y += (dy / dd) * f.power * dt;
        } else {
          e.rootT = Math.max(e.rootT, 0.2);
          this.damageEnemy(e, f.power * dt);
        }
      }
      if (f.t >= f.dur) this.fields.splice(i, 1);
    }
  }

  private updateProjectiles(dt: number): void {
    for (let i = this.projectiles.length - 1; i >= 0; i -= 1) {
      const p = this.projectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (dist(p.x, p.y, this.px, this.py) < p.r + PLAYER.radius) {
        if (this.invuln <= 0) {
          this.hp -= p.dmg;
          this.invuln = PLAYER.invuln;
          this.shake = Math.max(this.shake, 7);
          this.events.push({ type: 'hurt', x: p.x, y: p.y });
        }
        this.projectiles.splice(i, 1);
        continue;
      }
      if (p.life <= 0 || p.x < 0 || p.y < 0 || p.x > WORLD.w || p.y > WORLD.h) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  private updateOrbs(dt: number): void {
    const magnet = this.stats.magnet;
    for (let i = this.orbs.length - 1; i >= 0; i -= 1) {
      const o = this.orbs[i];
      o.t += dt;
      const d = dist(o.x, o.y, this.px, this.py);
      if (d < magnet) {
        const pull = 640;
        o.vx += ((this.px - o.x) / (d || 1)) * pull * dt;
        o.vy += ((this.py - o.y) / (d || 1)) * pull * dt;
      }
      o.vx *= 1 - 2.4 * dt;
      o.vy *= 1 - 2.4 * dt;
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      if (d < 20) {
        this.gainXp(o.value);
        this.orbs.splice(i, 1);
        this.events.push({ type: 'pickup' });
        continue;
      }
      if (o.t > 22) this.orbs.splice(i, 1);
    }
  }

  private updateBursts(dt: number): void {
    for (let i = this.bursts.length - 1; i >= 0; i -= 1) {
      const b = this.bursts[i];
      b.t += dt;
      if (b.t >= b.dur) this.bursts.splice(i, 1);
    }
  }

  private updateParticles(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const f = 1 - p.drag * dt;
      p.vx *= f;
      p.vy *= f;
    }
  }

  // ------------------------------------------------------------- director

  private updateDirector(dt: number): void {
    this.spawnT -= dt;
    if (this.spawnT <= 0) {
      this.spawnT = spawnInterval(this.time);
      const want = targetEnemyCount(this.time);
      if (this.enemies.length < Math.min(want, LIMITS.enemies)) {
        const count = Math.min(4, 1 + Math.floor(this.time / 75));
        for (let i = 0; i < count; i += 1) this.spawnAround(this.pickKind());
      }
    }
    if (this.bossIndex < BOSS_TIMES.length && this.time >= BOSS_TIMES[this.bossIndex]) {
      this.spawnBoss(this.bossIndex);
      this.bossIndex += 1;
    }
  }

  private pickKind(): EnemyKind {
    const t = this.time;
    const table: [EnemyKind, number][] = [['crawler', 10]];
    if (t > 25) table.push(['dasher', 6 + t / 55]);
    if (t > 55) table.push(['splitter', 5]);
    if (t > 105) table.push(['spitter', 4]);
    if (t > 165) table.push(['brute', 2.4]);
    let total = 0;
    for (const [, w] of table) total += w;
    let roll = this.rng() * total;
    for (const [kind, w] of table) {
      roll -= w;
      if (roll <= 0) return kind;
    }
    return 'crawler';
  }

  private spawnAround(kind: EnemyKind): void {
    const ring = 760;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const a = this.rng() * TAU;
      const x = clamp(this.px + Math.cos(a) * ring, 40, WORLD.w - 40);
      const y = clamp(this.py + Math.sin(a) * ring, 40, WORLD.h - 40);
      if (dist(x, y, this.px, this.py) < 380) continue;
      this.spawnEnemy(kind, x, y);
      return;
    }
  }

  private spawnBoss(wave: number): void {
    const a = this.rng() * TAU;
    const x = clamp(this.px + Math.cos(a) * 620, 80, WORLD.w - 80);
    const y = clamp(this.py + Math.sin(a) * 620, 80, WORLD.h - 80);
    const boss = this.spawnEnemy('boss', x, y);
    const hp = BOSS_HP[Math.min(wave, BOSS_HP.length - 1)];
    boss.maxHp = hp;
    boss.hp = hp;
    boss.minionT = 3;
    boss.r = 48 + wave * 4;
    if (wave === BOSS_TIMES.length - 1) this.finalBossId = boss.id;
    this.events.push({ type: 'boss', x, y });
    this.shake = Math.max(this.shake, 12);
    this.bursts.push({
      x,
      y,
      r0: 10,
      r1: 340,
      t: 0,
      dur: 0.9,
      color: 0xff0055,
      kind: 'singularity',
      angle: 0,
    });
  }

  private spawnEnemy(kind: EnemyKind, x: number, y: number): Enemy {
    const tpl = ENEMY_TEMPLATES[kind];
    const scale = 1 + this.time / 240;
    const hp = kind === 'boss' ? tpl.hp : tpl.hp * scale;
    const enemy: Enemy = {
      id: this.nextId++,
      x,
      y,
      vx: 0,
      vy: 0,
      hp,
      maxHp: hp,
      r: tpl.r,
      speed: tpl.speed,
      dmg: tpl.dmg,
      xp: tpl.xp,
      kind,
      alive: true,
      flash: 0,
      burnT: 0,
      burnDps: 0,
      slowT: 0,
      freezeT: 0,
      rootT: 0,
      hitCd: 0,
      shootT: randRange(this.rng, 0.5, 2),
      minionT: 4,
      phase: this.rng() * TAU,
      boss: Boolean(tpl.boss),
    };
    this.enemies.push(enemy);
    return enemy;
  }

  private damageEnemy(e: Enemy, amount: number): void {
    if (!e.alive) return;
    e.hp -= amount;
    if (e.hp > 0) return;
    e.alive = false;
    this.kills += 1;
    this.events.push({ type: 'kill', x: e.x, y: e.y });

    if (e.kind === 'splitter') {
      for (let k = 0; k < 2; k += 1) {
        const a = this.rng() * TAU;
        this.spawnEnemy('shard', e.x + Math.cos(a) * 20, e.y + Math.sin(a) * 20);
      }
    }
    if (e.boss) {
      this.shake = Math.max(this.shake, 16);
      this.events.push({ type: 'boss', x: e.x, y: e.y });
      this.bursts.push({
        x: e.x,
        y: e.y,
        r0: 10,
        r1: 520,
        t: 0,
        dur: 1.1,
        color: 0xffe14d,
        kind: 'steam',
        angle: 0,
      });
      for (let k = 0; k < 14; k += 1) {
        const a = this.rng() * TAU;
        this.spawnOrb(e.x + Math.cos(a) * 40, e.y + Math.sin(a) * 40, 5);
      }
      if (e.id === this.finalBossId) this.winPending = true;
    }
    this.spawnOrb(e.x, e.y, e.xp);
    this.pushParticles(e.x, e.y, 4, 0xff3b6b, 120);
  }

  private spawnOrb(x: number, y: number, value: number): void {
    if (this.orbs.length > 360) {
      this.gainXp(value);
      return;
    }
    this.orbs.push({
      x,
      y,
      vx: randRange(this.rng, -40, 40),
      vy: randRange(this.rng, -40, 40),
      value,
      t: 0,
      life: 22,
    });
  }

  private gainXp(amount: number): void {
    this.xp += amount;
    if (this.status !== 'playing') return;
    this.checkLevelUp();
  }

  private checkLevelUp(): boolean {
    if (this.xp < this.xpNext) return false;
    this.xp -= this.xpNext;
    this.level += 1;
    this.xpNext = xpForLevel(this.level);
    this.pendingChoices = rollUpgrades(this.rng, this.levels, 3);
    // Early levels must offer an element, otherwise the resonance mechanic —
    // the whole point of the game — stays locked out.
    if (this.level <= 3 && !this.pendingChoices.some((id) => id.startsWith('el'))) {
      const locked = (['elFrost', 'elVolt', 'elVoid'] as UpgradeId[]).filter(
        (id) => this.levels[id] === 0,
      );
      if (locked.length > 0) {
        this.pendingChoices[2] = locked[Math.floor(this.rng() * locked.length)];
      }
    }
    this.status = 'levelup';
    this.events.push({ type: 'levelup', x: this.px, y: this.py, value: this.level });
    return true;
  }

  private pushParticles(x: number, y: number, count: number, color: number, speed: number): void {
    for (let i = 0; i < count; i += 1) {
      if (this.particles.length >= LIMITS.particles) return;
      const a = this.rng() * TAU;
      const s = randRange(this.rng, speed * 0.25, speed);
      const life = randRange(this.rng, 0.25, 0.6);
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life,
        maxLife: life,
        size: randRange(this.rng, 1.6, 3.6),
        color,
        drag: 3.2,
      });
    }
  }

  private compact(): void {
    let w = 0;
    for (let i = 0; i < this.enemies.length; i += 1) {
      const e = this.enemies[i];
      if (e.alive) {
        this.enemies[w] = e;
        w += 1;
      }
    }
    this.enemies.length = w;

    let we = 0;
    for (let i = 0; i < this.echoes.length; i += 1) {
      const e = this.echoes[i];
      if (e.alive) {
        this.echoes[we] = e;
        we += 1;
      }
    }
    this.echoes.length = we;
  }

  /** Called by the scene once the final boss is dead. */
  resolveWin(): boolean {
    if (!this.winPending) return false;
    this.winPending = false;
    this.status = 'win';
    this.events.push({ type: 'win', x: this.px, y: this.py });
    return true;
  }
}

function angleDelta(a: number, b: number): number {
  let d = Math.abs(a - b) % TAU;
  if (d > Math.PI) d = TAU - d;
  return d;
}

function pointSegDist(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const abx = bx - ax;
  const aby = by - ay;
  const lenSq = abx * abx + aby * aby;
  if (lenSq === 0) return dist(px, py, ax, ay);
  let t = ((px - ax) * abx + (py - ay) * aby) / lenSq;
  t = clamp(t, 0, 1);
  return dist(px, py, ax + abx * t, ay + aby * t);
}
