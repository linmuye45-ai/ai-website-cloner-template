import * as Phaser from 'phaser';
import { RunSim, UPGRADE_BY_ID, type Input, type UpgradeId } from './sim/RunSim';
import { BANDS, PAL, PLAYER, T, TILE, VIEW, bandAt, toCss } from './sim/config';
import { Synth } from './audio';

const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const HAN = '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';

/** Bucketed tile shades keep the Graphics command count sane. */
const SHADE_STEPS = 3;

function tileHash(x: number, y: number): number {
  let n = (x * 73856093) ^ (y * 19349663);
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function mixHex(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
}

export class ZhulongScene extends Phaser.Scene {
  private sim!: RunSim;
  private synth = new Synth();

  private gWorld!: Phaser.GameObjects.Graphics;
  private gActors!: Phaser.GameObjects.Graphics;
  private gFx!: Phaser.GameObjects.Graphics;
  private gHud!: Phaser.GameObjects.Graphics;
  private light!: Phaser.GameObjects.Image;
  private ember!: Phaser.GameObjects.Image;

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
  private pauseTween?: Phaser.Tweens.Tween;

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
    this.cameras.main.setBackgroundColor('#08060d');

    this.makeLightTextures();

    this.gWorld = this.add.graphics().setDepth(0);
    this.gActors = this.add.graphics().setDepth(10);
    this.gFx = this.add.graphics().setDepth(14).setBlendMode(Phaser.BlendModes.ADD);
    this.gHud = this.add.graphics().setDepth(60).setScrollFactor(0);

    this.ember = this.add
      .image(0, 0, 'zh-ember')
      .setScrollFactor(0)
      .setDepth(40)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.5);
    this.light = this.add.image(0, 0, 'zh-dark').setScrollFactor(0).setDepth(50);

    const base = { fontFamily: MONO, fontSize: '13px', color: toCss(PAL.stone6) };
    this.tDepth = this.add
      .text(28, 22, '', { ...base, fontSize: '20px', color: toCss(PAL.parch2) })
      .setDepth(61)
      .setScrollFactor(0);
    this.tBand = this.add
      .text(28, 48, '', { fontFamily: HAN, fontSize: '15px', color: toCss(PAL.ember4) })
      .setDepth(61)
      .setScrollFactor(0);
    this.tLine = this.add
      .text(VIEW.w / 2, 26, '', { fontFamily: HAN, fontSize: '14px', color: toCss(PAL.stone5) })
      .setOrigin(0.5, 0)
      .setDepth(61)
      .setScrollFactor(0);
    this.tHp = this.add
      .text(VIEW.w - 28, 22, '', { ...base, fontSize: '12px' })
      .setOrigin(1, 0)
      .setDepth(61)
      .setScrollFactor(0);
    this.tSoul = this.add
      .text(VIEW.w - 28, 44, '', { ...base, fontSize: '12px', color: toCss(PAL.ember4) })
      .setOrigin(1, 0)
      .setDepth(61)
      .setScrollFactor(0);
    this.tCombo = this.add
      .text(VIEW.w / 2, 96, '', { fontFamily: MONO, fontSize: '26px', color: toCss(PAL.ember4) })
      .setOrigin(0.5, 0)
      .setDepth(61)
      .setScrollFactor(0);
    this.tHint = this.add
      .text(VIEW.w / 2, VIEW.h - 42, '', { fontFamily: HAN, fontSize: '13px', color: toCss(PAL.stone4) })
      .setOrigin(0.5)
      .setDepth(61)
      .setScrollFactor(0);

    const kb = this.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.keys = kb.addKeys({
        a: 'A', d: 'D', w: 'W', s: 'S',
        j: 'J', k: 'K', e: 'E', m: 'M', r: 'R',
        one: 'ONE', two: 'TWO', three: 'THREE',
        space: 'SPACE', enter: 'ENTER', esc: 'ESC',
      }) as Record<string, Phaser.Input.Keyboard.Key>;
    }

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onPointer(p));
    this.showTitle();
  }

  // ------------------------------------------------------------- lighting

  /**
   * Two procedural textures do most of the atmospheric work: a dark radial mask
   * (torchlight falloff) and a warm additive core. Without these the tile grid
   * reads as flat graph paper, which is exactly the "cheap" look we must avoid.
   */
  private makeLightTextures(): void {
    const S = 1024;
    if (!this.textures.exists('zh-dark')) {
      const tex = this.textures.createCanvas('zh-dark', S, S);
      if (tex) {
        const ctx = tex.getContext();
        const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
        g.addColorStop(0, 'rgba(5,3,10,0)');
        g.addColorStop(0.32, 'rgba(5,3,10,0.10)');
        g.addColorStop(0.55, 'rgba(5,3,10,0.55)');
        g.addColorStop(0.78, 'rgba(4,2,8,0.86)');
        g.addColorStop(1, 'rgba(3,1,6,0.97)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, S, S);
        tex.refresh();
      }
    }
    if (!this.textures.exists('zh-ember')) {
      const tex = this.textures.createCanvas('zh-ember', S, S);
      if (tex) {
        const ctx = tex.getContext();
        const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
        g.addColorStop(0, 'rgba(255,233,168,0.55)');
        g.addColorStop(0.28, 'rgba(232,120,44,0.22)');
        g.addColorStop(0.6, 'rgba(168,69,30,0.06)');
        g.addColorStop(1, 'rgba(92,36,23,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, S, S);
        tex.refresh();
      }
    }
  }

  // -------------------------------------------------------------- overlays

  private clearOverlay(): void {
    this.pauseTween?.stop();
    this.pauseTween = undefined;
    this.overlay?.destroy(true);
    this.overlay = undefined;
    this.cards = [];
    this.mode = 'none';
  }

  private panel(
    x: number,
    y: number,
    w: number,
    h: number,
    accent: number = PAL.stone4,
    alpha = 0.94,
  ): Phaser.GameObjects.Graphics {
    const g = this.add.graphics();
    g.fillStyle(PAL.ink, alpha);
    g.fillRect(x, y, w, h);
    g.lineStyle(1, accent, 0.9);
    g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    // Corner ticks instead of rounded corners: harder, more severe.
    g.lineStyle(2, accent, 1);
    const c = 12;
    g.beginPath();
    g.moveTo(x, y + c); g.lineTo(x, y); g.lineTo(x + c, y);
    g.moveTo(x + w - c, y); g.lineTo(x + w, y); g.lineTo(x + w, y + c);
    g.moveTo(x, y + h - c); g.lineTo(x, y + h); g.lineTo(x + c, y + h);
    g.moveTo(x + w - c, y + h); g.lineTo(x + w, y + h); g.lineTo(x + w, y + h - c);
    g.strokePath();
    return g;
  }

  private showTitle(): void {
    this.clearOverlay();
    this.mode = 'title';
    const c = this.add.container(0, 0).setDepth(80).setScrollFactor(0);

    const dim = this.add.graphics();
    dim.fillStyle(0x05030a, 0.93);
    dim.fillRect(0, 0, VIEW.w, VIEW.h);
    c.add(dim);

    // Ember sigil behind the title.
    const sig = this.add.graphics();
    for (let i = 0; i < 4; i += 1) {
      sig.lineStyle(1, PAL.ember2, 0.55 - i * 0.1);
      sig.strokeCircle(VIEW.w / 2, 210, 58 + i * 26);
    }
    sig.lineStyle(2, PAL.ember3, 0.9);
    sig.strokeCircle(VIEW.w / 2, 210, 46);
    c.add(sig);

    c.add(
      this.add.text(VIEW.w / 2, 176, '烛 龙', {
        fontFamily: HAN, fontSize: '64px', color: toCss(PAL.parch2),
      }).setOrigin(0.5),
    );
    c.add(
      this.add.text(VIEW.w / 2, 252, 'Z H U L O N G', {
        fontFamily: MONO, fontSize: '15px', color: toCss(PAL.ember4),
      }).setOrigin(0.5),
    );

    const verse = ['刀会忘。', '人不 会。'];
    verse.forEach((line, i) => {
      c.add(
        this.add.text(VIEW.w / 2, 330 + i * 32, line, {
          fontFamily: HAN, fontSize: '20px', color: toCss(PAL.stone5),
        }).setOrigin(0.5),
      );
    });

    const controls = [
      ['A / D', '行走'],
      ['W / 空格', '跃'],
      ['J', '挥刀 · 挖矿'],
      ['K', '弹反'],
      ['E', '火盆 · 存魂'],
    ];
    controls.forEach(([k, v], i) => {
      const y = 440 + i * 26;
      c.add(this.add.text(VIEW.w / 2 - 70, y, k, {
        fontFamily: MONO, fontSize: '13px', color: toCss(PAL.ember4),
      }).setOrigin(1, 0));
      c.add(this.add.text(VIEW.w / 2 - 52, y, v, {
        fontFamily: HAN, fontSize: '13px', color: toCss(PAL.stone5),
      }).setOrigin(0, 0));
    });

    const prompt = this.add.text(VIEW.w / 2, 616, '按 J 开始', {
      fontFamily: HAN, fontSize: '22px', color: toCss(PAL.parch2),
    }).setOrigin(0.5);
    c.add(prompt);
    this.pauseTween = this.tweens.add({ targets: prompt, alpha: 0.25, duration: 900, yoyo: true, repeat: -1 });

    this.overlay = c;
  }

  private showShop(): void {
    this.clearOverlay();
    this.mode = 'shop';
    const c = this.add.container(0, 0).setDepth(80).setScrollFactor(0);

    const dim = this.add.graphics();
    dim.fillStyle(0x05030a, 0.88);
    dim.fillRect(0, 0, VIEW.w, VIEW.h);
    c.add(dim);

    c.add(
      this.add.text(VIEW.w / 2, 92, '火 盆', {
        fontFamily: HAN, fontSize: '30px', color: toCss(PAL.ember4),
      }).setOrigin(0.5),
    );
    c.add(
      this.add.text(VIEW.w / 2, 132, `精魄 ${this.sim.banked}`, {
        fontFamily: MONO, fontSize: '16px', color: toCss(PAL.parch1),
      }).setOrigin(0.5),
    );
    c.add(
      this.add.text(VIEW.w / 2, 158, '存魂 · 淬体 · 再下潜', {
        fontFamily: HAN, fontSize: '13px', color: toCss(PAL.stone4),
      }).setOrigin(0.5),
    );

    const picks = this.sim.shopChoices;
    const cardW = 300;
    const cardH = 210;
    const gap = 32;
    const totalW = Math.max(1, picks.length) * cardW + (Math.max(1, picks.length) - 1) * gap;
    const startX = (VIEW.w - totalW) / 2;
    const y = 208;

    picks.forEach((id: UpgradeId, i) => {
      const def = UPGRADE_BY_ID[id];
      const lvl = this.sim.levels[id];
      const cost = this.sim.costOf(id);
      const afford = this.sim.banked >= cost;
      const accent = afford ? PAL.ember3 : PAL.stone3;
      const x = startX + i * (cardW + gap);
      this.cards.push({ x, y, w: cardW, h: cardH });

      c.add(this.panel(x, y, cardW, cardH, accent));
      c.add(this.add.text(x + 22, y + 20, def.name, {
        fontFamily: MONO, fontSize: '18px', color: toCss(afford ? PAL.ember4 : PAL.stone4),
      }));
      c.add(this.add.text(x + cardW - 22, y + 22, `Lv ${lvl}/${def.max}`, {
        fontFamily: MONO, fontSize: '11px', color: toCss(PAL.stone4),
      }).setOrigin(1, 0));
      c.add(this.add.text(x + 22, y + 52, def.cn, {
        fontFamily: HAN, fontSize: '28px', color: toCss(PAL.parch2),
      }));
      c.add(this.add.text(x + 22, y + 100, def.describe(lvl + 1), {
        fontFamily: HAN, fontSize: '13px', color: toCss(PAL.stone5),
        wordWrap: { width: cardW - 44 },
      }));
      c.add(this.add.text(x + 22, y + cardH - 40, `${cost} 精魄`, {
        fontFamily: MONO, fontSize: '15px', color: toCss(afford ? PAL.ember4 : PAL.red3),
      }));
      c.add(this.add.text(x + cardW - 22, y + cardH - 40, `[${i + 1}]`, {
        fontFamily: MONO, fontSize: '14px', color: toCss(PAL.stone4),
      }).setOrigin(1, 0));
    });

    if (picks.length === 0) {
      c.add(this.add.text(VIEW.w / 2, 300, '刀已到头。', {
        fontFamily: HAN, fontSize: '18px', color: toCss(PAL.stone5),
      }).setOrigin(0.5));
    }

    c.add(this.add.text(VIEW.w / 2, y + cardH + 46, '按 E 离开火盆', {
      fontFamily: HAN, fontSize: '14px', color: toCss(PAL.stone4),
    }).setOrigin(0.5));

    this.overlay = c;
  }

  private showDeath(): void {
    this.clearOverlay();
    this.mode = 'dead';
    const c = this.add.container(0, 0).setDepth(80).setScrollFactor(0);

    const dim = this.add.graphics();
    dim.fillStyle(0x0a0206, 0.94);
    dim.fillRect(0, 0, VIEW.w, VIEW.h);
    c.add(dim);

    c.add(this.add.text(VIEW.w / 2, 150, '网 断 了', {
      fontFamily: HAN, fontSize: '44px', color: toCss(PAL.red3),
    }).setOrigin(0.5));
    c.add(this.add.text(VIEW.w / 2, 208, 'THE THREAD SNAPPED', {
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
      const y = 268 + i * 34;
      c.add(this.add.text(VIEW.w / 2 - 150, y, k, {
        fontFamily: HAN, fontSize: '15px', color: toCss(PAL.stone4),
      }));
      c.add(this.add.text(VIEW.w / 2 + 150, y, v, {
        fontFamily: MONO, fontSize: '16px', color: toCss(PAL.parch1),
      }).setOrigin(1, 0));
    });

    c.add(this.add.text(VIEW.w / 2, 500, '精魄留在原地。刀留下。', {
      fontFamily: HAN, fontSize: '15px', color: toCss(PAL.stone5),
    }).setOrigin(0.5));

    const prompt = this.add.text(VIEW.w / 2, 566, '按 R 重来', {
      fontFamily: HAN, fontSize: '20px', color: toCss(PAL.parch2),
    }).setOrigin(0.5);
    c.add(prompt);
    this.pauseTween = this.tweens.add({ targets: prompt, alpha: 0.3, duration: 900, yoyo: true, repeat: -1 });

    this.overlay = c;
  }

  // ---------------------------------------------------------------- input

  private onPointer(p: Phaser.Input.Pointer): void {
    this.synth.unlock();
    if (this.mode === 'title') {
      this.beginRun();
      return;
    }
    if (this.mode === 'dead') {
      this.beginRun();
      return;
    }
    if (this.mode === 'shop') {
      for (let i = 0; i < this.cards.length; i += 1) {
        const r = this.cards[i];
        if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) {
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
    this.cameras.main.setScroll(
      Phaser.Math.Clamp(this.sim.px - VIEW.w / 2, 0, this.sim.world.w * TILE - VIEW.w),
      Phaser.Math.Clamp(this.sim.py - VIEW.h / 2, 0, this.sim.world.h * TILE - VIEW.h),
    );
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
        case 'parry':
          this.synth.sword();
          break;
        case 'hurt':
          this.synth.hurt();
          this.shakeT = 0.22;
          this.cameras.main.flash(110, 120, 20, 30);
          break;
        case 'kill':
          this.synth.kill();
          break;
        case 'mine':
          this.synth.ore();
          break;
        case 'bank':
          this.synth.bankTone();
          break;
        case 'vein':
          this.synth.ore();
          this.shakeT = 0.1;
          break;
        case 'death':
          this.synth.death();
          this.cameras.main.shake(420, 0.012);
          break;
        default:
          break;
      }
    }
  }

  // ------------------------------------------------------------------ draw

  private draw(dt: number): void {
    const cam = this.cameras.main;
    const sim = this.sim;
    const targetX = Phaser.Math.Clamp(sim.px - VIEW.w / 2, 0, sim.world.w * TILE - VIEW.w);
    const targetY = Phaser.Math.Clamp(sim.py - VIEW.h / 2, 0, sim.world.h * TILE - VIEW.h);
    const ease = this.mode === 'title' ? 0.12 : Math.min(1, dt * 8);
    cam.scrollX += (targetX - cam.scrollX) * ease;
    cam.scrollY += (targetY - cam.scrollY) * ease;

    if (this.shakeT > 0) {
      this.shakeT -= dt;
      cam.shake(60, 0.004);
    }

    this.drawWorld();
    this.drawActors();
    this.drawFx();

    // Light follows the player in screen space.
    const sx = sim.px - cam.scrollX;
    const sy = sim.py - cam.scrollY;
    this.light.setPosition(sx, sy);
    const lr = sim.lightRadius;
    // 163.8px is the baked transparent core per unit scale. 1.65 is the floor
    // that still covers 1280x720 when the player stands in a corner.
    this.light.setScale(Math.max(1.65, lr / 163.8));
    this.ember.setPosition(sx, sy);
    this.ember.setScale(Math.max(0.85, lr / 300));
    this.ember.setAlpha(0.42 + Math.sin(this.time.now / 260) * 0.05);

    this.drawHud();
  }

  private drawWorld(): void {
    const g = this.gWorld;
    g.clear();
    const cam = this.cameras.main;
    const sim = this.sim;
    const world = sim.world;

    const x0 = Math.max(0, Math.floor(cam.scrollX / TILE) - 1);
    const x1 = Math.min(world.w - 1, Math.ceil((cam.scrollX + VIEW.w) / TILE) + 1);
    const y0 = Math.max(0, Math.floor(cam.scrollY / TILE) - 1);
    const y1 = Math.min(world.h - 1, Math.ceil((cam.scrollY + VIEW.h) / TILE) + 1);

    const pulse = 0.72 + Math.sin(this.time.now / 340) * 0.28;

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
          g.fillStyle(mixHex(base, PAL.ink, 0.25), 1);
          g.fillRect(px, py, TILE, TILE);
          // Crystal facets.
          const h = tileHash(tx, ty);
          g.fillStyle(hot, 0.55 + h * 0.35);
          const ox = 4 + Math.floor(h * 6);
          g.fillRect(px + ox, py + 4, 5, TILE - 8);
          g.fillStyle(hot, (0.35 + pulse * 0.35) * 0.9);
          g.fillRect(px + ox + 2, py + 7, 2, TILE - 14);
          g.lineStyle(1, hot, 0.5 * pulse);
          g.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
          continue;
        }

        if (tile === T.BRAZIER) {
          g.fillStyle(PAL.ember2, 1);
          g.fillRect(px + 5, py + 10, TILE - 10, TILE - 12);
          g.fillStyle(PAL.ember3, 0.9 + pulse * 0.1);
          g.fillRect(px + 7, py + 12, TILE - 14, TILE - 16);
          g.fillStyle(PAL.ember5, pulse);
          g.fillRect(px + 10, py + 14, TILE - 20, TILE - 22);
          g.lineStyle(1, PAL.ember4, 0.6 * pulse);
          g.strokeRect(px + 3.5, py + 8.5, TILE - 7, TILE - 10);
          continue;
        }

        if (tile === T.BEDROCK) {
          g.fillStyle(PAL.ink, 1);
          g.fillRect(px, py, TILE, TILE);
          continue;
        }

        // Stone: bucket the per-tile variation into a few shades so the
        // Graphics command buffer stays small.
        const h = tileHash(tx, ty);
        const bucket = Math.floor(h * SHADE_STEPS) / (SHADE_STEPS - 1);
        let base = tile === T.DEEP ? band.wallDark : band.wall;
        base = mixHex(base, tile === T.DEEP ? PAL.ink : PAL.stone4, bucket * 0.5);
        g.fillStyle(base, 1);
        g.fillRect(px, py, TILE, TILE);

        // Lit top face where the tile above is open.
        if (world.tiles[i - world.w] === T.AIR) {
          g.fillStyle(mixHex(base, PAL.stone7, 0.35), 0.85);
          g.fillRect(px, py, TILE, 3);
        }
        // Damage cracks.
        const wear = world.wear[i];
        if (wear > 0) {
          g.lineStyle(1, PAL.ink, 0.55 + wear * 0.12);
          g.beginPath();
          g.moveTo(px + 4, py + 5);
          g.lineTo(px + TILE - 6, py + TILE - 7);
          if (wear > 1) {
            g.moveTo(px + TILE - 5, py + 4);
            g.lineTo(px + 6, py + TILE - 6);
          }
          g.strokePath();
        }
      }
    }

    // The rising tide: a hard, breathing boundary.
    const tideY = sim.miasmaY;
    if (tideY > cam.scrollY - 80 && tideY < cam.scrollY + VIEW.h + 80) {
      const t = 0.75 + Math.sin(this.time.now / 220) * 0.25;
      g.fillStyle(PAL.red1, 0.35);
      g.fillRect(cam.scrollX, tideY - 260, VIEW.w, 260);
      g.lineStyle(3, PAL.red3, 0.9 * t);
      g.beginPath();
      g.moveTo(cam.scrollX, tideY);
      g.lineTo(cam.scrollX + VIEW.w, tideY);
      g.strokePath();
    }
  }

  private drawActors(): void {
    const g = this.gActors;
    g.clear();
    const sim = this.sim;

    // Enemies, with a readable windup tell.
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

      // Telegraph: a growing arc on the side it will strike.
      if (windup) {
        const prog = 1 - Math.max(0, e.t) / 0.5;
        g.lineStyle(2, PAL.red4, 0.35 + prog * 0.6);
        const r = 22 + prog * 18;
        const a0 = e.facing > 0 ? -0.9 : Math.PI - 0.9;
        g.beginPath();
        g.arc(e.x, e.y, r, a0, a0 + 1.8, false);
        g.strokePath();
      }

      // Body as a tapered shard rather than a rectangle.
      const h = e.kind === 'lantern' ? 15 : 13;
      g.fillStyle(PAL.ink, 1);
      g.fillRect(e.x - 9, e.y - h, 18, h * 2);
      g.fillStyle(body, 1);
      g.fillRect(e.x - 7, e.y - h + 1, 14, h * 2 - 2);
      if (strike) {
        const tip = e.facing > 0 ? e.x + 10 : e.x - 26;
        g.fillStyle(PAL.parch2, 0.9);
        g.fillRect(tip, e.y - 4, 16, 8);
      }
      // Eyes.
      g.fillStyle(stagger ? PAL.stone3 : PAL.ember5, stagger ? 0.5 : 1);
      g.fillRect(e.x + e.facing * 3 - 2, e.y - 7, 3, 3);

      // Health pip.
      if (e.hp < e.maxHp) {
        const w = 20;
        g.fillStyle(PAL.ink, 0.8);
        g.fillRect(e.x - w / 2, e.y - h - 8, w, 3);
        g.fillStyle(PAL.red4, 1);
        g.fillRect(e.x - w / 2, e.y - h - 8, (w * e.hp) / e.maxHp, 3);
      }
    }

    // Player.
    const px = sim.px;
    const py = sim.py;
    const blink = sim.iframes > 0 && Math.floor(this.time.now / 60) % 2 === 0 ? 0.45 : 1;

    if (sim.parryT > 0) {
      g.lineStyle(3, PAL.teal6, 0.9);
      g.strokeCircle(px, py, 26 + (1 - sim.parryT / 0.2) * 14);
      g.fillStyle(PAL.teal5, 0.16);
      g.fillCircle(px, py, 30);
    }

    // Cloak + blade silhouette; two shapes only, but deliberately asymmetric.
    g.fillStyle(PAL.ink, blink);
    g.fillRect(px - 8, py - 11, 16, 22);
    g.fillStyle(PAL.teal3, blink);
    g.fillRect(px - 6, py - 9, 12, 18);
    g.fillStyle(PAL.teal5, blink);
    g.fillRect(px - 6, py - 9, 12, 4);
    // Head / hood.
    g.fillStyle(PAL.ink, blink);
    g.fillRect(px - 5, py - 15, 10, 8);
    g.fillStyle(PAL.parch1, blink);
    g.fillRect(px - 3, py - 12, 6, 3);

    // Sword arc during a swing.
    if (sim.attackT > 0) {
      const prog = 1 - sim.attackT / PLAYER.attackDur;
      const a0 = sim.facing > 0 ? -1.15 : Math.PI - 0.55;
      g.lineStyle(4, PAL.parch2, 0.9 * (1 - prog));
      g.beginPath();
      g.arc(px, py, sim.reach * 0.85, a0, a0 + 1.7 * (0.4 + prog), false);
      g.strokePath();
      g.lineStyle(1, PAL.ember5, 0.6 * (1 - prog));
      g.beginPath();
      g.arc(px, py, sim.reach * 0.85 + 4, a0, a0 + 1.7 * (0.4 + prog), false);
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

    // Fresh veins get a brief flare so the player sees what they earned.
    for (const v of sim.veinFlashes) {
      const a = v.life / 0.85;
      g.lineStyle(2, PAL.ember5, a);
      g.strokeRect(v.x * TILE - 2, v.y * TILE - 2, TILE + 4, TILE + 4);
      g.fillStyle(PAL.ember5, a * 0.2);
      g.fillRect(v.x * TILE, v.y * TILE, TILE, TILE);
    }

    for (const f of sim.floats) {
      const a = Math.min(1, f.life / 0.5);
      g.fillStyle(f.color, a);
      g.fillRect(f.x - 1, f.y - 1, 2, 2);
    }
  }

  private drawHud(): void {
    const g = this.gHud;
    g.clear();
    const sim = this.sim;
    if (this.mode === 'title') return;

    const hpPct = Phaser.Math.Clamp(sim.hp / sim.maxHp, 0, 1);
    const barW = 220;
    const bx = VIEW.w - 28 - barW;
    const by = 66;
    g.fillStyle(PAL.ink, 0.85);
    g.fillRect(bx, by, barW, 9);
    const hpColor = hpPct > 0.5 ? PAL.red4 : hpPct > 0.25 ? PAL.ember3 : PAL.red3;
    g.fillStyle(hpColor, 1);
    g.fillRect(bx, by, barW * hpPct, 9);
    g.lineStyle(1, PAL.stone3, 0.8);
    g.strokeRect(bx + 0.5, by + 0.5, barW - 1, 8);

    // Depth ruler on the left edge.
    const depthNorm = Phaser.Math.Clamp(sim.depthMetres / 1600, 0, 1);
    g.fillStyle(PAL.stone2, 0.8);
    g.fillRect(10, 96, 3, VIEW.h - 200);
    const markerY = 96 + (VIEW.h - 200) * depthNorm;
    g.fillStyle(PAL.ember4, 1);
    g.fillRect(6, markerY - 2, 11, 4);
    for (const b of BANDS) {
      if (b.from === 0) continue;
      const y = 96 + (VIEW.h - 200) * Phaser.Math.Clamp(b.from / 1600, 0, 1);
      g.fillStyle(PAL.stone3, 0.9);
      g.fillRect(10, y, 3, 1);
    }

    // Tide warning band.
    const tideNorm = Phaser.Math.Clamp(sim.miasmaRow / 1600, 0, 1);
    if (tideNorm > 0) {
      const ty = 96 + (VIEW.h - 200) * tideNorm;
      g.fillStyle(PAL.red3, 0.7);
      g.fillRect(10, ty, 3, 3);
    }

    const c = this.hudCache;
    if (c.hp !== Math.ceil(sim.hp)) {
      c.hp = Math.ceil(sim.hp);
      this.tHp.setText(`${Math.max(0, Math.ceil(sim.hp))} / ${sim.maxHp}`);
    }
    if (c.soul !== sim.essence + sim.banked) {
      c.soul = sim.essence + sim.banked;
      this.tSoul.setText(`精魄 ${sim.essence}  ·  盆 ${sim.banked}`);
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

    const nearBrazier = this.sim.world.brazierNear(sim.px, sim.py, 80);
    const hint = this.mode !== 'play'
      ? ''
      : nearBrazier
        ? '按 E 存入精魄 · 回满气血'
        : sim.time < 14
          ? '弹反会把敌人的力刻进石壁 → 长出矿脉'
          : '';
    if (this.tHint.text !== hint) this.tHint.setText(hint);

    // Soft red edge when close to death.
    if (hpPct < 0.3 && this.mode === 'play') {
      const a = 0.1 + Math.sin(this.time.now / 200) * 0.05;
      g.fillStyle(PAL.red1, a);
      g.fillRect(0, 0, VIEW.w, 18);
      g.fillRect(0, VIEW.h - 18, VIEW.w, 18);
      g.fillRect(0, 0, 18, VIEW.h);
      g.fillRect(VIEW.w - 18, 0, 18, VIEW.h);
    }
  }
}
