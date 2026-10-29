import { T, TILE_HP, WORLD } from './config';
import { mulberry32, type Rng } from './math';

/**
 * The Long Vein.
 *
 * A tile grid rather than loose objects, because digging rewrites cells
 * constantly. Generation is a layered process:
 *   1. solid rock
 *   2. a winding main shaft (guaranteed route down)
 *   3. chambers hung off the shaft, alternating sides
 *   4. galleries reconnecting every chamber
 *   5. ledges inside chambers so fights have geometry
 *   6. ore veins, biased to cave walls
 *   7. braziers as banking anchors
 */
export interface Decor {
  x: number;
  y: number;
  key: string;
}

export class World {
  readonly w = WORLD.w;
  readonly h = WORLD.h;
  tiles: Uint8Array;
  hp: Uint8Array;
  wear: Uint8Array;
  readonly rng: Rng;
  /** Reserved for set dressing; the current art pass draws none. */
  decor: Decor[] = [];

  constructor(seed: number) {
    this.rng = mulberry32(seed);
    this.tiles = new Uint8Array(this.w * this.h);
    this.hp = new Uint8Array(this.w * this.h);
    this.wear = new Uint8Array(this.w * this.h);
    this.generate();
  }

  idx(x: number, y: number): number {
    return y * this.w + x;
  }

  inside(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.w && y < this.h;
  }

  get(x: number, y: number): number {
    if (!this.inside(x, y)) return T.BEDROCK;
    return this.tiles[y * this.w + x];
  }

  isSolid(x: number, y: number): boolean {
    const t = this.get(x, y);
    return t !== T.AIR && t !== T.BRAZIER;
  }

  set(x: number, y: number, tile: number): void {
    if (!this.inside(x, y)) return;
    const i = y * this.w + x;
    this.tiles[i] = tile;
    this.hp[i] = TILE_HP[tile] ?? 1;
    this.wear[i] = 0;
  }

  private noise(x: number, y: number, scale: number, salt: number): number {
    const fx = x / scale;
    const fy = y / scale;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = fx - x0;
    const ty = fy - y0;
    const h = (ix: number, iy: number): number => {
      let n = (ix * 374761393 + iy * 668265263 + salt * 2654435761) | 0;
      n = (n ^ (n >>> 13)) * 1274126177;
      n = n ^ (n >>> 16);
      return ((n >>> 0) % 10000) / 10000;
    };
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);
    const a = h(x0, y0) + (h(x0 + 1, y0) - h(x0, y0)) * sx;
    const b = h(x0, y0 + 1) + (h(x0 + 1, y0 + 1) - h(x0, y0 + 1)) * sx;
    return a + (b - a) * sy;
  }

  /** Horizontal centre of the vein at a given row. */
  centreAt(row: number): number {
    return (
      this.w / 2 +
      Math.sin(row * 0.021) * 17 +
      Math.sin(row * 0.067 + 1.7) * 8 +
      Math.sin(row * 0.147 + 0.4) * 3.5
    );
  }

  /**
   * Half-width of the vein, in tiles. The viewport shows ~20 tiles across, so a
   * 4-8 tile half-width leaves real rock on both sides of the player. Anything
   * wider and a screen of play is an empty auditorium.
   */
  widthAt(row: number): number {
    const base = 2.9 + this.noise(0, row, 12, 3) * 1.6;
    const bulge = Math.pow(Math.max(0, Math.sin(row * 0.037 + 0.8)), 4) * 1.3;
    return base + bulge;
  }

  private generate(): void {
    const rng = this.rng;
    const W = this.w;
    const H = this.h;

    this.tiles.fill(T.ROCK);
    for (let i = 0; i < this.hp.length; i += 1) this.hp[i] = TILE_HP[T.ROCK];

    // 1. the vein itself: one continuous cavern down the world
    for (let y = 0; y < H; y += 1) {
      const c = this.centreAt(y);
      const half = this.widthAt(y);
      for (let x = 0; x < W; x += 1) {
        const d = Math.abs(x - c);
        // ragged edges rather than a clean circle
        const edge = this.noise(x * 0.4, y * 0.4, 6, 11) * 2.4;
        if (d <= half + edge - 0.8) this.set(x, y, T.AIR);
      }
    }

    // 2. side chambers hung off the vein, with a short throat to reach them
    const chambers: { x: number; y: number; w: number; h: number }[] = [];
    for (let y = 14; y < H - 20; y += 22 + Math.floor(rng() * 12)) {
      const side = rng() > 0.5 ? 1 : -1;
      const cw = 10 + Math.floor(rng() * 7);
      const ch = 6 + Math.floor(rng() * 4);
      const cx = Math.round(this.centreAt(y) + side * (this.widthAt(y) + 5 + rng() * 6) - cw / 2);
      const x0 = Math.max(2, Math.min(W - cw - 2, cx));
      const y0 = Math.max(3, Math.min(H - ch - 3, y));
      chambers.push({ x: x0, y: y0, w: cw, h: ch });

      for (let ty = y0; ty < y0 + ch; ty += 1) {
        for (let tx = x0; tx < x0 + cw; tx += 1) {
          const ex = Math.min(tx - x0, x0 + cw - 1 - tx);
          const ey = Math.min(ty - y0, y0 + ch - 1 - ty);
          const r = this.noise(tx, ty, 3, 17);
          if (ex === 0 && r < 0.55) continue;
          if (ey === 0 && r < 0.4) continue;
          this.set(tx, ty, T.AIR);
        }
      }

      // throat back to the vein
      const gy = y0 + Math.floor(ch / 2);
      const veinEdge = Math.round(this.centreAt(gy) + side * (this.widthAt(gy) + 1));
      const lo = Math.min(veinEdge, x0 + (side > 0 ? 0 : cw));
      const hi = Math.max(veinEdge, x0 + (side > 0 ? 0 : cw));
      for (let tx = lo; tx <= hi; tx += 1) {
        for (let dy = -1; dy < 3; dy += 1) this.set(tx, gy + dy, T.AIR);
      }
    }

    // 3. ledges: short shelves that break up the vertical fall
    for (const c of chambers) {
      const n = 1 + Math.floor(rng() * 3);
      for (let i = 0; i < n; i += 1) {
        const sy = c.y + 2 + Math.floor(rng() * Math.max(1, c.h - 3));
        const sx = c.x + 2 + Math.floor(rng() * Math.max(1, c.w - 9));
        const len = 4 + Math.floor(rng() * 5);
        for (let tx = sx; tx < Math.min(c.x + c.w - 1, sx + len); tx += 1) {
          this.set(tx, sy, T.ROCK);
        }
      }
    }
    // shelves inside the vein keep it from being a single drop
    for (let y = 18; y < H - 10; y += 7 + Math.floor(rng() * 5)) {
      const c = this.centreAt(y);
      const half = this.widthAt(y);
      const len = 3 + Math.floor(rng() * 5);
      const side = rng() > 0.5 ? 1 : -1;
      const sx = Math.round(c + side * (half - len - 1));
      for (let tx = sx; tx < sx + len; tx += 1) {
        if (this.get(tx, y) === T.AIR) this.set(tx, y, T.ROCK);
      }
    }

    // 4. deep stone: broad contiguous bands, because single scattered cells of
    // the mossy art read as black boxes rather than as harder rock
    for (let y = 4; y < H - 4; y += 1) {
      for (let x = 1; x < W - 1; x += 1) {
        if (this.get(x, y) !== T.ROCK) continue;
        const n = this.noise(x, y, 9, 71);
        const deepChance = 0.5 + (y / H) * 0.28;
        if (n > deepChance) this.set(x, y, T.DEEP);
      }
    }

    // 5. borders, entry hall, braziers
    for (let y = 0; y < H; y += 1) {
      for (let x = 0; x < W; x += 1) {
        if (x === 0 || x === W - 1 || y < 2 || y === H - 1) {
          this.tiles[y * W + x] = T.BEDROCK;
          this.hp[y * W + x] = 9999;
        }
      }
    }
    const startX = Math.round(this.centreAt(7));
    for (let y = 2; y < 10; y += 1) {
      for (let x = startX - 6; x <= startX + 6; x += 1) this.set(x, y, T.AIR);
    }

    for (let r = 26; r < H - 30; r += 34) {
      const cx = Math.round(this.centreAt(r));
      if (this.get(cx, r) !== T.AIR) continue;
      this.set(cx, r + 1, T.ROCK);
      this.set(cx, r, T.BRAZIER);
    }
  }

  hitTile(x: number, y: number, power = 1): { broke: number; hit: boolean } {
    if (!this.inside(x, y)) return { broke: -1, hit: false };
    const i = y * this.w + x;
    const tile = this.tiles[i];
    if (tile === T.AIR || tile === T.BRAZIER || tile === T.BEDROCK) {
      return { broke: -1, hit: false };
    }
    this.hp[i] = Math.max(0, this.hp[i] - power);
    this.wear[i] = Math.min(3, this.wear[i] + 1);
    if (this.hp[i] > 0) return { broke: -1, hit: true };
    this.tiles[i] = T.AIR;
    return { broke: tile, hit: true };
  }

  /**
   * 「刀痕成矿」: a parried blow is driven *through* the player and into the wall
   * behind them, cutting a seam of ore as it goes.
   *
   * `dir` is the direction the force was travelling (+1 right, -1 left, 0 radial).
   * The seam therefore grows away from the attacker — that is the mechanical
   * hook: where you stand when you parry decides which wall gets the ore.
   * Mining by hand still yields nothing; carving with a parry both pays out and
   * opens the wall, because ore is far softer than rock.
   */
  carveVein(
    cx: number,
    cy: number,
    rich: boolean,
    size: number,
    dir = 0,
    from?: { x: number; y: number } | null,
  ): { x: number; y: number }[] {
    let bx = -1;
    let by = -1;
    let bd = Infinity;
    for (let y = cy - 5; y <= cy + 5; y += 1) {
      for (let x = cx - 5; x <= cx + 5; x += 1) {
        const t = this.get(x, y);
        if (t !== T.ROCK && t !== T.DEEP) continue;
        const d = (x - cx) ** 2 + (y - cy) ** 2;
        if (d < bd) {
          bd = d;
          bx = x;
          by = y;
        }
      }
    }
    // Continue an existing seam when the chain is still live: a run of parries
    // draws one continuous cut instead of a scatter of blobs. That is what makes
    // the loop a *route* rather than a payout.
    if (from) {
      const ft = this.get(from.x, from.y);
      if (ft === T.ORE || ft === T.RICH) {
        bx = from.x;
        by = from.y;
      }
    }
    if (bx < 0) return [];

    const out: { x: number; y: number }[] = [];
    const target = rich ? T.RICH : T.ORE;
    let x = bx;
    let y = by;
    const step = dir;

    for (let i = 0; i < size; i += 1) {
      const t = this.get(x, y);
      if (t === T.ROCK || t === T.DEEP) {
        this.set(x, y, target);
        out.push({ x, y });
      }

      // Follow the driving direction while there is still stone ahead; the seam
      // only curls once it runs out of rock, so a parry reads as a clean strike
      // rather than a random splatter.
      const aheadX = x + step;
      if (step !== 0 && (this.get(aheadX, y) === T.ROCK || this.get(aheadX, y) === T.DEEP)) {
        x = aheadX;
        continue;
      }
      const dirs = this.rng() > 0.5 ? [1, -1] : [-1, 1];
      let moved = false;
      for (const dx of dirs) {
        const nx = x + dx;
        if (this.get(nx, y) !== T.AIR && (this.get(x, y + 1) === T.AIR || this.get(x, y - 1) === T.AIR)) {
          x = nx;
          moved = true;
          break;
        }
      }
      if (!moved) y += this.rng() > 0.5 ? 1 : -1;
    }

    return out;
  }

  brazierNear(px: number, py: number, range = 70): { x: number; y: number } | null {
    const tx = Math.floor(px / 16);
    const ty = Math.floor(py / 16);
    let best: { x: number; y: number } | null = null;
    let bd = Infinity;
    for (let y = ty - 5; y <= ty + 5; y += 1) {
      for (let x = tx - 5; x <= tx + 5; x += 1) {
        if (this.get(x, y) !== T.BRAZIER) continue;
        const wx = x * 16 + 8;
        const wy = y * 16 + 8;
        const d = (wx - px) ** 2 + (wy - py) ** 2;
        if (d < range * range && d < bd) {
          bd = d;
          best = { x: wx, y: wy };
        }
      }
    }
    return best;
  }
}
