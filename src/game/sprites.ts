// Procedural pixel-art factory. Every sprite is authored as an explicit
// pixel map (one character = one pixel), rendered to offscreen canvases and
// drawn nearest-neighbour at runtime for a crisp 16-bit look. No geometry
// placeholders: silhouettes, shading and outlines are all hand-authored.

export interface SpriteSheet {
  frames: HTMLCanvasElement[];
  w: number;
  h: number;
}

type Palette = Record<string, string>;
type Frame = string[];

const cache = new Map<string, SpriteSheet>();
const K = "#12111a"; // universal outline

function blank(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function render(frame: Frame, pal: Palette): HTMLCanvasElement {
  const h = frame.length;
  const w = Math.max(...frame.map((r) => r.length));
  const c = blank(w, h);
  const ctx = c.getContext("2d")!;
  for (let y = 0; y < h; y++) {
    const row = frame[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === " " || ch === ".") continue;
      const color = pal[ch] ?? (ch === "k" ? K : undefined);
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

function sheet(frames: Frame[], pal: Palette): SpriteSheet {
  const canvases = frames.map((f) => render(f, pal));
  return { frames: canvases, w: canvases[0].width, h: canvases[0].height };
}

function recolor(src: SpriteSheet, map: Record<string, string>): SpriteSheet {
  const frames = src.frames.map((fc) => {
    const c = blank(fc.width, fc.height);
    const ctx = c.getContext("2d")!;
    ctx.drawImage(fc, 0, 0);
    const img = ctx.getImageData(0, 0, fc.width, fc.height);
    const lookup = new Map<string, string>();
    for (const [from, to] of Object.entries(map)) {
      lookup.set(from.toLowerCase(), to);
    }
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const hex = `#${[d[i], d[i + 1], d[i + 2]]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")}`;
      const to = lookup.get(hex);
      if (to) {
        const r = parseInt(to.slice(1, 3), 16);
        const g = parseInt(to.slice(3, 5), 16);
        const b = parseInt(to.slice(5, 7), 16);
        d[i] = r;
        d[i + 1] = g;
        d[i + 2] = b;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  });
  return { frames, w: src.w, h: src.h };
}

// ---------------------------------------------------------------------------
// Player characters (16x18, two walk frames, flipped horizontally at runtime)
// ---------------------------------------------------------------------------

const ALDRIC_PAL: Palette = {
  k: K, h: "#cfd8e3", H: "#7f8aa3", f: "#e8b58e", F: "#b97f5f",
  p: "#ef4d44", P: "#a12b28", a: "#9fb0c6", A: "#64728c", g: "#f5c542",
  b: "#4a3b33", B: "#332822",
};
const aldricA: Frame = [
  "      pp        ",
  "     pppp       ",
  "     kHHHk      ",
  "    khhhhhk     ",
  "    khhhhhk     ",
  "    kHkHkHk     ",
  "    kffffffk    ",
  "     kfFFfk     ",
  "   kkaaaaakk    ",
  "  kaaaaaaaaak   ",
  "  kaaggggaaak   ",
  "  kaAggggAak    ",
  "  kaaaaaaaaak   ",
  "   kaaAAaaak    ",
  "   kkA  A kk    ",
  "   kk    kk     ",
  "   bB    bk     ",
  "  bbb    bbb    ",
];
const aldricB: Frame = [
  "      pp        ",
  "     pppp       ",
  "     kHHHk      ",
  "    khhhhhk     ",
  "    khhhhhk     ",
  "    kHkHkHk     ",
  "    kffffffk    ",
  "     kfFFfk     ",
  "   kkaaaaakk    ",
  "  kaaaaaaaaak   ",
  "  kaaggggaaak   ",
  "  kaAggggAak    ",
  "  kaaaaaaaaak   ",
  "   kaaAAaaak    ",
  "    kkA Akk     ",
  "    kk   kk     ",
  "   bbb   bB     ",
  "   bb    bbb    ",
];

const VESNA_PAL: Palette = {
  k: K, h: "#5b3e8f", H: "#3d2866", f: "#f0c09a", F: "#c08a66",
  a: "#7c5cbf", A: "#553a8c", g: "#f5c542", b: "#3a2b52", B: "#271c3a",
  e: "#67e8f9",
};
const vesnaA: Frame = [
  "     kHHk       ",
  "    khhhhk      ",
  "    hhhhhh      ",
  "   khhhhhhk     ",
  "   khhhhhhk     ",
  "   kfekefk      ",
  "   kffffffk     ",
  "    kfFFfk      ",
  "   kgaaaaagk    ",
  "  kaaaaaaaak    ",
  "  kaaeeeeaak    ",
  "  kaAeeeeAak    ",
  "  kaaaaaaaak    ",
  "   kaAAAAak     ",
  "   kkA  A kk    ",
  "   kk    kk     ",
  "   bB    bk     ",
  "  bbb    bbb    ",
];
const vesnaB: Frame = [
  "     kHHk       ",
  "    khhhhk      ",
  "    hhhhhh      ",
  "   khhhhhhk     ",
  "   khhhhhhk     ",
  "   kfekefk      ",
  "   kffffffk     ",
  "    kfFFfk      ",
  "   kgaaaaagk    ",
  "  kaaaaaaaak    ",
  "  kaaeeeeaak    ",
  "  kaAeeeeAak    ",
  "  kaaaaaaaak    ",
  "   kaAAAAak     ",
  "    kkA Akk     ",
  "    kk   kk     ",
  "   bbb   bB     ",
  "   bb    bbb    ",
];

const CROW_PAL: Palette = {
  k: K, h: "#3f4a5a", H: "#272e3a", f: "#d9a077", F: "#a8714c",
  a: "#4a5568", A: "#2f3744", g: "#a5b4fc", b: "#2b313c", B: "#1c212a",
  e: "#fde047",
};
const crowA: Frame = [
  "    kHHHHk      ",
  "   khhhhhhhk    ",
  "   hhhhhhhhh    ",
  "  khhhhhhhhhk   ",
  "  khhhhhhhhhk   ",
  "  kHkekekek     ",
  "  kkkfffffkk    ",
  "    kfFFf k     ",
  "   kkaaaaakk    ",
  "  kgaaaaaaagk   ",
  "  kaaAAAAaaak   ",
  "  kaaaaaaaaak   ",
  "  kaAaaaaaAak   ",
  "   kaaaaaaak    ",
  "   kkA  A kk    ",
  "   kk    kk     ",
  "   bB    bk     ",
  "  bbb    bbb    ",
];
const crowB: Frame = [
  "    kHHHHk      ",
  "   khhhhhhhk    ",
  "   hhhhhhhhh    ",
  "  khhhhhhhhhk   ",
  "  khhhhhhhhhk   ",
  "  kHkekekek     ",
  "  kkkfffffkk    ",
  "    kfFFf k     ",
  "   kkaaaaakk    ",
  "  kgaaaaaaagk   ",
  "  kaaAAAAaaak   ",
  "  kaaaaaaaaak   ",
  "  kaAaaaaaAak   ",
  "   kaaaaaaak    ",
  "    kkA Akk     ",
  "    kk   kk     ",
  "   bbb   bB     ",
  "   bb    bbb    ",
];

const BRAMBLE_PAL: Palette = {
  k: K, h: "#5a7d3c", H: "#3a5226", f: "#e8c39a", F: "#b5885f",
  a: "#6b8e4e", A: "#4e6b3a", g: "#f5c542", b: "#4a3b2a", B: "#33281c",
  e: "#fde68a", L: "#8aa86a",
};
const brambleA: Frame = [
  "     LLLL       ",
  "    LLLLLL      ",
  "   kkhhhhkk     ",
  "  kLhLLLLhLk    ",
  "  kLhLLLLhLk    ",
  "   kfekefk      ",
  "   kffffffk     ",
  "    kfFFfk      ",
  "  LkaaaaaakL    ",
  " LaaaaaaaaaL    ",
  " LaagggggaaL    ",
  "  kaAggggAak    ",
  "  kaaaaaaaak    ",
  " L kaAAAAak L   ",
  "   kkA  A kk    ",
  "   kk    kk     ",
  "   bB    bk     ",
  "  bbb    bbb    ",
];
const brambleB: Frame = [
  "     LLLL       ",
  "    LLLLLL      ",
  "   kkhhhhkk     ",
  "  kLhLLLLhLk    ",
  "  kLhLLLLhLk    ",
  "   kfekefk      ",
  "   kffffffk     ",
  "    kfFFfk      ",
  "  LkaaaaaakL    ",
  " LaaaaaaaaaL    ",
  " LaagggggaaL    ",
  "  kaAggggAak    ",
  "  kaaaaaaaak    ",
  " L kaAAAAak L   ",
  "    kkA Akk     ",
  "    kk   kk     ",
  "   bbb   bB     ",
  "   bb    bbb    ",
];

// ---------------------------------------------------------------------------
// Enemies (16x16, two frames unless noted)
// ---------------------------------------------------------------------------

const ZOMBIE_PAL: Palette = {
  k: K, g: "#6b8e4e", G: "#4e6b3a", l: "#8aa86a", r: "#7a4a35",
  R: "#573324", e: "#e5e7eb", p: "#3f6212",
};
const zombieA: Frame = [
  "                ",
  "    kkkkkk      ",
  "   kggggggk     ",
  "  kgGgggggGk  kk",
  "  kgegkgegGkkgrk",
  "  kggggggggkrgrk",
  "   kgGggGgk kkk ",
  "  kkrrrrrrrkk    ",
  " krgrrrrrrgrk    ",
  " krgrpppprgrk    ",
  "  kkrpppprrk     ",
  "   krrrrrrk      ",
  "   kGk  kGk      ",
  "   kGk  kGk      ",
  "   kkk  kkk      ",
  "  kkk    kkk     ",
];
const zombieB: Frame = [
  "                ",
  "    kkkkkk      ",
  "   kggggggk     ",
  "  kgGgggggGk  kk",
  "  kgegkgegGkkgrk",
  "  kggggggggkrgrk",
  "   kgGggGgk kkk ",
  "  kkrrrrrrrkk    ",
  " krgrrrrrrgrk    ",
  " krgrpppprgrk    ",
  "  kkrpppprrk     ",
  "   krrrrrrk      ",
  "    kG kGk       ",
  "    kG kGk       ",
  "   kkk kkk       ",
  "  kkk   kkk      ",
];

const BAT_PAL: Palette = { k: K, b: "#5b3a6e", B: "#3e274d", f: "#c084fc", e: "#fde047" };
const batA: Frame = [
  "                ",
  "                ",
  " kk          kk ",
  "kbBk      kBbk  ",
  "kbBBk kkkk kBBbk",
  "kbBBBkbeebkBBBbk",
  "kbBfBkbfbbkBfBbk",
 " kbbkkbbbbkkbbk ",
  "    kkbfbbkk    ",
  "      kbbk      ",
  "       kk       ",
  "                ",
];
const batB: Frame = [
  "                ",
  "                ",
  "                ",
  "     kkkkkk     ",
  " kk kbeebbk kk  ",
  "kbBkkbfbbkkBbk  ",
  "kbBBkbbbbkBBbk  ",
  "kbBBBkkkkBBBbk  ",
  " kBBB    BBBk   ",
  "  kk      kk    ",
  "                ",
  "                ",
];

const SKELETON_PAL: Palette = {
  k: K, w: "#e7e5d8", W: "#b8b5a6", d: "#4a4655", e: "#ef4444",
};
const skeletonA: Frame = [
  "    kkkkkk      ",
  "   kwwwwwwk     ",
  "  kwWWwwWWwk    ",
  "  kwkwwwwkwk    ",
  "  kwekkkkewk    ",
  "   kwwwwwwk     ",
  "    kWkkWk      ",
  "  kkwwwwwwkk    ",
  " kwdwwwwwwdwk   ",
  " kwdwkwwkwdwk   ",
  "  kwwkwwkwwk    ",
  "   kwwwwwwk     ",
  "   kWk  kWk     ",
  "   kWk  kWk     ",
  "   kkk  kkk     ",
  "  kkk    kkk    ",
];
const skeletonB: Frame = [
  "    kkkkkk      ",
  "   kwwwwwwk     ",
  "  kwWWwwWWwk    ",
  "  kwkwwwwkwk    ",
  "  kwekkkkewk    ",
  "   kwwwwwwk     ",
  "    kWkkWk      ",
  "  kkwwwwwwkk    ",
  " kwdwwwwwwdwk   ",
  " kwdwkwwkwdwk   ",
  "  kwwkwwkwwk    ",
  "   kwwwwwwk     ",
  "    kWk kWk     ",
  "    kWk kWk     ",
  "   kkk  kkk     ",
  "  kkk   kkk     ",
];

const GHOST_PAL: Palette = { k: K, w: "#dbeafe", W: "#bfdbfe", b: "#93c5fd", e: "#1e3a8a" };
const ghostA: Frame = [
  "     kkkkk      ",
  "   kkwwwwwkk    ",
  "  kwwwwwwwwwk   ",
  " kwWwwwwwwwWk   ",
  " kwwewwwwwewk   ",
  " kwwwwwwwwwwk   ",
  " kwwwwbbbwwww   ",
  " kwwwwbbbwwww   ",
  " kwwwwwwwwwwk   ",
  " kwwwwwwwwwwk   ",
  " kwwwwwwwwwwk   ",
  " kwwwwwwwwwwk   ",
  " kwwwwwwwwwwk   ",
  " kwwwwwwwwwwk   ",
  " kkwkkwkkwkkw   ",
  "  kk kk kk kk   ",
];
const ghostB: Frame = [
  "     kkkkk      ",
  "   kkwwwwwkk    ",
  "  kwwwwwwwwwk   ",
  " kwWwwwwwwwWk   ",
  " kwwewwwwwewk   ",
  " kwwwwwwwwwwk   ",
  " kwwwwbbbwwww   ",
  " kwwwwbbbwwww   ",
  " kwwwwwwwwwwk   ",
  " kwwwwwwwwwwk   ",
  " kwwwwwwwwwwk   ",
  " kwwwwwwwwwwk   ",
  " kwkwwwwkwwkw   ",
  " kwkkwwkkwwkk   ",
  " kk kwkkwk kk   ",
  "    kk  kk      ",
];

const SLIME_PAL: Palette = { k: K, g: "#34d399", G: "#059669", l: "#a7f3d0", e: "#064e3b", w: "#ecfdf5" };
const slimeA: Frame = [
  "                ",
  "                ",
  "     kkkk       ",
  "   kkggllggkk   ",
  "  kglllllllgk   ",
  " kgllgggglllgk  ",
  " kglgkgllglgk   ",
  "kgglgkgllglgggk ",
  "kgggggggggggggk ",
  "kGgggggggggggGk ",
  "kGgkggggggkgkGk ",
  "kGkkkkkkkkkkkGk ",
  " kkkkkkkkkkkkk  ",
  "                ",
  "                ",
  "                ",
];
const slimeB: Frame = [
  "                ",
  "                ",
  "                ",
  "    kkkkkk      ",
  "  kkggllggkk    ",
  " kglllllllgk    ",
  " kglgkgllglgk   ",
  "kggggkgglgggggk ",
  "kGgggggggggggGk ",
  "kGgkggggggkgkGk ",
  " kkkkkkkkkkkkk  ",
  "                ",
  "                ",
  "                ",
  "                ",
  "                ",
];

// ---------------------------------------------------------------------------
// Bosses (24x24, single frame — engine adds sway / glow)
// ---------------------------------------------------------------------------

const REAPER_PAL: Palette = {
  k: K, r: "#1f2937", R: "#111827", w: "#e7e5d8", W: "#9ca3af",
  e: "#ef4444", s: "#9ca3af", S: "#4b5563", g: "#f5c542",
};
const reaper: Frame = [
  "                        ",
  "        kkkkkk          ",
  "      kkrrrrrrkk        ",
  "     krrRrrrrRrrk       ",
  "    krrRrrrrrRrrrk      ",
  "   krrRrrkkkkrrRrrk     ",
  "   krrRrkeekekrRrrk  kk ",
  "   krrRrrkkkkrrRrrk ksk ",
  "    krrRrrrrrRrrrk kssk ",
  "    krrrrwwwwrrrrk ksSk ",
  "     krrrwwwwrrrk  ksk  ",
  "      kkrrrrrrkk  kssk  ",
  "   kkkkrrrrrrrkkkksk    ",
  "  krrrrrrrrrrrrrrrrk    ",
  " krRrrrrrrrrrrrrRrrk    ",
  " krRrrkkkkkkkkrrRrrk    ",
  "  krrrk      krrrrk     ",
  "  krRrk      krRrk      ",
  "   krrk      krrk       ",
  "   kRrk      kRrk       ",
  "   kkkk      kkkk       ",
  "  kkkkk      kkkkk      ",
  " kkkkkk      kkkkkk     ",
  "                        ",
];

const TITAN_PAL: Palette = {
  k: K, s: "#78716c", S: "#44403c", l: "#a8a29e", e: "#fb923c",
  g: "#57534e", r: "#292524",
};
const titan: Frame = [
  "                        ",
  "      kkkkkkkkkk        ",
  "    kkslllllllskk       ",
  "   kkslllllllllskk      ",
  "  kksllSSSSSSSllskk     ",
  "  kslSkkkkkkkkSlSsk     ",
  "  kslSkeekkeekSlSsk     ",
  "  kslSkkkkkkkkSlSsk     ",
  "  kksllllllllllskk      ",
  "   kkssllllllsskk       ",
  " kkksssssssssssskkk     ",
  "kslssssggggggsssslsk    ",
  "kslsssggggggggssslsk    ",
  "kslsssggSggSgggssslsk   ",
  "kslssssggggggsssslsk    ",
  " kksssssssssssssskk     ",
  "  kksss      ssskk      ",
  "  kslsk      kslsk      ",
  "  kslsk      kslsk      ",
  "  kslsk      kslsk      ",
  "  kSsk        kSs k     ",
  "  kkkk        kkkk      ",
  " kkkkk        kkkkk     ",
  "                        ",
];

const VOID_PAL: Palette = {
  k: K, r: "#2e1065", R: "#1e1b4b", w: "#7c3aed", W: "#4c1d95",
  e: "#c4b5fd", s: "#a78bfa", g: "#fde047",
};
const voidReaper: Frame = [
  "                        ",
  "       kggkkggk         ",
  "      kgRkkkkRgk        ",
  "     kkrrrrrrrrkk       ",
  "    krrRrrrrrRrrrk      ",
  "   krrRrrkkkkrrRrrk     ",
  "   krrRreeseeerrRrk     ",
  "   krrRrrkkkkrrRrrk     ",
  "    krrRrrrrrRrrrk      ",
  "    krrrwwwwwwrrrk      ",
  "     krrwwwwwwrrk       ",
  "   kkkrrrrrrrrkkk       ",
  "  kssrrrrrrrrrrssk      ",
  " ksssrrrrrrrrrrsssk     ",
  " kssrrrRrrrrRrrrssk     ",
  "  kssrrrRrrRrrrssk      ",
  "  kkssrrrrrrrrsskk      ",
  "   kkssrkkkkrrssk       ",
  "    kkssk  ksskk        ",
  "     kks    skk         ",
  "    kksk    kskk        ",
  "   kkkk      kkkk       ",
  "  kkkkk      kkkkk      ",
  "                        ",
];

// ---------------------------------------------------------------------------
// Pickups
// ---------------------------------------------------------------------------

const GEM1_PAL: Palette = { k: K, b: "#38bdf8", B: "#0369a1", l: "#bae6fd", w: "#f0f9ff" };
const gem1: Frame = [
  "                ",
  "                ",
  "      kk        ",
  "     kbbk       ",
  "    kblbbk      ",
  "   kblwbbBk     ",
  "  kblwwbbbBk    ",
  "  kbwbbbbbBk    ",
  "   kbbbbbBk     ",
  "    kbbbBk      ",
  "     kbBk       ",
  "      kk        ",
  "                ",
  "                ",
  "                ",
  "                ",
];
const GEM5_PAL: Palette = { k: K, b: "#34d399", B: "#047857", l: "#a7f3d0", w: "#ecfdf5" };
const GEM10_PAL: Palette = { k: K, b: "#f87171", B: "#b91c1c", l: "#fecaca", w: "#fff1f2" };
const gemBig: Frame = [
  "                ",
  "     kkkk       ",
  "    kbbbbk      ",
  "   kblwbbbk     ",
  "  kblwwbbbbk    ",
  "  kbwwbbbbbBk   ",
  "  kbbbbbbbbBk   ",
  "  kbbbbbbbbBk   ",
  "   kbbbbbbBk    ",
  "    kbbbbBk     ",
  "     kbbBk      ",
  "      kBk       ",
  "                ",
  "                ",
  "                ",
  "                ",
];

const COIN_PAL: Palette = { k: K, g: "#f5c542", G: "#b45309", l: "#fde68a" };
const coin: Frame = [
  "                ",
  "    kkkkkk      ",
  "  kkggllggkk    ",
  " kglgggggglgk   ",
  " kgllkGGkllgk   ",
  "kglgkGGGGkl lgk ".replace(" ", ""),
  "kglgkGGGGkllgk  ",
  "kglgkkGGkkllgk  ",
  " kgllkGGkllgk   ",
  " kglgggggglgk   ",
  "  kkggGGggkk    ",
  "    kkkkkk      ",
  "                ",
  "                ",
  "                ",
  "                ",
];

const CHICKEN_PAL: Palette = { k: K, b: "#c2703d", B: "#8a4a22", l: "#e8a86b", w: "#fdebd0", g: "#65a30d" };
const chicken: Frame = [
  "                ",
  "                ",
  "      kkkk      ",
  "    kkllbbkk    ",
  "   klwllbbbbk   ",
  "  klwwllbbbbBk  ",
  "  kllbbbbbbbBk  ",
  "  kbbbbbbbbbBk  ",
  "  kbBbbbbbbBBk  ",
  "   kbbBbbbBBk   ",
  "   kBkbkbbBk    ",
  "    kk kBbBk    ",
  "        kkBk    ",
  "         kk     ",
  "                ",
  "                ",
];

const CHEST_PAL: Palette = { k: K, w: "#92400e", W: "#78350f", g: "#f5c542", G: "#b45309", d: "#451a03" };
const chestClosed: Frame = [
  "                ",
  "                ",
  "    kkkkkkkk    ",
  "  kkggggggggkk  ",
  " kgkwwwwwwwwkgk ",
  " kgwwwwwwwwwwgk ",
  "kgwwwwwwwwwwwwgk",
  "kgwwwwkkkkwwwwgk",
  "kgwwwwkgGkwwwwgk",
  "kgwwwwkkkkwwwwgk",
  "kgWWWWWWWWWWWWgk",
  "kgWkkWWWWWWkkWgk",
  "kgWkkWWWWWWkkWgk",
  " kkkkkkkkkkkkkk ",
  "                ",
  "                ",
];
const chestOpen: Frame = [
  "                ",
  "  kkkkkkkkkkkk  ",
  " kggggggggggggk ",
  " kgllylllllllgk ",
  " kglllyylllllgk ",
  "  kkkkkkkkkkkk  ",
  " kgwwwwkkkkwwgk ",
  " kgwwwwkgGkwwgk ",
  " kgWWWWWWWWWWgk ",
  " kgWkkWWWWkkWgk ",
  " kgWkkWWWWkkWgk ",
  "  kkkkkkkkkkkk  ",
  "                ",
  "                ",
  "                ",
  "                ",
];
const CHEST_OPEN_PAL: Palette = { ...CHEST_PAL, y: "#fde047" };

const MAGNET_PAL: Palette = { k: K, r: "#dc2626", R: "#991b1b", g: "#e5e7eb", G: "#9ca3af" };
const magnet: Frame = [
  "                ",
  "    kkkkkkkk    ",
  "   krrrrrrrgk   ",
  "  krrrrrrrrggk  ",
  "  krRrrrrrrrGk  ",
  "  krRrrrrrrrGk  ",
  "  krRr    rGk   ",
  "  krRr    rGk   ",
  "  krRr    rGk   ",
  "  krRr    rGk   ",
  "  krRr    rGk   ",
  "  kkkk    kkkk  ",
  "                ",
  "                ",
  "                ",
  "                ",
];

// ---------------------------------------------------------------------------
// Stage props (16x16)
// ---------------------------------------------------------------------------

const TOMB_PAL: Palette = { k: K, s: "#9ca3af", S: "#6b7280", d: "#4b5563", g: "#6b8e4e" };
const tomb: Frame = [
  "                ",
  "     kkkkk      ",
  "    ksssssk     ",
  "   kssSssssk    ",
  "   ksSSSSsSk    ",
  "   kssddsssk    ",
  "   kssdddssk    ",
  "   kssddsssk    ",
  "  ksssssssssk   ",
  "  ksSSSSSSSsk   ",
  "  ksssssssssk   ",
  "  kkkkkkkkkkk   ",
  "      kggk      ",
  "     kggggk     ",
  "                ",
  "                ",
];

const DEADTREE_PAL: Palette = { k: K, w: "#7c5a3a", W: "#52391f", d: "#3a2716" };
const deadTree: Frame = [
  "       kk       ",
  "      kwwk      ",
  "  kk  kwwWk  kk ",
  " kwwkkkWWWkkwWk ",
  " kwwWk kWWk wWk ",
  "  kkwk kWWk kk  ",
  "     k kWWk     ",
  "    kkWWWWWkk   ",
  "    kWWWWWWWk   ",
  "    kWWWWWWWk   ",
  "    kWWWWWWWk   ",
  "    kWWWWWWWk   ",
  "   kWWWWWWWWWk  ",
  "   kWWWWWWWWk   ",
  "  kkkkkkkkkkkk  ",
  "                ",
];

const PINE_PAL: Palette = { k: K, g: "#3f6212", G: "#365314", l: "#4d7c0f", w: "#7c5a3a", W: "#52391f" };
const pine: Frame = [
  "       kk       ",
  "      kglk      ",
  "     kggllgk    ",
  "    kggGggllk   ",
  "   kgglGgggGk   ",
  "    kgglGggk    ",
  "   kggGgggGgk   ",
  "  kgglGgggGllk  ",
  "  kggGgggggGGk  ",
  "   kkggGlGggk   ",
  "  kggGgggggGGk  ",
  " kgglGgggggGllk ",
  " kkkkkkkkkkkkkk ",
  "      kwwk      ",
  "     kwwWWk     ",
  "    kkkkkkkk    ",
];

const BUSH_PAL: Palette = { k: K, g: "#4d7c0f", G: "#365314", l: "#65a30d", r: "#dc2626" };
const bush: Frame = [
  "                ",
  "     kkkk       ",
  "   kkglggkk     ",
  "  kggllgggGgk   ",
  " kgglggkgggGgk  ",
  " kgGlggggkgggk  ",
  " kgggggrgggGgk  ",
  " kggkggggggGgk  ",
  "  kgggGgggGgk   ",
  "  kkkkkkkkkkk   ",
  "                ",
  "                ",
  "                ",
  "                ",
  "                ",
  "                ",
];

const ROCK_PAL: Palette = { k: K, s: "#9ca3af", S: "#6b7280", d: "#4b5563", l: "#d1d5db" };
const rock: Frame = [
  "                ",
  "                ",
  "     kkkkk      ",
  "   kksllssk     ",
  "  kslsssSSsk    ",
  " kslsssssSSSk   ",
  " kslsSsssssSk   ",
  " ksSSsssSssSk   ",
  " kkSSSSSSSSkk   ",
  "  kkkkkkkkkk    ",
  "                ",
  "                ",
  "                ",
  "                ",
  "                ",
  "                ",
];

const FENCE_PAL: Palette = { k: K, w: "#a16207", W: "#713f12", d: "#422006" };
const fence: Frame = [
  "                ",
  " k k  k k  k k  ",
  " kwk kkwk kwk   ",
  " kwk kkwk kwk   ",
  "kwwkwwwwwkwwwwk ",
  "kwWwkwWwwkwWwwk ",
  "kwWwkwWwwkwWwwk ",
  "kwwkwwwwwkwwwwk ",
  "kwWwkwWwwkwWwwk ",
  "kwWwkwWwwkwWwwk ",
  " kkk  kkk  kkk  ",
  "                ",
  "                ",
  "                ",
  "                ",
  "                ",
];

const MUSHROOM_PAL: Palette = { k: K, r: "#dc2626", R: "#991b1b", w: "#fde68a", s: "#fef3c7", S: "#d6c39a" };
const mushroom: Frame = [
  "                ",
  "                ",
  "    kkkkkk      ",
  "  kkrrwrrrkk    ",
  " krrwrrrwrRrk   ",
  " krRrrrrrrrRk   ",
  " kkrrrrrrrrkk   ",
  "    kksskk      ",
  "    kssSsk      ",
  "    kssSsk      ",
  "    kssssk      ",
  "     kkkk       ",
  "                ",
  "                ",
  "                ",
  "                ",
];

const SHELF_PAL: Palette = { k: K, w: "#7c2d12", W: "#431407", g: "#a78bfa", r: "#dc2626", y: "#facc15", b: "#38bdf8" };
const shelf: Frame = [
  "                ",
  " kkkkkkkkkkkkk  ",
  " kwggrryybwwwwk ",
  " kwggrryybwWwwk ",
  " kkkkkkkkkkkkk  ",
  " kwbbggrrywwwwk ",
  " kwbbggrrywWwwk ",
  " kkkkkkkkkkkkk  ",
  " kwryybbggwwwwk ",
  " kwryybbggwWwwk ",
  " kkkkkkkkkkkkk  ",
  " kwwwwwwwwwwwwk ",
  " kwwwwwwwwwwwwk ",
  " kkkkkkkkkkkkk  ",
  "                ",
  "                ",
];

const PILLAR_PAL: Palette = { k: K, s: "#a8a29e", S: "#57534e", l: "#d6d3d1", g: "#f5c542" };
const pillar: Frame = [
  "                ",
  "  kkkkkkkkkkk   ",
  "  ksllllllls k  ",
  "  ksssssssssk   ",
  "  ksSssssssSk   ",
  "  ksSssssssSk   ",
  "  ksSsgssssSk   ",
  "  ksSsgssssSk   ",
  "  ksSssssssSk   ",
  "  ksSssssssSk   ",
  "  ksSssssssSk   ",
  "  ksSssssssSk   ",
  "  kssssssssssk  ",
  "  kkkkkkkkkkkk  ",
  "                ",
  "                ",
];

// ---------------------------------------------------------------------------
// Weapon / passive / UI icons (16x16)
// ---------------------------------------------------------------------------

function icon(rows: Frame, pal: Palette): SpriteSheet {
  return sheet([rows], pal);
}

const ICON_PALS = {
  blue: { k: K, a: "#38bdf8", b: "#0284c7", l: "#bae6fd", w: "#f0f9ff" } as Palette,
  gold: { k: K, a: "#fbbf24", b: "#b45309", l: "#fde68a", w: "#fffbeb" } as Palette,
  orange: { k: K, a: "#fb923c", b: "#c2410c", l: "#fed7aa", w: "#fff7ed" } as Palette,
  indigo: { k: K, a: "#a5b4fc", b: "#4f46e5", l: "#e0e7ff", w: "#eef2ff" } as Palette,
  green: { k: K, a: "#4ade80", b: "#15803d", l: "#bbf7d0", w: "#f0fdf4" } as Palette,
  purple: { k: K, a: "#c084fc", b: "#7e22ce", l: "#e9d5ff", w: "#faf5ff" } as Palette,
  yellow: { k: K, a: "#fde047", b: "#a16207", l: "#fef9c3", w: "#fefce8" } as Palette,
  rose: { k: K, a: "#fb7185", b: "#be123c", l: "#fecdd3", w: "#fff1f2" } as Palette,
  red: { k: K, a: "#f87171", b: "#b91c1c", l: "#fecaca", w: "#fff1f2" } as Palette,
  gray: { k: K, a: "#9ca3af", b: "#4b5563", l: "#e5e7eb", w: "#f9fafb" } as Palette,
};

const ICONS: Record<string, [Frame, Palette]> = {
  icon_bolt: [[
    "                ",
    "       kk       ",
    "      kaak      ",
    "      kaak      ",
    "     kkaaak     ",
    "    kkaalla k   ".replace(" ", ""),
    "   kkalllllk    ",
    "  kkalllllllk   ",
    "   kkalllllk    ",
    "    kkalla k    ".replace(" ", ""),
    "     kkaak      ",
    "      kk k      ".replace(" ", ""),
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.blue],
  icon_whip: [[
    "                ",
    "  kk            ",
    " kaak           ",
    " kaaak          ",
    "  kaaak         ",
    "   kaaak        ",
    "    kaaak       ",
    "     kaaak      ",
    "      kaaak     ",
    "       kaaak    ",
    "        kaaak   ",
    "         kaak   ",
    "          kk    ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.gold],
  icon_axe: [[
    "                ",
    "       kkkk     ",
    "     kkaaaakk   ",
    "    kaalllaak   ",
    "   kaallllaak   ",
    "   kaallaakk    ",
    "    kkaakk      ",
    "      kak       ",
    "      kak       ",
    "      kak       ",
    "      kak       ",
    "      kak       ",
    "      kk        ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.orange],
  icon_dagger: [[
    "                ",
    "           kk   ",
    "          kaak  ",
    "         kaak   ",
    "        kaak    ",
    "       kaak     ",
    "      kaak      ",
    "     kaak       ",
    "    kaak        ",
    "   kbbk         ",
    "   kbbk         ",
    "  kbbbk         ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.indigo],
  icon_aura: [[
    "                ",
    "     kkkkkk     ",
    "   kkaaaaaakk   ",
    "  kaallllllak   ",
    " kaall    llak  ",
    " kaal      lak  ",
    "kal        lak  ",
    "kal        lak  ",
    "kal        lak  ",
    "kaal      lak   ",
    " kaall    llak  ",
    "  kaallllllak   ",
    "   kkaaaaaakk   ",
    "     kkkkkk     ",
    "                ",
    "                ",
  ], ICON_PALS.green],
  icon_book: [[
    "                ",
    "  kkkkkkkkkk    ",
    " kaaaaaaaaaak   ",
    " kaalllllllaak  ",
    " kaalkkkkllaak  ",
    " kaalk  kllaak  ",
    " kaalk  kllaak  ",
    " kaalk  kllaak  ",
    " kaalk  kllaak  ",
    " kaalkkkkllaak  ",
    " kaalllllllaak  ",
    " kaabbbbbbbaak  ",
    "  kkkkkkkkkk    ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.purple],
  icon_storm: [[
    "                ",
    "       kk       ",
    "      kk kk     ".replace(" ", ""),
    "     kk   kk    ",
    "    kk     kk   ",
    "     kk   kk    ",
    "      kk kk     ".replace(" ", ""),
    "   kk  kk  kk   ",
    "  kk  kk   kk   ",
    "     kk    kk   ",
    "    kk      kk  ",
    "   kk        kk ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.yellow],
  icon_nova: [[
    "                ",
    "       kk       ",
    "   kk  kaa kk   ".replace(" ", ""),
    "  kaak kaa kaak ",
    "      kaaa      ",
    " kkaaaaaaaakk  ",
    "kaalllaaaalllak",
    "kaalllaaaalllak",
    " kkaaaaaaaakk  ",
    "      kaaa      ",
    "  kaak kaa kaak ",
    "   kk  kaa kk   ".replace(" ", ""),
    "       kk       ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.rose],
  icon_might: [[
    "                ",
    "    kkkkkk      ",
    "   kaaaaaak     ",
    "  kaalaalaak    ",
    "  kaalaalaak    ",
    "   kaaaaaak     ",
    "    kkaakk      ",
    "   kkaakkaakk   ",
    "  kaak  kaak    ",
    " kaak    kaak   ",
    " kaak    kaak   ",
    " kk        kk   ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.red],
  icon_cd: [[
    "                ",
    "    kkkkkk      ",
    "  kkaaaaaakk    ",
    " kaallllllak    ",
    " kaal kk llak   ",
    "kal  kk   lak   ",
    "kal  k    lak   ",
    "kal       lak   ",
    "kal      llak   ",
    " kaalllllak     ",
    "  kkaaaaakk     ",
    "    kkkkkk      ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.gray],
  icon_area: [[
    "                ",
    " kk          kk ",
    "kaak      kaak  ",
    "kaak      kaak  ",
    "                ",
    "                ",
    "     kkkk       ",
    "    kaallak     ",
    "    kaallak     ",
    "     kkkk       ",
    "                ",
    "                ",
    "kaak      kaak  ",
    "kaak      kaak  ",
    " kk          kk ",
    "                ",
  ], ICON_PALS.blue],
  icon_boots: [[
    "                ",
    "       kkkk     ",
    "      kaaak     ",
    "      kaaak     ",
    "      kaaak     ",
    "      kaaak     ",
    "      kaaak     ",
    "     kaaaak     ",
    "    kaaaaak     ",
    "   kaaaaaaak    ",
    "  kaalllllaak   ",
    "  kkkkkkkkkk    ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.indigo],
  icon_heart: [[
    "                ",
    "   kk    kk     ",
    "  kaak  kaak    ",
    " kaallaallaak   ",
    "kaallllllllak   ",
    "kaallllllllak   ",
    " kaallllllak    ",
    "  kaallllak     ",
    "   kaallak      ",
    "    kaalk       ",
    "     kk         ",
    "                ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.red],
  icon_magnet: [[
    "                ",
    "    kkkkkkkk    ",
    "   kaaaaaaak    ",
    "  kaaaaaaaak    ",
    "  kaa      ak   ",
    "  kaa      ak   ",
    "  kaa      ak   ",
    "  kaa      ak   ",
    "  kaa      ak   ",
    "  kaa      ak   ",
    "  kkkk    kkkk  ",
    "                ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.red],
  icon_regen: [[
    "                ",
    "       kk       ",
    "      kaak      ",
    "    kkalla kk   ".replace(" ", ""),
    "   kalllllak    ",
    "  kallllllaak   ",
    "  kallllllaak   ",
    "   kalllllak    ",
    "    kalllak     ",
    "     kkaak      ",
    "      kk        ",
    "                ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.green],
  icon_armor: [[
    "                ",
    "   kkkkkkkk     ",
    "  kaaaaaaaak    ",
    " kaallaallaak   ",
    " kaalllllllak   ",
    " kaallkklllak   ",
    " kaallkklllak   ",
    " kaalllllllak   ",
    " kaalllllllak   ",
    "  kaalllllak    ",
    "   kaallaak     ",
    "    kkkkkk      ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.gray],
  icon_growth: [[
    "                ",
    "       kk       ",
    "      kallk     ",
    "     kallalk    ",
    "    kalllllk    ",
    "    kallllk     ",
    "     klllk      ",
    "      kllk      ",
    " kaak  kllk     ",
    "kaalak kllk     ",
    "kaalla kllk     ",
    " kkkk  kkkk     ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.green],
  icon_luck: [[
    "                ",
    "      kkkk      ",
    "    kkaallaak   ",
    "   kalllllllk   ",
    "  kallllllllk   ",
    "  kallllklllk   ",
    "   kkllkllkk    ",
    "    kklllkk     ",
    "     klllk      ",
    "    kkllkk      ",
    "   kk  kk       ",
    "                ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.green],
  icon_skull: [[
    "                ",
    "    kkkkkk      ",
    "  kkaaaaaakk    ",
    " kaallllllak    ",
    " kaalkkllkak    ",
    " kaalkkllkak    ",
    " kaallllllak    ",
    "  kaakkkkaak    ",
    "   kallllak     ",
    "   kallllak     ",
    "    kk  kk      ",
    "    kk  kk      ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.gray],
  icon_clock: [[
    "                ",
    "    kkkkkk      ",
    "  kkaaaaaakk    ",
    " kaallllllak    ",
    " kaal kk llak   ",
    "kal  kk   lak   ",
    "kal  k    lak   ",
    "kal       lak   ",
    "kal      llak   ",
    " kaalllllak     ",
    "  kkaaaaakk     ",
    "    kkkkkk      ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.gold],
  icon_trophy: [[
    "                ",
    "  kkkkkkkkkk    ",
    " kaaaaaaaaaak   ",
    " kaalllllllaak  ",
    " kaalllllllaak  ",
    "  kaalllllaak   ",
    "   kkaaaakk     ",
    "     kaak       ",
    "    kaaak       ",
    "   kaaaaak      ",
    "  kkaaaaaakk    ",
    "  kkkkkkkkkk    ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.gold],
  icon_star: [[
    "                ",
    "       kk       ",
    "      kaak      ",
    "  kk  kaa kk    ".replace(" ", ""),
    " kkakkaaaakkak  ",
    "kaalllaaaalllak ",
    " kaalllaalllak  ",
    "  kkallllakk    ",
    "   kallllak     ",
    "   kallllak     ",
    "  kallk kallk   ".replace(" ", ""),
    " kallk  kallk   ",
    " kkkk    kkkk   ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.yellow],
  icon_sword: [[
    "                ",
    "          kk    ",
    "         kaak   ",
    "        kaak    ",
    "       kaak     ",
    "      kaak      ",
    "     kaak       ",
    "    kaak        ",
    "   kaak         ",
    "  kbbk          ",
    "  kbbk          ",
    " kbbbk          ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.gray],
  icon_coin: [[
    "                ",
    "    kkkkkk      ",
    "  kkaallaa kk   ".replace(" ", ""),
    " kalllllllak    ",
    " kallkGGkllak   ",
    "kallkGGGGkllak  ",
    "kallkGGGGkllak  ",
    " kallkGGkllak   ",
    " kalllllllak    ",
    "  kkaallaakk    ",
    "    kkkkkk      ",
    "                ",
    "                ",
    "                ",
    "                ",
    "                ",
  ], ICON_PALS.gold],
};

// world projectile sprites
const PROJ_DAGGER: Frame = [
  "      kk  ",
  "     kaak ",
  "    kaak  ",
  "   kaak   ",
  "  kaak    ",
  " kbbk     ",
  " kbbk     ",
  "kbbbk     ",
];
const PROJ_AXE: Frame = [
  "  kkkk    ",
  " kaaaakk  ",
  "kaalllaak ",
  "kaalllaak ",
  " kaallaak ",
  "  kbbbk   ",
  "   kbbk   ",
  "   kk     ",
];
const PROJ_BOOK: Frame = [
  " kkkkkkkk ",
  "kaaaaaaak ",
  "aallllll a".replace(" ", ""),
  "aalkkkll a".replace(" ", ""),
  "aalk  ll a".replace(" ", ""),
  "aalkkkll a".replace(" ", ""),
  "aallllll a".replace(" ", ""),
  " kkkkkkkk ",
];

// ---------------------------------------------------------------------------
// Registry + ground tile generation
// ---------------------------------------------------------------------------

function buildAll(): void {
  if (typeof window === "undefined" || cache.size > 0) return;

  cache.set("char_aldric", sheet([aldricA, aldricB], ALDRIC_PAL));
  cache.set("char_vesna", sheet([vesnaA, vesnaB], VESNA_PAL));
  cache.set("char_crow", sheet([crowA, crowB], CROW_PAL));
  cache.set("char_bramble", sheet([brambleA, brambleB], BRAMBLE_PAL));

  const zombieSheet = sheet([zombieA, zombieB], ZOMBIE_PAL);
  cache.set("en_zombie", zombieSheet);
  cache.set("en_husk", recolor(zombieSheet, {
    "#6b8e4e": "#6d5a78", "#4e6b3a": "#473a52", "#8aa86a": "#8b7499",
    "#7a4a35": "#3a3550", "#573324": "#272438", "#3f6212": "#241f33",
  }));
  cache.set("en_ghoul", recolor(zombieSheet, {
    "#6b8e4e": "#9f7a4d", "#4e6b3a": "#6e5230", "#8aa86a": "#c49a66",
    "#7a4a35": "#5b3a2e", "#573324": "#3d2720", "#3f6212": "#3a2418",
  }));
  cache.set("en_bat", sheet([batA, batB], BAT_PAL));
  cache.set("en_skeleton", sheet([skeletonA, skeletonB], SKELETON_PAL));
  cache.set("en_ghost", sheet([ghostA, ghostB], GHOST_PAL));
  cache.set("en_slime", sheet([slimeA, slimeB], SLIME_PAL));

  cache.set("boss_reaper", sheet([reaper], REAPER_PAL));
  cache.set("boss_titan", sheet([titan], TITAN_PAL));
  cache.set("boss_void", sheet([voidReaper], VOID_PAL));

  cache.set("gem_1", sheet([gem1], GEM1_PAL));
  cache.set("gem_5", sheet([gemBig], GEM5_PAL));
  cache.set("gem_10", sheet([gemBig], GEM10_PAL));
  cache.set("coin", sheet([coin], COIN_PAL));
  cache.set("chicken", sheet([chicken], CHICKEN_PAL));
  cache.set("chest", sheet([chestClosed], CHEST_PAL));
  cache.set("chest_open", sheet([chestOpen], CHEST_OPEN_PAL));
  cache.set("magnet", sheet([magnet], MAGNET_PAL));

  cache.set("prop_tomb", sheet([tomb], TOMB_PAL));
  cache.set("prop_deadtree", sheet([deadTree], DEADTREE_PAL));
  cache.set("prop_pine", sheet([pine], PINE_PAL));
  cache.set("prop_bush", sheet([bush], BUSH_PAL));
  cache.set("prop_rock", sheet([rock], ROCK_PAL));
  cache.set("prop_fence", sheet([fence], FENCE_PAL));
  cache.set("prop_mushroom", sheet([mushroom], MUSHROOM_PAL));
  cache.set("prop_shelf", sheet([shelf], SHELF_PAL));
  cache.set("prop_pillar", sheet([pillar], PILLAR_PAL));

  for (const [key, [rows, pal]] of Object.entries(ICONS)) {
    cache.set(key, icon(rows, pal));
  }

  cache.set("proj_dagger", sheet([PROJ_DAGGER], ICON_PALS.indigo));
  cache.set("proj_axe", sheet([PROJ_AXE], ICON_PALS.orange));
  cache.set("proj_book", sheet([PROJ_BOOK], ICON_PALS.purple));
}

export function ensureSprites(): void {
  buildAll();
}

export function getSprite(key: string): SpriteSheet {
  buildAll();
  const s = cache.get(key);
  if (s) return s;
  // fallback placeholder (never expected in practice)
  const c = blank(8, 8);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ff00ff";
  ctx.fillRect(0, 0, 8, 8);
  return { frames: [c], w: 8, h: 8 };
}

const tintCache = new Map<string, SpriteSheet>();

// Returns a recolored copy of a base sprite, cached per (key + map).
export function getTintedSprite(baseKey: string, map: Record<string, string>): SpriteSheet {
  const cacheKey = `${baseKey}|${Object.entries(map).map(([a, b]) => `${a}>${b}`).join(",")}`;
  const cached = tintCache.get(cacheKey);
  if (cached) return cached;
  const tinted = recolor(getSprite(baseKey), map);
  tintCache.set(cacheKey, tinted);
  return tinted;
}

export function makeGroundTile(
  base: string,
  speckles: string[],
  tile: number,
  seed: number,
): HTMLCanvasElement {
  const c = blank(tile, tile);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, tile, tile);
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = 0; i < tile * 2.2; i++) {
    const x = Math.floor(rnd() * tile);
    const y = Math.floor(rnd() * tile);
    ctx.fillStyle = speckles[Math.floor(rnd() * speckles.length)];
    ctx.fillRect(x, y, 1, 1);
  }
  // occasional darker patch clusters
  for (let i = 0; i < 3; i++) {
    const x = Math.floor(rnd() * tile);
    const y = Math.floor(rnd() * tile);
    ctx.fillStyle = speckles[1];
    ctx.fillRect(x, y, 2, 1);
    ctx.fillRect(x + 1, y + 1, 1, 1);
  }
  return c;
}
