/**
 * Headless smoke checks for the Phaser Sunny Land build.
 * No browser/DOM available in CI, so this validates the data contract the
 * PlayScene depends on: prepared Tiled map, embedded collision tiles,
 * object-layer spawns, and every asset BootScene loads actually on disk.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', '..');
const pub = path.join(root, 'public', 'vendor', 'sunnyland');
let failures = 0;
const check = (name, cond) => {
  if (!cond) {
    failures += 1;
    console.error(`FAIL  ${name}`);
  } else {
    console.log(`ok    ${name}`);
  }
};

const pngSize = (file) => {
  const b = fs.readFileSync(file);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
};

// --- Map contract -------------------------------------------------------
const map = JSON.parse(fs.readFileSync(path.join(pub, 'maps', 'level1.json'), 'utf8'));
const layerNames = map.layers.map((l) => l.name);
check('map has back/main/object layers', ['back', 'main', 'object'].every((n) => layerNames.includes(n)));

const ts = map.tilesets[0];
check('tileset embedded with web image path', ts.image === '/vendor/sunnyland/textures/Layers/tileset.png');
const solidTiles = ts.tiles.filter((t) => t.properties?.some((p) => p.name === 'solid' && p.value));
check('tileset exposes solid collision tiles', solidTiles.length >= 30);

const objs = map.layers.find((l) => l.type === 'objectgroup').objects;
const counts = objs.reduce((acc, o) => ((acc[o.name] = (acc[o.name] || 0) + 1), acc), {});
check('player spawn exists', counts.player === 1);
check('three enemy archetypes placed', (counts.frog || 0) >= 1 && (counts.opossum || 0) >= 1 && (counts.eagle || 0) >= 1);
check('pickups placed', (counts.gem || 0) >= 1 && (counts.fruit || 0) >= 1);
check('level exit (level2) exists', (counts.level2 || 0) === 1);

// --- Asset existence ----------------------------------------------------
const files = [
  'textures/Actors/foxy.png', 'textures/Actors/frog.png',
  'textures/Actors/opossum.png', 'textures/Actors/eagle-attack.png',
  'textures/Items/cherry.png', 'textures/Items/gem.png',
  'textures/FX/enemy-deadth.png', 'textures/FX/item-feedback.png',
  'textures/Layers/tileset.png', 'textures/Layers/back.png', 'textures/Layers/middle.png',
  'textures/Props/door.png', 'textures/UI/Heart.png', 'textures/UI/Heart-bg.png',
  'audio/platformer_level03_loop.ogg', 'audio/cartoon-jump-6462.mp3',
  'audio/monster.mp3', 'audio/dead-8bit-41400.mp3', 'audio/punch2a.mp3',
  'audio/frog_quak-81741.mp3', 'audio/poka01.mp3', 'audio/button_click.wav',
];
for (const f of files) check(`asset exists: ${f}`, fs.existsSync(path.join(pub, f)));

// --- Spritesheet geometry matches frameConfig ---------------------------
const sheets = {
  'textures/Actors/foxy.png': [198, 384],
  'textures/Actors/frog.png': [140, 64],
  'textures/Actors/opossum.png': [216, 28],
  'textures/Actors/eagle-attack.png': [160, 41],
  'textures/Items/cherry.png': [105, 21],
  'textures/Items/gem.png': [75, 13],
  'textures/FX/enemy-deadth.png': [240, 41],
  'textures/FX/item-feedback.png': [160, 32],
};
for (const [f, [w, h]] of Object.entries(sheets)) {
  const s = pngSize(path.join(pub, f));
  check(`sheet size ${f} = ${w}x${h}`, s.width === w && s.height === h);
}

check('CC0 license shipped', fs.existsSync(path.join(pub, 'LICENSE')));
check('attribution file shipped', fs.existsSync(path.join(pub, 'ATTRIBUTION.md')));

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll Phaser smoke checks passed.');
