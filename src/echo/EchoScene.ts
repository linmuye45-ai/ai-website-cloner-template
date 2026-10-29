import * as Phaser from 'phaser';
import { RunSim } from './sim/RunSim';
import { ELEMENTS, ELEMENT_ORDER, type ElementId } from './sim/elements';
import { PLAYER, VIEW, WEB, WORLD } from './sim/config';
import { UPGRADE_BY_ID, type UpgradeId } from './sim/upgrades';
import { Synth } from './audio';

const FONT = '"PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const PLAYER_COLOR = 0x7dffd4;
const ENEMY_COLOR: Record<string, number> = {
  crawler: 0xff3b6b,
  dasher: 0xff8b3d,
  splitter: 0xb45cff,
  shard: 0x8a6bff,
  spitter: 0xff4fd8,
  brute: 0xff2d2d,
  boss: 0xff0055,
};

const SAVE_KEY = 'echoweave-best-v1';

interface Best {
  time: number;
  kills: number;
  weave: number;
  resonance: number;
  wins: number;
}

function loadBest(): Best {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) throw new Error('empty');
    const parsed = JSON.parse(raw) as Partial<Best>;
    return {
      time: parsed.time ?? 0,
      kills: parsed.kills ?? 0,
      weave: parsed.weave ?? 0,
      resonance: parsed.resonance ?? 0,
      wins: parsed.wins ?? 0,
    };
  } catch {
    return { time: 0, kills: 0, weave: 0, resonance: 0, wins: 0 };
  }
}

function saveBest(best: Best): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(best));
  } catch {
    /* private mode: records simply do not persist */
  }
}

function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Reusable polygon scratch buffer — avoids per-frame allocation. */
const POLY: { x: number; y: number }[] = [];

function fillNgon(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  r: number,
  sides: number,
  rot: number,
  color: number,
  alpha = 1,
): void {
  POLY.length = 0;
  for (let i = 0; i < sides; i += 1) {
    const a = rot + (i / sides) * Math.PI * 2;
    POLY.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r });
  }
  g.fillStyle(color, alpha);
  g.fillPoints(POLY, true);
}

export class EchoScene extends Phaser.Scene {
  private sim!: RunSim;
  private synth = new Synth();

  private gBg!: Phaser.GameObjects.Graphics;
  private gNet!: Phaser.GameObjects.Graphics;
  private gEnemy!: Phaser.GameObjects.Graphics;
  private gFx!: Phaser.GameObjects.Graphics;
  private gHero!: Phaser.GameObjects.Graphics;
  private gHud!: Phaser.GameObjects.Graphics;

  private tTime!: Phaser.GameObjects.Text;
  private tHp!: Phaser.GameObjects.Text;
  private tRight!: Phaser.GameObjects.Text;
  private tLevel!: Phaser.GameObjects.Text;
  private tHint!: Phaser.GameObjects.Text;
  private tBoss!: Phaser.GameObjects.Text;

  private overlay?: Phaser.GameObjects.Container;
  private promptTween?: Phaser.Tweens.Tween;
  private cardRects: { x: number; y: number; w: number; h: number }[] = [];
  private overlayKind: 'none' | 'title' | 'cards' | 'end' = 'none';

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyM!: Phaser.Input.Keyboard.Key;
  private keyP!: Phaser.Input.Keyboard.Key;
  private keyOne!: Phaser.Input.Keyboard.Key;
  private keyTwo!: Phaser.Input.Keyboard.Key;
  private keyThree!: Phaser.Input.Keyboard.Key;

  private joyActive = false;
  private joyOx = 0;
  private joyOy = 0;
  private joyX = 0;
  private joyY = 0;
  private paused = false;
  private lastIntensity = -1;
  private best: Best = { time: 0, kills: 0, weave: 0, resonance: 0, wins: 0 };
  private hudCache = { hp: -1, time: -1, kills: -1, weave: -1, res: -1, level: -1, boss: '' };

  constructor() {
    super('Echo');
  }

  create(): void {
    this.sim = new RunSim((Date.now() ^ 0x9e3779b9) >>> 0);
    this.best = loadBest();
    this.cameras.main.setBackgroundColor('#07070f');

    this.gBg = this.add.graphics().setDepth(0);
    this.gNet = this.add.graphics().setDepth(4).setBlendMode(Phaser.BlendModes.ADD);
    this.gEnemy = this.add.graphics().setDepth(10);
    this.gFx = this.add.graphics().setDepth(16).setBlendMode(Phaser.BlendModes.ADD);
    this.gHero = this.add.graphics().setDepth(20);
    this.gHud = this.add.graphics().setDepth(30).setScrollFactor(0);

    const textStyle = { fontFamily: FONT, fontSize: '16px', color: '#ffffff' };
    this.tTime = this.add
      .text(VIEW.w / 2, 20, '00:00', { ...textStyle, fontFamily: MONO, fontSize: '26px', color: '#e8f6ff' })
      .setOrigin(0.5, 0)
      .setDepth(31)
      .setScrollFactor(0);
    this.tHp = this.add
      .text(26, 18, '', { ...textStyle, fontFamily: MONO, fontSize: '13px', color: '#9ffbe0' })
      .setDepth(31)
      .setScrollFactor(0);
    this.tRight = this.add
      .text(VIEW.w - 26, 18, '', {
        ...textStyle,
        fontFamily: MONO,
        fontSize: '13px',
        color: '#c9d6ff',
        align: 'right',
      })
      .setOrigin(1, 0)
      .setDepth(31)
      .setScrollFactor(0);
    this.tLevel = this.add
      .text(26, VIEW.h - 34, '', { ...textStyle, fontFamily: MONO, fontSize: '13px', color: '#ffe14d' })
      .setDepth(31)
      .setScrollFactor(0);
    this.tBoss = this.add
      .text(VIEW.w / 2, 58, '', { ...textStyle, fontFamily: FONT, fontSize: '14px', color: '#ff6b8a' })
      .setOrigin(0.5, 0)
      .setDepth(31)
      .setScrollFactor(0);
    this.tHint = this.add
      .text(VIEW.w / 2, VIEW.h - 40, '', {
        ...textStyle,
        fontSize: '13px',
        color: '#5f6f92',
      })
      .setOrigin(0.5)
      .setDepth(31)
      .setScrollFactor(0);

    const kb = this.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.wasd = kb.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' }) as Record<
        string,
        Phaser.Input.Keyboard.Key
      >;
      this.keySpace = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.keyM = kb.addKey(Phaser.Input.Keyboard.KeyCodes.M);
      this.keyP = kb.addKey(Phaser.Input.Keyboard.KeyCodes.P);
      this.keyOne = kb.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
      this.keyTwo = kb.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
      this.keyThree = kb.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    }

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onPointerDown(p));
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => this.onPointerMove(p));
    this.input.on('pointerup', () => {
      this.joyActive = false;
      this.joyX = 0;
      this.joyY = 0;
    });

    this.cameras.main.setScroll(
      Phaser.Math.Clamp(this.sim.px - VIEW.w / 2, 0, WORLD.w - VIEW.w),
      Phaser.Math.Clamp(this.sim.py - VIEW.h / 2, 0, WORLD.h - VIEW.h),
    );
    this.showTitle();
  }

  // --------------------------------------------------------------- overlays

  private clearOverlay(): void {
    this.promptTween?.stop();
    this.promptTween = undefined;
    this.overlay?.destroy(true);
    this.overlay = undefined;
    this.cardRects = [];
    this.overlayKind = 'none';
  }

  private panel(w: number, h: number, x: number, y: number, border: number): Phaser.GameObjects.Graphics {
    const g = this.add.graphics();
    g.fillStyle(0x05050c, 0.92);
    g.fillRoundedRect(x, y, w, h, 14);
    g.lineStyle(2, border, 0.85);
    g.strokeRoundedRect(x, y, w, h, 14);
    return g;
  }

  private showTitle(): void {
    this.clearOverlay();
    this.overlayKind = 'title';
    const c = this.add.container(0, 0).setDepth(40).setScrollFactor(0);
    const dim = this.add.graphics();
    dim.fillStyle(0x04040a, 0.9);
    dim.fillRect(0, 0, VIEW.w, VIEW.h);
    c.add(dim);

    const glow = this.add.graphics();
    glow.lineStyle(2, PLAYER_COLOR, 0.5);
    for (let i = 0; i < 5; i += 1) {
      glow.strokeCircle(VIEW.w / 2, 250, 120 + i * 46);
    }
    c.add(glow);

    c.add(
      this.add
        .text(VIEW.w / 2, 186, 'E C H O W E A V E', {
          fontFamily: MONO,
          fontSize: '54px',
          color: '#f2fbff',
        })
        .setOrigin(0.5),
    );
    c.add(
      this.add
        .text(VIEW.w / 2, 240, '回 声 织 网', {
          fontFamily: FONT,
          fontSize: '26px',
          color: '#7dffd4',
        })
        .setOrigin(0.5),
    );
    c.add(
      this.add
        .text(VIEW.w / 2, 300, '你的轨迹，就是你的武器', {
          fontFamily: FONT,
          fontSize: '20px',
          color: '#b9c7e8',
        })
        .setOrigin(0.5),
    );

    const rules = [
      '移动 → 留下「回声」，回声重走你走过的路',
      '走过的丝线持续 5.5 秒，敌人撞进网里会被割伤',
      '两种元素的丝线真正交叉 → 共振爆炸（共 6 种组合）',
      '绕圈只能保命；想赢，就去织一张十字交叉的网',
    ];
    rules.forEach((line, i) => {
      c.add(
        this.add
          .text(VIEW.w / 2, 370 + i * 30, line, {
            fontFamily: FONT,
            fontSize: '16px',
            color: i === 3 ? '#ffe14d' : '#8fa3c8',
          })
          .setOrigin(0.5),
      );
    });

    c.add(
      this.add
        .text(VIEW.w / 2, 540, 'WASD / 方向键 移动 · 手机拖动屏幕转向', {
          fontFamily: FONT,
          fontSize: '15px',
          color: '#6f83a8',
        })
        .setOrigin(0.5),
    );

    const prompt = this.add
      .text(VIEW.w / 2, 600, '按 空格 / 点击屏幕 开始', {
        fontFamily: FONT,
        fontSize: '22px',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    c.add(prompt);
    this.promptTween = this.tweens.add({
      targets: prompt,
      alpha: 0.25,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    if (this.best.time > 0) {
      c.add(
        this.add
          .text(
            VIEW.w / 2,
            650,
            `最长存活 ${fmtTime(this.best.time)} · 最高击杀 ${this.best.kills} · 最佳织网 ${this.best.weave}m`,
            { fontFamily: MONO, fontSize: '13px', color: '#4f5f80' },
          )
          .setOrigin(0.5),
      );
    }

    this.overlay = c;
  }

  private showCards(): void {
    this.clearOverlay();
    this.overlayKind = 'cards';
    const c = this.add.container(0, 0).setDepth(40).setScrollFactor(0);
    const dim = this.add.graphics();
    dim.fillStyle(0x04040a, 0.86);
    dim.fillRect(0, 0, VIEW.w, VIEW.h);
    c.add(dim);

    c.add(
      this.add
        .text(VIEW.w / 2, 92, `LEVEL ${this.sim.level}`, {
          fontFamily: MONO,
          fontSize: '22px',
          color: '#ffe14d',
        })
        .setOrigin(0.5),
    );
    c.add(
      this.add
        .text(VIEW.w / 2, 124, '选择一项强化 · 数字键 1/2/3 或点击', {
          fontFamily: FONT,
          fontSize: '14px',
          color: '#8fa3c8',
        })
        .setOrigin(0.5),
    );

    const picks = this.sim.pendingChoices;
    const cardW = 300;
    const cardH = 250;
    const gap = 34;
    const totalW = picks.length * cardW + (picks.length - 1) * gap;
    const startX = (VIEW.w - totalW) / 2;
    const y = 200;

    picks.forEach((id, i) => {
      const def = UPGRADE_BY_ID[id];
      const level = this.sim.levels[id];
      const accent = this.accentFor(id);
      const x = startX + i * (cardW + gap);
      this.cardRects.push({ x, y, w: cardW, h: cardH });

      const card = this.panel(cardW, cardH, x, y, accent);
      c.add(card);

      const kindLabel =
        def.kind === 'element' ? '元素核心' : def.kind === 'resonance' ? '共振' : def.kind === 'echo' ? '回声' : '生存';

      c.add(
        this.add
          .text(x + 22, y + 20, kindLabel, {
            fontFamily: FONT,
            fontSize: '12px',
            color: '#6f83a8',
          })
          .setOrigin(0, 0),
      );
      c.add(
        this.add
          .text(x + 22, y + 44, def.name, {
            fontFamily: MONO,
            fontSize: '22px',
            color: Phaser.Display.Color.IntegerToColor(accent).rgba,
          })
          .setOrigin(0, 0),
      );
      c.add(
        this.add
          .text(x + 22, y + 78, def.cn, {
            fontFamily: FONT,
            fontSize: '17px',
            color: '#e6eeff',
          })
          .setOrigin(0, 0),
      );
      c.add(
        this.add
          .text(x + 22, y + 116, def.describe(level + 1), {
            fontFamily: FONT,
            fontSize: '14px',
            color: '#a8b8d8',
            wordWrap: { width: cardW - 44 },
            lineSpacing: 6,
          })
          .setOrigin(0, 0),
      );

      if (def.kind === 'element') {
        const el = (id === 'elFrost' ? 'frost' : id === 'elVolt' ? 'volt' : 'void') as ElementId;
        c.add(
          this.add
            .text(x + 22, y + cardH - 64, ELEMENTS[el].tagline, {
              fontFamily: FONT,
              fontSize: '13px',
              color: ELEMENTS[el].css,
              wordWrap: { width: cardW - 44 },
            })
            .setOrigin(0, 0),
        );
      } else {
        c.add(
          this.add
            .text(x + 22, y + cardH - 64, `等级 ${level + 1} / ${def.max}`, {
              fontFamily: MONO,
              fontSize: '12px',
              color: '#5f6f92',
            })
            .setOrigin(0, 0),
        );
      }

      c.add(
        this.add
          .text(x + cardW - 22, y + cardH - 40, `[${i + 1}]`, {
            fontFamily: MONO,
            fontSize: '18px',
            color: Phaser.Display.Color.IntegerToColor(accent).rgba,
          })
          .setOrigin(1, 0),
      );
    });

    this.overlay = c;
  }

  private accentFor(id: UpgradeId): number {
    if (id === 'elFrost') return ELEMENTS.frost.color;
    if (id === 'elVolt') return ELEMENTS.volt.color;
    if (id === 'elVoid') return ELEMENTS.void.color;
    const def = UPGRADE_BY_ID[id];
    if (def.kind === 'element') return ELEMENTS.fire.color;
    if (def.kind === 'resonance') return 0xc77dff;
    if (def.kind === 'echo') return PLAYER_COLOR;
    return 0x9fb2d8;
  }

  private showEnd(win: boolean): void {
    this.clearOverlay();
    this.overlayKind = 'end';
    const summary = this.sim.getSummary();
    this.best.time = Math.max(this.best.time, summary.survived);
    this.best.kills = Math.max(this.best.kills, summary.kills);
    this.best.weave = Math.max(this.best.weave, summary.weave);
    this.best.resonance = Math.max(this.best.resonance, summary.resonances);
    if (win) this.best.wins += 1;
    saveBest(this.best);

    const c = this.add.container(0, 0).setDepth(40).setScrollFactor(0);
    const dim = this.add.graphics();
    dim.fillStyle(0x04040a, 0.9);
    dim.fillRect(0, 0, VIEW.w, VIEW.h);
    c.add(dim);

    const accent = win ? 0x7dffd4 : 0xff5c8a;
    const panel = this.panel(620, 400, (VIEW.w - 620) / 2, 140, accent);
    c.add(panel);

    c.add(
      this.add
        .text(VIEW.w / 2, 178, win ? '织 完 了' : '网 断 了', {
          fontFamily: FONT,
          fontSize: '40px',
          color: win ? '#7dffd4' : '#ff5c8a',
        })
        .setOrigin(0.5),
    );
    c.add(
      this.add
        .text(VIEW.w / 2, 224, win ? 'THE PATTERN HOLDS' : 'THE THREAD SNAPPED', {
          fontFamily: MONO,
          fontSize: '14px',
          color: '#6f83a8',
        })
        .setOrigin(0.5),
    );

    const rows: [string, string][] = [
      ['存活时间', fmtTime(summary.survived)],
      ['击杀', String(summary.kills)],
      ['共振爆炸', String(summary.resonances)],
      ['织网总长', `${summary.weave} m`],
      ['等级', String(summary.level)],
    ];
    rows.forEach(([label, value], i) => {
      const y = 282 + i * 36;
      c.add(
        this.add.text(VIEW.w / 2 - 190, y, label, {
          fontFamily: FONT,
          fontSize: '16px',
          color: '#8fa3c8',
        }),
      );
      c.add(
        this.add
          .text(VIEW.w / 2 + 190, y, value, {
            fontFamily: MONO,
            fontSize: '18px',
            color: '#e8f6ff',
          })
          .setOrigin(1, 0),
      );
    });

    c.add(
      this.add
        .text(
          VIEW.w / 2,
          486,
          `历史最佳：击杀 ${this.best.kills} · 织网 ${this.best.weave}m · 共振 ${this.best.resonance}`,
          { fontFamily: MONO, fontSize: '12px', color: '#4f5f80' },
        )
        .setOrigin(0.5),
    );

    const prompt = this.add
      .text(VIEW.w / 2, 566, '按 空格 / 点击 再来一局', {
        fontFamily: FONT,
        fontSize: '20px',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    c.add(prompt);
    this.promptTween = this.tweens.add({
      targets: prompt,
      alpha: 0.3,
      duration: 850,
      yoyo: true,
      repeat: -1,
    });

    this.overlay = c;
  }

  // ------------------------------------------------------------------ input

  private startRun(): void {
    this.synth.unlock();
    this.clearOverlay();
    this.sim.start();
    this.paused = false;
    this.cameras.main.setScroll(
      Phaser.Math.Clamp(this.sim.px - VIEW.w / 2, 0, WORLD.w - VIEW.w),
      Phaser.Math.Clamp(this.sim.py - VIEW.h / 2, 0, WORLD.h - VIEW.h),
    );
  }

  private onPointerDown(p: Phaser.Input.Pointer): void {
    this.synth.unlock();
    if (this.overlayKind === 'title') {
      this.startRun();
      return;
    }
    if (this.overlayKind === 'end') {
      this.startRun();
      return;
    }
    if (this.overlayKind === 'cards') {
      for (let i = 0; i < this.cardRects.length; i += 1) {
        const r = this.cardRects[i];
        if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) {
          this.pickCard(i);
          return;
        }
      }
      return;
    }
    this.joyActive = true;
    this.joyOx = p.x;
    this.joyOy = p.y;
    this.joyX = 0;
    this.joyY = 0;
  }

  private onPointerMove(p: Phaser.Input.Pointer): void {
    if (!this.joyActive) return;
    const dx = p.x - this.joyOx;
    const dy = p.y - this.joyOy;
    const d = Math.hypot(dx, dy);
    if (d < 10) {
      this.joyX = 0;
      this.joyY = 0;
      return;
    }
    const scale = Math.min(1, d / 70) / d;
    this.joyX = dx * scale;
    this.joyY = dy * scale;
  }

  private pickCard(index: number): void {
    this.sim.chooseUpgrade(index);
    this.clearOverlay();
  }

  // ----------------------------------------------------------------- update

  update(_time: number, delta: number): void {
    const dt = Math.min(delta / 1000, 0.05);

    if (this.keyM && Phaser.Input.Keyboard.JustDown(this.keyM)) {
      this.synth.setMuted(!this.synth.isMuted);
    }
    if (this.keyP && Phaser.Input.Keyboard.JustDown(this.keyP) && this.sim.status === 'playing') {
      this.paused = !this.paused;
      this.hudCache.time = -1;
    }
    if (this.overlayKind === 'title' && this.keySpace && Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      this.startRun();
    }
    if (this.overlayKind === 'end' && this.keySpace && Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      this.startRun();
    }
    if (this.overlayKind === 'cards') {
      if (this.keyOne && Phaser.Input.Keyboard.JustDown(this.keyOne)) this.pickCard(0);
      else if (this.keyTwo && Phaser.Input.Keyboard.JustDown(this.keyTwo)) this.pickCard(1);
      else if (this.keyThree && Phaser.Input.Keyboard.JustDown(this.keyThree)) this.pickCard(2);
    }

    if (!this.paused) {
      const input = this.readInput();
      this.sim.update(dt, input);
      if (this.sim.resolveWin()) {
        this.showEnd(true);
      }
      this.consumeEvents();
    }

    if (this.overlayKind === 'none') {
      if (this.sim.status === 'levelup') this.showCards();
      else if (this.sim.status === 'dead') this.showEnd(false);
    }

    const whole = Math.floor(this.sim.time);
    if (whole !== this.lastIntensity) {
      this.lastIntensity = whole;
      this.synth.setIntensity(whole);
    }
    this.draw(dt);
  }

  private readInput(): { x: number; y: number } {
    let ix = 0;
    let iy = 0;
    if (this.cursors) {
      if (this.cursors.left?.isDown || this.wasd?.left?.isDown) ix -= 1;
      if (this.cursors.right?.isDown || this.wasd?.right?.isDown) ix += 1;
      if (this.cursors.up?.isDown || this.wasd?.up?.isDown) iy -= 1;
      if (this.cursors.down?.isDown || this.wasd?.down?.isDown) iy += 1;
    }
    if (ix === 0 && iy === 0 && this.joyActive) {
      ix = this.joyX;
      iy = this.joyY;
    }
    return { x: ix, y: iy };
  }

  private consumeEvents(): void {
    for (const ev of this.sim.events) {
      switch (ev.type) {
        case 'resonance':
          this.synth.resonance();
          this.cameras.main.shake(130, 0.0045);
          break;
        case 'hurt':
          this.synth.hurt();
          this.cameras.main.flash(110, 80, 0, 20);
          break;
        case 'levelup':
          this.synth.levelUp();
          break;
        case 'boss':
          this.synth.boss();
          this.cameras.main.shake(340, 0.011);
          break;
        case 'dead':
          this.synth.dead();
          this.cameras.main.shake(420, 0.014);
          break;
        case 'win':
          this.synth.win();
          break;
        case 'echo':
          this.synth.echo();
          break;
        default:
          break;
      }
    }
    this.sim.events.length = 0;
    const shake = this.sim.takeShake();
    if (shake > 4) this.cameras.main.shake(90, Math.min(0.012, shake * 0.0006));
  }

  // ------------------------------------------------------------------ draw

  private draw(dt: number): void {
    const cam = this.cameras.main;
    const targetX = Phaser.Math.Clamp(this.sim.px - VIEW.w / 2, 0, Math.max(0, WORLD.w - VIEW.w));
    const targetY = Phaser.Math.Clamp(this.sim.py - VIEW.h / 2, 0, Math.max(0, WORLD.h - VIEW.h));
    cam.scrollX += (targetX - cam.scrollX) * Math.min(1, dt * 10);
    cam.scrollY += (targetY - cam.scrollY) * Math.min(1, dt * 10);

    this.drawBackground();
    this.drawNet();
    this.drawEnemies();
    this.drawFx();
    this.drawHero();
    this.drawHud();
  }

  private drawBackground(): void {
    const g = this.gBg;
    g.clear();
    const cam = this.cameras.main;
    const sx = cam.scrollX;
    const sy = cam.scrollY;
    const grid = 100;
    g.lineStyle(1, 0x171730, 0.9);
    g.beginPath();
    for (let x = Math.floor(sx / grid) * grid; x < sx + VIEW.w + grid; x += grid) {
      g.moveTo(x, sy);
      g.lineTo(x, sy + VIEW.h);
    }
    for (let y = Math.floor(sy / grid) * grid; y < sy + VIEW.h + grid; y += grid) {
      g.moveTo(sx, y);
      g.lineTo(sx + VIEW.w, y);
    }
    g.strokePath();

    g.lineStyle(4, 0x2b2b55, 1);
    g.strokeRect(0, 0, WORLD.w, WORLD.h);
  }

  private static readonly seg: number[][] = [[], [], [], [], [], [], [], [], [], [], [], []];

  private drawNet(): void {
    const g = this.gNet;
    g.clear();
    const now = this.sim.time;
    const life = WEB.threadLife;
    const half = WEB.cell * 0.55;
    const buckets = EchoScene.seg;
    for (let i = 0; i < 12; i += 1) buckets[i].length = 0;

    for (const mark of this.sim.web.values()) {
      const age = now - mark.t;
      if (age > life) continue;
      const f = 1 - age / life;
      const tier = f > 0.66 ? 0 : f > 0.33 ? 1 : 2;
      const elIdx = ELEMENT_ORDER.indexOf(mark.element);
      if (elIdx < 0) continue;
      const b = buckets[tier * 4 + elIdx];
      const dx = Math.cos(mark.dir) * half;
      const dy = Math.sin(mark.dir) * half;
      b.push(mark.x - dx, mark.y - dy, mark.x + dx, mark.y + dy);
    }

    for (let tier = 0; tier < 3; tier += 1) {
      for (let e = 0; e < 4; e += 1) {
        const b = buckets[tier * 4 + e];
        if (b.length === 0) continue;
        const color = ELEMENTS[ELEMENT_ORDER[e]].color;
        g.lineStyle(tier === 0 ? 3 : 2, color, tier === 0 ? 0.85 : tier === 1 ? 0.4 : 0.16);
        g.beginPath();
        for (let i = 0; i < b.length; i += 4) {
          g.moveTo(b[i], b[i + 1]);
          g.lineTo(b[i + 2], b[i + 3]);
        }
        g.strokePath();
      }
    }
  }

  private drawEnemies(): void {
    const g = this.gEnemy;
    g.clear();
    const enemies = this.sim.enemies;
    for (let i = 0; i < enemies.length; i += 1) {
      const e = enemies[i];
      if (!e.alive) continue;
      const color = e.flash > 0 ? 0xffffff : (ENEMY_COLOR[e.kind] ?? 0xff3b6b);
      const rot = Math.atan2(e.vy, e.vx);
      const alpha = e.freezeT > 0 ? 0.55 : 1;

      switch (e.kind) {
        case 'crawler':
          fillNgon(g, e.x, e.y, e.r * 1.25, 3, rot, color, alpha);
          break;
        case 'dasher':
          fillNgon(g, e.x, e.y, e.r * 1.3, 4, rot, color, alpha);
          break;
        case 'splitter':
          fillNgon(g, e.x, e.y, e.r, 6, e.phase, color, alpha);
          break;
        case 'shard':
          fillNgon(g, e.x, e.y, e.r, 4, rot + Math.PI / 4, color, alpha);
          break;
        case 'spitter':
          g.fillStyle(color, alpha);
          g.fillCircle(e.x, e.y, e.r);
          g.lineStyle(2, 0xff9ae8, 0.9);
          g.strokeCircle(e.x, e.y, e.r + 5);
          break;
        case 'brute':
          fillNgon(g, e.x, e.y, e.r, 8, e.phase * 0.4, color, alpha);
          break;
        case 'boss': {
          fillNgon(g, e.x, e.y, e.r, 12, e.phase * 0.5, color, alpha);
          g.fillStyle(0xffffff, 0.8);
          g.fillCircle(e.x, e.y, e.r * 0.3);
          const pct = Phaser.Math.Clamp(e.hp / e.maxHp, 0, 1);
          g.fillStyle(0x220008, 0.9);
          g.fillRect(e.x - 60, e.y - e.r - 26, 120, 8);
          g.fillStyle(0xff0055, 1);
          g.fillRect(e.x - 60, e.y - e.r - 26, 120 * pct, 8);
          break;
        }
        default:
          fillNgon(g, e.x, e.y, e.r, 4, rot, color, alpha);
      }
    }
  }

  private drawFx(): void {
    const g = this.gFx;
    g.clear();
    const sim = this.sim;

    // experience orbs
    g.fillStyle(0x66f0ff, 0.9);
    for (let i = 0; i < sim.orbs.length; i += 1) {
      const o = sim.orbs[i];
      const r = o.value > 3 ? 6 : 3.4;
      fillNgon(g, o.x, o.y, r, 4, 0.6, 0x66f0ff, 0.95);
    }

    // enemy projectiles
    g.fillStyle(0xff4fd8, 0.95);
    for (let i = 0; i < sim.projectiles.length; i += 1) {
      const p = sim.projectiles[i];
      g.fillCircle(p.x, p.y, p.r);
    }

    // resonance bursts
    for (let i = 0; i < sim.bursts.length; i += 1) {
      const b = sim.bursts[i];
      const t = Phaser.Math.Clamp(b.t / b.dur, 0, 1);
      const r = b.r0 + (b.r1 - b.r0) * (1 - (1 - t) * (1 - t));
      const alpha = (1 - t) ** 1.6;
      g.lineStyle(6 * (1 - t) + 1, b.color, alpha);
      g.strokeCircle(b.x, b.y, r);
      g.lineStyle(2, 0xffffff, alpha * 0.45);
      g.strokeCircle(b.x, b.y, r * 0.82);
      if (b.kind === 'annihilate') {
        const len = 300 * (0.3 + t);
        g.lineStyle(6 * (1 - t) + 1, b.color, alpha);
        g.beginPath();
        g.moveTo(b.x - Math.cos(b.angle) * len, b.y - Math.sin(b.angle) * len);
        g.lineTo(b.x + Math.cos(b.angle) * len, b.y + Math.sin(b.angle) * len);
        g.strokePath();
      }
    }

    // standing fields
    for (let i = 0; i < sim.fields.length; i += 1) {
      const f = sim.fields[i];
      const t = Phaser.Math.Clamp(f.t / f.dur, 0, 1);
      g.lineStyle(2, f.color, 0.6 * (1 - t));
      g.strokeCircle(f.x, f.y, f.r * (f.kind === 'pull' ? 1 - t * 0.5 : 1));
      g.fillStyle(f.color, 0.08 * (1 - t));
      g.fillCircle(f.x, f.y, f.r);
    }

    // particles
    for (let i = 0; i < sim.particles.length; i += 1) {
      const p = sim.particles[i];
      const alpha = Phaser.Math.Clamp(p.life / p.maxLife, 0, 1);
      g.fillStyle(p.color, alpha);
      g.fillCircle(p.x, p.y, p.size * alpha + 0.6);
    }
  }

  private drawHero(): void {
    const gHero = this.gHero;
    const gFx = this.gFx;
    const sim = this.sim;
    gHero.clear();

    // echoes: a bright head plus a short tail along the path they are tracing
    for (let i = 0; i < sim.echoes.length; i += 1) {
      const echo = sim.echoes[i];
      if (!echo.alive) continue;
      const color = ELEMENTS[echo.element].color;
      const idx = Math.floor(echo.progress * (echo.n - 1));
      const tail = Math.max(0, idx - 14);
      gFx.lineStyle(4, color, 0.85);
      gFx.beginPath();
      for (let k = tail; k <= idx; k += 1) {
        const x = echo.path[k * 2];
        const y = echo.path[k * 2 + 1];
        if (k === tail) gFx.moveTo(x, y);
        else gFx.lineTo(x, y);
      }
      gFx.strokePath();

      fillNgon(gFx, echo.x, echo.y, 13, 4, sim.time * 2, color, 0.9);
      gFx.lineStyle(2, color, 0.5);
      gFx.strokeCircle(echo.x, echo.y, echo.radius);
      gFx.fillStyle(color, 0.12);
      gFx.fillCircle(echo.x, echo.y, echo.radius);
    }

    // player
    const px = sim.px;
    const py = sim.py;
    const blink = sim.invuln > 0 && Math.floor(sim.time * 20) % 2 === 0 ? 0.35 : 1;

    gHero.fillStyle(PLAYER_COLOR, 0.16 * blink);
    gHero.fillCircle(px, py, PLAYER.radius * 2.4);
    gHero.lineStyle(2, PLAYER_COLOR, 0.45 * blink);
    gHero.strokeCircle(px, py, PLAYER.radius * 1.7);

    fillNgon(gHero, px, py, PLAYER.radius * 1.45, 3, sim.facing, PLAYER_COLOR, blink);
    gHero.fillStyle(0xffffff, blink);
    gHero.fillCircle(px, py, PLAYER.radius * 0.42);

    // magnet ring hint
    gHero.lineStyle(1, 0x2f5f52, 0.5);
    gHero.strokeCircle(px, py, sim.stats.magnet);
  }

  private drawHud(): void {
    const g = this.gHud;
    const sim = this.sim;
    g.clear();

    // health
    const hpPct = Phaser.Math.Clamp(sim.hp / sim.stats.maxHp, 0, 1);
    const barW = 260;
    g.fillStyle(0x120018, 0.9);
    g.fillRoundedRect(24, 38, barW, 14, 7);
    const hpColor = hpPct > 0.55 ? 0x57f0b0 : hpPct > 0.25 ? 0xffd24d : 0xff4d6d;
    g.fillStyle(hpColor, 1);
    g.fillRoundedRect(24, 38, Math.max(2, barW * hpPct), 14, 7);

    // experience
    const xpPct = Phaser.Math.Clamp(sim.xp / sim.xpNext, 0, 1);
    g.fillStyle(0x101028, 0.95);
    g.fillRect(0, VIEW.h - 8, VIEW.w, 8);
    g.fillStyle(0x6f8bff, 1);
    g.fillRect(0, VIEW.h - 8, VIEW.w * xpPct, 8);

    // element chips
    sim.stats.elements.forEach((el, i) => {
      const x = 30 + i * 26;
      const y = 68;
      fillNgon(g, x, y, 8, 4, Math.PI / 4, ELEMENTS[el].color, 0.95);
    });

    // critical vignette
    if (hpPct < 0.3 && sim.status === 'playing') {
      const a = 0.14 + Math.sin(sim.time * 6) * 0.06;
      g.fillStyle(0xff2a4d, a * 0.5);
      g.fillRect(0, 0, VIEW.w, 26);
      g.fillRect(0, VIEW.h - 26, VIEW.w, 26);
      g.fillRect(0, 0, 26, VIEW.h);
      g.fillRect(VIEW.w - 26, 0, 26, VIEW.h);
    }

    if (this.paused && this.overlayKind === 'none') {
      g.fillStyle(0x04040a, 0.72);
      g.fillRect(0, 0, VIEW.w, VIEW.h);
    }

    // text updates (only when the value actually changed)
    const cache = this.hudCache;
    const timeText = fmtTime(sim.time);
    if (cache.time !== Math.floor(sim.time)) {
      cache.time = Math.floor(sim.time);
      this.tTime.setText(this.paused ? 'PAUSED' : timeText);
    }
    const hpInt = Math.ceil(sim.hp);
    if (cache.hp !== hpInt) {
      cache.hp = hpInt;
      this.tHp.setText(`${Math.max(0, hpInt)} / ${sim.stats.maxHp} HP`);
    }
    const right = `击杀 ${sim.kills}\n织网 ${Math.round(sim.weave)} m\n共振 ${sim.resonances}`;
    if (cache.kills !== sim.kills || cache.weave !== Math.round(sim.weave) || cache.res !== sim.resonances) {
      cache.kills = sim.kills;
      cache.weave = Math.round(sim.weave);
      cache.res = sim.resonances;
      this.tRight.setText(right);
    }
    if (cache.level !== sim.level) {
      cache.level = sim.level;
      this.tLevel.setText(`LV ${sim.level}`);
    }

    const boss = sim.enemies.find((e) => e.boss && e.alive);
    const bossLabel = boss ? `◆ BOSS  ${Math.ceil((boss.hp / boss.maxHp) * 100)}%` : '';
    if (cache.boss !== bossLabel) {
      cache.boss = bossLabel;
      this.tBoss.setText(bossLabel);
    }

    if (this.overlayKind === 'none' && sim.status === 'playing') {
      const hint =
        sim.time < 9
          ? '移动留下丝线 · 让两种元素的线交叉 → 共振爆炸'
          : this.paused
            ? '已暂停 · 按 P 继续'
            : '';
      if (this.tHint.text !== hint) this.tHint.setText(hint);
    } else if (this.tHint.text !== '') {
      this.tHint.setText('');
    }
  }
}
