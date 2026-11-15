// Controlled lighting check: stationary player at frame center, full night.
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
  constructor(w = 0, h = 0) { this._w = w; this._h = h; this.buf = new Uint8Array(Math.max(1, w * h * 4)); this.path = null; this.gradient = null; }
  get width() { return this._w; }
  set width(v) { this._w = v; this.buf = new Uint8Array(Math.max(1, v * this._h * 4)); }
  get height() { return this._h; }
  set height(v) { this._h = v; this.buf = new Uint8Array(Math.max(1, this._w * v * 4)); }
  getContext() { return makeCtx(this); }
  getBoundingClientRect() { return { width: this._w, height: this._h, left: 0, top: 0 }; }
  addEventListener() {} removeEventListener() {}
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
function makeCtx(self) {
  return {
    fillStyle: "#000", strokeStyle: "#000", lineWidth: 1, globalAlpha: 1,
    globalCompositeOperation: "source-over", imageSmoothingEnabled: false, textAlign: "left", font: "10px mono",
    setTransform() {}, save() {}, restore() {}, translate() {}, scale() {}, rotate() {},
    beginPath() { self.path = null; self.gradient = null; },
    arc(x, y, r) { self.path = { type: "circle", x, y, r }; },
    ellipse(x, y, rx, ry) { self.path = { type: "ellipse", x, y, rx, ry }; },
    moveTo() {}, lineTo() {}, stroke() {}, strokeText() {}, fillText() {}, measureText: () => ({ width: 10 }),
    createPattern: () => ({}),
    createRadialGradient: () => { const g = { stops: [], addColorStop(o, c) { this.stops.push({ o, c }); } }; self.gradient = g; return g; },
    createLinearGradient: () => ({ addColorStop() {} }),
    rect() {},
    fillRect(x, y, w, h) {
      if (this.globalCompositeOperation === "destination-out") {
        for (let yy = Math.max(0, y); yy < Math.min(self._h, y + h); yy++)
          for (let xx = Math.max(0, x); xx < Math.min(self._w, x + w); xx++) self.buf[(yy * self._w + xx) * 4 + 3] = 0;
        return;
      }
      const c = parseColor(this.fillStyle);
      if (!c) return;
      const [r, g, b, a] = c;
      const alpha = (a / 255) * this.globalAlpha;
      for (let yy = Math.max(0, y); yy < Math.min(self._h, y + h); yy++)
        for (let xx = Math.max(0, x); xx < Math.min(self._w, x + w); xx++) blend(self.buf, self._w, xx, yy, r, g, b, alpha);
    },
    clearRect(x, y, w, h) { for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) self.buf.fill(0, (yy * self._w + xx) * 4, 4); },
    fill() {
      const p = self.path;
      if (!p) return;
      if (this.globalCompositeOperation === "destination-out" && p.type === "circle") {
        // stub limitation: typed-array indices must be integers (real canvas accepts floats)
        const px = Math.round(p.x), py = Math.round(p.y), pr = Math.round(p.r);
        const stops = (self.gradient?.stops ?? []).map((s) => ({ o: s.o, a: parseFloat((s.c.match(/[\d.]+\)$/) || ["1"])[0]) }));
        // precompute alpha per integer distance so we don't interpolate per pixel
        const lut = new Uint8Array(pr + 1);
        for (let d = 0; d <= pr; d++) {
          const t = d / pr;
          let a = stops.length ? stops[stops.length - 1].a : 1;
          for (let i = 0; i < stops.length - 1; i++) {
            if (t >= stops[i].o && t <= stops[i + 1].o) {
              const k = (t - stops[i].o) / (stops[i + 1].o - stops[i].o || 1);
              a = stops[i].a + (stops[i + 1].a - stops[i].a) * k;
              break;
            }
          }
          lut[d] = Math.round(a * 255);
        }
        for (let yy = Math.max(0, py - pr); yy < Math.min(self._h, py + pr); yy++) {
          for (let xx = Math.max(0, px - pr); xx < Math.min(self._w, px + pr); xx++) {
            const dist = Math.round(Math.hypot(xx - px, yy - py));
            if (dist > pr) continue;
            const idx = (yy * self._w + xx) * 4 + 3;
            self.buf[idx] = Math.max(0, self.buf[idx] * (1 - lut[dist] / 255));
          }
        }
        return;
      }
      const c = parseColor(this.fillStyle);
      if (!c) return;
      const [r, g, b, a] = c;
      const alpha = (a / 255) * this.globalAlpha;
      if (p.type === "circle" || p.type === "ellipse") {
        const rx = p.rx ?? p.r, ry = p.ry ?? p.r;
        for (let yy = Math.max(0, p.y - ry); yy < Math.min(self._h, p.y + ry); yy++)
          for (let xx = Math.max(0, p.x - rx); xx < Math.min(self._w, p.x + rx); xx++)
            if (((xx - p.x) / rx) ** 2 + ((yy - p.y) / ry) ** 2 <= 1) blend(self.buf, self._w, xx, yy, r, g, b, alpha);
      }
    },
    drawImage(src, dx, dy, dw, dh) {
      const sw = src.width, sh = src.height;
      dw = dw ?? sw; dh = dh ?? sh;
      for (let yy = 0; yy < dh; yy++) for (let xx = 0; xx < dw; xx++) {
        const sx = Math.min(sw - 1, Math.floor((xx / dw) * sw)), sy = Math.min(sh - 1, Math.floor((yy / dh) * sh));
        const si = (sy * sw + sx) * 4, di = ((Math.round(dy) + yy) * self._w + Math.round(dx) + xx) * 4;
        const sa = (src.buf[si + 3] / 255) * this.globalAlpha;
        if (sa > 0) blend(self.buf, self._w, Math.round(dx) + xx, Math.round(dy) + yy, src.buf[si], src.buf[si + 1], src.buf[si + 2], sa);
      }
    },
    getImageData(x, y, w, h) {
      const data = new Uint8ClampedArray(w * h * 4);
      for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
        const si = ((y + yy) * self._w + (x + xx)) * 4;
        data.set(self.buf.subarray(si, si + 4), (yy * w + xx) * 4);
      }
      return { data, width: w, height: h };
    },
    putImageData(img, x, y) {
      for (let yy = 0; yy < img.height; yy++) for (let xx = 0; xx < img.width; xx++) {
        const si = (yy * img.width + xx) * 4, di = ((y + yy) * self._w + (x + xx)) * 4;
        self.buf.set(img.data.subarray(si, si + 4), di);
      }
    },
  };
}
globalThis.window = { devicePixelRatio: 1, innerWidth: 960, innerHeight: 540, addEventListener() {}, removeEventListener() {}, setTimeout, clearTimeout, setInterval, clearInterval };
globalThis.document = { hidden: false, createElement: () => new StubCanvas(), addEventListener() {}, removeEventListener() {} };
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const { GameEngine } = require(path.join(process.cwd(), ".smoke-build/engine.js"));
const cb = { onLevelUp() {}, onChest() {}, onEnd() {}, onBanner() {}, onToast() {}, onAchievement() {}, onSeen() {}, onPauseChange() {} };
const canvas = new StubCanvas(960, 540);
const engine = new GameEngine(canvas, { characterId: "aldric", stageId: "library", endless: false, callbacks: cb });
// stationary: run 60 simulated seconds without input so camera centers and night falls
for (let f = 0; f < 3600; f++) { engine.hp = engine.maxHp; engine.update(1 / 60); }
engine.render();
// debug: inspect the lighting layer itself
const lc = engine.lightCanvas;
const lctx = engine.lightCtx;
const la = [];
for (let x = 40; x <= 920; x += 80) la.push(`${x}:${lc.buf[(270 * 960 + x) * 4 + 3]}`);
console.log("light-layer alpha at y=270:", la.join("  "));
// manual punch test on the retained context
lctx.globalCompositeOperation = "destination-out";
lctx.beginPath();
lctx.arc(100, 100, 30, 0, Math.PI * 2);
lctx.fillStyle = "#000";
lctx.fill();
console.log("manual punch alpha@100,100:", lc.buf[(100 * 960 + 100) * 4 + 3]);
console.log("retained ctx op after render:", lctx.globalCompositeOperation);
lctx.globalCompositeOperation = "source-over";
const psx = engine.px - engine.camX + 480;
const psy = engine.py - engine.camY + 270;
console.log("night time:", engine.time.toFixed(1), "player screen pos:", psx.toFixed(0), psy.toFixed(0), "world:", engine.px.toFixed(0), engine.py.toFixed(0));
const centerAlpha = lc.buf[(Math.round(psy) * 960 + Math.round(psx)) * 4 + 3];
console.log("light alpha at true player pos:", centerAlpha);

const rgb = Buffer.alloc(canvas.width * canvas.height * 3);
for (let i = 0, p = 0; i < canvas.buf.length; i += 4, p += 3) {
  const a = canvas.buf[i + 3] / 255;
  rgb[p] = canvas.buf[i] * a + 11 * (1 - a);
  rgb[p + 1] = canvas.buf[i + 1] * a + 15 * (1 - a);
  rgb[p + 2] = canvas.buf[i + 2] * a + 20 * (1 - a);
}
const ppmPath = path.join(process.cwd(), "scripts/light.ppm");
fs.writeFileSync(ppmPath, Buffer.concat([Buffer.from(`P6\n${canvas.width} ${canvas.height}\n255\n`), rgb]));
// report brightness gradient along a horizontal line through the player center
const y = 270;
const samples = [];
for (let x = 40; x <= 920; x += 80) {
  const i = (y * 960 + x) * 3;
  samples.push(`${x}:${Math.round((rgb[i] + rgb[i + 1] + rgb[i + 2]) / 3)}`);
}
console.log("brightness at y=270:", samples.join("  "));
console.log("wrote", ppmPath);
