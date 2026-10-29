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

  private generate(): void {
    const rng = this.rng;
    for (let y = 0; y < this.h; y += 1) {
      // A gentle S-curve so the shaft is not a straight drop.
      const drift = Math.sin(y * 0.017) * 7 + Math.sin(y * 0.061 + 1.3) * 3;
      const centre = this.w / 2 + drift;
      const halfWidth = 3.4 + this.noise(0, y, 22, 3) * 2.6;

      for (let x = 0; x < this.w; x += 1) {
        const i = y * this.w + x;
        const dxc = Math.abs(x - centre);

        // Borders are indestructible so the play area can never be escaped.
        if (x === 0 || x === this.w - 1 || y < 3) {
          this.tiles[i] = T.BEDROCK;
          this.hp[i] = 999;
          continue;
        }

        let tile: number = T.STONE;

        if (dxc < halfWidth) {
          tile = T.AIR;
        } else {
          // Caves and seams branching off the main shaft.
          const cave =
            this.noise(x, y, 13, 11) * 0.65 + this.noise(x, y, 5, 29) * 0.35;
          if (cave > 0.66) tile = T.AIR;

          // Deeper bands get denser, harder stone.
          const depth = y / this.h;
          if (tile !== T.AIR && this.noise(x, y, 9, 7) > 0.78 - depth * 0.2) {
            tile = T.DEEP;
          }
        }

        this.tiles[i] = tile;
        this.hp[i] = TILE_HP[tile] ?? 1;
      }
    }

    // Guarantee the entry chamber is open and has a floor.
    for (let y = 3; y < 9; y += 1) {
      for (let x = this.w / 2 - 5; x <= this.w / 2 + 5; x += 1) {
        this.set(Math.round(x), y, T.AIR);
      }
    }
    for (let x = this.w / 2 - 5; x <= this.w / 2 + 5; x += 1) {
      this.set(Math.round(x), 9, T.STONE);
    }

    // Scatter natural ore so early mining is possible before any parry.
    for (let y = 12; y < this.h - 6; y += 1) {
      for (let x = 1; x < this.w - 1; x += 1) {
        if (this.get(x, y) !== T.STONE && this.get(x, y) !== T.DEEP) continue;
        const depth = y / this.h;
        const roll = this.noise(x, y, 7, 41);
        if (roll > 0.9 - depth * 0.06) {
          this.set(x, y, rng() > 0.72 ? T.ORE_RICH : T.ORE);
        }
      }
    }

    // Braziers: safe anchors you can bank essence at. Always on the shaft.
    for (let r = 34; r < this.h - 30; r += 56) {
      const drift = Math.sin(r * 0.017) * 7 + Math.sin(r * 0.061 + 1.3) * 3;
      const cx = Math.round(this.w / 2 + drift);
      for (let y = r - 2; y <= r + 2; y += 1) {
        for (let x = cx - 3; x <= cx + 3; x += 1) {
          if (Math.abs(x - cx) <= 2 && y <= r) this.set(x, y, T.AIR);
        }
      }
      for (let x = cx - 3; x <= cx + 3; x += 1) {
        this.set(x, r + 2, T.STONE);
      }
      this.set(cx, r + 1, T.BRAZIER);
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
