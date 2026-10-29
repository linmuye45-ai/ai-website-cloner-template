import * as Phaser from 'phaser';
import { BANDS, PLAYER, T, TILE, VIEW, WORLD, SAVE_KEY, bandAt } from './sim/config';
import type { Band } from './sim/config';
import { RunSim } from './sim/RunSim';
import { C, LIGHT_KEYS, PROP_KEYS, hex, lightUrl, propUrl } from './art';
import { ASSET_BASE } from '@/phaser-game/assets';
import { tileLook } from './sim/look';

type Keys = Record<string, Phaser.Input.Keyboard.Key>;

interface Save {
  best: number;
  banked: number;
  runs: number;
}

const readSave = (): Save => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { best: 0, banked: 0, runs: 0 };
    const p = JSON.parse(raw) as Partial<Save>;
    return { best: p.best ?? 0, banked: p.banked ?? 0, runs: p.runs ?? 0 };
  } catch {
    return { best: 0, banked: 0, runs: 0 };
  }
};

const writeSave = (s: Save): void => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  } catch {
    /* private mode: progress is per-session, which is acceptable */
  }
};

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload(): void {
    const bar = this.add.graphics();
    bar.fillStyle(C.ember, 1);
    bar.fillRect(VIEW.w / 2 - 160, VIEW.h / 2, 320 * this.load.progress, 3);

    for (const n of ['dungeon-walls', 'dungeon-floor-cement', 'cave', 'parallax-wall']) {
      this.load.image(`t_${n}`, `${ASSET_BASE}/vendor/frogatto/${n}.png`);
    }
    for (const n of ['nene-spritesheet1', 'bat-black', 'beetle-black-armor', 'mushroom-walker-green', 'jellybug-green', 'maggot-grey', 'moth-black']) {
      this.load.image(`s_${n}`, `${ASSET_BASE}/vendor/frogatto/${n}.png`);
    }
    for (const name of PROP_KEYS) this.load.image(`p_${name}`, propUrl(name));
    for (const name of LIGHT_KEYS) this.load.image(`l_${name}`, lightUrl(name));
  }

  create(): void {
    // Frogatto atlases are 8 cells wide at 32px.
    for (const n of ['dungeon-walls', 'dungeon-floor-cement', 'cave']) {
      const key = `t_${n}`;
      const src = this.textures.get(key).getSourceImage() as HTMLImageElement;
      if (!this.textures.exists(`${key}_cells`)) {
        this.textures.addSpriteSheet(`${key}_cells`, src, { frameWidth: 32, frameHeight: 32 });
      }
    }
    // Frogatto sprites are horizontal frame strips of a fixed width.
    const STRIP_W: Record<string, number> = {
      nene: 51, bat: 26, beetle: 25, mushroom: 31, jelly: 37, maggot: 28, moth: 39,
    };
    const STRIP_SRC: Record<string, string> = {
      nene: 'nene-spritesheet1',
      bat: 'bat-black',
      beetle: 'beetle-black-armor',
      mushroom: 'mushroom-walker-green',
      jelly: 'jellybug-green',
      maggot: 'maggot-grey',
      moth: 'moth-black',
    };
    for (const [k, w] of Object.entries(STRIP_W)) {
      const key = `anim_${k}`;
      if (this.textures.exists(key)) continue;
      const img = this.textures.get(`s_${STRIP_SRC[k]}`).getSourceImage() as HTMLImageElement;
      this.textures.addSpriteSheet(key, img, { frameWidth: w, frameHeight: img.height });
    }
    if (!this.anims.exists('nene-idle')) {
      const neneFrames = this.textures.get('anim_nene').frameTotal - 1;
      this.anims.create({
        key: 'nene-idle',
        frames: this.anims.generateFrameNumbers('anim_nene', { start: 0, end: Math.min(5, neneFrames - 1) }),
        frameRate: 7,
        repeat: -1,
      });
    }
    this.scene.start('title');
  }
}

export class TitleScene extends Phaser.Scene {
  private started = false;

  constructor() {
    super('title');
  }

  create(): void {
    const save = readSave();
    this.cameras.main.setBackgroundColor(hex(C.void));

    // A single ember is the only warm thing on the screen.
    const glow = this.add.image(VIEW.w / 2, 250, 'l_circle_a').setTint(C.ember).setBlendMode(Phaser.BlendModes.ADD).setScale(0.9).setAlpha(0.5);
    this.tweens.add({ targets: glow, alpha: 0.28, scale: 1.02, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    const title = this.text(VIEW.w / 2, 214, '烛 龙', 72, C.paper).setOrigin(0.5);
    title.setLetterSpacing?.(8);
    this.text(VIEW.w / 2, 292, 'Z H U L O N G', 14, C.dim).setOrigin(0.5);
    this.text(VIEW.w / 2, 336, '刀 痕 成 矿', 16, C.ember).setOrigin(0.5);
    this.text(
      VIEW.w / 2,
      366,
      '完美格挡会把敌人的力刻进石壁 — 岩壁长出矿脉，防御即是开采。',
      13,
      C.dim,
    ).setOrigin(0.5);

    const enter = this.text(VIEW.w / 2, 470, '[ 按 ENTER 下潜 ]', 20, C.emberHot).setOrigin(0.5);
    this.tweens.add({ targets: enter, alpha: 0.35, duration: 900, yoyo: true, repeat: -1 });

    this.text(VIEW.w / 2, 540, 'A / D 移动　空格 跳　J 挥刀　K 架刀（格挡）　L 烛血　F 入炉', 12, C.dim).setOrigin(0.5);
    this.text(VIEW.w / 2, 566, '在烛炉旁按 F 可将精魂入炉并换取刀法精进', 12, C.dim).setOrigin(0.5);
    this.text(VIEW.w + -32, VIEW.h - 26, `最深处 ${save.best} m　·　累计精魂 ${save.banked}　·　下潜 ${save.runs} 次`, 11, C.line).setOrigin(1, 1);

    this.input.keyboard?.once('keydown-ENTER', () => this.startRun());
    this.input.keyboard?.once('keydown-SPACE', () => this.startRun());
    this.input.once('pointerdown', () => this.startRun());
  }

  private startRun(): void {
    if (this.started) return;
    this.started = true;
    this.cameras.main.fadeOut(260, 5, 3, 10);
    this.time.delayedCall(280, () => this.scene.start('game'));
  }

  private text(x: number, y: number, body: string, size: number, color: number): Phaser.GameObjects.Text {
    return this.add
      .text(x, y, body, {
        fontFamily: 'VonwaonBitmap, monospace',
        fontSize: `${size}px`,
        color: hex(color),
      })
      .setResolution(2);
  }
}

export class GameScene extends Phaser.Scene {
  sim!: RunSim;
  private keys!: Keys;
  private worldRoot!: Phaser.GameObjects.Container;
  private uiRoot!: Phaser.GameObjects.Container;
  private tilePool: Phaser.GameObjects.Image[] = [];
  private cellKey: string[] = [];
  private oreCells: { x: number; y: number; r: number }[] = [];
  private dark!: Phaser.GameObjects.RenderTexture;
  private glows: Phaser.GameObjects.Image[] = [];
  private farWall!: Phaser.GameObjects.TileSprite;
  private motes!: Phaser.GameObjects.Graphics;
  private player!: Phaser.GameObjects.Sprite;
  private playerGlow!: Phaser.GameObjects.Image;
  private fx!: Phaser.GameObjects.Graphics;
  private baseGfx!: Phaser.GameObjects.Graphics;
  private hud!: Phaser.GameObjects.Graphics;
  private uiCam!: Phaser.Cameras.Scene2D.Camera;
  private enemies: Phaser.GameObjects.Image[] = [];
  private chips: Phaser.GameObjects.Image[] = [];
  private pauseOverlay: Phaser.GameObjects.Container | null = null;
  private pauseKind: 'none' | 'help' | 'defeat' | 'shop' = 'none';
  private shopItems: { key: string; name: string; desc: string; cost: number }[] = [];
  private shopSel = 0;
  private paused = false;
  private banner = '';
  private bannerT = 0;
  private lastBand = -1;
  private save: Save = { best: 0, banked: 0, runs: 0 };
  private seed = 1;
  private shownFps = 0;
  private touch: { left: boolean; right: boolean } = { left: false, right: false };

  constructor() {
    super('game');
  }

  create(): void {
    // Phaser reuses the Scene instance across scene.restart(), so every
    // per-run collection has to be dropped or the second run draws corpses.
    this.tilePool = [];
    this.cellKey = [];
    this.glows = [];
    this.enemies = [];
    this.chips = [];
    this.flames = [];
    this.hudTexts = {};
    this.stamp = null;
    this.pauseOverlay = null;
    this.pauseKind = 'none';
    this.paused = false;
    this.bannerT = 0;
    this.lastBand = -1;
    this.shopItems = [];
    this.shopSel = 0;

    this.save = readSave();
    this.save.runs += 1;
    writeSave(this.save);
    this.seed = (Date.now() ^ (this.save.runs * 2654435761)) >>> 0;
    this.sim = new RunSim(this.seed);

    this.worldRoot = this.add.container(0, 0);
    this.uiRoot = this.add.container(0, 0).setDepth(1000);

    // Far wall: the same stone mass pushed back by parallax and fog.
    this.farWall = this.add
      .tileSprite(0, 0, VIEW.w / 3 + 64, VIEW.h / 3 + 64, 't_parallax-wall')
      .setOrigin(0.5)
      .setScrollFactor(0.45)
      .setTint(0x3a3048)
      .setAlpha(0.55);
    this.farWall.setTileScale(4, 4);
    this.worldRoot.add(this.farWall);

    this.motes = this.add.graphics();
    this.uiRoot.add(this.motes);

    this.baseGfx = this.add.graphics();
    this.worldRoot.add(this.baseGfx);
    this.fx = this.add.graphics();
    this.worldRoot.add(this.fx);
    this.player = this.add.sprite(this.sim.px, this.sim.py, 'anim_nene', 0).setOrigin(0.5, 0.5).setScale(1.15);
    this.player.play({ key: 'nene-idle', frameRate: 7, repeat: -1 });
    this.playerGlow = this.add.image(0, 0, 'l_circle_a').setTint(C.ember).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.16).setScale(0.1);
    this.worldRoot.add(this.playerGlow);
    this.worldRoot.add(this.player);

    const cells = 34 * 22;
    for (let i = 0; i < cells; i += 1) {
      const img = this.add.image(0, 0, 't_dungeon-walls_cells', 0).setOrigin(0, 0).setVisible(false);
      this.tilePool.push(img);
      this.cellKey.push('');
      this.worldRoot.add(img);
    }
    this.worldRoot.sendToBack(this.fx);

    for (let i = 0; i < LIGHT_KEYS.length * 2; i += 1) {
      const g = this.add.image(0, 0, `l_${LIGHT_KEYS[i % LIGHT_KEYS.length]}`).setBlendMode(Phaser.BlendModes.ADD).setVisible(false);
      this.glows.push(g);
      this.uiRoot.add(g);
    }
    this.dark = this.add.renderTexture(0, 0, VIEW.w, VIEW.h).setOrigin(0, 0);
    this.uiRoot.add(this.dark);
    this.dark.setDepth(0);
    // glows must sit above the darkness plate
    for (const g of this.glows) this.uiRoot.bringToTop(g);

    this.hud = this.add.graphics();
    this.uiRoot.add(this.hud);

    this.cameras.main.setBounds(0, 0, WORLD.w * TILE, WORLD.h * TILE);
    this.cameras.main.setZoom(3);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(40, 30);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.fadeIn(400, 5, 3, 10);

    this.uiCam = this.cameras.add(0, 0, VIEW.w, VIEW.h);
    this.uiCam.setName('ui');
    this.uiCam.ignore(this.worldRoot);
    this.cameras.main.ignore(this.uiRoot);

    this.keys = this.input.keyboard!.addKeys('A,D,W,S,SPACE,J,K,L,F,ESC,R,ENTER,E') as Keys;
    this.input.keyboard!.on('keydown-ESC', () => this.toggleHelp());
    this.input.keyboard!.on('keydown-ONE', () => this.pickShop(0));
    this.input.keyboard!.on('keydown-TWO', () => this.pickShop(1));
    this.input.keyboard!.on('keydown-THREE', () => this.pickShop(2));

    this.banner = BANDS[0].name + '　' + BANDS[0].line;
    this.bannerT = 3.2;
    this.lastBand = 0;

    this.bindTouch();
  }

  private bindTouch(): void {
    this.input.removeAllListeners('pointerdown');
    this.input.removeAllListeners('pointerup');
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.x < VIEW.w * 0.3) this.touch.left = true;
      else this.touch.right = true;
    });
    this.input.on('pointerup', () => {
      this.touch.left = false;
      this.touch.right = false;
    });
  }

  private toggleHelp(): void {
    if (this.pauseKind === 'defeat' || this.pauseKind === 'shop' || this.sim.dead) return;
    if (this.pauseKind === 'help') {
      this.clearOverlay();
      return;
    }
    this.paused = true;
    this.pauseKind = 'help';
    const c = this.add.container(0, 0);
    const g = this.add.graphics();
    panel(g, 320, 150, 640, 400);
    c.add(g);
    c.add(this.label(352, 176, '刀 法', 20, C.emberHot));
    const lines = [
      'A / D　左右移动　　空格　跳（可二段轻浮）',
      'J　　　挥刀：同时斩敌与凿石',
      'K　　　架刀：0.2 秒内挡住来袭 → 完美格挡',
      'L　　　烛血：回复生命（每次下潜有限）',
      'F　　　在烛炉旁：精魂入炉 / 刀法精进',
      'ESC　　收起此页　　R　　死亡后重来',
      '',
      '完美格挡会把敌人的力刻进最近的石壁，',
      '石壁随即长出矿脉 — 你越会防，矿就越多。',
      '未入炉的精魂在死亡时全部散尽。',
    ];
    lines.forEach((t, i) => c.add(this.label(352, 222 + i * 26, t, 13, i > 6 ? C.dim : C.paper)));
    this.uiRoot.add(c);
    this.pauseOverlay = c;
  }

  private clearOverlay(): void {
    this.pauseOverlay?.destroy(true);
    this.pauseOverlay = null;
    this.pauseKind = 'none';
    this.paused = false;
    this.shopItems = [];
  }

  private label(x: number, y: number, body: string, size: number, color: number, origin = 0): Phaser.GameObjects.Text {
    return this.add
      .text(x, y, body, { fontFamily: 'VonwaonBitmap, monospace', fontSize: `${size}px`, color: hex(color) })
      .setOrigin(origin, 0)
      .setResolution(2);
  }

  update(_t: number, deltaMs: number): void {
    const dt = Math.min(0.033, deltaMs / 1000);
    const sim = this.sim;

    if (sim.dead) {
      if (sim.deathT > 1.1 && this.pauseKind !== 'defeat') this.showDefeat();
      this.sim.stepParticlesOnly(dt);
    } else if (this.pauseKind === 'shop') {
      this.handleShopInput();
    } else if (this.paused) {
      /* help overlay: world holds still */
    } else {
      sim.update(dt, this.readInput());
    }

    this.drawWorld(dt);
    this.drawMotes();
    this.drawHud(dt);
    this.updateCamera();
  }

  private readInput() {
    const k = this.keys;
    const left = k.A.isDown || k.LEFT?.isDown || this.touch.left;
    const right = k.D.isDown || this.touch.right;
    const jd = (key: Phaser.Input.Keyboard.Key | undefined): boolean =>
      !!key && Phaser.Input.Keyboard.JustDown(key);
    return {
      moveX: (right ? 1 : 0) - (left ? 1 : 0),
      jumpPressed: jd(k.SPACE) || jd(k.W),
      jumpHeld: k.SPACE.isDown || k.W.isDown,
      attackPressed: jd(k.J),
      parryPressed: jd(k.K),
      drinkPressed: jd(k.L),
    };
  }

  /** Dust drifting up the shaft: the cave needs to feel occupied. */
  private drawMotes(): void {
    const g = this.motes;
    const t = this.sim.time;
    g.clear();
    for (let i = 0; i < 70; i += 1) {
      const bx = ((i * 127.1 * 13.37) % VIEW.w + VIEW.w) % VIEW.w;
      const speed = 10 + (i % 5) * 4;
      const by = (VIEW.h - ((t * speed + i * 91.3) % VIEW.h)) % VIEW.h;
      const sway = Math.sin(t * 0.8 + i) * 10;
      g.fillStyle(i % 9 === 0 ? C.emberHot : 0x8a86a8, 0.1 + (i % 4) * 0.05);
      g.fillRect(Math.round(bx + sway), Math.round(by), 2, 2);
    }
  }

  private updateCamera(): void {
    const cam = this.cameras.main;
    const lookAhead = this.sim.vy > 40 ? 40 : 0;
    cam.setFollowOffset(0, -lookAhead);
    this.farWall.setPosition(
      cam.scrollX * 0.45 + VIEW.w / (2 * cam.zoom),
      cam.scrollY * 0.45 + VIEW.h / (2 * cam.zoom),
    );
  }

  /** Convert a world point to the screen point used by the light plate. */
  private toScreen(x: number, y: number): { x: number; y: number } {
    const cam = this.cameras.main;
    return { x: (x - cam.scrollX) * cam.zoom, y: (y - cam.scrollY) * cam.zoom };
  }

  private drawWorld(dt: number): void {
    const sim = this.sim;
    const cam = this.cameras.main;
    const z = cam.zoom;
    const left = cam.scrollX - 20;
    const top = cam.scrollY - 20;
    const right = left + VIEW.w / z + 40;
    const bottom = top + VIEW.h / z + 40;
    const tx0 = Math.floor(left / TILE);
    const tx1 = Math.ceil(right / TILE);
    const ty0 = Math.floor(top / TILE);
    const ty1 = Math.ceil(bottom / TILE);

    this.oreCells.length = 0;
    this.baseGfx.clear();
    let slot = 0;
    for (let ty = ty0; ty <= ty1 && slot < this.tilePool.length; ty += 1) {
      for (let tx = tx0; tx <= tx1 && slot < this.tilePool.length; tx += 1) {
        const tile = sim.world.get(tx, ty);
        const img = this.tilePool[slot];
        if (tile === T.AIR || tile === T.BRAZIER) {
          img.setVisible(false);
          slot += 1;
          continue;
        }
        const look = tileLook((x, y) => sim.world.get(x, y), tx, ty, sim.band.tint);
        const ck = `${look.sheet}|${look.cell}|${look.tint}`;
        if (look.glow) this.oreCells.push({ x: tx * TILE + 16, y: ty * TILE + 16, r: look.glow });
        if (this.cellKey[slot] !== ck) {
          img.setTexture(`t_${look.sheet === 'walls' ? 'dungeon-walls' : look.sheet === 'floor' ? 'dungeon-floor-cement' : 'cave'}_cells`);
          img.setFrame(look.cell);
          img.setTint(look.tint);
          this.cellKey[slot] = ck;
        }
        img.setVisible(true);
        img.setPosition(tx * TILE, ty * TILE);
        this.baseGfx.fillStyle(look.base, 1);
        this.baseGfx.fillRect(tx * TILE, ty * TILE, TILE, TILE);
        slot += 1;
      }
    }
    for (let i = slot; i < this.tilePool.length; i += 1) this.tilePool[i].setVisible(false);

    this.drawBrazierFlames();
    this.syncEnemies();
    this.syncChips();
    this.drawFx(dt);
    this.composeLight();

    // player
    this.player.setPosition(sim.px + PLAYER.w / 2, sim.py + PLAYER.h / 2);
    this.player.setFlipX(sim.face < 0);
    this.player.setVisible(!(sim.dead && sim.deathT > 0.5));
    this.player.setAngle(0);
    if (sim.iframes > 0 && Math.floor(sim.iframes * 24) % 2 === 0) this.player.setAlpha(0.35);
    else this.player.setAlpha(1);
    this.player.setTint(sim.parryT > 0 ? C.jadeLight : 0xffffff);

    this.playerGlow.setPosition(sim.px + PLAYER.w / 2, sim.py + PLAYER.h / 2);
    this.playerGlow.setScale((sim.upgrades.includes('ember') ? 0.14 : 0.1) * (0.94 + Math.sin(sim.time * 6) * 0.06));
  }

  private drawBrazierFlames(): void {
    const sim = this.sim;
    const cam = this.cameras.main;
    const tx0 = Math.floor((cam.scrollX - 40) / TILE);
    const tx1 = Math.ceil((cam.scrollX + VIEW.w / 3 + 40) / TILE);
    const ty0 = Math.floor((cam.scrollY - 40) / TILE);
    const ty1 = Math.ceil((cam.scrollY + VIEW.h / 3 + 40) / TILE);
    const pool = this.flamePool();
    let i = 0;
    for (let ty = ty0; ty <= ty1; ty += 1) {
      for (let tx = tx0; tx <= tx1; tx += 1) {
        if (sim.world.get(tx, ty) !== T.BRAZIER) continue;
        const s = pool[i++];
        if (!s) return;
        s.setVisible(false);
        this.flameGfx.fillStyle(C.ember, 1).fillRect(tx * TILE + 10, ty * TILE + 14, 12, 14);
        s.setPosition(tx * TILE + 8, ty * TILE + 8);
        const flick = 1 + Math.sin(sim.time * 9 + tx * 1.7) * 0.08;
        s.setScale(flick);
      }
    }
    for (let j = i; j < pool.length; j += 1) pool[j].setVisible(false);
  }

  private flames: Phaser.GameObjects.Image[] = [];
  private flameGfx!: Phaser.GameObjects.Graphics;
  /** Torch stand plus a flame; both come from the Tiny Dungeon prop sheet. */
  private flamePool(): Phaser.GameObjects.Image[] {
    if (!this.flameGfx) {
      this.flameGfx = this.add.graphics();
      this.worldRoot.add(this.flameGfx);
    }
    this.flameGfx.clear();
    if (this.flames.length === 0) {
      for (let i = 0; i < 24; i += 1) {
        const t = this.add.image(0, 0, 'anim_nene', 0).setVisible(false);
        this.worldRoot.add(t);
        this.flames.push(t);
      }
    }
    return this.flames;
  }

  private syncEnemies(): void {
    const sim = this.sim;
    while (this.enemies.length < sim.enemies.length) {
      const img = this.add.sprite(0, 0, 'anim_bat', 0).setOrigin(0.5, 0.5).setScale(1.15);
      this.worldRoot.add(img);
      this.enemies.push(img);
    }
    for (let i = 0; i < this.enemies.length; i += 1) {
      const img = this.enemies[i];
      const e = sim.enemies[i];
      if (!e) {
        img.setVisible(false);
        continue;
      }
      const key =
        e.kind === 'knight' ? 'anim_beetle' : e.kind === 'imp' ? 'anim_moth' : e.kind === 'slime' ? 'anim_jelly' : e.kind === 'skeleton' ? 'anim_maggot' : 'anim_bat';
      if (img.texture.key !== key) img.setTexture(key);
      img.setVisible(true).setPosition(e.x + e.w / 2, e.y + e.h / 2);
      img.setFlipX(e.dir < 0);
      img.setAlpha(e.state === 'dead' ? Math.max(0, 1 - e.t / 1.4) : 1);
      img.setAngle(e.state === 'dead' ? e.dir * 70 : 0);
      if (e.state === 'windup') {
        const k = 1 + (1 - Math.max(0, e.t) / 0.46) * 0.5;
        img.setScale(k, k);
        img.setTint(0xff9a6a);
      } else if (e.state === 'stagger') {
        img.setTint(0x9fe3dd);
      } else if (e.flash > 0) {
        img.setTint(0xffffff);
      } else {
        img.setScale(1);
        img.setTint(e.armored ? 0xb9c2d8 : 0xffffff);
      }
    }
  }

  private syncChips(): void {
    const sim = this.sim;
    while (this.chips.length < sim.chips.length) {
      const img = this.add.image(0, 0, 'anim_nene', 0).setScale(0.06).setOrigin(0.5, 0.5).setAlpha(0.9);
      this.worldRoot.add(img);
      this.chips.push(img);
    }
    for (let i = 0; i < this.chips.length; i += 1) {
      const img = this.chips[i];
      const c = sim.chips[i];
      if (!c) {
        img.setVisible(false);
        continue;
      }
      img.setVisible(true).setPosition(c.x, c.y);
      img.setTint(c.kind === 0 ? 0x9fe3dd : c.kind === 1 ? 0xffc46b : 0xff8f6a);
    }
  }

  private drawFx(dt: number): void {
    const sim = this.sim;
    const g = this.fx;
    g.clear();
    const cam = this.cameras.main;
    const sh = sim.shakeT > 0 ? sim.shakeMag * (sim.shakeT / 0.3) : 0;
    if (sh > 0.2) cam.setScroll(cam.scrollX + (Math.random() - 0.5) * sh, cam.scrollY + (Math.random() - 0.5) * sh);

    if (sim.attackT > 0) {
      const p = 1 - sim.attackT / PLAYER.attackDur;
      const reach = (PLAYER.reach + (sim.upgrades.includes('reach') ? 5 : 0)) * (0.5 + p);
      const cx = sim.px + PLAYER.w / 2;
      const cy = sim.py + PLAYER.h / 2;
      g.lineStyle(2, C.emberHot, 0.9 - p * 0.9);
      g.beginPath();
      g.arc(cx, cy, reach, sim.face > 0 ? -1.1 : Math.PI + 1.1, sim.face > 0 ? 1.1 : Math.PI - 1.1, sim.face < 0);
      g.strokePath();
      g.lineStyle(4, C.ember, 0.35 - p * 0.35);
      g.beginPath();
      g.arc(cx, cy, reach - 3, sim.face > 0 ? -1.1 : Math.PI + 1.1, sim.face > 0 ? 1.1 : Math.PI - 1.1, sim.face < 0);
      g.strokePath();
    }
    for (const p of sim.pulses) {
      const a = Math.max(0, p.life / p.maxLife) * 0.8;
      g.lineStyle(1, p.kind === 1 ? C.jadeLight : p.kind === 2 ? C.emberHot : C.gold, a);
      g.strokeCircle(p.x, p.y, p.r);
    }
    for (const p of sim.particles) {
      const a = Math.max(0, p.life / p.max);
      g.fillStyle(p.kind === 1 ? C.emberHot : p.kind === 2 ? C.jadeLight : C.stone, a);
      g.fillRect(p.x, p.y, p.size, p.size);
    }

    // ore: a hard bright core plus bloom, so a vein reads in the dark
    for (const o of this.oreCells) {
      g.fillStyle(o.r === 2 ? 0xffefc0 : 0xffe08a, 0.5);
      g.fillRect(o.x - 3, o.y - 3, 6, 6);
      g.fillStyle(o.r === 2 ? 0xffefc0 : 0xffe08a, 1);
      g.fillRect(o.x - 2, o.y - 2, 4, 4);
    }

    // enemy telegraph: a thin arc where the blow will land
    for (const e of sim.enemies) {
      if (e.state !== 'windup') continue;
      const p = 1 - Math.max(0, e.t) / 0.46;
      g.lineStyle(1.5, p > 0.55 ? C.bloodLight : C.blood, 0.35 + p * 0.6);
      g.beginPath();
      g.arc(e.x + e.w / 2, e.y + e.h / 2, 9 + p * 9, e.dir > 0 ? -0.7 : Math.PI + 0.7, e.dir > 0 ? 0.7 : Math.PI - 0.7, e.dir < 0);
      g.strokePath();
    }
    void dt;
  }

  /** Fill the viewport with darkness, then punch holes for every light. */
  private composeLight(): void {
    const sim = this.sim;
    const rt = this.dark;
    rt.clear();
    rt.fill(0x03040c, 0.22);

    const add = (wx: number, wy: number, radius: number, texture: string): void => {
      const s = this.toScreen(wx, wy);
      const d = radius * 2 * this.cameras.main.zoom;
      const scale = d / 512;
      // origin (0,0) + explicit top-left keeps the hole centred on the light
      rt.erase(this.texture(texture).setScale(scale), s.x - d / 2, s.y - d / 2);
    };

    add(sim.px + PLAYER.w / 2, sim.py + PLAYER.h / 2, 230 * (sim.upgrades.includes('ember') ? 1.3 : 1), 'l_circle_a');
    add(sim.px + PLAYER.w / 2, sim.py + PLAYER.h / 2, 96, 'l_circle_b');

    for (let ty = Math.floor((sim.py - 200) / TILE); ty <= Math.floor((sim.py + 200) / TILE); ty += 1) {
      for (let tx = Math.floor((sim.px - 300) / TILE); tx <= Math.floor((sim.px + 300) / TILE); tx += 1) {
        const t = sim.world.get(tx, ty);
        if (t === T.BRAZIER) add(tx * TILE + 16, ty * TILE + 16, 150, 'l_circle_a_noise');
        else if (t === T.ORE) add(tx * TILE + 16, ty * TILE + 16, 30, 'l_circle_b');
        else if (t === T.RICH) add(tx * TILE + 16, ty * TILE + 16, 44, 'l_circle_b');
      }
    }
    for (const e of sim.enemies) {
      if (e.state === 'windup') add(e.x + e.w / 2, e.y + e.h / 2, 40, 'l_circle_a_streaks');
    }
    for (const p of sim.pulses) add(p.x, p.y, p.r * 3, 'l_circle_b');

    // warm additive pass so fire actually feels warm
    let gi = 0;
    const glowAt = (wx: number, wy: number, radius: number, tint: number, alpha: number): void => {
      const g = this.glows[gi++];
      if (!g) return;
      const s = this.toScreen(wx, wy);
      g.setVisible(true).setPosition(s.x, s.y).setTexture('l_circle_a_noise')
        .setScale((radius * 2 * this.cameras.main.zoom) / 512).setTint(tint).setAlpha(alpha);
    };
    glowAt(sim.px + PLAYER.w / 2, sim.py + PLAYER.h / 2, 120, C.ember, 0.3 + Math.sin(sim.time * 5) * 0.03);
    glowAt(sim.px + PLAYER.w / 2, sim.py + PLAYER.h / 2, 240, C.emberDeep, 0.12);
    for (let ty = Math.floor((sim.py - 160) / TILE); ty <= Math.floor((sim.py + 160) / TILE); ty += 1) {
      for (let tx = Math.floor((sim.px - 260) / TILE); tx <= Math.floor((sim.px + 260) / TILE); tx += 1) {
        if (sim.world.get(tx, ty) !== T.BRAZIER) continue;
        glowAt(tx * TILE + 16, ty * TILE + 12, 90, C.emberHot, 0.26);
      }
    }
    for (let i = gi; i < this.glows.length; i += 1) this.glows[i].setVisible(false);
  }

  private texture(key: string): Phaser.GameObjects.Image {
    // A throwaway image used only as an erase stamp; kept in a scratch pool.
    if (!this.stamp) this.stamp = this.add.image(0, 0, key).setOrigin(0, 0).setVisible(false);
    return this.stamp.setTexture(key);
  }

  private stamp: Phaser.GameObjects.Image | null = null;

  private drawHud(dt: number): void {
    const sim = this.sim;
    const g = this.hud;
    g.clear();
    const W = VIEW.w;

    // ---- top-left: vitals ------------------------------------------------
    g.fillStyle(0x000000, 0.55);
    g.fillRect(20, 18, 268, 62);
    g.lineStyle(1, C.line, 0.9);
    g.strokeRect(20.5, 18.5, 267, 61);
    g.fillStyle(C.blood, 1);
    g.fillRect(30, 30, 200 * (sim.hp / sim.maxHp), 9);
    g.fillStyle(0xffffff, 0.16);
    g.fillRect(30, 30, 200 * (sim.hp / sim.maxHp), 2);
    g.lineStyle(1, 0x000000, 0.6);
    g.strokeRect(29.5, 29.5, 201, 10);
    if (!this.hudTexts.hp) this.mkText();
    this.setHud('hp', 238, 26, `${Math.ceil(sim.hp)}`, 14, C.paper, 0);
    this.flaskIcon.setPosition(38, 56).setVisible(true).setTint(sim.flask > 0 ? 0xd15c52 : 0x494356);
    this.setHud('flask', 48, 60, `烛血 ${sim.flask}`, 12, sim.flask > 0 ? C.paper : C.dim, 0);

    // ---- top-right: depth + band ----------------------------------------
    this.setHud('depth', W - 24, 20, `${sim.depth} m`, 22, C.paper, 1);
    this.setHud('band', W - 24, 50, `${sim.band.name}　${sim.upgrades.length} 式`, 12, C.dim, 1);

    // ---- bottom-left: essence -------------------------------------------
    g.fillStyle(0x000000, 0.55);
    g.fillRect(20, VIEW.h - 76, 232, 56);
    g.lineStyle(1, C.line, 0.9);
    g.strokeRect(20.5, VIEW.h - 75.5, 231, 55);
    this.setHud('ess', 40, VIEW.h - 70, `精魂 ${sim.essence}`, 16, C.jadeLight, 0);
    this.setHud('bank', 40, VIEW.h - 44, `入炉 ${sim.banked}　·　精进 ${sim.upgrades.length}`, 12, C.dim, 0);
    if (sim.essence > 0) {
      const warned = sim.pending > 0;
      g.fillStyle(warned ? C.tide : C.jade, 0.25 + Math.sin(sim.time * 4) * 0.1);
      g.fillRect(20, VIEW.h - 76, 6, 56);
    }

    // ---- combo / log ----------------------------------------------------
    if (sim.combo > 1) {
      this.setHud('combo', W / 2, 40, `${sim.combo} 连`, 26, C.emberHot, 0.5);
      this.hudTexts.combo.setAlpha(Math.min(1, sim.comboT), 0);
    } else this.setHud('combo', W / 2, 40, '', 26, C.emberHot, 0.5);

    sim.log.slice(0, 3).forEach((l, i) => {
      const a = Math.min(1, 3.6 - (sim.time - l.t));
      this.setHud(`log${i}`, W / 2, VIEW.h - 130 + i * 22, l.text, 15, i === 0 ? C.emberHot : C.paper, 0.5);
      this.hudTexts[`log${i}`].setAlpha(a, 0);
    });
    for (let i = 3; i < 6; i += 1) if (this.hudTexts[`log${i}`]) this.setHud(`log${i}`, 0, 0, '', 12, C.dim, 0.5);

    // ---- brazier prompt -------------------------------------------------
    const braz = sim.world.brazierNear(sim.px, sim.py);
    if (braz && !sim.dead) {
      this.shopItems = this.buildShop();
      this.setHud('prompt', braz.x, braz.y - 34, '烛炉', 12, C.emberHot, 0.5);
      this.hudTexts.prompt.setDepth(2);
      this.setHud('prompt2', W / 2, VIEW.h - 176, '按 F：入炉精魂 / 刀法精进', 13, C.paper, 0.5);
      if (this.pauseKind === 'none' && !this.paused && Phaser.Input.Keyboard.JustDown(this.keys.F)) this.openShop();
    } else {
      this.setHud('prompt', 0, 0, '', 12, C.emberHot, 0.5);
      this.setHud('prompt2', 0, 0, '', 12, C.paper, 0.5);
    }

    // ---- first-minute coaching -----------------------------------------
    if (sim.time < 9 && sim.depth < 60) {
      this.setHud('hint', W / 2, VIEW.h - 210, 'A / D 移动　空格 跳　J 挥刀　K 架刀　L 烛血', 13, C.paper, 0.5);
      this.hudTexts.hint.setAlpha(Math.min(1, (9 - sim.time) / 2), 0);
    } else this.setHud('hint', 0, 0, '', 12, C.paper, 0.5);

    // ---- tide warning ---------------------------------------------------
    if (sim.tideWarn > 0) {
      const a = 0.1 + Math.min(0.3, (3.2 - sim.tideWarn) * 0.12);
      g.fillStyle(C.tide, a);
      g.fillRect(0, 0, W, 90);
      this.setHud('tide', W / 2, 96, '暗潮将起', 16, C.bloodLight, 0.5);
    } else this.setHud('tide', 0, 0, '', 12, C.bloodLight, 0.5);

    // ---- banner ---------------------------------------------------------
    if (this.bannerT > 0 && this.banner) {
      this.bannerT -= dt;
      const a = Math.min(1, this.bannerT);
      this.setHud('banner', W / 2, VIEW.h / 2 - 120, this.banner, 26, C.paper, 0.5);
      this.hudTexts.banner.setAlpha(a, 0);
    } else this.setHud('banner', 0, 0, '', 12, C.paper, 0.5);

    if (this.lastBand !== (BANDS.findIndex((b) => b === sim.band))) {
      this.lastBand = BANDS.indexOf(sim.band);
      if (sim.depth > 4) {
        this.banner = `${sim.band.name}　${sim.band.line}`;
        this.bannerT = 3.4;
      }
    }

    // damage vignette
    if (sim.hitFlash > 0) {
      g.fillStyle(C.blood, sim.hitFlash * 0.28);
      g.fillRect(0, 0, W, VIEW.h);
    }
    void this.shownFps;
  }

  private hudTexts: Record<string, Phaser.GameObjects.Text> = {};
  private flaskIcon!: Phaser.GameObjects.Image;

  private mkText(): void {
    this.flaskIcon = this.add.image(38, 56, 'anim_nene', 0).setScale(0.5).setOrigin(0.5);
    this.uiRoot.add(this.flaskIcon);
    for (const k of ['hp', 'flask', 'depth', 'band', 'ess', 'bank', 'combo', 'log0', 'log1', 'log2', 'log3', 'log4', 'log5', 'prompt', 'prompt2', 'tide', 'banner', 'hint']) {
      const t = this.add
        .text(0, 0, '', { fontFamily: 'VonwaonBitmap, monospace', fontSize: '16px', color: '#ffffff' })
        .setResolution(2);
      this.uiRoot.add(t);
      this.hudTexts[k] = t;
    }
  }

  private setHud(key: string, x: number, y: number, body: string, size: number, color: number, origin: number): void {
    const t = this.hudTexts[key];
    if (!t) return;
    if (t.text !== body) t.setText(body);
    if (t.style.fontSize !== `${size}px`) t.setFontSize(size);
    if (t.style.color !== hex(color)) t.setColor(hex(color));
    t.setPosition(x, y).setOrigin(origin, 0);
    t.setVisible(body.length > 0);
  }

  private buildShop() {
    const s = this.sim;
    const costs = [3, 5, 8];
    const names = [
      { key: 'edge', name: '刃 · 淬　刀伤 +18%' },
      { key: 'tempo', name: '步 · 疾　移动更快' },
      { key: 'vigor', name: '体 · 厚　生命上限 +25' },
      { key: 'vein', name: '脉 · 生　刀痕更长更丰' },
      { key: 'parry', name: '心 · 静　格挡判定 +35%' },
      { key: 'ember', name: '火 · 旺　烛火更远' },
      { key: 'bank', name: '炉 · 固　入炉 +25%' },
      { key: 'reach', name: '臂 · 长　挥击更远' },
    ].filter((n) => !s.upgrades.includes(n.key));
    const out = names.slice(0, 3).map((n, i) => ({ ...n, desc: '', cost: costs[i] + s.spent }));
    return out;
  }

  private openShop(): void {
    const sim = this.sim;
    this.paused = true;
    this.pauseKind = 'shop';
    this.shopSel = 0;
    this.shopItems = this.buildShop();
    const c = this.add.container(0, 0);
    const g = this.add.graphics();
    panel(g, 300, 130, 680, 460);
    c.add(g);
    c.add(this.label(340, 154, '烛 炉', 22, C.emberHot));
    c.add(this.label(340, 186, `精魂 ${sim.essence}　入炉 ${sim.banked}　按 1 / 2 / 3 选择　ESC 离开`, 12, C.dim));
    this.shopItems.forEach((it, i) => {
      const y = 218 + i * 96;
      const gg = this.add.graphics();
      gg.fillStyle(0x000000, 0.45);
      gg.fillRect(340, y, 600, 78);
      gg.lineStyle(1, C.line, 1);
      gg.strokeRect(340.5, y + 0.5, 599, 77);
      c.add(gg);
      c.add(this.label(360, y + 14, `${i + 1}　${it.name}`, 17, C.paper));
      c.add(this.label(360, y + 46, `消耗 ${it.cost} 精魂`, 12, C.jadeLight));
    });
    if (this.shopItems.length === 0) c.add(this.label(360, 230, '刀法已尽极。', 17, C.dim));
    c.add(this.label(340, 520, '入炉：在烛炉旁自动完成，把精魂带回地面。', 12, C.dim));
    this.uiRoot.add(c);
    this.pauseOverlay = c;
  }

  private handleShopInput(): void {
    const k = this.keys;
    if (Phaser.Input.Keyboard.JustDown(k.ENTER)) this.pickShop(this.shopSel);
    if (Phaser.Input.Keyboard.JustDown(k.ESC) || Phaser.Input.Keyboard.JustDown(k.F)) this.clearOverlay();
    if (Phaser.Input.Keyboard.JustDown(k.A)) this.shopSel = Math.max(0, this.shopSel - 1);
    if (Phaser.Input.Keyboard.JustDown(k.D)) this.shopSel = Math.min(this.shopItems.length - 1, this.shopSel + 1);
  }

  private pickShop(i: number): void {
    if (this.pauseKind !== 'shop') return;
    const it = this.shopItems[i];
    if (!it) return;
    if (this.sim.essence < it.cost) {
      this.sim.say('精魂不足');
      return;
    }
    this.sim.essence -= it.cost;
    this.sim.spent += 1;
    this.sim.upgrades.push(it.key);
    if (it.key === 'vigor') {
      this.sim.maxHp += 25;
      this.sim.hp = this.sim.maxHp;
    }
    this.sim.say(`${it.name.split('　')[0]} 已成`);
    this.clearOverlay();
  }

  private showDefeat(): void {
    const sim = this.sim;
    this.pauseKind = 'defeat';
    this.paused = true;
    this.save.best = Math.max(this.save.best, sim.depth);
    this.save.banked += 0;
    writeSave(this.save);
    const c = this.add.container(0, 0);
    const g = this.add.graphics();
    panel(g, 360, 150, 560, 400);
    c.add(g);
    c.add(this.label(640, 178, '刀 落', 30, C.bloodLight, 0.5));
    c.add(this.label(640, 224, `深 ${sim.depth} m　·　斩 ${sim.kills}　·　完美格挡 ${sim.perfects}`, 15, C.paper, 0.5));
    c.add(this.label(640, 260, `入炉精魂 ${sim.banked}　·　精进 ${sim.upgrades.length} 式`, 13, C.dim, 0.5));
    c.add(this.label(640, 296, sim.essence > 0 ? '未入炉的精魂已散尽。' : '没有精魂留在身上——走得很干净。', 13, C.dim, 0.5));
    c.add(this.label(640, 476, '[ 按 R 再下一次 ]', 18, C.emberHot, 0.5));
    this.uiRoot.add(c);
    this.pauseOverlay = c;
    this.input.keyboard?.once('keydown-R', () => {
      this.clearOverlay();
      this.scene.restart();
    });
  }
}

function panel(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number): void {
  g.fillStyle(0x07050d, 0.94);
  g.fillRect(x, y, w, h);
  g.lineStyle(1, C.line, 1);
  g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  g.lineStyle(1, 0x000000, 0.8);
  g.strokeRect(x + 4.5, y + 4.5, w - 9, h - 9);
  g.lineStyle(2, C.ember, 0.55);
  g.lineBetween(x + 14, y + 1, x + 74, y + 1);
  g.lineBetween(x + w - 74, y + h - 1, x + w - 14, y + h - 1);
}

export async function createZhulongGame(parent: HTMLElement): Promise<Phaser.Game> {
  try {
    await document.fonts.load('16px VonwaonBitmap');
    await document.fonts.ready;
  } catch {
    /* fall back to monospace */
  }
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: VIEW.w,
    height: VIEW.h,
    backgroundColor: '#0a0d16',
    pixelArt: true,
    roundPixels: true,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [BootScene, TitleScene, GameScene],
    audio: { noAudio: true },
  });
}

export const BAND_INFO: Band[] = BANDS;
export const bandName = (row: number): string => bandAt(row).name;
