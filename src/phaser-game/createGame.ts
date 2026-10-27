import * as Phaser from 'phaser';
import { BootScene } from './BootScene';
import { PlayScene, PHASER_VIEW } from './PlayScene';

/**
 * Phaser 3 game factory. Rendered only on the client (the React wrapper
 * dynamically imports this module inside useEffect).
 */
export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: PHASER_VIEW.width,
    height: PHASER_VIEW.height,
    backgroundColor: '#1b1230',
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: PHASER_VIEW.gravity },
        debug: false,
      },
    },
    input: {
      keyboard: true,
      gamepad: true,
    },
    scene: [BootScene, PlayScene],
  });
}

export type { PlayScene };
