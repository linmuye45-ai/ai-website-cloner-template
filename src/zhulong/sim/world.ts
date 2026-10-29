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
  /** Set dressing placed on cave floors, purely visual. */
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

  /** Horizontal centre of the shaft at a given row. */
  centreAt(row: number): number {
    return (
      this.w / 2 +
      Math.sin(row * 0.009) * 26 +
      Math.sin(row * 0.031 + 1.7) * 11 +
      Math.sin(row * 0.077 + 0.4) * 5
    );
  }

  private generate(): void {
    const rng = this.rng;
    const W = this.w;
    const H = this.h;

    this.tiles.fill(T.ROCK);
    for (let i = 0; i < this.hp.length; i += 1) this.hp[i] = TILE_HP[T.ROCK];

    // 1. main shaft
    for (let y = 0; y < H; y += 1) {
      const c = this.centreAt(y);
      const half = 3 + this.noise(0, y, 18, 3) * 2;
      for (let x = 0; x < W; x += 1) {
        if (Math.abs(x - c) <= half) this.set(x, y, T.AIR);
      }
    }

    // 2. chambers + galleries
    const chambers: { x: number; y: number; w: number; h: number }[] = [];
    for (let y = 22; y < H - 30; y += 24 + Math.floor(rng() * 10)) {
      const cw = 16 + Math.floor(rng() * 12);
      const ch = 9 + Math.floor(rng() * 6);
      const side = rng() > 0.5 ? 1 : -1;
      const cx = Math.round(this.centreAt(y) + side * (14 + rng() * 16) - cw / 2);
      const x0 = Math.max(2, Math.min(W - cw - 2, cx));
      const y0 = Math.max(3, Math.min(H - ch - 3, y));
      chambers.push({ x: x0, y: y0, w: cw, h: ch });

      for (let ty = y0; ty < y0 + ch; ty += 1) {
        for (let tx = x0; tx < x0 + cw; tx += 1) {
          const ex = Math.min(tx - x0, x0 + cw - 1 - tx);
          const ey = Math.min(ty - y0, y0 + ch - 1 - ty);
          const r = this.noise(tx, ty, 3, 17);
          if (ex === 0 && r < 0.5) continue;
          if (ey === 0 && r < 0.35) continue;
          this.set(tx, ty, T.AIR);
        }
      }

      // gallery back to the shaft
      const gy = y0 + Math.floor(ch / 2);
      const shaftX = Math.round(this.centreAt(gy));
      const lo = Math.min(shaftX, x0 + cw);
      const hi = Math.max(shaftX, x0 + cw);
      for (let tx = lo; tx <= hi; tx += 1) {
        for (let dy = 0; dy < 3; dy += 1) this.set(tx, gy + dy, T.AIR);
      }
    }

    // 3. ledges in chambers
    for (const c of chambers) {
      const n = 1 + Math.floor(rng() * 3);
      for (let i = 0; i < n; i += 1) {
        const sy = c.y + 2 + Math.floor(rng() * Math.max(1, c.h - 3));
        const sx = c.x + 2 + Math.floor(rng() * Math.max(1, c.w - 8));
        const len = 4 + Math.floor(rng() * 5);
        for (let tx = sx; tx < Math.min(c.x + c.w - 1, sx + len); tx += 1) {
          this.set(tx, sy, T.ROCK);
        }
      }
    }

    // 3b. set dressing: chests, barrels and skull altars on cave floors
    const PROPS = ['barrel', 'chest', 'skull_altar'];
    for (const c of chambers) {
      for (let tx = c.x + 1; tx < c.x + c.w - 1; tx += 1) {
        for (let ty = c.y + 1; ty < c.y + c.h; ty += 1) {
          if (this.get(tx, ty) !== T.AIR) continue;
          if (this.get(tx, ty + 1) === T.AIR) continue;
          if (this.get(tx, ty - 1) !== T.AIR) continue;
          if (rng() > 0.09) continue;
          this.decor.push({ x: tx, y: ty, key: PROPS[Math.floor(rng() * PROPS.length)] });
          ty = c.y + c.h;
          break;
        }
      }
    }

    // 4. reopen the shaft where ledges may have crossed it
    for (let y = 0; y < H; y += 1) {
      const c = this.centreAt(y);
      const half = 2.6 + this.noise(0, y, 18, 3) * 1.8;
      for (let x = 0; x < W; x += 1) {
        if (Math.abs(x - c) <= half) this.set(x, y, T.AIR);
      }
    }

    // 5. deep stone pockets and ore along walls
    for (let y = 4; y < H - 4; y += 1) {
      for (let x = 1; x < W - 1; x += 1) {
        const t = this.get(x, y);
        if (t !== T.ROCK) continue;
        const depth = y / H;
        if (this.noise(x, y, 7, 71) > 0.74 + depth * 0.14) {
          this.set(x, y, T.DEEP);
          continue;
        }
        // No free ore anywhere: the only veins in this world are the ones a
        // perfect parry transcribes into the wall (「刀痕成矿」).
        void depth;
      }
    }

    // 6. borders, entry hall, braziers
    for (let y = 0; y < H; y += 1) {
      for (let x = 0; x < W; x += 1) {
        if (x === 0 || x === W - 1 || y < 2 || y === H - 1) {
          this.tiles[y * W + x] = T.BEDROCK;
          this.hp[y * W + x] = 9999;
        }
      }
    }
    const startX = Math.round(this.centreAt(6));
    for (let y = 2; y < 12; y += 1) {
      for (let x = startX - 8; x <= startX + 8; x += 1) this.set(x, y, T.AIR);
    }
    for (let x = startX - 8; x <= startX + 8; x += 1) this.set(x, 12, T.ROCK);
    this.decor.push({ x: startX - 6, y: 11, key: 'skull_altar' });
    this.decor.push({ x: startX + 6, y: 11, key: 'barrel' });

    for (let r = 40; r < H - 40; r += 58) {
      const cx = Math.round(this.centreAt(r));
      for (let y = r - 3; y <= r; y += 1) {
        for (let x = cx - 4; x <= cx + 4; x += 1) this.set(x, y, T.AIR);
      }
      for (let x = cx - 4; x <= cx + 4; x += 1) this.set(x, r + 1, T.ROCK);
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
   * 「刀痕成矿」 — the signature mechanic. A perfect parry transcribes the
   * blow's force into the nearest stone, growing a vein the player can mine.
   */
  carveVein(cx: number, cy: number, rich: boolean, size: number): { x: number; y: number }[] {
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
    if (bx < 0) return [];

    const out: { x: number; y: number }[] = [];
    const target = rich ? T.RICH : T.ORE;
    let x = bx;
    let y = by;
    for (let i = 0; i < size; i += 1) {
      const t = this.get(x, y);
      if (t === T.ROCK || t === T.DEEP) {
        this.set(x, y, target);
        out.push({ x, y });
      }
      // Follow the wall face rather than tunnelling into open air.
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
