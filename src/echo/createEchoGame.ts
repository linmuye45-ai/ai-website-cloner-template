import * as Phaser from 'phaser';
import { VIEW } from './sim/config';
import { EchoScene } from './EchoScene';

/**
 * Phaser factory for ECHOWEAVE. Everything visual is drawn procedurally with
 * Graphics, so there is nothing to preload and no third-party art.
 */
export function createEchoGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: VIEW.w,
    height: VIEW.h,
    backgroundColor: '#07070f',
    pixelArt: false,
    roundPixels: false,
    antialias: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
      keyboard: true,
      gamepad: false,
    },
    scene: [EchoScene],
  });
}
