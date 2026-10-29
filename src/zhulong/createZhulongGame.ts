import * as Phaser from 'phaser';
import { VIEW } from './sim/config';
import { ZhulongScene } from './ZhulongScene';

/**
 * Canvas-first game shell: no page chrome, no scroll, everything the player
 * needs is drawn inside the frame.
 */
export function createZhulongGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: VIEW.w,
    height: VIEW.h,
    backgroundColor: '#08060d',
    pixelArt: false,
    antialias: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: { keyboard: true, gamepad: false },
    scene: [ZhulongScene],
  });
}
