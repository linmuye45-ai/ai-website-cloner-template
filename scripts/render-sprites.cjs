// Renders every authored sprite to a contact sheet (PPM -> PNG via ImageMagick)
// so the pixel art can be visually inspected without a browser.
const fs = require("fs");
const path = require("path");

function parseColor(s) {
  if (s.startsWith("#")) {
    const h = s.slice(1);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 255];
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(",").map((x) => parseFloat(x.trim()));
    return [p[0], p[1], p[2], Math.round((p[3] ?? 1) * 255)];
  }
  return [255, 0, 255, 255];
}

class StubCanvas {
  constructor(w = 0, h = 0) {
    this._w = w;
    this._h = h;
    this.buf = new Uint8Array(Math.max(1, w * h * 4));
  }
  get width() {
    return this._w;
  }
  set width(v) {
    this._w = v;
    this.buf = new Uint8Array(Math.max(1, v * this._h * 4));
  }
  get height() {
    return this._h;
  }
  set height(v) {
    this._h = v;
    this.buf = new Uint8Array(Math.max(1, this._w * v * 4));
  }
  getContext() {
    const self = this;
    return {
      fillStyle: "#000000",
      set fillStyleV(v) {},
      rect() {},
      fillRect(x, y, w, h) {
        const [r, g, b, a] = parseColor(this.fillStyle);
        for (let yy = Math.max(0, y); yy < Math.min(self.height, y + h); yy++) {
          for (let xx = Math.max(0, x); xx < Math.min(self.width, x + w); xx++) {
            const i = (yy * self.width + xx) * 4;
            if (a === 255) self.buf.set([r, g, b, 255], i);
            else if (a > 0) {
              const oa = self.buf[i + 3] / 255;
              const na = a / 255 + oa * (1 - a / 255);
              self.buf[i] = (r * (a / 255) + self.buf[i] * oa * (1 - a / 255)) / na;
              self.buf[i + 1] = (g * (a / 255) + self.buf[i + 1] * oa * (1 - a / 255)) / na;
              self.buf[i + 2] = (b * (a / 255) + self.buf[i + 2] * oa * (1 - a / 255)) / na;
              self.buf[i + 3] = na * 255;
            }
          }
        }
      },
      clearRect(x, y, w, h) {
        for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) self.buf.fill(0, (yy * self.width + xx) * 4, 4);
      },
      drawImage(src, dx, dy, dw, dh) {
        const sw = src.width;
        const sh = src.height;
        dw = dw ?? sw;
        dh = dh ?? sh;
        for (let yy = 0; yy < dh; yy++) {
          for (let xx = 0; xx < dw; xx++) {
            const sx = Math.min(sw - 1, Math.floor((xx / dw) * sw));
            const sy = Math.min(sh - 1, Math.floor((yy / dh) * sh));
            const si = (sy * sw + sx) * 4;
            const di = ((dy + yy) * self.width + (dx + xx)) * 4;
            const sa = src.buf[si + 3];
            if (sa === 255) self.buf.set(src.buf.subarray(si, si + 4), di);
            else if (sa > 0) {
              const oa = self.buf[di + 3] / 255;
              const na = sa / 255 + oa * (1 - sa / 255);
              self.buf[di] = (src.buf[si] * (sa / 255) + self.buf[di] * oa * (1 - sa / 255)) / na;
              self.buf[di + 1] = (src.buf[si + 1] * (sa / 255) + self.buf[di + 1] * oa * (1 - sa / 255)) / na;
              self.buf[di + 2] = (src.buf[si + 2] * (sa / 255) + self.buf[di + 2] * oa * (1 - sa / 255)) / na;
              self.buf[di + 3] = na * 255;
            }
          }
        }
      },
      getImageData(x, y, w, h) {
        const out = new ImageDataShim(w, h);
        for (let yy = 0; yy < h; yy++)
          for (let xx = 0; xx < w; xx++) {
            const si = ((y + yy) * self.width + (x + xx)) * 4;
            out.data.set(self.buf.subarray(si, si + 4), (yy * w + xx) * 4);
          }
        return out;
      },
      putImageData(img, x, y) {
        for (let yy = 0; yy < img.height; yy++)
          for (let xx = 0; xx < img.width; xx++) {
            const si = (yy * img.width + xx) * 4;
            const di = ((y + yy) * self.width + (x + xx)) * 4;
            self.buf.set(img.data.subarray(si, si + 4), di);
          }
      },
      createPattern: () => ({}),
      createRadialGradient: () => ({ addColorStop() {} }),
      createLinearGradient: () => ({ addColorStop() {} }),
      beginPath() {},
      arc() {},
      ellipse() {},
      fill() {},
      stroke() {},
      moveTo() {},
      lineTo() {},
      save() {},
      restore() {},
      translate() {},
      scale() {},
      rotate() {},
      drawImage2() {},
    };
  }
}
class ImageDataShim {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.data = new Uint8ClampedArray(w * h * 4);
  }
}

globalThis.window = { devicePixelRatio: 1, innerWidth: 1280, innerHeight: 720, addEventListener() {}, removeEventListener() {} };
globalThis.document = { hidden: false, createElement: () => new StubCanvas(), addEventListener() {}, removeEventListener() {} };
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const { getSprite, getTintedSprite, makeGroundTile } = require(path.join(process.cwd(), ".smoke-build/sprites.js"));
const { ENEMIES } = require(path.join(process.cwd(), ".smoke-build/content.js"));

const GROUPS = [
  ["char_aldric", "char_vesna", "char_crow", "char_bramble"],
  ["en_zombie", "en_husk", "en_ghoul", "en_bat", "en_skeleton", "en_ghost", "en_slime", "en_cultist", "en_beetle", "en_bloater"],
  ["boss_reaper", "boss_titan", "boss_void"],
  ["gem_1", "gem_5", "gem_10", "coin", "chicken", "chest", "chest_open", "magnet"],
  ["prop_tomb", "prop_deadtree", "prop_pine", "prop_bush", "prop_rock", "prop_fence", "prop_mushroom", "prop_shelf", "prop_pillar"],
  [
    "icon_bolt", "icon_whip", "icon_axe", "icon_dagger", "icon_aura", "icon_book", "icon_storm", "icon_nova",
    "icon_might", "icon_cd", "icon_area", "icon_boots", "icon_heart", "icon_magnet", "icon_regen", "icon_armor",
    "icon_growth", "icon_luck", "icon_skull", "icon_clock", "icon_trophy", "icon_star", "icon_sword", "icon_coin",
  ],
  ["proj_dagger", "proj_axe", "proj_book"],
];

// tinted stage variants, rendered through the same runtime recolor path
const tintGroup = Object.values(ENEMIES)
  .filter((e) => e.tint)
  .map((e) => `tint:${e.id}`);
GROUPS.push(tintGroup);

function spriteFor(key) {
  if (key.startsWith("tint:")) {
    const e = ENEMIES[key.slice(5)];
    return getTintedSprite(e.sprite, e.tint);
  }
  return getSprite(key);
}

const SCALE = 4;
const CELL = 26 * SCALE;
const COLS = 8;
const rows = GROUPS.reduce((a, g) => a + Math.ceil(g.length / COLS), 0);
const sheet = new StubCanvas(COLS * CELL, rows * CELL + 40);
const ctx = sheet.getContext();
ctx.fillStyle = "#20242e";
ctx.fillRect(0, 0, sheet.width, sheet.height);

let cursor = 0;
for (const group of GROUPS) {
  for (const key of group) {
    const spr = spriteFor(key);
    const col = cursor % COLS;
    const row = Math.floor(cursor / COLS);
    const ox = col * CELL + (CELL - spr.w * SCALE) / 2;
    const oy = row * CELL + (CELL - spr.h * SCALE) / 2;
    for (let f = 0; f < spr.frames.length; f++) {
      ctx.drawImage(spr.frames[f], Math.round(ox + f * (spr.w * SCALE + 4)), Math.round(oy), spr.w * SCALE, spr.h * SCALE);
    }
    cursor++;
  }
  cursor = Math.ceil(cursor / COLS) * COLS;
}

// ground tile sample
const tile = makeGroundTile("#233029", ["#2a3a31", "#1d2922", "#31453a"], 48, 7006);
ctx.drawImage(tile, 0, sheet.height - 40, 40, 40);

// Flatten RGBA over the background into plain RGB (P6 PPM is 3 bytes/pixel)
const [br, bg, bb] = parseColor("#20242e");
const rgb = Buffer.alloc(sheet.width * sheet.height * 3);
for (let i = 0, p = 0; i < sheet.buf.length; i += 4, p += 3) {
  const a = sheet.buf[i + 3] / 255;
  rgb[p] = sheet.buf[i] * a + br * (1 - a);
  rgb[p + 1] = sheet.buf[i + 1] * a + bg * (1 - a);
  rgb[p + 2] = sheet.buf[i + 2] * a + bb * (1 - a);
}
const ppmPath = path.join(process.cwd(), "scripts/sprites.ppm");
const header = Buffer.from(`P6\n${sheet.width} ${sheet.height}\n255\n`);
fs.writeFileSync(ppmPath, Buffer.concat([header, rgb]));
console.log("wrote", ppmPath, sheet.width + "x" + sheet.height);
