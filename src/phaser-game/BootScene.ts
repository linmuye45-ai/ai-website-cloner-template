import * as Phaser from 'phaser';
import { FRAMES } from './frameConfig';

const BASE = '/vendor/sunnyland';
const TEX = `${BASE}/textures`;
const SFX = `${BASE}/audio`;

/**
 * Loads every SunnyLand asset and registers the animation library.
 * All art/audio here is CC0-1.0 (see public/vendor/sunnyland/LICENSE).
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    const { width, height } = this.scale;
    const bar = this.add.rectangle(width / 2, height / 2, 160, 8, 0x3a2a4a);
    const fill = this.add
      .rectangle(width / 2 - 80, height / 2, 0, 8, 0xffcc66)
      .setOrigin(0, 0.5);
    this.load.on('progress', (p: number) => fill.width = 160 * p);
    this.add
      .text(width / 2, height / 2 - 24, 'SUNNY LAND', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#fff2d6',
      })
      .setOrigin(0.5);

    // Actors
    this.load.spritesheet('foxy', `${TEX}/Actors/foxy.png`, FRAMES.foxy);
    this.load.spritesheet('frog', `${TEX}/Actors/frog.png`, FRAMES.frog);
    this.load.spritesheet('opossum', `${TEX}/Actors/opossum.png`, FRAMES.opossum);
    this.load.spritesheet('eagle', `${TEX}/Actors/eagle-attack.png`, FRAMES.eagle);

    // Items & FX
    this.load.spritesheet('cherry', `${TEX}/Items/cherry.png`, FRAMES.cherry);
    this.load.spritesheet('gem', `${TEX}/Items/gem.png`, FRAMES.gem);
    this.load.spritesheet('enemyDeath', `${TEX}/FX/enemy-deadth.png`, FRAMES.enemyDeath);
    this.load.spritesheet('itemFx', `${TEX}/FX/item-feedback.png`, FRAMES.itemFx);

    // World
    this.load.image('tileset', `${TEX}/Layers/tileset.png`);
    this.load.image('back', `${TEX}/Layers/back.png`);
    this.load.image('middle', `${TEX}/Layers/middle.png`);
    this.load.image('door', `${TEX}/Props/door.png`);
    this.load.image('spikes', `${TEX}/Props/spikes.png`);
    this.load.tilemapTiledJSON('level1', `${BASE}/maps/level1.json`);

    // Audio
    this.load.audio('music', `${SFX}/platformer_level03_loop.ogg`);
    this.load.audio('jump', `${SFX}/cartoon-jump-6462.mp3`);
    this.load.audio('hurt', `${SFX}/monster.mp3`);
    this.load.audio('dead', `${SFX}/dead-8bit-41400.mp3`);
    this.load.audio('stomp', `${SFX}/punch2a.mp3`);
    this.load.audio('frogQuak', `${SFX}/frog_quak-81741.mp3`);
    this.load.audio('pickup', `${SFX}/poka01.mp3`);
    this.load.audio('click', `${SFX}/button_click.wav`);

    this.load.once('complete', () => bar.destroy(), fill.destroy());
  }

  create(): void {
    // Tiny white pixel used for dust particles.
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillRect(0, 0, 2, 2);
    g.generateTexture('pixel', 2, 2);
    g.destroy();

    const anim = (key: string, texture: string, frames: number[], frameRate: number, repeat = -1) =>
      this.anims.create({
        key,
        frames: frames.map((f) => ({ key: texture, frame: f })),
        frameRate,
        repeat,
      });

    // Foxy: 6 columns. Rows: 0 idle, 1 walk, 2 climb, 4 hurt, 5 jump/fall.
    anim('foxy-idle', 'foxy', [0, 1, 2, 3, 2, 1], 6);
    anim('foxy-walk', 'foxy', [6, 7, 8, 9, 10, 11], 11);
    anim('foxy-jump', 'foxy', [30], 0, 0);
    anim('foxy-fall', 'foxy', [31], 0, 0);
    anim('foxy-hurt', 'foxy', [24, 25], 8);

    // Frog: row 0 idle, row 1 jump(f1)/fall(f2).
    anim('frog-idle', 'frog', [0, 1, 2, 3], 4);
    anim('frog-jump', 'frog', [5], 0, 0);
    anim('frog-fall', 'frog', [6], 0, 0);

    anim('opossum-walk', 'opossum', [0, 1, 2, 3, 4, 5], 9);
    anim('eagle-fly', 'eagle', [0, 1, 2, 3], 7);
    anim('cherry-idle', 'cherry', [0, 1, 2, 3, 4], 8);
    anim('gem-idle', 'gem', [0, 1, 2, 3, 4], 8);
    anim('enemy-death', 'enemyDeath', [0, 1, 2, 3, 4, 5], 14, 0);
    anim('item-fx', 'itemFx', [0, 1, 2, 3, 4], 14, 0);

    this.scene.start('Play');
  }
}
