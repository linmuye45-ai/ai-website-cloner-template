// Original Ember Trail levels. Built programmatically so every row is
// guaranteed rectangular; no third-party level layouts are reproduced.

export const TILE = 16;
export const LEVEL_ROWS = 12;

export type TileChar =
  | " "
  | "#" // grass cap (solid)
  | "=" // dirt (solid)
  | "B" // brick (solid)
  | "S" // stone (solid)
  | "M" // mossy stone (solid)
  | "P" // one-way plank
  | "W" // decorative back wall (non-solid)
  | "^"; // spike hazard (non-solid)

export const SOLID_TILES: ReadonlySet<string> = new Set(["#", "=", "B", "S", "M"]);

export type SpawnKind =
  | "player"
  | "thornling"
  | "wisp"
  | "shard"
  | "heart"
  | "lantern"
  | "hearth"
  | "boss";

export interface Spawn {
  kind: SpawnKind;
  tx: number;
  ty: number;
}

export interface LevelData {
  name: string;
  width: number; // tiles
  height: number; // tiles
  tiles: TileChar[][]; // [row][col]
  spawns: Spawn[];
}

class Builder {
  readonly width: number;
  readonly height: number;
  private grid: TileChar[][];
  readonly spawns: Spawn[] = [];

  constructor(name: string, width: number, height = LEVEL_ROWS) {
    this.width = width;
    this.height = height;
    this.grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => " " as TileChar),
    );
    this.name = name;
  }

  private name: string;

  rect(x0: number, y0: number, x1: number, y1: number, tile: TileChar): this {
    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          this.grid[y][x] = tile;
        }
      }
    }
    return this;
  }

  set(x: number, y: number, tile: TileChar): this {
    return this.rect(x, y, x, y, tile);
  }

  mark(kind: SpawnKind, tx: number, ty: number): this {
    this.spawns.push({ kind, tx, ty });
    return this;
  }

  build(): LevelData {
    return {
      name: this.name,
      width: this.width,
      height: this.height,
      tiles: this.grid.map((row) => [...row]),
      spawns: [...this.spawns],
    };
  }
}

function levelOne(): LevelData {
  const b = new Builder("MOSSGATE OUTSKIRTS", 64);
  // base ground (rows 10-11) with three pits
  b.rect(0, 10, 13, 11, "=").rect(0, 10, 13, 10, "#");
  b.rect(16, 10, 29, 11, "=").rect(16, 10, 29, 10, "#");
  b.rect(33, 10, 46, 11, "=").rect(33, 10, 46, 10, "#");
  b.rect(49, 10, 63, 11, "=").rect(49, 10, 63, 10, "#");
  // pit decoration and a spike bed in the middle pit
  b.rect(30, 11, 32, 11, "^");
  // floating one-way plank route over the first pit
  b.rect(8, 7, 10, 7, "P").rect(18, 6, 20, 6, "P").rect(23, 7, 25, 7, "P");
  // wall-jump intro shaft: two stone faces with a gap
  b.rect(26, 4, 26, 9, "S").rect(29, 4, 29, 9, "S");
  b.set(26, 3, "M").set(29, 3, "M");
  // stone keep on the right with a back-wall interior
  b.rect(52, 0, 63, 9, "W").rect(52, 6, 63, 9, "S");
  b.rect(52, 6, 52, 9, "M").rect(63, 6, 63, 9, "M");
  b.rect(55, 8, 58, 9, "B");
  // ledges leading up to the keep wall
  b.rect(44, 7, 46, 7, "P").rect(49, 5, 51, 5, "P");
  // shard arcs
  [
    [4, 9], [5, 9], [9, 6], [11, 6], [17, 8], [19, 5], [21, 5],
    [24, 6], [27, 3], [28, 3], [34, 9], [35, 9], [38, 8], [40, 8],
    [45, 6], [50, 4], [53, 5], [57, 5], [60, 9],
  ].forEach(([tx, ty]) => b.mark("shard", tx, ty));
  // enemies, pickups, checkpoints, goal
  b.mark("thornling", 6, 9).mark("thornling", 21, 9)
    .mark("thornling", 38, 9).mark("thornling", 55, 9);
  b.mark("heart", 33, 9);
  b.mark("lantern", 16, 9).mark("lantern", 49, 9);
  b.mark("hearth", 61, 7);
  b.mark("player", 2, 9);
  return b.build();
}

function levelTwo(): LevelData {
  const b = new Builder("EMBER RIDGE", 72);
  // broken ground with wider pits that demand the double jump
  b.rect(0, 10, 9, 11, "=").rect(0, 10, 9, 10, "#");
  b.rect(14, 10, 23, 11, "=").rect(14, 10, 23, 10, "#");
  b.rect(28, 10, 37, 11, "=").rect(28, 10, 37, 10, "#");
  b.rect(42, 10, 51, 11, "=").rect(42, 10, 51, 10, "#");
  b.rect(56, 10, 71, 11, "=").rect(56, 10, 71, 10, "#");
  // spike beds in pits
  b.rect(10, 11, 13, 11, "^").rect(24, 11, 27, 11, "^")
    .rect(38, 11, 41, 11, "^").rect(52, 11, 55, 11, "^");
  // a spike-topped ground stretch to discourage ground hugging
  b.set(30, 9, "^").set(31, 9, "^");
  // vertical wall-jump chimney
  b.rect(17, 2, 17, 9, "S").rect(20, 2, 20, 9, "S");
  b.set(17, 1, "M").set(20, 1, "M");
  // ascending plank + brick sky route
  b.rect(11, 7, 12, 7, "P").rect(24, 7, 25, 7, "P")
    .rect(27, 5, 28, 5, "B").rect(33, 4, 34, 4, "P")
    .rect(39, 6, 40, 6, "P").rect(45, 4, 47, 4, "B")
    .rect(52, 6, 53, 6, "P");
  // dash gate: low brick lintel the player dashes under
  b.rect(43, 7, 48, 7, "B").set(45, 8, "^").set(46, 8, "^");
  // stone terminus with back wall
  b.rect(62, 0, 71, 9, "W").rect(62, 6, 71, 9, "S");
  b.rect(62, 6, 62, 9, "M").rect(71, 6, 71, 9, "M");
  b.rect(65, 8, 68, 9, "B");
  // shard line rewarding the high route
  [
    [3, 9], [6, 9], [11, 6], [15, 8], [18, 3], [19, 3], [24, 6],
    [27, 4], [30, 8], [33, 3], [36, 8], [39, 5], [43, 5], [46, 3],
    [52, 5], [57, 9], [60, 9], [63, 5], [67, 5], [69, 9],
  ].forEach(([tx, ty]) => b.mark("shard", tx, ty));
  b.mark("thornling", 5, 9).mark("thornling", 22, 9)
    .mark("thornling", 35, 9).mark("thornling", 48, 9)
    .mark("thornling", 60, 9);
  b.mark("wisp", 16, 5).mark("wisp", 40, 4).mark("wisp", 58, 5);
  b.mark("heart", 28, 9).mark("heart", 56, 9);
  b.mark("lantern", 14, 9).mark("lantern", 42, 9).mark("lantern", 56, 9);
  b.mark("hearth", 69, 7);
  b.mark("player", 2, 9);
  return b.build();
}

function levelThree(): LevelData {
  // BOSS ARENA — sealed floor (no pits), high walls, dodge platforms.
  const b = new Builder("BRIARHEART THICKET", 40);
  // solid floor across the whole arena
  b.rect(0, 10, 39, 11, "=").rect(0, 10, 39, 10, "#");
  // containing stone walls with moss caps
  b.rect(0, 0, 0, 10, "S").rect(39, 0, 39, 10, "S");
  b.set(0, 0, "M").set(39, 0, "M");
  // dark back wall for depth contrast against the ember core
  b.rect(1, 0, 38, 9, "W");
  // two dodging platforms with a spike bed underneath the right one
  b.rect(9, 7, 12, 7, "P").rect(20, 5, 23, 5, "B")
    .rect(27, 7, 30, 7, "P");
  b.rect(21, 9, 22, 9, "^");
  // brick pillars framing the boss pedestal
  b.rect(29, 6, 29, 9, "B").rect(35, 6, 35, 9, "B");
  b.set(29, 5, "M").set(35, 5, "M");
  // shards reward brave platforming while dodging
  [
    [10, 6], [11, 6], [21, 4], [22, 4], [28, 6], [29, 6], [5, 9], [15, 9],
  ].forEach(([tx, ty]) => b.mark("shard", tx, ty));
  b.mark("heart", 3, 9);
  b.mark("lantern", 2, 9);
  b.mark("boss", 31, 8);
  b.mark("hearth", 37, 7);
  b.mark("player", 2, 9);
  return b.build();
}

export const LEVELS: LevelData[] = [levelOne(), levelTwo(), levelThree()];
