import { T, TILE_HP, WORLD } from './config';
import { mulberry32, type Rng } from './math';

/**
 * The shaft. A dense tile grid rather than sparse objects: digging rewrites
 * cells constantly, so a flat typed array keeps it cheap and cache-friendly.
 */
export class World {
  readonly w = WORLD.w;
  readonly h = WORLD.h;
  tiles: Uint8Array;
  /** Remaining sword hits before a tile breaks. */
  hp: Uint8Array;
  /** Per-tile wear marker 0-3, purely for the damage crack overlay. */
  wear: Uint8Array;
  /** Tile coordinates that currently hold a live ore vein. */
  readonly rng: Rng;

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

  /** Value-noise in [0,1), sampled on a coarse lattice with smooth steps. */
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

  /**
   * Level generation.
   *
   * A thin wormhole through solid rock looks like a wall, not a place. Real
   * digging games give you rooms: chambers you drop into, ledges to fight on,
   * and passages that connect sideways. The loop below carves, in order:
   *
   *   1. a winding main shaft (the guaranteed descent route)
   *   2. chambers every ~30 rows, randomly offset left/right
   *   3. horizontal galleries linking chambers to the shaft
   *   4. ledges and rubble inside chambers so they are traversable
   *   5. ore, biased to cave walls and chamber floors
   *   6. braziers on the shaft floor as banking anchors
   */
  private generate(): void {
    const rng = this.rng;
    const W = this.w;
    const H = this.h;

    // Everything starts as stone; carving happens below.
    for (let i = 0; i < this.tiles.length; i += 1) {
      this.tiles[i] = T.STONE;
      this.hp[i] = TILE_HP[T.STONE];
    }

    const centreAt = (row: number): number =>
      W / 2 + Math.sin(row * 0.021) * 8 + Math.sin(row * 0.073 + 1.3) * 3.5;

    // 1. Main shaft.
    for (let y = 0; y < H; y += 1) {
      const c = centreAt(y);
      const half = 2.6 + this.noise(0, y, 26, 3) * 2.2;
      for (let x = 0; x < W; x += 1) {
        if (Math.abs(x - c) <= half) this.set(x, y, T.AIR);
      }
    }

    // 2. Chambers: big open rooms, alternating side, always reconnected.
    const chambers: { x: number; y: number; w: number; h: number }[] = [];
    for (let y = 26; y < H - 40; y += 26 + Math.floor(rng() * 12)) {
      const cw = 12 + Math.floor(rng() * 10);
      const ch = 7 + Math.floor(rng() * 5);
      const side = rng() > 0.5 ? 1 : -1;
      const cx = Math.round(W / 2 + side * (10 + rng() * 14) - cw / 2);
      const x0 = Math.max(2, Math.min(W - cw - 2, cx));
      const y0 = Math.max(4, Math.min(H - ch - 4, y));
      chambers.push({ x: x0, y: y0, w: cw, h: ch });

      for (let ty = y0; ty < y0 + ch; ty += 1) {
        for (let tx = x0; tx < x0 + cw; tx += 1) {
          // Rounded corners so rooms do not look like rectangles.
          const ex = Math.min(tx - x0, x0 + cw - 1 - tx);
          const ey = Math.min(ty - y0, y0 + ch - 1 - ty);
          const r = this.noise(tx, ty, 4, 17);
          if (ex === 0 && r < 0.45) continue;
          if (ey === 0 && r < 0.35) continue;
          this.set(tx, ty, T.AIR);
        }
      }

      // 3. Gallery back to the shaft, so a chamber is never a dead end.
      const gy = y0 + Math.floor(ch / 2);
      const shaftX = Math.round(centreAt(gy));
      const from = Math.min(shaftX, x0 + cw);
      const to = Math.max(shaftX, x0 + cw);
      for (let tx = from; tx <= to; tx += 1) {
        this.set(tx, gy, T.AIR);
        this.set(tx, gy + 1, T.AIR);
        this.set(tx, gy + 2, T.AIR);
      }
    }

    // 4. Ledges inside chambers: something to stand on and fight around.
    for (const c of chambers) {
      const shelves = 1 + Math.floor(rng() * 3);
      for (let i = 0; i < shelves; i += 1) {
        const sy = c.y + 2 + Math.floor(rng() * Math.max(1, c.h - 3));
        const sx = c.x + 2 + Math.floor(rng() * Math.max(1, c.w - 6));
        const len = 3 + Math.floor(rng() * 4);
        for (let tx = sx; tx < Math.min(c.x + c.w - 1, sx + len); tx += 1) {
          this.set(tx, sy, T.STONE);
        }
      }
    }

    // Re-ensure the shaft is open where shelves may have crossed it.
    for (let y = 0; y < H; y += 1) {
      const c = centreAt(y);
      const half = 2.4 + this.noise(0, y, 26, 3) * 2.0;
      for (let x = 0; x < W; x += 1) {
        if (Math.abs(x - c) <= half) this.set(x, y, T.AIR);
      }
    }

    // 5. Ore, biased to walls and chamber floors.
    for (let y = 4; y < H - 4; y += 1) {
      for (let x = 1; x < W - 1; x += 1) {
        const t = this.get(x, y);
        if (t !== T.STONE) continue;
        const nearAir =
          this.get(x + 1, y) === T.AIR || this.get(x - 1, y) === T.AIR ||
          this.get(x, y + 1) === T.AIR || this.get(x, y - 1) === T.AIR;
        if (!nearAir) continue;
        const depth = y / H;
        const roll = this.noise(x, y, 6, 41);
        if (roll > 0.86 - depth * 0.08) {
          this.set(x, y, rng() > 0.7 ? T.ORE_RICH : T.ORE);
        }
      }
    }

    // 6. Hard borders, entry chamber, braziers.
    for (let y = 0; y < H; y += 1) {
      for (let x = 0; x < W; x += 1) {
        if (x === 0 || x === W - 1 || y === 0 || y === 1 || y === H - 1) {
          this.tiles[y * W + x] = T.BEDROCK;
          this.hp[y * W + x] = 999;
        }
      }
    }
    const startX = Math.round(centreAt(6));
    for (let y = 2; y < 10; y += 1) {
      for (let x = startX - 6; x <= startX + 6; x += 1) this.set(x, y, T.AIR);
    }
    for (let x = startX - 6; x <= startX + 6; x += 1) this.set(x, 10, T.STONE);

    for (let r = 34; r < H - 30; r += 52) {
      const cx = Math.round(centreAt(r));
      for (let y = r - 2; y <= r; y += 1) {
        for (let x = cx - 3; x <= cx + 3; x += 1) this.set(x, y, T.AIR);
      }
      for (let x = cx - 3; x <= cx + 3; x += 1) this.set(x, r + 1, T.STONE);
      this.set(cx, r, T.BRAZIER);
    }
  }

  /**
   * One sword hit against a tile. Returns the tile that broke (or -1).
   * Ore yields are handled by the caller so the economy stays in one place.
   */
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
   * 「刀痕成矿」 — the signature move. A perfect parry carves a vein into the
   * nearest stone, so the player's defensive timing literally mines the map.
   */
  carveVein(cx: number, cy: number, rich: boolean, size: number): { x: number; y: number }[] {
    let bestX = -1;
    let bestY = -1;
    let bestD = Infinity;
    for (let y = cy - 4; y <= cy + 4; y += 1) {
      for (let x = cx - 4; x <= cx + 4; x += 1) {
        const t = this.get(x, y);
        if (t !== T.STONE && t !== T.DEEP) continue;
        const d = (x - cx) ** 2 + (y - cy) ** 2;
        if (d < bestD) {
          bestD = d;
          bestX = x;
          bestY = y;
        }
      }
    }
    if (bestX < 0) return [];

    const out: { x: number; y: number }[] = [];
    const target = rich ? T.ORE_RICH : T.ORE;
    let x = bestX;
    let y = bestY;
    for (let i = 0; i < size; i += 1) {
      if (this.get(x, y) === T.STONE || this.get(x, y) === T.DEEP) {
        this.set(x, y, target);
        out.push({ x, y });
      }
      // Walk the vein along the wall face rather than into open air.
      const dirs = this.rng() > 0.5 ? [1, -1] : [-1, 1];
      let moved = false;
      for (const dx of dirs) {
        if (this.get(x + dx, y) !== T.AIR && (this.get(x, y + 1) === T.AIR || this.get(x, y - 1) === T.AIR)) {
          x += dx;
          moved = true;
          break;
        }
      }
      if (!moved) y += this.rng() > 0.5 ? 1 : -1;
    }
    return out;
  }

  /** Finds the nearest brazier within range of a world-pixel position. */
  brazierNear(px: number, py: number, range = 74): { x: number; y: number } | null {
    const tx = Math.floor(px / 24);
    const ty = Math.floor(py / 24);
    let best: { x: number; y: number } | null = null;
    let bestD = Infinity;
    for (let y = ty - 5; y <= ty + 5; y += 1) {
      for (let x = tx - 5; x <= tx + 5; x += 1) {
        if (this.get(x, y) !== T.BRAZIER) continue;
        const wx = x * 24 + 12;
        const wy = y * 24 + 12;
        const d = (wx - px) ** 2 + (wy - py) ** 2;
        if (d < range * range && d < bestD) {
          bestD = d;
          best = { x: wx, y: wy };
        }
      }
    }
    return best;
  }
}
