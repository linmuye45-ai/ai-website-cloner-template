// Simulates ~12 seconds of a real run, then renders one engine frame to PNG
// to validate full-scene composition (ground, props, horde, player, FX).
const fs = require("fs");
const path = require("path");

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
    this.path = null;
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

function makeCtx(self) {
  const ctx = {
    fillStyle: "#000",
    strokeStyle: "#000",
    lineWidth: 1,
    globalAlpha: 1,
    imageSmoothingEnabled: false,
    textAlign: "left",
    font: "10px mono",
    setTransform() {},
    save() {},
    restore() {},
    translate() {},
    scale() {},
    rotate() {},
    beginPath() {
      self.path = null;
    },
    arc(x, y, r) {
      self.path = { type: "circle", x, y, r };
    },
    ellipse(x, y, rx, ry) {
      self.path = { type: "ellipse", x, y, rx, ry };
    },
    moveTo() {},
    lineTo() {},
    stroke() {},
    strokeText() {},
    fillText() {},
    measureText: () => ({ width: 10 }),
    createPattern: () => ({}),
    createRadialGradient: () => ({ addColorStop() {} }),
    createLinearGradient: () => ({ addColorStop() {} }),
    rect() {},
    fillRect(x, y, w, h) {
      const c = parseColor(this.fillStyle);
      if (!c) return;
      const [r, g, b, a] = c;
      const alpha = (a / 255) * this.globalAlpha;
      for (let yy = Math.max(0, y); yy < Math.min(self._h, y + h); yy++) {
        for (let xx = Math.max(0, x); xx < Math.min(self._w, x + w); xx++) {
          blend(self.buf, self._w, xx, yy, r, g, b, alpha);
        }
      }
    },
    clearRect(x, y, w, h) {
      for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) self.buf.fill(0, (yy * self._w + xx) * 4, 4);
    },
    fill() {
      const p = self.path;
      const c = parseColor(this.fillStyle);
      if (!p || !c) return;
      const [r, g, b, a] = c;
      const alpha = (a / 255) * this.globalAlpha;
      if (p.type === "circle") {
        for (let yy = Math.max(0, p.y - p.r); yy < Math.min(self._h, p.y + p.r); yy++)
          for (let xx = Math.max(0, p.x - p.r); xx < Math.min(self._w, p.x + p.r); xx++)
            if ((xx - p.x) ** 2 + (yy - p.y) ** 2 <= p.r * p.r) blend(self.buf, self._w, xx, yy, r, g, b, alpha);
      }
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
          const di = ((Math.round(dy) + yy) * self._w + Math.round(dx) + xx) * 4;
          const sa = (src.buf[si + 3] / 255) * this.globalAlpha;
          if (sa > 0) blend(self.buf, self._w, Math.round(dx) + xx, Math.round(dy) + yy, src.buf[si], src.buf[si + 1], src.buf[si + 2], sa);
        }
      }
    },
    getImageData(x, y, w, h) {
      const data = new Uint8ClampedArray(w * h * 4);
      for (let yy = 0; yy < h; yy++)
        for (let xx = 0; xx < w; xx++) {
          const si = ((y + yy) * self._w + (x + xx)) * 4;
          data.set(self.buf.subarray(si, si + 4), (yy * w + xx) * 4);
        }
      return { data, width: w, height: h };
    },
    putImageData(img, x, y) {
      for (let yy = 0; yy < img.height; yy++)
        for (let xx = 0; xx < img.width; xx++) {
          const si = (yy * img.width + xx) * 4;
          const di = ((y + yy) * self._w + (x + xx)) * 4;
          self.buf.set(img.data.subarray(si, si + 4), di);
        }
    },
  };
  return ctx;
}

function blend(buf, w, x, y, r, g, b, a) {
  const i = (y * w + x) * 4;
  const oa = buf[i + 3] / 255;
  const na = a + oa * (1 - a);
  if (na <= 0) return;
  buf[i] = (r * a + buf[i] * oa * (1 - a)) / na;
  buf[i + 1] = (g * a + buf[i + 1] * oa * (1 - a)) / na;
  buf[i + 2] = (b * a + buf[i + 2] * oa * (1 - a)) / na;
  buf[i + 3] = na * 255;
}

globalThis.window = {
  devicePixelRatio: 1,
  innerWidth: 960,
  innerHeight: 540,
  addEventListener() {},
  removeEventListener() {},
  setTimeout, clearTimeout, setInterval, clearInterval,
};
globalThis.document = { hidden: false, createElement: () => new StubCanvas(), addEventListener() {}, removeEventListener() {} };
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const { GameEngine } = require(path.join(process.cwd(), ".smoke-build/engine.js"));

const canvas = new StubCanvas(960, 540);
const cb = {
  onLevelUp() {}, onChest() {}, onEnd() {}, onBanner() {}, onToast() {},
  onAchievement() {}, onSeen() {}, onPauseChange() {},
};
const engine = new GameEngine(canvas, { characterId: "vesna", stageId: "graveyard", endless: false, callbacks: cb });
engine.keys.add("d");
engine.keys.add("w");
for (let f = 0; f < 720; f++) engine.update(1 / 60);
// sprinkle some gems and pickups naturally exist already; render frame
engine.render();

const rgb = Buffer.alloc(canvas.width * canvas.height * 3);
for (let i = 0, p = 0; i < canvas.buf.length; i += 4, p += 3) {
  const a = canvas.buf[i + 3] / 255;
  rgb[p] = canvas.buf[i] * a + 11 * (1 - a);
  rgb[p + 1] = canvas.buf[i + 1] * a + 15 * (1 - a);
  rgb[p + 2] = canvas.buf[i + 2] * a + 20 * (1 - a);
}
const ppmPath = path.join(process.cwd(), "scripts/scene.ppm");
fs.writeFileSync(ppmPath, Buffer.concat([Buffer.from(`P6\n${canvas.width} ${canvas.height}\n255\n`), rgb]));
console.log("enemies:", engine.enemies.length, "kills:", engine.kills, "time:", engine.time.toFixed(1), "level:", engine.level);
console.log("wrote", ppmPath);
