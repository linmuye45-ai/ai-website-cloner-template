import * as Phaser from 'phaser';
import { RunSim, UPGRADE_BY_ID, type Input, type UpgradeId } from './sim/RunSim';
import { BANDS, PAL, PLAYER, T, TILE, VIEW, bandAt, toCss } from './sim/config';
import { MASK_SIZE, maskScale, paintLightMask } from './lightmask';
import { Synth } from './audio';

/**
 * Camera zoom. At 32px tiles this shows ~17x10 tiles, which is the framing a
 * side-scrolling action game needs — 1:1 made the avatar four pixels of noise.
 */
const ZOOM = 1.75;

const PX = 'VonwaonBitmap';
const MONO = 'ui-monospace, Menlo, Consolas, monospace';

function tileHash(x: number, y: number): number {
  let n = (x * 73856093) ^ (y * 19349663);
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function mixHex(a: number, b: number, t: number): number {
  // t must be clamped: extrapolating past the endpoints overflows each channel
  // and turns stone into bright yellow noise.
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const c = (x: number, y: number) => Math.max(0, Math.min(255, Math.round(x + (y - x) * k)));
  return (c(ar, br) << 16) | (c(ag, bg) << 8) | c(ab, bb);
}

export class ZhulongScene extends Phaser.Scene {
  private sim!: RunSim;
  private synth = new Synth();

  private gBack!: Phaser.GameObjects.Graphics;
  private gWorld!: Phaser.GameObjects.Graphics;
  private gActors!: Phaser.GameObjects.Graphics;
  private gFx!: Phaser.GameObjects.Graphics;
  private gHud!: Phaser.GameObjects.Graphics;
  private gVignette!: Phaser.GameObjects.Graphics;
  private light!: Phaser.GameObjects.Image;
  private ember!: Phaser.GameObjects.Image;
  private uiCam!: Phaser.Cameras.Scene2D.Camera;

  private tDepth!: Phaser.GameObjects.Text;
  private tBand!: Phaser.GameObjects.Text;
  private tLine!: Phaser.GameObjects.Text;
  private tHp!: Phaser.GameObjects.Text;
  private tSoul!: Phaser.GameObjects.Text;
  private tHint!: Phaser.GameObjects.Text;
  private tCombo!: Phaser.GameObjects.Text;

  private overlay?: Phaser.GameObjects.Container;
  private cards: { x: number; y: number; w: number; h: number }[] = [];
  private mode: 'title' | 'play' | 'shop' | 'dead' | 'none' = 'title';
  private pulse?: Phaser.Tweens.Tween;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private lastJump = false;
  private lastAttack = false;
  private lastParry = false;
  private lastInteract = false;

  private hudCache = { hp: -1, soul: -1, depth: -1, band: '', combo: -1 };
  private shakeT = 0;
  private lastBand = '';

  constructor() {
    super('Zhulong');
  }

  create(): void {
    this.sim = new RunSim();
    this.cameras.main.setBackgroundColor('#06040b');
    this.makeTextures();

    this.gBack = this.add.graphics().setDepth(-10);
    this.gWorld = this.add.graphics().setDepth(0);
    this.gActors = this.add.graphics().setDepth(10);
    this.gFx = this.add.graphics().setDepth(14).setBlendMode(Phaser.BlendModes.ADD);

    this.light = this.add.image(0, 0, 'zh-mask').setDepth(50).setBlendMode(Phaser.BlendModes.NORMAL);
    this.ember = this.add
      .image(0, 0, 'zh-ember')
      .setDepth(51)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.42);

    this.gHud = this.add.graphics().setDepth(60);
    this.gVignette = this.add.graphics().setDepth(59);

    const txt = (size: number, color: number, family = PX) => ({
      fontFamily: family,
      fontSize: `${size}px`,
      color: toCss(color),
    });

    this.tDepth = this.add.text(30, 20, '', txt(22, PAL.parch2)).setDepth(61);
    this.tBand = this.add.text(30, 48, '', txt(16, PAL.ember4)).setDepth(61);
    this.tLine = this.add
      .text(VIEW.w / 2, 24, '', txt(14, PAL.stone5))
      .setOrigin(0.5, 0)
      .setDepth(61);
    this.tHp = this.add.text(VIEW.w - 30, 20, '', txt(13, PAL.stone6)).setOrigin(1, 0).setDepth(61);
    this.tSoul = this.add.text(VIEW.w - 30, 44, '', txt(13, PAL.ember4)).setOrigin(1, 0).setDepth(61);
    this.tCombo = this.add
      .text(VIEW.w / 2, 92, '', txt(30, PAL.ember4))
      .setOrigin(0.5, 0)
      .setDepth(61);
    this.tHint = this.add
      .text(VIEW.w / 2, VIEW.h - 44, '', txt(14, PAL.stone5))
      .setOrigin(0.5)
      .setDepth(61);

    // Main camera shows the world at ZOOM; a second camera draws the UI at 1:1.
    const cam = this.cameras.main;
    cam.setZoom(ZOOM);
    this.uiCam = this.cameras.add(0, 0, VIEW.w, VIEW.h);
    this.uiCam.setZoom(1);
    this.uiCam.ignore([this.gBack, this.gWorld, this.gActors, this.gFx]);
    cam.ignore([this.light, this.ember, this.gHud, this.gVignette,
      this.tDepth, this.tBand, this.tLine, this.tHp, this.tSoul, this.tCombo, this.tHint]);

    const kb = this.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.keys = kb.addKeys({
        a: 'A', d: 'D', w: 'W', s: 'S', j: 'J', k: 'K', e: 'E',
        m: 'M', r: 'R', one: 'ONE', two: 'TWO', three: 'THREE',
        space: 'SPACE', enter: 'ENTER', esc: 'ESC',
      }) as Record<string, Phaser.Input.Keyboard.Key>;
    }
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onPointer(p));

    this.showTitle();
  }

  // ------------------------------------------------------------- textures

  private makeTextures(): void {
    if (!this.textures.exists('zh-mask')) {
      const tex = this.textures.createCanvas('zh-mask', MASK_SIZE, MASK_SIZE);
      if (tex) {
        paintLightMask(tex.getContext());
        tex.refresh();
      }
    }
    if (!this.textures.exists('zh-ember')) {
      const tex = this.textures.createCanvas('zh-ember', MASK_SIZE, MASK_SIZE);
      if (tex) {
        const ctx = tex.getContext();
        const c = MASK_SIZE / 2;
        const g = ctx.createRadialGradient(c, c, 0, c, c, c);
        g.addColorStop(0, 'rgba(255,233,168,0.42)');
        g.addColorStop(0.3, 'rgba(232,120,44,0.16)');
        g.addColorStop(0.65, 'rgba(168,69,30,0.04)');
        g.addColorStop(1, 'rgba(92,36,23,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, MASK_SIZE, MASK_SIZE);
        tex.refresh();
      }
    }
  }

  // -------------------------------------------------------------- overlays

  private clearOverlay(): void {
    this.pulse?.stop();
    this.pulse = undefined;
    this.overlay?.destroy(true);
    this.overlay = undefined;
    this.cards = [];
    this.mode = 'none';
  }

  private panel(x: number, y: number, w: number, h: number, accent: number = PAL.stone4): Phaser.GameObjects.Graphics {
    const g = this.add.graphics();
    g.fillStyle(PAL.ink, 0.95);
    g.fillRect(x, y, w, h);
    g.lineStyle(1, accent, 0.85);
    g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    g.lineStyle(3, accent, 1);
    const c = 14;
    g.beginPath();
    g.moveTo(x, y + c); g.lineTo(x, y); g.lineTo(x + c, y);
    g.moveTo(x + w - c, y); g.lineTo(x + w, y); g.lineTo(x + w, y + c);
    g.moveTo(x, y + h - c); g.lineTo(x, y + h); g.lineTo(x + c, y + h);
    g.moveTo(x + w - c, y + h); g.lineTo(x + w, y + h); g.lineTo(x + w, y + h - c);
    g.strokePath();
    return g;
  }

  private addToOverlay(c: Phaser.GameObjects.Container, ...objs: Phaser.GameObjects.GameObject[]): void {
    c.add(objs);
    this.uiCam.ignore(objs);
  }

  private showTitle(): void {
    this.clearOverlay();
    this.mode = 'title';
    const c = this.add.container(0, 0).setDepth(80);
    this.uiCam.ignore(c);

    const dim = this.add.graphics();
    dim.fillStyle(0x05030a, 0.94);
    dim.fillRect(0, 0, VIEW.w, VIEW.h);
    c.add(dim);

    const sig = this.add.graphics();
    for (let i = 0; i < 5; i += 1) {
      sig.lineStyle(1, PAL.ember2, 0.5 - i * 0.08);
      sig.strokeCircle(VIEW.w / 2, 208, 62 + i * 30);
    }
    sig.lineStyle(2, PAL.ember3, 0.85);
    sig.strokeCircle(VIEW.w / 2, 208, 50);
    sig.fillStyle(PAL.ember5, 0.85);
    sig.fillRect(VIEW.w / 2 - 4, 204, 8, 8);
    c.add(sig);

    c.add(this.add.text(VIEW.w / 2, 168, '烛 龙', {
      fontFamily: PX, fontSize: '72px', color: toCss(PAL.parch2),
    }).setOrigin(0.5));
    c.add(this.add.text(VIEW.w / 2, 258, 'Z H U L O N G', {
      fontFamily: MONO, fontSize: '15px', color: toCss(PAL.ember4),
    }).setOrigin(0.5));

    ['刀会忘。', '人不 会。'].forEach((line, i) => {
      c.add(this.add.text(VIEW.w / 2, 330 + i * 34, line, {
        fontFamily: PX, fontSize: '22px', color: toCss(PAL.stone5),
      }).setOrigin(0.5));
    });

    const controls: [string, string][] = [
      ['A / D', '行走'],
      ['W / 空格', '跃'],
      ['J', '挥刀 · 挖矿'],
      ['K', '弹反'],
      ['E', '火盆 · 存魂'],
    ];
    controls.forEach(([k, v], i) => {
      const y = 434 + i * 28;
      c.add(this.add.text(VIEW.w / 2 - 84, y, k, {
        fontFamily: MONO, fontSize: '13px', color: toCss(PAL.ember4),
      }).setOrigin(1, 0));
      c.add(this.add.text(VIEW.w / 2 - 62, y - 2, v, {
        fontFamily: PX, fontSize: '15px', color: toCss(PAL.stone5),
      }).setOrigin(0, 0));
    });

    const prompt = this.add.text(VIEW.w / 2, 620, '按 J 开始', {
      fontFamily: PX, fontSize: '24px', color: toCss(PAL.parch2),
    }).setOrigin(0.5);
    c.add(prompt);
    this.pulse = this.tweens.add({ targets: prompt, alpha: 0.3, duration: 900, yoyo: true, repeat: -1 });

    this.overlay = c;
  }

  private showShop(): void {
    this.clearOverlay();
    this.mode = 'shop';
    const c = this.add.container(0, 0).setDepth(80);
    this.uiCam.ignore(c);

    const dim = this.add.graphics();
    dim.fillStyle(0x05030a, 0.9);
    dim.fillRect(0, 0, VIEW.w, VIEW.h);
    c.add(dim);

    c.add(this.add.text(VIEW.w / 2, 82, '火 盆', {
      fontFamily: PX, fontSize: '34px', color: toCss(PAL.ember4),
    }).setOrigin(0.5));
    c.add(this.add.text(VIEW.w / 2, 126, `精魄 ${this.sim.banked}`, {
      fontFamily: PX, fontSize: '18px', color: toCss(PAL.parch1),
    }).setOrigin(0.5));
    c.add(this.add.text(VIEW.w / 2, 154, '存魂 · 淬体 · 再下潜', {
      fontFamily: PX, fontSize: '14px', color: toCss(PAL.stone4),
    }).setOrigin(0.5));

    const picks = this.sim.shopChoices;
    const cardW = 300;
    const cardH = 214;
    const gap = 32;
    const n = Math.max(1, picks.length);
    const totalW = n * cardW + (n - 1) * gap;
    const startX = (VIEW.w - totalW) / 2;
    const y = 206;

    picks.forEach((id: UpgradeId, i) => {
      const def = UPGRADE_BY_ID[id];
      const lvl = this.sim.levels[id];
      const cost = this.sim.costOf(id);
      const afford = this.sim.banked >= cost;
      const accent = afford ? PAL.ember3 : PAL.stone3;
      const x = startX + i * (cardW + gap);
      this.cards.push({ x, y, w: cardW, h: cardH });

      c.add(this.panel(x, y, cardW, cardH, accent));
      c.add(this.add.text(x + 22, y + 18, def.name, {
        fontFamily: MONO, fontSize: '17px', color: toCss(afford ? PAL.ember4 : PAL.stone4),
      }));
      c.add(this.add.text(x + cardW - 22, y + 22, `Lv ${lvl}/${def.max}`, {
        fontFamily: MONO, fontSize: '11px', color: toCss(PAL.stone4),
      }).setOrigin(1, 0));
      c.add(this.add.text(x + 22, y + 48, def.cn, {
        fontFamily: PX, fontSize: '34px', color: toCss(PAL.parch2),
      }));
      c.add(this.add.text(x + 22, y + 100, def.describe(lvl + 1), {
        fontFamily: PX, fontSize: '14px', color: toCss(PAL.stone5),
        wordWrap: { width: cardW - 44 },
      }));
      c.add(this.add.text(x + 22, y + cardH - 38, `${cost} 精魄`, {
        fontFamily: PX, fontSize: '16px', color: toCss(afford ? PAL.ember4 : PAL.red3),
      }));
      c.add(this.add.text(x + cardW - 22, y + cardH - 36, `[${i + 1}]`, {
        fontFamily: MONO, fontSize: '14px', color: toCss(PAL.stone4),
      }).setOrigin(1, 0));
    });

    if (picks.length === 0) {
      c.add(this.add.text(VIEW.w / 2, 300, '刀已到头。', {
        fontFamily: PX, fontSize: '20px', color: toCss(PAL.stone5),
      }).setOrigin(0.5));
    }

    c.add(this.add.text(VIEW.w / 2, y + cardH + 48, '按 E 离开火盆', {
      fontFamily: PX, fontSize: '15px', color: toCss(PAL.stone4),
    }).setOrigin(0.5));

    this.overlay = c;
  }

  private showDeath(): void {
    this.clearOverlay();
    this.mode = 'dead';
    const c = this.add.container(0, 0).setDepth(80);
    this.uiCam.ignore(c);

    const dim = this.add.graphics();
    dim.fillStyle(0x0a0206, 0.95);
    dim.fillRect(0, 0, VIEW.w, VIEW.h);
    c.add(dim);

    c.add(this.add.text(VIEW.w / 2, 138, '网 断 了', {
      fontFamily: PX, fontSize: '48px', color: toCss(PAL.red3),
    }).setOrigin(0.5));
    c.add(this.add.text(VIEW.w / 2, 200, 'THE THREAD SNAPPED', {
      fontFamily: MONO, fontSize: '12px', color: toCss(PAL.stone4),
    }).setOrigin(0.5));

    const s = this.sim;
    const rows: [string, string][] = [
      ['深度', `${s.depthMetres} m`],
      ['斩敌', String(s.kills)],
      ['完美弹反', String(s.perfects)],
      ['掘矿', String(s.mined)],
      ['存入火盆', String(s.banked)],
      ['遗失', String(s.essence)],
    ];
    rows.forEach(([k, v], i) => {
      const y = 262 + i * 36;
      c.add(this.add.text(VIEW.w / 2 - 160, y, k, {
        fontFamily: PX, fontSize: '16px', color: toCss(PAL.stone4),
      }));
      c.add(this.add.text(VIEW.w / 2 + 160, y - 2, v, {
        fontFamily: PX, fontSize: '18px', color: toCss(PAL.parch1),
      }).setOrigin(1, 0));
    });

    c.add(this.add.text(VIEW.w / 2, 500, '精魄留在原地。刀留下。', {
      fontFamily: PX, fontSize: '16px', color: toCss(PAL.stone5),
    }).setOrigin(0.5));

    const prompt = this.add.text(VIEW.w / 2, 566, '按 R 重来', {
      fontFamily: PX, fontSize: '22px', color: toCss(PAL.parch2),
    }).setOrigin(0.5);
    c.add(prompt);
    this.pulse = this.tweens.add({ targets: prompt, alpha: 0.3, duration: 900, yoyo: true, repeat: -1 });

    this.overlay = c;
  }

  // ---------------------------------------------------------------- input

  private onPointer(p: Phaser.Input.Pointer): void {
    this.synth.unlock();
    if (this.mode === 'title' || this.mode === 'dead') {
      this.beginRun();
      return;
    }
    if (this.mode === 'shop') {
      const x = p.x;
      const y = p.y;
      for (let i = 0; i < this.cards.length; i += 1) {
        const r = this.cards[i];
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
          this.tryBuy(i);
          return;
        }
      }
    }
  }

  private beginRun(): void {
    this.synth.unlock();
    this.clearOverlay();
    this.sim = new RunSim();
    this.sim.start();
    this.mode = 'play';
    this.lastBand = '';
    this.hudCache.band = '';
    this.snapCamera();
  }

  private snapCamera(): void {
    const cam = this.cameras.main;
    const viewW = VIEW.w / ZOOM;
    const viewH = VIEW.h / ZOOM;
    cam.scrollX = Phaser.Math.Clamp(this.sim.px - viewW / 2, 0, this.sim.world.w * TILE - viewW);
    cam.scrollY = Phaser.Math.Clamp(this.sim.py - viewH / 2, 0, this.sim.world.h * TILE - viewH);
  }

  private tryBuy(i: number): void {
    const id = this.sim.shopChoices[i];
    if (!id) return;
    if (this.sim.buy(id)) {
      this.synth.buyTone();
      this.showShop();
    } else {
      this.synth.uiMove();
    }
  }

  private readInput(): Input {
    const k = this.keys;
    const left = Boolean(this.cursors?.left.isDown || k?.a.isDown);
    const right = Boolean(this.cursors?.right.isDown || k?.d.isDown);
    const jump = Boolean(this.cursors?.up.isDown || k?.w.isDown || k?.space.isDown);
    const jumpNow = jump && !this.lastJump;
    this.lastJump = jump;
    const attack = Boolean(k?.j.isDown);
    const attackNow = attack && !this.lastAttack;
    this.lastAttack = attack;
    const parry = Boolean(k?.k.isDown);
    const parryNow = parry && !this.lastParry;
    this.lastParry = parry;
    const interact = Boolean(k?.e.isDown);
    const interactNow = interact && !this.lastInteract;
    this.lastInteract = interact;
    return {
      left, right, jump, jumpPressed: jumpNow,
      attack, attackPressed: attackNow, parryPressed: parryNow,
      interactPressed: interactNow,
    };
  }

  // ---------------------------------------------------------------- update

  update(_t: number, delta: number): void {
    const dt = Math.min(delta / 1000, 0.05);
    this.synth.unlock();

    if (this.keys?.m && Phaser.Input.Keyboard.JustDown(this.keys.m)) {
      this.synth.setMuted(!this.synth.isMuted);
    }

    if (this.mode === 'title') {
      if ((this.keys?.j && Phaser.Input.Keyboard.JustDown(this.keys.j)) ||
          (this.keys?.enter && Phaser.Input.Keyboard.JustDown(this.keys.enter)) ||
          (this.keys?.space && Phaser.Input.Keyboard.JustDown(this.keys.space))) {
        this.beginRun();
      }
    } else if (this.mode === 'dead') {
      if ((this.keys?.r && Phaser.Input.Keyboard.JustDown(this.keys.r)) ||
          (this.keys?.j && Phaser.Input.Keyboard.JustDown(this.keys.j))) {
        this.beginRun();
      }
    } else if (this.mode === 'shop') {
      if (this.keys?.one && Phaser.Input.Keyboard.JustDown(this.keys.one)) this.tryBuy(0);
      else if (this.keys?.two && Phaser.Input.Keyboard.JustDown(this.keys.two)) this.tryBuy(1);
      else if (this.keys?.three && Phaser.Input.Keyboard.JustDown(this.keys.three)) this.tryBuy(2);
      if ((this.keys?.e && Phaser.Input.Keyboard.JustDown(this.keys.e)) ||
          (this.keys?.esc && Phaser.Input.Keyboard.JustDown(this.keys.esc))) {
        this.sim.closeShop();
        this.clearOverlay();
        this.mode = 'play';
      }
    } else if (this.mode === 'play') {
      this.sim.update(dt, this.readInput());
      this.consumeEvents();
      if (this.sim.status === 'shop') this.showShop();
      else if (this.sim.status === 'dead') this.showDeath();
    }

    this.draw(dt);
  }

  private consumeEvents(): void {
    for (const ev of this.sim.takeEvents()) {
      switch (ev.type) {
        case 'perfect':
          this.synth.parry();
          this.shakeT = 0.16;
          this.cameras.main.flash(90, 80, 200, 180);
          break;
        case 'parry': this.synth.sword(); break;
        case 'hurt':
          this.synth.hurt();
          this.shakeT = 0.22;
          this.cameras.main.flash(110, 120, 20, 30);
          break;
        case 'kill': this.synth.kill(); break;
        case 'mine': this.synth.ore(); break;
        case 'bank': this.synth.bankTone(); break;
        case 'vein':
          this.synth.ore();
          this.shakeT = 0.1;
          break;
        case 'death':
          this.synth.death();
          this.cameras.main.shake(420, 0.012);
          break;
        default: break;
      }
    }
  }

  // ------------------------------------------------------------------ draw

  private draw(dt: number): void {
    const cam = this.cameras.main;
    const sim = this.sim;
    const viewW = VIEW.w / ZOOM;
    const viewH = VIEW.h / ZOOM;
    const targetX = Phaser.Math.Clamp(sim.px - viewW / 2, 0, sim.world.w * TILE - viewW);
    const targetY = Phaser.Math.Clamp(sim.py - viewH / 2, 0, sim.world.h * TILE - viewH);
    const ease = this.mode === 'title' ? 0.14 : Math.min(1, dt * 9);
    cam.scrollX += (targetX - cam.scrollX) * ease;
    cam.scrollY += (targetY - cam.scrollY) * ease;

    if (this.shakeT > 0) {
      this.shakeT -= dt;
      cam.shake(60, 0.004);
    }

    this.drawBackdrop();
    this.drawWorld();
    this.drawActors();
    this.drawFx();

    // Screen-space position of the player, for the UI-camera lighting.
    const sx = (sim.px - cam.scrollX) * ZOOM;
    const sy = (sim.py - cam.scrollY) * ZOOM;
    const scale = maskScale(sim.lightRadius, VIEW.w, VIEW.h);
    this.light.setPosition(sx, sy).setScale(scale);
    this.ember
      .setPosition(sx, sy)
      .setScale(Math.max(1.1, sim.lightRadius / 210))
      .setAlpha(0.34 + Math.sin(this.time.now / 260) * 0.05);

    this.drawHud();
  }

  /**
   * Parallax backdrop. Without it the caves read as a black void and the whole
   * frame feels empty; with it the shaft has depth and a sense of age.
   *
   * Layers move at 0.25x / 0.55x of camera scroll. Because the main camera is
   * zoomed, an anchor at world coordinate `a` must be drawn at
   * `a + scroll * (1 - factor)` to land at the right screen position.
   */
  private drawBackdrop(): void {
    const g = this.gBack;
    g.clear();
    const cam = this.cameras.main;
    const sim = this.sim;
    const viewW = VIEW.w / ZOOM;
    const viewH = VIEW.h / ZOOM;
    const band = bandAt(Math.floor(sim.py / TILE));

    const far = (wx: number) => wx + cam.scrollX * 0.75;
    const near = (wx: number) => wx + cam.scrollX * 0.45;
    const farY = (wy: number) => wy + cam.scrollY * 0.75;
    const nearY = (wy: number) => wy + cam.scrollY * 0.45;

    // Base wash so the void is a deep stone colour, not dead black.
    g.fillStyle(mixHex(0x06040b, band.wallDark, 0.35), 1);
    g.fillRect(cam.scrollX - 4, cam.scrollY - 4, viewW + 8, viewH + 8);

    const top = Math.floor((cam.scrollY * 0.25) / 64) * 64;
    const rows = Math.ceil(viewH / 64) + 6;

    // --- far layer: distant masonry, dim enough to stay behind the action ---
    const farBase = mixHex(band.wallDark, PAL.ink, 0.72);
    for (let r = 0; r < rows; r += 1) {
      const wy = top + r * 64;
      const h = tileHash(7, Math.floor(wy / 64));
      if (h < 0.4) continue;
      const py = farY(wy);
      // A wide slab with horizontal mortar courses reads as ancient wall.
      const px = far(cam.scrollX - 200);
      g.fillStyle(farBase, 0.55);
      g.fillRect(px, py, viewW + 400, 56);
      g.fillStyle(mixHex(farBase, PAL.stone4, 0.16), 0.4);
      g.fillRect(px, py, viewW + 400, 2);
      g.fillStyle(mixHex(farBase, PAL.ink, 0.5), 0.5);
      g.fillRect(px, py + 54, viewW + 400, 2);
      // Vertical joints, offset per course so it never lines up into stripes.
      const off = (h * 97) % 60;
      for (let vx = 0; vx < viewW + 400; vx += 60) {
        g.fillStyle(mixHex(farBase, PAL.ink, 0.4), 0.35);
        g.fillRect(px + vx + off, py + 4, 2, 48);
      }
    }

    // --- arch silhouettes: sparse, large, very dim. Adds scale, not noise. ---
    for (let r = 0; r < Math.ceil(rows / 3); r += 1) {
      const wy = top + r * 192;
      const h = tileHash(23, Math.floor(wy / 192));
      if (h < 0.55) continue;
      const px = far(cam.scrollX + ((h * 811) % Math.max(1, viewW))) ;
      const py = farY(wy);
      const w = 120 + h * 90;
      g.fillStyle(mixHex(band.wallDark, PAL.ink, 0.62), 0.5);
      g.fillRect(px, py, w, 170);
      g.fillStyle(mixHex(0x06040b, band.wallDark, 0.2), 0.85);
      g.fillRect(px + 14, py + 34, w - 28, 136);
    }

    // --- near layer: hanging chains and roots ---
    for (let r = 0; r < rows; r += 1) {
      const wy = top + r * 64;
      const h = tileHash(13, Math.floor(wy / 64));
      if (h < 0.62) continue;
      const x = (((h * 613) % 13) - 6) * 74;
      const px = near(cam.scrollX + viewW / 2 + x);
      const py = nearY(wy);
      const len = 80 + h * 260;
      const col = mixHex(band.wall, PAL.ink, 0.7);
      g.fillStyle(col, 0.75);
      g.fillRect(px, py, 3, len);
      for (let k = 0; k < len; k += 14) {
        g.fillStyle(mixHex(col, PAL.stone5, 0.18), 0.6);
        g.fillRect(px - 2, py + k, 7, 4);
      }
    }

    // --- ambient motes: drifting embers that sell depth ---
    const t = this.time.now / 1000;
    for (let i = 0; i < 26; i += 1) {
      const seed = tileHash(i, Math.floor(sim.py / 400));
      const px = cam.scrollX + ((seed * 7331 + t * (6 + seed * 14)) % (viewW + 40)) - 20;
      const py = cam.scrollY + (((seed * 4217 + t * (10 + seed * 9)) % (viewH + 40)) - 20);
      g.fillStyle(PAL.ember2, 0.18 + seed * 0.22);
      g.fillRect(px, py, 2, 2);
    }
  }

  private drawWorld(): void {
    const g = this.gWorld;
    g.clear();
    const cam = this.cameras.main;
    const sim = this.sim;
    const world = sim.world;

    const viewW = VIEW.w / ZOOM;
    const viewH = VIEW.h / ZOOM;
    const x0 = Math.max(0, Math.floor(cam.scrollX / TILE) - 1);
    const x1 = Math.min(world.w - 1, Math.ceil((cam.scrollX + viewW) / TILE) + 1);
    const y0 = Math.max(0, Math.floor(cam.scrollY / TILE) - 1);
    const y1 = Math.min(world.h - 1, Math.ceil((cam.scrollY + viewH) / TILE) + 1);
    const pulse = 0.72 + Math.sin(this.time.now / 340) * 0.28;

    // Deep backdrop so the shaft reads as a void, not empty canvas.
    g.fillStyle(0x06040b, 1);
    g.fillRect(cam.scrollX - 8, cam.scrollY - 8, viewW + 16, viewH + 16);

    for (let ty = y0; ty <= y1; ty += 1) {
      const band = bandAt(ty);
      for (let tx = x0; tx <= x1; tx += 1) {
        const i = ty * world.w + tx;
        const tile = world.tiles[i];
        if (tile === T.AIR) continue;
        const px = tx * TILE;
        const py = ty * TILE;

        if (tile === T.ORE || tile === T.ORE_RICH) {
          const rich = tile === T.ORE_RICH;
          const base = rich ? PAL.ember3 : PAL.teal4;
          const hot = rich ? PAL.ember5 : PAL.teal6;
          // Rock shell with a crystal cluster embedded in it.
          g.fillStyle(mixHex(base, PAL.ink, 0.62), 1);
          g.fillRect(px, py, TILE, TILE);
          g.fillStyle(mixHex(base, PAL.ink, 0.35), 1);
          g.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
          const h = tileHash(tx, ty);
          const cw = 6 + Math.floor(h * 5);
          const cx = px + 5 + Math.floor(h * 12);
          g.fillStyle(base, 0.95);
          g.fillRect(cx, py + 6, cw, TILE - 12);
          g.fillStyle(hot, 0.75 + pulse * 0.25);
          g.fillRect(cx + 1, py + 9, Math.max(2, cw - 4), TILE - 20);
          g.fillStyle(0xffffff, 0.35 * pulse);
          g.fillRect(cx + 1, py + 9, 2, TILE - 20);
          g.fillStyle(mixHex(base, PAL.ink, 0.5), 1);
          g.fillRect(px, py + TILE - 3, TILE, 3);
          g.fillRect(px + TILE - 3, py, 3, TILE);
          continue;
        }

        if (tile === T.BRAZIER) {
          g.fillStyle(PAL.stone1, 1);
          g.fillRect(px + 3, py + 11, TILE - 6, TILE - 13);
          g.fillStyle(PAL.metal3, 1);
          g.fillRect(px + 4, py + 12, TILE - 8, 4);
          g.fillStyle(PAL.ember2, 1);
          g.fillRect(px + 6, py + 14, TILE - 12, TILE - 18);
          g.fillStyle(PAL.ember3, 0.95);
          g.fillRect(px + 8, py + 16, TILE - 16, TILE - 22);
          g.fillStyle(PAL.ember5, pulse);
          g.fillRect(px + 12, py + 18, TILE - 24, TILE - 28);
          g.lineStyle(1, PAL.ember4, 0.5 * pulse);
          g.strokeRect(px + 2.5, py + 10.5, TILE - 5, TILE - 12);
          continue;
        }

        if (tile === T.BEDROCK) {
          g.fillStyle(0x0a0812, 1);
          g.fillRect(px, py, TILE, TILE);
          g.fillStyle(0x120e1c, 1);
          g.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
          continue;
        }

        // --- stone ---
        // No per-tile outline: outlining every cell turns the wall into a
        // spreadsheet. Shape comes from big soft gradients plus lit faces,
        // which is what makes rock read as rock.
        const h = tileHash(tx, ty);
        const deep = tile === T.DEEP;
        let base = deep ? band.wallDark : band.wall;

        // Low-frequency value noise (~8 tiles) gives large lit and dark masses.
        const big = tileHash(Math.floor(tx / 8), Math.floor(ty / 8));
        const mid = tileHash(Math.floor(tx / 3), Math.floor(ty / 3));
        base = mixHex(base, PAL.stone6, 0.42 + (big - 0.5) * 0.55 + (mid - 0.5) * 0.2);
        // Very light per-tile jitter only: heavier values re-introduce a grid.
        base = mixHex(base, PAL.ink, h * 0.07);

        g.fillStyle(base, 1);
        g.fillRect(px, py, TILE, TILE);

        // Grain: sparse flecks, never on a grid.
        if (h > 0.55) {
          g.fillStyle(mixHex(base, PAL.ink, 0.28), 1);
          g.fillRect(px + 4 + Math.floor(h * 20), py + 6 + Math.floor(mid * 16), 3, 2);
        }
        if (big > 0.66 && h > 0.3) {
          g.fillStyle(mixHex(base, PAL.stone7, 0.16), 1);
          g.fillRect(px + 2 + Math.floor(mid * 22), py + 3 + Math.floor(h * 20), 2, 3);
        }

        // Lit lip only where the tile above is open — this is the platform edge.
        if (world.tiles[i - world.w] === T.AIR) {
          g.fillStyle(mixHex(base, PAL.stone7, 0.62), 1);
          g.fillRect(px, py, TILE, 3);
          g.fillStyle(mixHex(base, PAL.stone6, 0.22), 1);
          g.fillRect(px, py + 3, TILE, 3);
        }
        // Shadow under overhangs.
        if (world.tiles[i + world.w] === T.AIR) {
          g.fillStyle(mixHex(base, PAL.ink, 0.7), 1);
          g.fillRect(px, py + TILE - 4, TILE, 4);
        }
        // Side faces in contact with air get a rim, which outlines cave shapes
        // without outlining individual tiles.
        if (world.tiles[i - 1] === T.AIR) {
          g.fillStyle(mixHex(base, PAL.stone6, 0.3), 1);
          g.fillRect(px, py, 2, TILE);
        }
        if (world.tiles[i + 1] === T.AIR) {
          g.fillStyle(mixHex(base, PAL.ink, 0.45), 1);
          g.fillRect(px + TILE - 2, py, 2, TILE);
        }

        const wear = world.wear[i];
        if (wear > 0) {
          g.lineStyle(1, PAL.ink, 0.5 + wear * 0.15);
          g.beginPath();
          g.moveTo(px + 5, py + 6);
          g.lineTo(px + TILE - 7, py + TILE - 8);
          if (wear > 1) {
            g.moveTo(px + TILE - 6, py + 5);
            g.lineTo(px + 7, py + TILE - 7);
          }
          g.strokePath();
        }
      }
    }

    // Rising tide.
    const tideY = sim.miasmaY;
    if (tideY > cam.scrollY - 200 && tideY < cam.scrollY + viewH + 200) {
      const t = 0.75 + Math.sin(this.time.now / 220) * 0.25;
      g.fillStyle(PAL.red1, 0.45);
      g.fillRect(cam.scrollX - 8, tideY - 420, viewW + 16, 420);
      g.fillStyle(PAL.red2, 0.35);
      g.fillRect(cam.scrollX - 8, tideY - 120, viewW + 16, 120);
      g.fillStyle(PAL.red3, 0.85 * t);
      g.fillRect(cam.scrollX - 8, tideY - 3, viewW + 16, 5);
    }
  }

  private drawActors(): void {
    const g = this.gActors;
    g.clear();
    const sim = this.sim;

    for (const e of sim.enemies) {
      const windup = e.state === 'windup';
      const strike = e.state === 'strike';
      const stagger = e.state === 'stagger';
      const body = stagger
        ? PAL.stone5
        : e.flash > 0
          ? PAL.parch2
          : e.kind === 'lancer'
            ? PAL.red3
            : e.kind === 'lantern'
              ? PAL.ember3
              : PAL.red2;

      if (windup) {
        const prog = 1 - Math.max(0, e.t) / 0.5;
        g.lineStyle(2, PAL.red4, 0.35 + prog * 0.6);
        const r = 30 + prog * 26;
        const a0 = e.facing > 0 ? -0.9 : Math.PI - 0.9;
        g.beginPath();
        g.arc(e.x, e.y, r, a0, a0 + 1.8, false);
        g.strokePath();
      }

      if (e.kind === 'lantern') {
        // Floating lantern: chained orb, glows, no legs.
        const bob = Math.sin(this.time.now / 420 + e.id) * 3;
        g.fillStyle(PAL.ink, 1);
        g.fillRect(e.x - 1, e.y - 56 + bob, 2, 22);
        g.fillStyle(PAL.stone4, 1);
        g.fillRect(e.x - 16, e.y - 34 + bob, 32, 40);
        g.fillStyle(PAL.ember2, 1);
        g.fillRect(e.x - 12, e.y - 30 + bob, 24, 32);
        g.fillStyle(PAL.ember3, 1);
        g.fillRect(e.x - 8, e.y - 26 + bob, 16, 24);
        g.fillStyle(PAL.ember5, 0.9);
        g.fillRect(e.x - 4, e.y - 20 + bob, 8, 12);
        g.fillStyle(PAL.stone5, 1);
        g.fillRect(e.x - 18, e.y - 36 + bob, 36, 5);
        g.fillRect(e.x - 18, e.y + 4 + bob, 36, 5);
      } else if (e.kind === 'lancer') {
        // Tall, thin, carries a long spear: threat reads at a distance.
        g.fillStyle(PAL.ink, 1);
        g.fillRect(e.x - 11, e.y - 34, 22, 68);
        g.fillStyle(body, 1);
        g.fillRect(e.x - 8, e.y - 31, 16, 62);
        g.fillStyle(mixHex(body, PAL.ink, 0.5), 1);
        g.fillRect(e.x - 8, e.y + 8, 16, 23);
        g.fillStyle(PAL.metal3, 1);
        g.fillRect(e.x + (e.facing > 0 ? 6 : -52), e.y - 16, 46, 3);
        g.fillStyle(PAL.metal4, 1);
        g.fillRect(e.x + (e.facing > 0 ? 48 : -56), e.y - 17, 8, 5);
        g.fillStyle(PAL.ember5, 1);
        g.fillRect(e.x + e.facing * 6 - 2, e.y - 27, 5, 5);
      } else {
        // Wraith: hunched, wide shoulders, dragging arms.
        const hh = 24;
        g.fillStyle(PAL.ink, 1);
        g.fillRect(e.x - 18, e.y - hh - 3, 36, hh * 2 + 6);
        g.fillStyle(body, 1);
        g.fillRect(e.x - 14, e.y - hh, 28, hh * 2);
        g.fillStyle(mixHex(body, PAL.ink, 0.45), 1);
        g.fillRect(e.x - 14, e.y + hh * 0.4, 28, hh * 0.6);
        g.fillStyle(mixHex(body, PAL.parch2, 0.3), 1);
        g.fillRect(e.x - 14, e.y - hh, 28, 5);
        g.fillStyle(PAL.ink, 1);
        g.fillRect(e.x - 22, e.y - 12, 8, 22);
        g.fillRect(e.x + 14, e.y - 12, 8, 22);
        g.fillStyle(PAL.ember5, 1);
        g.fillRect(e.x + e.facing * 6 - 2, e.y - 14, 5, 5);
      }

      if (strike) {
        const tip = e.facing > 0 ? e.x + 14 : e.x - 44;
        g.fillStyle(PAL.parch2, 0.95);
        g.fillRect(tip, e.y - 6, 30, 12);
        g.fillStyle(PAL.ember5, 0.7);
        g.fillRect(tip + (e.facing > 0 ? 18 : 0), e.y - 3, 6, 6);
      }

      g.fillStyle(stagger ? PAL.stone3 : PAL.ember5, stagger ? 0.5 : 1);
      g.fillRect(e.x + e.facing * 6 - 2, e.y - 12, 5, 5);

      if (e.hp < e.maxHp) {
        const w = 32;
        const top = e.y - (e.kind === 'lantern' ? 44 : e.kind === 'lancer' ? 40 : 30);
        g.fillStyle(PAL.ink, 0.85);
        g.fillRect(e.x - w / 2, top, w, 4);
        g.fillStyle(PAL.red4, 1);
        g.fillRect(e.x - w / 2, top, (w * e.hp) / e.maxHp, 4);
      }
    }

    const px = sim.px;
    const py = sim.py;
    const blink = sim.iframes > 0 && Math.floor(this.time.now / 60) % 2 === 0 ? 0.45 : 1;

    if (sim.parryT > 0) {
      g.lineStyle(3, PAL.teal6, 0.9);
      g.strokeCircle(px, py, 54 + (1 - sim.parryT / 0.2) * 26);
      g.fillStyle(PAL.teal5, 0.14);
      g.fillCircle(px, py, 60);
    }

    // Cloak silhouette with a real walk cycle. Legs alternate on a cadence
    // driven by horizontal speed, so the avatar never slides statically.
    const moving = Math.abs(sim.vx) > 12 && sim.onGround;
    const phase = sim.time * 11;
    const stride = moving ? Math.sin(phase) : 0;
    const lift = sim.onGround ? 0 : 3;
    const sway = moving ? Math.sin(phase) * 2 : Math.sin(this.time.now / 700) * 1.2;

    // Legs first (behind the cloak).
    g.fillStyle(PAL.ink, blink);
    g.fillRect(px - 10 + stride * 4, py + 20, 9, 13 + lift);
    g.fillRect(px + 1 - stride * 4, py + 20, 9, 13 + lift);
    g.fillStyle(PAL.teal1, blink);
    g.fillRect(px - 8 + stride * 4, py + 22, 6, 9 + lift);
    g.fillRect(px + 3 - stride * 4, py + 22, 6, 9 + lift);

    // Cloak: dark frame, teal body, lit shoulder.
    g.fillStyle(PAL.ink, blink);
    g.fillRect(px - 17 + sway, py - 31, 34, 58);
    g.fillStyle(PAL.teal2, blink);
    g.fillRect(px - 14 + sway, py - 28, 28, 52);
    g.fillStyle(PAL.teal3, blink);
    g.fillRect(px - 14 + sway, py - 28, 28, 34);
    g.fillStyle(PAL.teal5, blink);
    g.fillRect(px - 14 + sway, py - 28, 28, 9);
    g.fillStyle(PAL.teal6, blink);
    g.fillRect(px + (sim.facing > 0 ? 9 : -11) + sway, py - 25, 2, 16);
    // Torn hem.
    g.fillStyle(PAL.teal1, blink);
    g.fillRect(px - 14 + sway, py + 14, 9, 12);
    g.fillRect(px + 1 + sway, py + 18, 12, 8);

    // Off-hand arm, swinging opposite the stride.
    g.fillStyle(PAL.teal1, blink);
    g.fillRect(px - (sim.facing > 0 ? 20 : -12) - stride * 3, py - 14, 8, 20);

    // Hood + shadowed face + eye slit.
    g.fillStyle(PAL.ink, blink);
    g.fillRect(px - 13 + sway, py - 46, 26, 20);
    g.fillStyle(PAL.teal1, blink);
    g.fillRect(px - 9 + sway, py - 42, 18, 13);
    g.fillStyle(PAL.parch1, blink);
    g.fillRect(px + (sim.facing > 0 ? 2 : -6) + sway, py - 37, 4, 4);

    // Blade held at rest, angled with facing.
    g.fillStyle(PAL.ink, blink);
    g.fillRect(px + (sim.facing > 0 ? 13 : -19), py - 8, 6, 28);
    g.fillStyle(PAL.metal3, blink);
    g.fillRect(px + (sim.facing > 0 ? 14 : -18), py - 6, 4, 24);
    g.fillStyle(PAL.metal4, blink);
    g.fillRect(px + (sim.facing > 0 ? 14 : -18), py - 6, 4, 5);

    if (sim.attackT > 0) {
      const prog = 1 - sim.attackT / PLAYER.attackDur;
      const a0 = sim.facing > 0 ? -1.15 : Math.PI - 0.55;
      g.lineStyle(5, PAL.parch2, 0.9 * (1 - prog));
      g.beginPath();
      g.arc(px, py, sim.reach * 0.85, a0, a0 + 1.7 * (0.4 + prog), false);
      g.strokePath();
      g.lineStyle(2, PAL.ember5, 0.6 * (1 - prog));
      g.beginPath();
      g.arc(px, py, sim.reach * 0.85 + 6, a0, a0 + 1.7 * (0.4 + prog), false);
      g.strokePath();
    }
  }

  private drawFx(): void {
    const g = this.gFx;
    g.clear();
    const sim = this.sim;

    for (const p of sim.particles) {
      const a = Math.max(0, p.life / p.maxLife);
      g.fillStyle(p.color, a * 0.9);
      g.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }

    for (const v of sim.veinFlashes) {
      const a = v.life / 0.85;
      g.lineStyle(2, PAL.ember5, a);
      g.strokeRect(v.x * TILE - 2, v.y * TILE - 2, TILE + 4, TILE + 4);
      g.fillStyle(PAL.ember5, a * 0.22);
      g.fillRect(v.x * TILE, v.y * TILE, TILE, TILE);
    }
  }

  private drawHud(): void {
    const g = this.gHud;
    g.clear();
    const sim = this.sim;
    if (this.mode === 'title') return;

    const hpPct = Phaser.Math.Clamp(sim.hp / sim.maxHp, 0, 1);
    const barW = 240;
    const bx = VIEW.w - 30 - barW;
    g.fillStyle(PAL.ink, 0.88);
    g.fillRect(bx, 64, barW, 10);
    const hpColor = hpPct > 0.5 ? PAL.red4 : hpPct > 0.25 ? PAL.ember3 : PAL.red3;
    g.fillStyle(hpColor, 1);
    g.fillRect(bx, 64, barW * hpPct, 10);
    g.lineStyle(1, PAL.stone3, 0.85);
    g.strokeRect(bx + 0.5, 64.5, barW - 1, 9);

    // Depth ruler.
    const top = 96;
    const hgt = VIEW.h - 200;
    g.fillStyle(PAL.stone2, 0.75);
    g.fillRect(12, top, 3, hgt);
    const markerY = top + hgt * Phaser.Math.Clamp(sim.depthMetres / 1200, 0, 1);
    g.fillStyle(PAL.ember4, 1);
    g.fillRect(7, markerY - 2, 13, 5);
    for (const b of BANDS) {
      if (b.from === 0) continue;
      g.fillStyle(PAL.stone3, 0.9);
      g.fillRect(12, top + hgt * Phaser.Math.Clamp(b.from / 1200, 0, 1), 3, 1);
    }
    const tideNorm = Phaser.Math.Clamp(sim.miasmaRow / 1200, 0, 1);
    if (tideNorm > 0) {
      g.fillStyle(PAL.red3, 0.8);
      g.fillRect(10, top + hgt * tideNorm, 7, 3);
    }

    const c = this.hudCache;
    if (c.hp !== Math.ceil(sim.hp)) {
      c.hp = Math.ceil(sim.hp);
      this.tHp.setText(`${Math.max(0, Math.ceil(sim.hp))} / ${sim.maxHp}`);
    }
    if (c.soul !== sim.essence + sim.banked) {
      c.soul = sim.essence + sim.banked;
      this.tSoul.setText(`精魄 ${sim.essence} · 盆 ${sim.banked}`);
    }
    if (c.depth !== sim.depthMetres) {
      c.depth = sim.depthMetres;
      this.tDepth.setText(`${sim.depthMetres} m`);
    }
    if (c.combo !== sim.hitCombo) {
      c.combo = sim.hitCombo;
      this.tCombo.setText(sim.hitCombo >= 3 ? `${sim.hitCombo} 连` : '');
    }
    const band = sim.band;
    if (c.band !== band.name) {
      c.band = band.name;
      this.tBand.setText(band.name);
      if (this.lastBand && this.lastBand !== band.name) this.synth.descend();
      this.lastBand = band.name;
    }
    if (this.tLine.text !== band.line) this.tLine.setText(band.line);

    const nearBrazier = sim.world.brazierNear(sim.px, sim.py, 80);
    const hint = this.mode !== 'play'
      ? ''
      : nearBrazier
        ? '按 E 存入精魄 · 回满气血'
        : sim.time < 14
          ? '弹反会把敌人的力刻进石壁 → 长出矿脉'
          : '';
    if (this.tHint.text !== hint) this.tHint.setText(hint);

    if (hpPct < 0.3 && this.mode === 'play') {
      const a = 0.1 + Math.sin(this.time.now / 200) * 0.05;
      g.fillStyle(PAL.red1, a);
      g.fillRect(0, 0, VIEW.w, 20);
      g.fillRect(0, VIEW.h - 20, VIEW.w, 20);
      g.fillRect(0, 0, 20, VIEW.h);
      g.fillRect(VIEW.w - 20, 0, 20, VIEW.h);
    }
  }
}
