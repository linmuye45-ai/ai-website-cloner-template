/**
 * Prepares SunnyLand (CC0-1.0, WispSnow/SunnyLand) Tiled maps for Phaser 3.
 *
 * The source .tmj files reference external tilesets via {firstgid, source}.
 * Phaser needs embedded tileset definitions, so this script:
 *   1. inlines tileset.tsj into each map's `tilesets` array (firstgid 1);
 *   2. rewrites the tileset image path to the vendored web path;
 *   3. drops the actor/prop collection references (we spawn those manually);
 *   4. emits plain JSON the Phaser tilemap loader can consume directly.
 *
 * Usage: node scripts/vendor/prepare-sunnyland.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const mapsDir = join(root, 'scripts/vendor/sunnyland/maps');
const outDir = join(root, 'public/vendor/sunnyland/maps');

const tileset = JSON.parse(await readFile(join(mapsDir, 'tileset.tsj'), 'utf8'));
tileset.image = '/vendor/sunnyland/textures/Layers/tileset.png';

for (const name of ['level0', 'level1', 'level2']) {
  const map = JSON.parse(await readFile(join(mapsDir, `${name}.tmj`), 'utf8'));
  map.tilesets = [
    { firstgid: 1, ...tileset },
  ];
  // Image layers (far/mid parallax) keep only the vendored file name.
  for (const layer of map.layers) {
    if (layer.type === 'imagelayer' && layer.image) {
      const file = layer.image.split('/').pop();
      layer.image = `/vendor/sunnyland/textures/Layers/${file}`;
    }
  }
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, `${name}.json`), JSON.stringify(map));
  console.log(`prepared ${name} (${map.width}x${map.height})`);
}
