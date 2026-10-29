import {
  COMBAT,
  PLAYER,
  T,
  TILE,
  bandAt,
  type Band,
} from './config';
import { approach, clamp, mulberry32, type Rng } from './math';
import { World } from './world';

export type RunStatus = 'title' | 'playing' | 'shop' | 'dead';

export type EnemyKind = 'wraith' | 'lancer' | 'lantern';

export interface Enemy {
  id: number;
  kind: EnemyKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  facing: number;
  state: 'idle' | 'windup' | 'strike' | 'recover' | 'stagger';
  t: number;
  onGround: boolean;
  flash: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: number;
  gravity: number;
}

export interface FloatText {
  x: number;
  y: number;
  vy: number;
  life: number;
  text: string;
  color: number;
}

export type UpgradeId =
  | 'edge'
  | 'reach'
  | 'vigor'
  | 'tempo'
  | 'veinYield'
  | 'veinSize'
  | 'lantern'
  | 'emberstep';

export interface UpgradeDef {
  id: UpgradeId;
  name: string;
  cn: string;
  max: number;
  baseCost: number;
  describe: (next: number) => string;
}

export const UPGRADES: UpgradeDef[] = [
  { id: 'edge', name: 'EDGE', cn: '刃', max: 8, baseCost: 14, describe: (n) => `刀伤 +${3 * n}` },
  { id: 'reach', name: 'REACH', cn: '寸', max: 4, baseCost: 20, describe: (n) => `刀距 +${8 * n}px` },
  { id: 'vigor', name: 'VIGOR', cn: '骨', max: 6, baseCost: 18, describe: (n) => `气血上限 +${20 * n}` },
  { id: 'tempo', name: 'TEMPO', cn: '息', max: 5, baseCost: 22, describe: (n) => `挥刀间隔 -${8 * n}%` },
  { id: 'veinYield', name: 'VEIN', cn: '髓', max: 6, baseCost: 26, describe: (n) => `矿石精魄 +${45 * n}%` },
  { id: 'veinSize', name: 'SEAM', cn: '脉', max: 4, baseCost: 30, describe: (n) => `刀痕矿脉 +${n} 格` },
  { id: 'lantern', name: 'LANTERN', cn: '烛', max: 4, baseCost: 24, describe: (n) => `烛光范围 +${18 * n}%` },
  { id: 'emberstep', name: 'EMBERSTEP', cn: '烬', max: 3, baseCost: 34, describe: () => `空中可再跃一次` },
];

export const UPGRADE_BY_ID: Record<UpgradeId, UpgradeDef> = Object.fromEntries(
  UPGRADES.map((u) => [u.id, u]),
) as Record<UpgradeId, UpgradeDef>;

export type UpgradeLevels = Record<UpgradeId, number>;

function emptyLevels(): UpgradeLevels {
  return {
    edge: 0,
    reach: 0,
    vigor: 0,
    tempo: 0,
    veinYield: 0,
    veinSize: 0,
    lantern: 0,
    emberstep: 0,
  };
}

export interface Input {
  left: boolean;
  right: boolean;
  jump: boolean;
  jumpPressed: boolean;
  attack: boolean;
  attackPressed: boolean;
  parryPressed: boolean;
  interactPressed: boolean;
}

export const NO_INPUT: Input = {
  left: false,
  right: false,
  jump: false,
  jumpPressed: false,
  attack: false,
  attackPressed: false,
  parryPressed: false,
  interactPressed: false,
};

export interface SimEvent {
  type: 'parry' | 'perfect' | 'hurt' | 'mine' | 'kill' | 'bank' | 'shop' | 'descend' | 'death' | 'vein';
  x?: number;
  y?: number;
  amount?: number;
}

export class RunSim {
  readonly seed: number;
  readonly rng: Rng;
  world: World;

  status: RunStatus = 'title';
  time = 0;

  // player
  px = 0;
  py = 0;
  vx = 0;
  vy = 0;
  facing = 1;
  onGround = false;
  coyote = 0;
  jumpBuffer = 0;
  airJumps = 0;
  hp: number = PLAYER.maxHp;
  attackT = 0;
  attackCd = 0;
  parryT = 0;
  parryCd = 0;
  iframes = 0;
  hitCombo = 0;
  comboT = 0;

  // economy
  essence = 0;
  banked = 0;
  depthMax = 0;
  kills = 0;
  perfects = 0;
  mined = 0;

  levels: UpgradeLevels = emptyLevels();
  shopChoices: UpgradeId[] = [];
  shopOpen = false;

  // pressure
  miasmaRow = -60;
  miasmaSpeed = 1.05;
  miasmaHurtT = 0;

  enemies: Enemy[] = [];
  particles: Particle[] = [];
  floats: FloatText[] = [];
  events: SimEvent[] = [];

  private nextId = 1;
  private spawnT = 1.4;
  private veinFlash: { x: number; y: number; life: number }[] = [];

  constructor(seed = (Date.now() & 0x7fffffff) >>> 0) {
    this.seed = seed;
    this.rng = mulberry32(seed);
    this.world = new World(seed);
    this.reset();
  }

  reset(): void {
    this.time = 0;
    this.px = (this.world.w / 2) * TILE + TILE / 2;
    this.py = 7 * TILE;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1;
    this.hp = this.maxHp;
    this.attackT = 0;
    this.attackCd = 0;
    this.parryT = 0;
    this.parryCd = 0;
    this.iframes = 0;
    this.airJumps = 0;
    this.hitCombo = 0;
    this.comboT = 0;
    this.essence = 0;
    this.banked = 0;
    this.depthMax = 0;
    this.kills = 0;
    this.perfects = 0;
    this.mined = 0;
    this.levels = emptyLevels();
    this.enemies = [];
    this.particles = [];
    this.floats = [];
    this.events = [];
    this.miasmaRow = -60;
    this.miasmaSpeed = 1.05;
    this.miasmaHurtT = 0;
    this.spawnT = 1.4;
    this.shopOpen = false;
    this.shopChoices = [];
    this.veinFlash = [];
  }

  start(): void {
    this.reset();
    this.status = 'playing';
  }

  // ---------------------------------------------------------------- derived

  get maxHp(): number {
    return PLAYER.maxHp + 20 * this.levels.vigor;
  }

  get attackDamage(): number {
    return PLAYER.attackDamage + 3 * this.levels.edge;
  }

  get reach(): number {
    return PLAYER.attackReach + 8 * this.levels.reach;
  }

  get attackCooldown(): number {
    return PLAYER.attackCd * (1 - 0.08 * this.levels.tempo);
  }

  get veinYieldMult(): number {
    return 1 + 0.45 * this.levels.veinYield;
  }

  get veinSize(): number {
    return 3 + this.levels.veinSize;
  }

  get lightRadius(): number {
    return 210 * (1 + 0.18 * this.levels.lantern);
  }

  get row(): number {
    return Math.floor(this.py / TILE);
  }

  get band(): Band {
    return bandAt(this.row);
  }

  get depthMetres(): number {
    return Math.max(0, Math.round((this.py - 7 * TILE) / TILE));
  }

  // ----------------------------------------------------------------- update

  update(dt: number, input: Input): void {
    if (this.status !== 'playing') return;
    const step = Math.min(dt, 1 / 30);
    this.time += step;

    this.updatePlayer(step, input);
    this.updateCombat(step, input);
    this.updateEnemies(step);
    this.updateMiasma(step);
    this.updateSpawns(step);
    this.updateParticles(step);
    this.updateVeinFlash(step);

    if (this.hp <= 0) {
      this.hp = 0;
      this.status = 'dead';
      this.events.push({ type: 'death', x: this.px, y: this.py });
    }
  }

  private updatePlayer(dt: number, input: Input): void {
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    if (dir !== 0) {
      this.vx = approach(this.vx, dir * PLAYER.speed, PLAYER.accel * dt);
      this.facing = dir;
    } else {
      this.vx = approach(this.vx, 0, PLAYER.friction * dt);
    }

    this.coyote = this.onGround ? PLAYER.coyote : Math.max(0, this.coyote - dt);
    if (input.jumpPressed) this.jumpBuffer = PLAYER.buffer;
    else this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);

    if (this.jumpBuffer > 0) {
      if (this.coyote > 0) {
        this.vy = -PLAYER.jump;
        this.coyote = 0;
        this.jumpBuffer = 0;
        this.onGround = false;
        this.airJumps = this.levels.emberstep > 0 ? 1 : 0;
        this.puff(this.px, this.py + PLAYER.h / 2, 6, 0x857d94);
      } else if (this.airJumps > 0) {
        this.vy = -PLAYER.jump * 0.88;
        this.airJumps -= 1;
        this.jumpBuffer = 0;
        this.puff(this.px, this.py + PLAYER.h / 2, 10, 0xf7b733);
        this.events.push({ type: 'descend' });
      }
    }
    // Variable jump height: releasing early cuts the arc.
    if (!input.jump && this.vy < -140) this.vy += PLAYER.gravity * 1.6 * dt;

    this.vy = Math.min(PLAYER.maxFall, this.vy + PLAYER.gravity * dt);

    this.moveX(this.vx * dt);
    this.moveY(this.vy * dt);

    if (this.attackCd > 0) this.attackCd -= dt;
    if (this.parryCd > 0) this.parryCd -= dt;
    if (this.parryT > 0) this.parryT -= dt;
    if (this.iframes > 0) this.iframes -= dt;
    if (this.comboT > 0) {
      this.comboT -= dt;
      if (this.comboT <= 0) this.hitCombo = 0;
    }

    this.depthMax = Math.max(this.depthMax, this.depthMetres);
  }

  /** Axis-separated AABB vs tile collisions, resolved per tile row/column. */
  private moveX(dx: number): void {
    if (dx === 0) return;
    this.px += dx;
    const halfW = PLAYER.w / 2;
    const top = this.py - PLAYER.h / 2;
    const bottom = this.py + PLAYER.h / 2;
    const edge = dx > 0 ? this.px + halfW : this.px - halfW;
    const tx = Math.floor(edge / TILE);
    const ty0 = Math.floor(top / TILE);
    const ty1 = Math.floor((bottom - 0.01) / TILE);
    let hit = false;
    for (let ty = ty0; ty <= ty1; ty += 1) {
      if (this.world.isSolid(tx, ty)) {
        hit = true;
        break;
      }
    }
    if (hit) {
      this.px = dx > 0 ? tx * TILE - halfW - 0.01 : (tx + 1) * TILE + halfW + 0.01;
      this.vx = 0;
    }
  }

  private moveY(dy: number): void {
    this.onGround = false;
    if (dy === 0) return;
    this.py += dy;
    const halfW = PLAYER.w / 2;
    const top = this.py - PLAYER.h / 2;
    const bottom = this.py + PLAYER.h / 2;
    const tx0 = Math.floor((this.px - halfW) / TILE);
    const tx1 = Math.floor((this.px + halfW - 0.01) / TILE);

    if (dy > 0) {
      const ty = Math.floor(bottom / TILE);
      for (let tx = tx0; tx <= tx1; tx += 1) {
        if (this.world.isSolid(tx, ty)) {
          this.py = ty * TILE - PLAYER.h / 2 - 0.01;
          this.vy = 0;
          this.onGround = true;
          this.airJumps = this.levels.emberstep > 0 ? 1 : 0;
          return;
        }
      }
    } else {
      const ty = Math.floor(top / TILE);
      for (let tx = tx0; tx <= tx1; tx += 1) {
        if (this.world.isSolid(tx, ty)) {
          this.py = (ty + 1) * TILE + PLAYER.h / 2 + 0.01;
          this.vy = 0;
          return;
        }
      }
    }
  }

  private updateCombat(dt: number, input: Input): void {
    if (this.attackT > 0) this.attackT -= dt;

    // Strike: damages enemies in an arc and carves the tile in front.
    if (input.attackPressed && this.attackCd <= 0) {
      this.attackCd = this.attackCooldown;
      this.attackT = PLAYER.attackDur;
      this.swordStrike();
    }

    // Parry: a short active window, then a punishable cooldown.
    if (input.parryPressed && this.parryCd <= 0) {
      this.parryT = PLAYER.parryActive;
      this.parryCd = PLAYER.parryCd;
      this.events.push({ type: 'parry' });
    }

    // Interact with a brazier to open the shop.
    if (input.interactPressed) {
      const b = this.world.brazierNear(this.px, this.py, 80);
      if (b) this.bank();
    }
  }

  private swordStrike(): void {
    const cx = this.px + this.facing * (this.reach * 0.55);
    const cy = this.py;

    // Enemies first.
    for (const e of this.enemies) {
      if (e.hp <= 0) continue;
      const dx = e.x - cx;
      const dy = e.y - cy;
      if (Math.abs(dx) > this.reach && Math.abs(dy) > 26) continue;
      if (dx * this.facing < -18) continue;
      const dist = Math.hypot(dx, dy);
      if (dist > this.reach + 14) continue;
      this.damageEnemy(e, this.attackDamage);
    }

    // Then the wall in front: this is the mining action.
    const tipX = this.px + this.facing * this.reach;
    const tx = Math.floor(tipX / TILE);
    for (let dy = -1; dy <= 1; dy += 1) {
      const ty = Math.floor((this.py + dy * 12) / TILE);
      const res = this.world.hitTile(tx, ty, PLAYER.mineDamage);
      if (res.hit) {
        this.puff(tx * TILE + 12, ty * TILE + 12, 4, 0x676078);
      }
      if (res.broke >= 0) {
        this.onTileBroken(tx, ty, res.broke);
        break;
      }
    }
  }

  private onTileBroken(x: number, y: number, tile: number): void {
    if (tile === T.ORE || tile === T.ORE_RICH) {
      const base = tile === T.ORE_RICH ? 9 : 4;
      const gain = Math.round(base * this.veinYieldMult);
      this.essence += gain;
      this.mined += 1;
      this.floats.push({
        x: x * TILE + 12,
        y: y * TILE + 12,
        vy: -34,
        life: 0.9,
        text: `+${gain}`,
        color: tile === T.ORE_RICH ? 0xf7b733 : 0x86d4d2,
      });
      this.puff(x * TILE + 12, y * TILE + 12, 10, tile === T.ORE_RICH ? 0xf7b733 : 0x49a8b0);
      this.events.push({ type: 'mine', amount: gain });
    }
  }

  private damageEnemy(e: Enemy, amount: number): void {
    e.hp -= amount;
    e.flash = 0.16;
    this.hitCombo += 1;
    this.comboT = 2.2;
    this.puff(e.x, e.y, 6, 0xd15c52);
    if (e.hp > 0) return;
    this.kills += 1;
    this.events.push({ type: 'kill', x: e.x, y: e.y });
    this.puff(e.x, e.y, 16, 0x9c3540);
    // Killing an enemy drops a little essence; parrying is still the main tap.
    const drop = e.kind === 'lantern' ? 7 : 3;
    this.essence += Math.round(drop * this.veinYieldMult);
  }

  private updateEnemies(dt: number): void {
    for (const e of this.enemies) {
      if (e.hp <= 0) continue;
      if (e.flash > 0) e.flash -= dt;

      e.vy = Math.min(700, e.vy + PLAYER.gravity * dt);
      e.t -= dt;

      const dx = this.px - e.x;
      const dy = this.py - e.y;
      const dist = Math.hypot(dx, dy);

      switch (e.state) {
        case 'idle': {
          const speed = e.kind === 'lancer' ? 96 : 58;
          e.vx = approach(e.vx, Math.sign(dx) * speed, 600 * dt);
          e.facing = Math.sign(dx) || e.facing;
          if (dist < 96 && Math.abs(dy) < 70 && e.t <= 0) {
            e.state = 'windup';
            e.t = COMBAT.windup;
            e.vx = 0;
          }
          break;
        }
        case 'windup': {
          e.vx = approach(e.vx, 0, 1600 * dt);
          e.facing = Math.sign(dx) || e.facing;
          if (e.t <= 0) {
            e.state = 'strike';
            e.t = 0.16;
            // The lunge: a committed, readable line of attack.
            e.vx = e.facing * (e.kind === 'lancer' ? 420 : 300);
            this.resolveStrike(e);
          }
          break;
        }
        case 'strike': {
          e.vx = approach(e.vx, 0, 900 * dt);
          if (e.t <= 0) {
            e.state = 'recover';
            e.t = 0.55;
          }
          break;
        }
        case 'recover': {
          e.vx = approach(e.vx, 0, 1400 * dt);
          if (e.t <= 0) {
            e.state = 'idle';
            e.t = 0.35 + this.rng() * 0.5;
          }
          break;
        }
        case 'stagger': {
          e.vx = approach(e.vx, 0, 900 * dt);
          if (e.t <= 0) {
            e.state = 'recover';
            e.t = 0.4;
          }
          break;
        }
      }

      this.moveEntity(e, dt);
    }
    this.enemies = this.enemies.filter((e) => e.hp > 0);
  }

  /** Called at the moment an enemy's strike becomes active. */
  private resolveStrike(e: Enemy): void {
    const dx = Math.abs(e.x - this.px);
    const dy = Math.abs(e.y - this.py);
    if (dx > 54 || dy > 40) return;

    const parrying = this.parryT > 0;
    if (parrying) {
      // Perfect parry: the blow is turned, and the force is carved into stone.
      this.perfects += 1;
      e.state = 'stagger';
      e.t = COMBAT.postureBreak;
      e.vx = -e.facing * 120;
      this.iframes = Math.max(this.iframes, 0.25);
      this.events.push({ type: 'perfect', x: e.x, y: e.y });
      this.puff(e.x, e.y, 22, 0x86d4d2);
      this.carveFromParry(e);
      return;
    }
    if (this.iframes > 0) return;

    this.hp -= COMBAT.enemyDamage;
    this.iframes = PLAYER.iframes;
    this.hitCombo = 0;
    this.events.push({ type: 'hurt', x: this.px, y: this.py });
    this.puff(this.px, this.py, 12, 0xd15c52);
    this.vx = -e.facing * 180;
    this.vy = -180;
  }

  /** 「刀痕成矿」: a perfect parry seeds a vein of ore into the nearest wall. */
  private carveFromParry(e: Enemy): void {
    const rich = this.rng() > 0.45;
    const cx = Math.floor(this.px / TILE) + this.facing;
    const cy = Math.floor(this.py / TILE);
    const carved = this.world.carveVein(cx, cy, rich, this.veinSize);
    if (carved.length === 0) return;
    for (const c of carved) {
      this.veinFlash.push({ x: c.x, y: c.y, life: 0.85 });
      this.puff(c.x * TILE + 12, c.y * TILE + 12, 3, rich ? 0xf7b733 : 0x49a8b0);
    }
    this.events.push({
      type: 'vein',
      x: carved[0].x * TILE,
      y: carved[0].y * TILE,
      amount: carved.length,
    });
    void e;
  }

  private moveEntity(e: Enemy, dt: number): void {
    const halfW = 9;
    const halfH = 13;

    e.x += e.vx * dt;
    for (const s of [-1, 1]) {
      const tx = Math.floor((e.x + s * halfW) / TILE);
      const ty = Math.floor(e.y / TILE);
      if (this.world.isSolid(tx, ty)) {
        e.x = s > 0 ? tx * TILE - halfW - 0.01 : (tx + 1) * TILE + halfW + 0.01;
        e.vx = 0;
        // A blocked pursuer hops, so it can follow the player up ledges.
        if (e.onGround && e.state === 'idle') e.vy = -300;
      }
    }

    e.y += e.vy * dt;
    e.onGround = false;
    const ty = Math.floor((e.y + halfH) / TILE);
    const tx0 = Math.floor((e.x - halfW) / TILE);
    const tx1 = Math.floor((e.x + halfW) / TILE);
    for (let tx = tx0; tx <= tx1; tx += 1) {
      if (this.world.isSolid(tx, ty)) {
        e.y = ty * TILE - halfH - 0.01;
        e.vy = 0;
        e.onGround = true;
        break;
      }
    }
  }

  private updateMiasma(dt: number): void {
    // Rising dark tide: the only defence is to keep descending.
    this.miasmaSpeed = 1.05 + this.time * 0.0022;
    this.miasmaRow += this.miasmaSpeed * dt;

    if (this.row < this.miasmaRow) {
      this.miasmaHurtT -= dt;
      if (this.miasmaHurtT <= 0) {
        this.miasmaHurtT = 0.55;
        this.hp -= 5;
        this.events.push({ type: 'hurt', x: this.px, y: this.py });
        this.puff(this.px, this.py, 8, 0x6a2230);
      }
    }
  }

  private updateSpawns(dt: number): void {
    this.spawnT -= dt;
    if (this.spawnT > 0) return;
    this.spawnT = Math.max(0.42, 1.1 - this.time * 0.0035);

    const count = this.enemies.length;
    if (count > 11) return;

    // Two spawn shapes: a pursuer arriving from the side, and a dweller already
    // waiting deeper in the shaft. The second is what makes descending itself
    // dangerous instead of a free ride away from everything behind you.
    const ahead = this.rng() > 0.45;
    const dir = this.rng() > 0.5 ? 1 : -1;
    const tx = ahead
      ? Math.floor(this.px / TILE) + Math.floor(this.rng() * 7 - 3)
      : Math.floor(this.px / TILE) + dir * (9 + Math.floor(this.rng() * 5));
    const ty = ahead
      ? Math.floor(this.py / TILE) + 6 + Math.floor(this.rng() * 6)
      : Math.floor(this.py / TILE) + Math.floor(this.rng() * 5 - 2);
    if (tx < 2 || tx > this.world.w - 3) return;
    if (ty < this.miasmaRow + 2) return;
    if (this.world.isSolid(tx, ty)) return;

    let kind: EnemyKind = 'wraith';
    const roll = this.rng();
    if (this.depthMetres > 60 && roll > 0.62) kind = 'lancer';
    if (this.depthMetres > 140 && roll > 0.9) kind = 'lantern';

    const batch = this.time > 70 && this.rng() > 0.55 ? 2 : 1;
    for (let n = 0; n < batch; n += 1) {
      this.spawnOne(kind, tx + n, Math.max(0, ty), dir);
    }
  }

  private spawnOne(kind: EnemyKind, tx: number, ty: number, dir: number): void {
    // Spawn points are usually inside solid rock; search outward for standing
    // room instead of discarding the spawn, otherwise the shaft stays empty.
    const spot = this.findOpenNear(tx, ty);
    if (!spot) return;
    tx = spot.x;
    ty = spot.y;
    if (ty < this.miasmaRow + 2 || ty >= this.world.h - 2) return;
    const hp = kind === 'lantern' ? 34 : kind === 'lancer' ? 26 : 20;
    this.enemies.push({
      id: this.nextId++,
      kind,
      x: tx * TILE + 12,
      y: ty * TILE + 12,
      vx: 0,
      vy: 0,
      hp,
      maxHp: hp,
      facing: -dir,
      state: 'idle',
      t: 0.6 + this.rng(),
      onGround: false,
      flash: 0,
    });
  }

  /** Nearest open, standable tile within a few tiles of (x,y). */
  private findOpenNear(x: number, y: number): { x: number; y: number } | null {
    for (let r = 0; r <= 4; r += 1) {
      for (let oy = -r; oy <= r; oy += 1) {
        for (let ox = -r; ox <= r; ox += 1) {
          const nx = x + ox;
          const ny = y + oy;
          if (nx < 2 || nx > this.world.w - 3) continue;
          if (ny < 2 || ny >= this.world.h - 2) continue;
          if (this.world.isSolid(nx, ny)) continue;
          if (this.world.isSolid(nx, ny + 1)) return { x: nx, y: ny };
        }
      }
    }
    return null;
  }

  private updateParticles(dt: number): void {
    for (const p of this.particles) {
      p.life -= dt;
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    for (const f of this.floats) {
      f.life -= dt;
      f.y += f.vy * dt;
      f.vy *= 1 - 2.4 * dt;
    }
    this.floats = this.floats.filter((f) => f.life > 0);
  }

  private updateVeinFlash(dt: number): void {
    for (const v of this.veinFlash) v.life -= dt;
    this.veinFlash = this.veinFlash.filter((v) => v.life > 0);
  }

  private puff(x: number, y: number, n: number, color: number): void {
    for (let i = 0; i < n; i += 1) {
      const a = this.rng() * Math.PI * 2;
      const s = 30 + this.rng() * 130;
      const life = 0.25 + this.rng() * 0.45;
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 40,
        life,
        maxLife: life,
        size: 1.5 + this.rng() * 2.5,
        color,
        gravity: 420,
      });
    }
  }

  // ------------------------------------------------------------------ shop

  /** Banking happens at a brazier; it also fully restores health. */
  bank(): void {
    this.banked += this.essence;
    this.essence = 0;
    this.hp = this.maxHp;
    this.shopOpen = true;
    this.status = 'shop';
    this.shopChoices = this.rollShop();
    this.events.push({ type: 'bank', x: this.px, y: this.py });
    this.events.push({ type: 'shop' });
  }

  private rollShop(): UpgradeId[] {
    const pool = UPGRADES.filter((u) => this.levels[u.id] < u.max);
    if (pool.length === 0) return [];
    const picked: UpgradeId[] = [];
    while (picked.length < 3 && picked.length < pool.length) {
      const u = pool[Math.floor(this.rng() * pool.length)];
      if (!picked.includes(u.id)) picked.push(u.id);
    }
    return picked;
  }

  costOf(id: UpgradeId): number {
    const def = UPGRADE_BY_ID[id];
    return Math.round(def.baseCost * (1 + this.levels[id] * 0.55));
  }

  buy(id: UpgradeId): boolean {
    const cost = this.costOf(id);
    if (this.banked < cost) return false;
    if (this.levels[id] >= UPGRADE_BY_ID[id].max) return false;
    this.banked -= cost;
    this.levels[id] += 1;
    if (id === 'vigor') this.hp = this.maxHp;
    this.shopChoices = this.rollShop();
    return true;
  }

  closeShop(): void {
    this.shopOpen = false;
    this.status = 'playing';
  }

  // --------------------------------------------------------------- helpers

  /** Miasma damage check used by the renderer to draw the boundary. */
  get miasmaY(): number {
    return this.miasmaRow * TILE;
  }

  get veinFlashes(): { x: number; y: number; life: number }[] {
    return this.veinFlash;
  }

  takeEvents(): SimEvent[] {
    const out = this.events;
    this.events = [];
    return out;
  }

  clamp1(v: number): number {
    return clamp(v, -1, 1);
  }
}
