import { BANDS, ENEMY, PLAYER, T, TILE, type Band } from './config';
import { World } from './world';
import { clamp, type Rng } from './math';

export interface Enemy {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  /** 'idle' | 'chase' | 'windup' — windup is the parry window. */
  state: 'idle' | 'chase' | 'windup' | 'stagger' | 'dead';
  /** Far from the player they swim through stone; close up they solidify. */
  phasing: boolean;
  t: number;
  dir: number;
  kind: 'ghoul' | 'skeleton' | 'knight' | 'slime' | 'imp';
  dmg: number;
  flash: number;
  armored: boolean;
  hitdone: boolean;
}

export interface OreChip {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  /** 0 ore, 1 rich, 2 essence */
  kind: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  kind: number;
  size: number;
}

export interface Pulse {
  x: number;
  y: number;
  r: number;
  max: number;
  life: number;
  maxLife: number;
  kind: number;
}

export interface LogLine {
  text: string;
  t: number;
}

const UPGRADES = [
  { key: 'edge', name: '刃 · 淬', desc: '刀伤 +18%', cost: 2 },
  { key: 'reach', name: '臂 · 长', desc: '挥击范围 +5', cost: 2 },
  { key: 'tempo', name: '步 · 疾', desc: '移动与下落更快', cost: 2 },
  { key: 'vigor', name: '体 · 厚', desc: '生命上限 +25（回满）', cost: 3 },
  { key: 'ember', name: '火 · 旺', desc: '烛火照亮范围 +28%', cost: 2 },
  { key: 'parry', name: '心 · 静', desc: '完美格挡判定 +35%', cost: 3 },
  { key: 'vein', name: '脉 · 生', desc: '刀痕成矿更丰、更长', cost: 3 },
  { key: 'bank', name: '炉 · 固', desc: '入炉精魂 +25%', cost: 3 },
] as const;

export interface RunStats {
  depth: number;
  kills: number;
  perfects: number;
  parries: number;
  essence: number;
  banked: number;
}

export type PlayerState = 'air' | 'ground' | 'dead';

export class RunSim {
  world: World;
  rng: Rng;
  band: Band;

  px = 0;
  py = 0;
  vx = 0;
  vy = 0;
  face = 1;
  hp: number = PLAYER.maxHp;
  maxHp: number = PLAYER.maxHp;
  grounded = false;
  state: PlayerState = 'air';

  attackT = 0;
  attackCd = 0;
  parryT = 0;
  parryCd = 0;
  iframes = 0;
  coyote = 0;
  buffer = 0;
  flask = 1;
  flaskCd = 0;

  essence = 0;
  banked = 0;
  spent = 0;
  pending = 0;
  kills = 0;
  perfects = 0;
  parries = 0;
  comboT = 0;
  combo = 0;
  /** Last carved seam, so the HUD can draw its direction for a moment. */
  lastVein: { x: number; y: number; dir: number; n: number; t: number } | null = null;
  /** 「刀势」: chain length and the tile the current cut has reached. */
  chain = 0;
  chainAt: { x: number; y: number } | null = null;

  bestRow = 0;
  time = 0;
  dead = false;
  deathT = 0;

  enemies: Enemy[] = [];
  chips: OreChip[] = [];
  particles: Particle[] = [];
  pulses: Pulse[] = [];
  log: LogLine[] = [];
  nextId = 1;
  spawnT = 0;
  shakeT = 0;
  shakeMag = 0;
  hitStop = 0;
  hitFlash = 0;
  /** Wave clock for the 暗潮 pressure system. */
  tide = 0;
  tideWarn = 0;
  tideActive = 0;
  /** World Y the tide front has reached. */
  tideFront = 0;
  tideStartY = 0;

  constructor(seed: number) {
    this.world = new World(seed);
    this.rng = this.world.rng;
    this.band = { from: 0, name: '', line: '', tint: 0xffffff, backdrop: 0 } as Band;
    const sx = Math.round(this.world.centreAt(8)) * TILE + TILE / 2;
    this.px = sx;
    this.py = 9 * TILE;
    this.band = this.currentBand();
  }

  currentBand(): Band {
    let b = this.band;
    for (const cand of BANDS) {
      if (this.py / TILE >= cand.from) b = cand;
    }
    return b;
  }

  get row(): number {
    return Math.floor((this.py + PLAYER.h) / TILE);
  }

  get col(): number {
    return Math.floor(this.px / TILE);
  }

  get depth(): number {
    return Math.max(0, Math.floor((this.py - 12 * TILE) / TILE));
  }

  private solidAt(x: number, y: number): boolean {
    return this.world.isSolid(Math.floor(x / TILE), Math.floor(y / TILE));
  }

  private rectHits(x: number, y: number, w: number, h: number): boolean {
    const x0 = Math.floor(x / TILE);
    const x1 = Math.floor((x + w - 1) / TILE);
    const y0 = Math.floor(y / TILE);
    const y1 = Math.floor((y + h - 1) / TILE);
    for (let ty = y0; ty <= y1; ty += 1) {
      for (let tx = x0; tx <= x1; tx += 1) {
        if (this.world.isSolid(tx, ty)) return true;
      }
    }
    return false;
  }

  /**
   * Axis-separated movement with sub-stepping.
   *
   * A single 620 px/s fall advances 10+ px per frame, which is wider than the
   * body, so one big step can put the feet on the far side of a floor and drop
   * the player out of the level. Steps are cut to 4 px, which is less than any
   * solid feature, so nothing is ever skipped.
   */
  private moveAxis(dx: number, dy: number): void {
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 4));
    const sx = dx / steps;
    const sy = dy / steps;
    for (let i = 0; i < steps; i += 1) {
      if (sx !== 0) {
        const nx = this.px + sx;
        if (!this.rectHits(nx, this.py, PLAYER.w, PLAYER.h)) {
          this.px = nx;
        } else {
          // step up single tiles so a 1-high lip does not stop a descent
          const up = this.py - TILE * 0.85;
          if (!this.rectHits(nx, up, PLAYER.w, PLAYER.h)) {
            this.px = nx;
            this.py = up;
          } else {
            this.vx = 0;
            break;
          }
        }
      }
      if (sy !== 0) {
        const ny = this.py + sy;
        if (!this.rectHits(this.px, ny, PLAYER.w, PLAYER.h)) {
          this.py = ny;
        } else {
          if (sy > 0) {
            this.py = Math.floor((this.py + PLAYER.h) / TILE) * TILE - PLAYER.h - 0.01;
            this.grounded = true;
          }
          this.vy = 0;
          break;
        }
      }
    }
  }

  update(dt: number, input: Input): void {
    this.time += dt;
    if (this.dead) {
      this.deathT += dt;
      this.stepParticles(dt);
      return;
    }
    if (this.hitStop > 0) {
      this.hitStop -= dt;
      dt *= 0.2;
    }

    this.hitFlash = Math.max(0, this.hitFlash - dt * 3);
    this.parryT = Math.max(0, this.parryT - dt);
    this.parryCd = Math.max(0, this.parryCd - dt);
    this.attackCd = Math.max(0, this.attackCd - dt);
    this.iframes = Math.max(0, this.iframes - dt);
    this.flaskCd = Math.max(0, this.flaskCd - dt);
    this.comboT = Math.max(0, this.comboT - dt);
    if (this.comboT <= 0) {
      this.combo = 0;
      // The cut goes cold: a new parry starts a fresh seam instead of extending.
      this.chain = 0;
      this.chainAt = null;
    }
    if (this.lastVein) {
      this.lastVein.t -= dt;
      if (this.lastVein.t <= 0) this.lastVein = null;
    }
    this.shakeT = Math.max(0, this.shakeT - dt);

    // ---- movement ------------------------------------------------------
    const speedMul = this.up('tempo') ? 1.16 : 1;
    const accel = PLAYER.accel * speedMul;
    const target = input.moveX * PLAYER.speed * speedMul;
    if (input.moveX !== 0) {
      this.face = input.moveX;
      this.vx += clamp(target - this.vx, -accel * dt, accel * dt);
    } else {
      this.vx += clamp(0 - this.vx, -PLAYER.friction * dt, PLAYER.friction * dt);
    }

    this.vy = Math.min(PLAYER.maxFall * speedMul, this.vy + PLAYER.gravity * dt);

    if (this.grounded) this.coyote = PLAYER.coyote;
    else this.coyote = Math.max(0, this.coyote - dt);
    this.buffer = input.jumpPressed ? PLAYER.buffer : Math.max(0, this.buffer - dt);
    if (this.buffer > 0 && this.coyote > 0) {
      this.vy = -PLAYER.jump * speedMul;
      this.buffer = 0;
      this.coyote = 0;
      this.grounded = false;
      this.puff(this.px, this.py + PLAYER.h, 6, 0);
    }
    if (input.jumpHeld && this.vy < 0) this.vy -= 260 * dt;
    if (!input.jumpHeld && this.vy < -90) this.vy += 900 * dt;

    this.grounded = false;
    this.moveAxis(this.vx * dt, 0);
    this.moveAxis(0, this.vy * dt);
    if (this.py > this.world.h * TILE) {
      this.damage(999, true);
    }

    // ---- combat --------------------------------------------------------
    if (input.attackPressed && this.attackCd <= 0) {
      this.attackCd = PLAYER.attackCd;
      this.attackT = PLAYER.attackDur;
      this.puff(this.px + this.face * 14, this.py + 10, 4, 1);
      this.hitStop = Math.max(this.hitStop, 0.03);
    }
    this.attackT = Math.max(0, this.attackT - dt);
    if (this.attackT > 0) this.resolveSwing();

    if (input.parryPressed && this.parryCd <= 0) {
      this.parryCd = PLAYER.parryCd;
      this.parryT = PLAYER.parryActive * (this.up('parry') ? 1.35 : 1);
      this.pulses.push({ x: this.px + this.face * 10, y: this.py + 7, r: 3, max: 15, life: 0.16, maxLife: 0.16, kind: 1 });
    }

    if (input.drinkPressed && this.flask > 0 && this.flaskCd <= 0 && this.hp < this.maxHp) {
      this.flask -= 1;
      this.flaskCd = 1.2;
      this.hp = Math.min(this.maxHp, this.hp + 45);
      this.pulses.push({ x: this.px, y: this.py + 7, r: 5, max: 24, life: 0.35, maxLife: 0.35, kind: 2 });
      this.say('饮下烛血');
    }

    // bank at a brazier
    const braz = this.world.brazierNear(this.px, this.py);
    if (braz) {
      this.pending = Math.max(0, this.pending - dt);
      this.tideWarn = Math.max(0, this.tideWarn - dt * 0.5);
      if (this.essence > 0) {
        const gain = Math.round(this.essence * (this.up('bank') ? 1.25 : 1));
        this.banked += gain;
        if (this.essence * 3 >= this.threshold) this.say(`入炉 · 精魂 +${gain}`);
        this.essence = 0;
        this.hp = Math.min(this.maxHp, this.hp + 8 * dt * 6);
        this.pulses.push({ x: braz.x, y: braz.y, r: 4, max: 20, life: 0.3, maxLife: 0.3, kind: 2 });
      }
    } else if (this.essence > 0) {
      this.pending += dt;
    }

    // ---- 暗潮 (the rising tide) ----------------------------------------
    this.tideWarn = Math.max(0, this.tideWarn - dt);
    this.tideActive = Math.max(0, this.tideActive - dt);
    this.tide += dt;
    if (this.tide > 26 && this.tideWarn <= 0 && this.tideActive <= 0) {
      this.tideWarn = 3.2;
      this.tide = 0;
    }
    if (this.tideWarn > 0 && this.tideWarn < 0.08) {
      this.tideActive = 6;
      this.tideStartY = this.py;
      this.tideFront = this.py - 220;
      this.say('暗潮压下');
      this.shake(6, 0.4);
    }
    if (this.tideActive > 0) {
      this.tideActive -= dt;
      // The front sinks past you at 44 px/s. Standing still is death; the only
      // answer is to keep descending, which is the whole rhythm of the game.
      this.tideFront += 44 * dt;
      if (this.py < this.tideFront) {
        this.hp -= 16 * dt;
        this.hitFlash = Math.max(this.hitFlash, 0.5);
        if (this.hp <= 0) {
          this.hp = 0;
          this.die();
        }
      }
    }

    // ---- economy -------------------------------------------------------
    for (let i = this.chips.length - 1; i >= 0; i -= 1) {
      const c = this.chips[i];
      c.life -= dt;
      c.vy += 900 * dt;
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      const gx = this.px + PLAYER.w / 2;
      const gy = this.py + PLAYER.h / 2;
      const d = Math.hypot(gx - c.x, gy - c.y);
      if (d < 44) {
        c.x += (gx - c.x) * dt * 9;
        c.y += (gy - c.y) * dt * 9;
      }
      if (d < 10 || c.life <= 0) {
        if (c.life > 0) {
          const v = c.kind === 1 ? 5 : c.kind === 2 ? 3 : 2;
          this.essence += v;
          this.pulses.push({ x: c.x, y: c.y, r: 1, max: 7, life: 0.14, maxLife: 0.14, kind: 0 });
        }
        this.chips.splice(i, 1);
      }
    }

    // ---- enemies -------------------------------------------------------
    this.spawnT -= dt;
    if (this.spawnT <= 0) {
      this.spawnT = Math.max(0.55, 1.7 - this.depth / 260);
      this.trySpawn();
    }
    this.stepEnemies(dt);
    this.stepParticles(dt);

    this.bestRow = Math.max(this.bestRow, this.row);
    this.band = this.currentBand();
  }

  private up(key: string): boolean {
    return this.upgrades.includes(key);
  }

  upgrades: string[] = [];

  get threshold(): number {
    return 60 + this.spent * 30;
  }

  buyUpgrade(): { ok: boolean; msg: string } {
    const cost = Math.ceil(this.threshold / 10) + 2;
    if (this.banked < cost) return { ok: false, msg: '精魂不足' };
    const pool = UPGRADES.filter((u) => !this.upgrades.includes(u.key));
    if (pool.length === 0) return { ok: false, msg: '刀已尽极' };
    const pick = pool[Math.floor(this.rng() * pool.length)];
    this.banked -= cost;
    this.spent += 1;
    this.upgrades.push(pick.key);
    if (pick.key === 'vigor') {
      this.maxHp += 25;
      this.hp = this.maxHp;
    }
    this.say(`${pick.name} · ${pick.desc}`);
    return { ok: true, msg: `${pick.name} · ${pick.desc}` };
  }

  private resolveSwing(): void {
    const reach = PLAYER.reach + (this.up('reach') ? 5 : 0);
    const dmg = PLAYER.damage * (this.up('edge') ? 1.18 : 1);
    const x0 = this.face > 0 ? this.px + 4 : this.px - reach;
    const y0 = this.py - 4;
    for (const e of this.enemies) {
      if (e.state === 'dead') continue;
      if (e.x + e.w < x0 || e.x > x0 + reach) continue;
      if (e.y + e.h < y0 || e.y > y0 + PLAYER.h + 10) continue;
      if (e.hp <= 0) continue;
      // A blow already in motion cannot be cancelled by another blow: the only
      // answer to a windup is a parry. Hitting a staggered enemy is a riposte.
      const riposte = e.state === 'stagger' ? 2.6 : 1;
      e.hp -= dmg * riposte;
      e.flash = 0.16;
      this.hitStop = Math.max(this.hitStop, 0.045);
      this.shake(3, 0.12);
      this.puff(e.x + e.w / 2, e.y + e.h / 2, 7, 1);
      if (e.hp <= 0) {
        e.state = 'dead';
        this.kills += 1;
        this.combo += 1;
        this.comboT = 2.4;
        for (let i = 0; i < 4; i += 1) {
          this.chips.push({
            x: e.x + e.w / 2,
            y: e.y + e.h / 2,
            vx: (this.rng() - 0.5) * 160,
            vy: -90 - this.rng() * 130,
            life: 1.6,
            kind: e.armored ? 2 : 0,
          });
        }
        // armour breaks into usable ore
        if (e.armored) this.world.carveVein(Math.floor(e.x / TILE), Math.floor(e.y / TILE), true, 2);
        this.hitStop = Math.max(this.hitStop, 0.07);
      }
      break;
    }

    // mining
    const tx0 = Math.floor(x0 / TILE);
    const tx1 = Math.floor((x0 + reach) / TILE);
    const ty0 = Math.floor(y0 / TILE);
    const ty1 = Math.floor((y0 + PLAYER.h + 10) / TILE);
    for (let ty = ty0; ty <= ty1; ty += 1) {
      for (let tx = tx0; tx <= tx1; tx += 1) {
        const res = this.world.hitTile(tx, ty, PLAYER.minePower);
        if (!res.hit) continue;
        this.puff(tx * TILE + 8, ty * TILE + 8, 3, 0);
        if (res.broke >= 0) {
          const kind = res.broke === T.RICH ? 1 : 0;
          // plain rock is only a path, never a payout
          const n = res.broke === T.RICH ? 5 : res.broke === T.ORE ? 4 : 0;
          for (let i = 0; i < n; i += 1) {
            this.chips.push({
              x: tx * TILE + 8,
              y: ty * TILE + 8,
              vx: (this.rng() - 0.5) * 130,
              vy: -80 - this.rng() * 90,
              life: 1.3,
              kind,
            });
          }
          if (res.broke === T.ORE || res.broke === T.RICH) this.shake(1.6, 0.08);
        }
      }
    }
  }

  private trySpawn(): void {
    const alive = this.enemies.filter((e) => e.state !== 'dead').length;
    const cap = 6 + Math.floor(this.depth / 70);
    if (alive >= cap) return;
    for (let attempt = 0; attempt < 26; attempt += 1) {
      const rx = 4 + Math.floor(this.rng() * 8);
      const tx = this.col + (this.rng() > 0.5 ? rx : -rx);
      const ty = this.row - 6 + Math.floor(this.rng() * 10);
      if (this.world.get(tx, ty) !== T.AIR) continue;
      if (this.world.get(tx, ty + 1) === T.AIR) continue;
      if (this.world.get(tx, ty - 1) !== T.AIR) continue;
      const depth = this.depth;
      const roll = this.rng();
      let kind: Enemy['kind'] = 'slime';
      let hp = 22;
      let dmg: number = ENEMY.damage;
      let armored = false;
      if (roll > 0.88 && depth > 120) {
        kind = 'imp';
        hp = 50;
        dmg = 16;
      } else if (roll > 0.72 && depth > 60) {
        kind = 'knight';
        hp = 62;
        armored = true;
        dmg = 17;
      } else if (roll > 0.44) {
        kind = 'skeleton';
        hp = 44;
      } else if (roll > 0.22) {
        kind = 'ghoul';
        hp = 40;
        dmg = 12;
      }
      const scale = 1 + depth / 420;
      this.enemies.push({
        id: this.nextId++,
        x: tx * TILE + 2,
        y: ty * TILE + 2,
        vx: 0,
        vy: 0,
        w: 12,
        h: 14,
        hp: Math.round(hp * scale),
        maxHp: Math.round(hp * scale),
        state: 'idle',
        t: 0,
        dir: -1,
        kind,
        dmg,
        flash: 0,
        armored,
        hitdone: false,
        phasing: false,
      });
      return;
    }

    // Boxed in by their own tunnel? Something comes out of the stone instead.
    for (let attempt = 0; attempt < 24; attempt += 1) {
      const rx = 5 + Math.floor(this.rng() * 7);
      const tx = this.col + (this.rng() > 0.5 ? rx : -rx);
      const ty = this.row - 4 + Math.floor(this.rng() * 8);
      const t = this.world.get(tx, ty);
      if (t !== T.ROCK && t !== T.DEEP) continue;
      this.world.set(tx, ty, T.AIR);
      this.puff(tx * TILE + 8, ty * TILE + 8, 10, 1);
      this.enemies.push({
        id: this.nextId++,
        x: tx * TILE + 2,
        y: ty * TILE + 2,
        vx: 0,
        vy: 0,
        w: 12,
        h: 14,
        hp: 40,
        maxHp: 40,
        state: 'chase',
        t: 0,
        dir: -1,
        kind: 'ghoul',
        dmg: ENEMY.damage,
        flash: 0,
        armored: false,
        hitdone: false,
        phasing: false,
      });
      return;
    }
  }

  private stepEnemies(dt: number): void {
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const e = this.enemies[i];
      e.flash = Math.max(0, e.flash - dt);
      if (e.state === 'dead') {
        e.t += dt;
        if (e.t > 1.4) this.enemies.splice(i, 1);
        continue;
      }
      const dx = this.px + PLAYER.w / 2 - (e.x + e.w / 2);
      const dy = this.py + PLAYER.h / 2 - (e.y + e.h / 2);
      const dist = Math.hypot(dx, dy);
      // A body embedded in stone has no leverage: it must surface before it
      // can swing. Otherwise blows land through walls the player cannot see.
      const inOpen = this.world.get(
        Math.floor((e.x + e.w / 2) / TILE),
        Math.floor((e.y + e.h / 2) / TILE),
      ) === T.AIR;
      e.t -= dt;
      if (e.state === 'idle') {
        if (dist < 150) e.state = 'chase';
        else {
          e.vx = Math.sin(this.time * 1.3 + e.id) * 10;
        }
      } else if (e.state === 'chase') {
        if (dist > 210) {
          e.state = 'idle';
        } else if (dist < 34 && e.t <= 0 && inOpen) {
          e.state = 'windup';
          e.t = ENEMY.windup;
          e.dir = dx > 0 ? 1 : -1;
          e.hitdone = false;
        } else {
          e.dir = dx > 0 ? 1 : -1;
          e.vx = e.dir * (e.kind === 'imp' ? 62 : 44);
        }
      } else if (e.state === 'windup') {
        e.vx = 0;
        e.vy = 0;
        if (e.t <= 0 && !e.hitdone) {
          e.hitdone = true;
          // the blow lands exactly once; the parry window is the last 0.2 s
          const hitReach = 30;
          const facing = (dx <= 0 && e.dir < 0) || (dx > 0 && e.dir > 0);
          const inReach = Math.abs(dx) < hitReach && Math.abs(dy) < 26 && facing && inOpen;
          if (inReach) {
            if (this.parryT > 0) {
              this.perfectParry(e);
            } else if (this.iframes <= 0) {
              this.damage(e.dmg, false, e.dir);
            }
          }
          e.state = 'chase';
          e.t = 0.6;
        }
      } else if (e.state === 'stagger') {
        e.vx *= 0.8;
        if (e.t <= 0) e.state = 'chase';
      }

      // Far away, the tide chews through the stone to reach you; up close it
      // has to obey geometry like anything else.
      const far = dist > 56;
      e.phasing = far && dist > 90;
      if (e.phasing) {
        const sp = 96;
        const len = Math.max(1, dist);
        e.x += (dx / len) * sp * dt;
        e.y += (dy / len) * sp * dt;
        e.vx = 0;
        e.vy = 0;
      } else {
        e.vy = Math.min(500, e.vy + 900 * dt);
        const nx = e.x + e.vx * dt;
        if (!this.rectHits(nx, e.y, e.w, e.h)) e.x = nx;
        else e.vx = 0;
        const ny = e.y + e.vy * dt;
        if (!this.rectHits(e.x, ny, e.w, e.h)) e.y = ny;
        else {
          if (e.vy > 0) e.y = Math.floor((e.y + e.h) / TILE) * TILE - e.h - 0.01;
          e.vy = 0;
        }
      }
      if (far) {
        // drift toward the player even while the windup timer is idle
        e.dir = dx > 0 ? 1 : -1;
        if (e.state === 'idle' && dist < 120) e.state = 'chase';
      }
      // contact damage
      if (this.iframes <= 0 && e.state !== 'windup' && inOpen) {
        const close = Math.abs(dx) < 12 && Math.abs(dy) < 16;
        if (close) this.damage(4, false, e.dir);
      }
    }
  }

  /**
   * Parry entry point for tooling and the render harness: the sim itself routes
   * through the same path, so a frame captured here is a frame the player sees.
   */
  forceParry(e: Enemy): void {
    this.perfectParry(e);
  }

  private perfectParry(e: Enemy): void {
    this.perfects += 1;
    this.parries += 1;
    this.essence += 2;
    this.combo += 1;
    this.comboT = 2.6;
    this.iframes = 0.3;
    this.hitStop = 0.12;
    this.shake(7, 0.28);
    this.pulses.push({ x: e.x + e.w / 2, y: e.y + e.h / 2, r: 5, max: 26, life: 0.24, maxLife: 0.24, kind: 1 });
    e.state = 'stagger';
    e.t = ENEMY.staggerTime;
    e.vx = -e.dir * 120;
    // The blow's momentum carries through: it is driven away from the attacker.
    const forceDir = e.x + e.w / 2 <= this.px + PLAYER.w / 2 ? 1 : -1;
    // 「刀势」: each parry in a chain extends the previous seam, so a clean streak
    // reads as one long cut through the rock — and a longer cut is both a richer
    // vein and a tunnel you can use. Dropping the chain costs you the line.
    const chain = Math.min(5, this.chain);
    const size = (this.up('vein') ? 7 : 5) + chain;
    const rich = this.up('vein') || chain >= 2 || this.rng() > 0.5;
    const made = this.world.carveVein(
      Math.floor((e.x + e.w / 2) / TILE),
      Math.floor((e.y + e.h / 2) / TILE),
      rich,
      size,
      forceDir,
      this.chainAt,
    );
    if (made.length > 0) this.chain = Math.min(5, this.chain + 1);
    const last = made[made.length - 1];
    if (last) this.chainAt = { x: last.x, y: last.y };
    for (const t of made) {
      this.chips.push({
        x: t.x * TILE + 8,
        y: t.y * TILE + 8,
        vx: (this.rng() - 0.5) * 90,
        vy: -130,
        life: 0.9,
        kind: rich ? 1 : 0,
      });
    }
    if (made.length > 0) {
      this.say(forceDir > 0 ? '刀痕成矿 →' : '← 刀痕成矿');
      this.lastVein = { x: made[0].x, y: made[0].y, dir: forceDir, n: made.length, t: 1.1 };
    }
  }

  damage(amount: number, fatal = false, dir = 0): void {
    if (this.iframes > 0 && !fatal) return;
    // Taking a hit breaks the chain: the seam is severed where it stopped.
    this.chain = 0;
    this.chainAt = null;
    this.hp -= amount;
    this.iframes = PLAYER.iframes;
    this.hitStop = 0.08;
    this.shake(8, 0.3);
    this.hitFlash = 1;
    this.vx += dir * 150;
    this.vy = Math.min(this.vy, -140);
    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    }
  }

  private die(): void {
    this.dead = true;
    this.deathT = 0;
    this.say('刀落 · 精魂散');
    this.essence = 0;
    this.shake(12, 0.7);
  }

  respawn(): void {
    const sx = Math.round(this.world.centreAt(8)) * TILE + TILE / 2;
    this.px = sx;
    this.py = 9 * TILE;
    this.vx = 0;
    this.vy = 0;
    this.hp = this.maxHp;
    this.dead = false;
    this.deathT = 0;
    this.iframes = 1.6;
    this.essence = 0;
    this.enemies = [];
    this.tide = 0;
    this.tideActive = 0;
    this.tideFront = 0;
    this.tideWarn = 0;
  }

  /** Runs while the run is over so the death tableau keeps breathing. */
  stepParticlesOnly(dt: number): void {
    this.deathT += dt;
    this.stepParticles(dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt * 1.5);
    this.shakeT = Math.max(0, this.shakeT - dt);
  }

  say(text: string): void {
    this.log.unshift({ text, t: this.time });
    if (this.log.length > 6) this.log.pop();
  }

  shake(mag: number, dur: number): void {
    this.shakeMag = Math.max(this.shakeMag, mag);
    this.shakeT = Math.max(this.shakeT, dur);
  }

  private puff(x: number, y: number, n: number, kind: number): void {
    for (let i = 0; i < n; i += 1) {
      this.particles.push({
        x,
        y,
        vx: (this.rng() - 0.5) * 190,
        vy: (this.rng() - 0.5) * 190 - 40,
        life: 0.28 + this.rng() * 0.4,
        max: 0.68,
        kind,
        size: 1 + Math.floor(this.rng() * 2),
      });
    }
  }

  private stepParticles(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      p.life -= dt;
      p.vy += 420 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.pulses.length - 1; i >= 0; i -= 1) {
      const p = this.pulses[i];
      p.life -= dt;
      p.r += (p.max - p.r) * Math.min(1, dt * 9);
      if (p.life <= 0) this.pulses.splice(i, 1);
    }
    for (let i = this.log.length - 1; i >= 0; i -= 1) {
      if (this.time - this.log[i].t > 3.6) this.log.splice(i, 1);
    }
  }
}

export interface Input {
  moveX: number;
  jumpPressed: boolean;
  jumpHeld: boolean;
  attackPressed: boolean;
  parryPressed: boolean;
  drinkPressed: boolean;
}
