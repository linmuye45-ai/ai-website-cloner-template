// Generates original marketing/PWA imagery from in-repo pixel sprites:
//   public/og.png       1200x630 social share card
//   public/icon-192.png 192x192 PWA icon
//   public/icon-512.png 512x512 PWA icon
// Uses a bundled 5x7 bitmap font — no external fonts or assets.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ----------------------------- 5x7 bitmap font -----------------------------
const FONT = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".####", "#....", "#....", "#....", "#....", "#....", ".####"],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".####", "#....", "#....", "#.###", "#...#", "#...#", ".####"],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  J: ["..###", "...#.", "...#.", "...#.", "...#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  "3": ["####.", "....#", "....#", ".###.", "....#", "....#", "####."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  "6": [".###.", "#....", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "....#", ".###."],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
  ":": [".....", "..#..", "..#..", ".....", "..#..", "..#..", "....."],
  "-": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
  ".": [".....", ".....", ".....", ".....", ".....", ".##..", ".##.."],
  "!": ["..#..", "..#..", "..#..", "..#..", "..#..", ".....", "..#.."],
  "'": ["..#..", "..#..", ".#...", ".....", ".....", ".....", "....."],
};

// ------------------------------- canvas stub --------------------------------
function parseColor(s) {
  if (typeof s !== "string") return null;
  if (s.startsWith("#")) {
    const h = s.slice(1);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 255];
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(",").map((x) => parseFloat(x.trim()));
    return [p[0], p[1], p[2], Math.round((p[3] ?? 1) * 255)];
  }
  return null;
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
    return makeCtx(this);
  }
  getBoundingClientRect() {
    return { width: this._w, height: this._h, left: 0, top: 0 };
  }
  addEventListener() {}
  removeEventListener() {}
}
function blend(buf, w, x, y, r, g, b, a) {
  const px = Math.round(x);
  const py = Math.round(y);
  if (px < 0 || py < 0 || px >= w || py >= buf.length / 4 / w) return;
  const i = (py * w + px) * 4;
  const oa = buf[i + 3] / 255;
  const na = a + oa * (1 - a);
  if (na <= 0) return;
  buf[i] = (r * a + buf[i] * oa * (1 - a)) / na;
  buf[i + 1] = (g * a + buf[i + 1] * oa * (1 - a)) / na;
  buf[i + 2] = (b * a + buf[i + 2] * oa * (1 - a)) / na;
  buf[i + 3] = na * 255;
}
function makeCtx(self) {
  return {
    fillStyle: "#000",
    strokeStyle: "#000",
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    imageSmoothingEnabled: false,
    setTransform() {},
    save() {},
    restore() {},
    translate() {},
    scale() {},
    createLinearGradient: () => ({ addColorStop() {} }),
    rect(x, y, w, h) {
      this.fillRect(x, y, w, h);
    },
    fillRect(x, y, w, h) {
      const c = parseColor(this.fillStyle);
      if (!c) return;
      const [r, g, b, a] = c;
      const alpha = (a / 255) * this.globalAlpha;
      for (let yy = Math.max(0, y); yy < Math.min(self._h, y + h); yy++)
        for (let xx = Math.max(0, x); xx < Math.min(self._w, x + w); xx++) blend(self.buf, self._w, xx, yy, r, g, b, alpha);
    },
    clearRect(x, y, w, h) {
      for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) self.buf.fill(0, (yy * self._w + xx) * 4, 4);
    },
    circle(x, y, r, color, alpha = 1) {
      const c = parseColor(color);
      if (!c) return;
      for (let yy = Math.max(0, y - r); yy <= Math.min(self._h - 1, y + r); yy++)
        for (let xx = Math.max(0, x - r); xx <= Math.min(self._w - 1, x + r); xx++)
          if ((xx - x) ** 2 + (yy - y) ** 2 <= r * r) blend(self.buf, self._w, xx, yy, c[0], c[1], c[2], alpha);
    },
    drawImage(src, dx, dy, dw, dh) {
      const sw = src.width;
      const sh = src.height;
      dw = dw ?? sw;
      dh = dh ?? sh;
      for (let yy = 0; yy < dh; yy++)
        for (let xx = 0; xx < dw; xx++) {
          const sx = Math.min(sw - 1, Math.floor((xx / dw) * sw));
          const sy = Math.min(sh - 1, Math.floor((yy / dh) * sh));
          const si = (sy * sw + sx) * 4;
          const sa = (src.buf[si + 3] / 255) * this.globalAlpha;
          if (sa > 0)
            blend(self.buf, self._w, Math.round(dx) + xx, Math.round(dy) + yy, src.buf[si], src.buf[si + 1], src.buf[si + 2], sa);
        }
    },
    getImageData(x, y, w, h) {
      const data = new Uint8ClampedArray(w * h * 4);
      for (let yy = 0; yy < h; yy++)
        for (let xx = 0; xx < w; xx++) {
          const si = ((y + yy) * self._w + x + xx) * 4;
          data.set(self.buf.subarray(si, si + 4), (yy * w + xx) * 4);
        }
      return { data, width: w, height: h };
    },
    putImageData(img, x, y) {
      for (let yy = 0; yy < img.height; yy++)
        for (let xx = 0; xx < img.width; xx++) {
          const si = (yy * img.width + xx) * 4;
          const di = ((y + yy) * self._w + x + xx) * 4;
          self.buf.set(img.data.subarray(si, si + 4), di);
        }
    },
    text(str, x, y, scale, color) {
      const c = parseColor(color);
      if (!c) return;
      let cx = x;
      for (const ch of str.toUpperCase()) {
        const glyph = FONT[ch] ?? FONT[" "];
        for (let gy = 0; gy < 7; gy++)
          for (let gx = 0; gx < 5; gx++)
            if (glyph[gy][gx] === "#")
              for (let sy = 0; sy < scale; sy++)
                for (let sx = 0; sx < scale; sx++)
                  blend(self.buf, self._w, cx + gx * scale + sx, y + gy * scale + sy, c[0], c[1], c[2], 1);
        cx += 6 * scale;
      }
    },
  };
}
function writePng(canvas, outPath) {
  const ppm = outPath.replace(/\.png$/, ".ppm");
  const rgb = Buffer.alloc(canvas._w * canvas._h * 3);
  for (let i = 0, p = 0; i < canvas.buf.length; i += 4, p += 3) {
    const a = canvas.buf[i + 3] / 255;
    rgb[p] = canvas.buf[i] * a + 11 * (1 - a);
    rgb[p + 1] = canvas.buf[i + 1] * a + 15 * (1 - a);
    rgb[p + 2] = canvas.buf[i + 2] * a + 20 * (1 - a);
  }
  fs.writeFileSync(ppm, Buffer.concat([Buffer.from(`P6\n${canvas._w} ${canvas._h}\n255\n`), rgb]));
  execSync(`convert "${ppm}" "${outPath}"`);
  fs.unlinkSync(ppm);
  console.log("wrote", outPath);
}

// --------------------------------- artwork ----------------------------------
globalThis.window = { devicePixelRatio: 1, innerWidth: 1200, innerHeight: 630, addEventListener() {}, removeEventListener() {} };
globalThis.document = { hidden: false, createElement: () => new StubCanvas(), addEventListener() {}, removeEventListener() {} };
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const { getSprite } = require(path.join(process.cwd(), ".smoke-build/sprites.js"));

// 1200x630 share card
{
  const W = 1200;
  const H = 630;
  const c = new StubCanvas(W, H);
  const ctx = c.getContext();
  for (let y = 0; y < H; y++) {
    const t = y / H;
    ctx.fillStyle = `rgb(${Math.round(11 + t * 14)},${Math.round(15 + t * 22)},${Math.round(20 + t * 18)})`;
    ctx.fillRect(0, y, W, 1);
  }
  ctx.circle(1010, 120, 96, "#fef3c7", 0.05);
  ctx.circle(1010, 120, 78, "#fef3c7", 0.09);
  ctx.circle(1010, 120, 60, "#fef3c7", 0.22);
  ctx.circle(1010, 120, 50, "#fef3c7", 0.95);
  ctx.fillStyle = "#1d2922";
  ctx.fillRect(0, 470, W, H - 470);
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = ["#2a3a31", "#1d2922", "#31453a"][i % 3];
    ctx.fillRect((i * 137) % W, 470 + ((i * 53) % (H - 470)), 3, 3);
  }
  for (let i = 0; i < 7; i++) {
    const spr = getSprite(i % 2 ? "prop_tomb" : "prop_deadtree");
    const x = 60 + i * 165 + (i % 3) * 20;
    ctx.drawImage(spr.frames[0], x, 430 - spr.frames[0].height * 2, spr.frames[0].width * 2, spr.frames[0].height * 2);
  }
  const hero = getSprite("char_aldric");
  ctx.drawImage(hero.frames[0], W / 2 - hero.w * 4, 360, hero.w * 8, hero.h * 8);
  const cast = ["en_beetle", "en_slime", "en_bat", "en_zombie", "en_skeleton", "en_ghost", "en_cultist", "en_bloater"];
  const slots = [92, 218, 344, 470, 730, 856, 982, 1108];
  cast.forEach((key, i) => {
    const spr = getSprite(key);
    const y = 386 + (i % 2) * 30 - spr.h * 2;
    ctx.drawImage(spr.frames[0], slots[i] - spr.w * 2, y, spr.w * 4, spr.h * 4);
  });
  ["gem_1", "gem_5", "gem_10", "gem_1", "coin"].forEach((key, i) => {
    const spr = getSprite(key);
    ctx.drawImage(spr.frames[0], 300 + i * 130, 470, spr.w * 3, spr.h * 3);
  });
  ctx.text("DUSKFALL", 92 + 5, 118 + 5, 11, "#000000");
  ctx.text("DUSKFALL", 92, 118, 11, "#f5c542");
  ctx.text("SURVIVORS", 94 + 4, 222 + 4, 8, "#000000");
  ctx.text("SURVIVORS", 94, 222, 8, "#e8ecf1");
  ctx.fillStyle = "rgba(245,197,66,0.16)";
  ctx.fillRect(92, 300, 470, 44);
  ctx.text("FREE IN BROWSER - NO DOWNLOAD", 108, 312, 3, "#fde68a");
  writePng(c, path.join(process.cwd(), "public/og.png"));
}

for (const [size, out] of [
  [192, "icon-192.png"],
  [512, "icon-512.png"],
]) {
  const c = new StubCanvas(size, size);
  const ctx = c.getContext();
  ctx.fillStyle = "#0b0f14";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#141b24";
  ctx.fillRect(size * 0.08, size * 0.08, size * 0.84, size * 0.84);
  const spr = getSprite("char_vesna");
  const s = Math.floor(size / 20);
  ctx.drawImage(spr.frames[0], (size - spr.w * s) / 2, (size - spr.h * s) / 2, spr.w * s, spr.h * s);
  writePng(c, path.join(process.cwd(), "public", out));
}
