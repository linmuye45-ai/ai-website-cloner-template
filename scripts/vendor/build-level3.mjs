/**
 * Builds level3.tmj: a remixed third stage on top of the CC0 SunnyLand
 * level2 terrain. Terrain tiles stay untouched (so every tile combination
 * is native art), while gameplay objects are re-authored into a denser
 * layout and a few solid floating platforms are stamped in with a tile
 * id proven solid by the upstream tileset properties.
 *
 * Run via `npm run vendor:maps` (prepare-sunnyland.mjs imports this).
 */
export function buildLevel3(level2, tileset) {
  const map = JSON.parse(JSON.stringify(level2));
  const { width, layers } = map;
  const solidIds = new Set(
    tileset.tiles
      .filter((t) => t.properties?.some((p) => p.name === 'solid' && p.value))
      .map((t) => t.id + 1), // Tiled GIDs are 1-based in map data
  );
  const main = layers.find((l) => l.name === 'main' && l.type === 'tilelayer');
  const used = new Set(main.data.filter((v) => v > 0));
  // Smallest solid block id actually used in this terrain -> safe to stamp.
  const blockId = [...solidIds].filter((id) => used.has(id)).sort((a, b) => a - b)[0];

  // Stamp three floating platforms (col,row,lengthCells) over open air.
  const stamps = [
    [12, 17, 3],
    [24, 14, 4],
    [38, 16, 3],
  ];
  for (const [col, row, len] of stamps) {
    for (let x = col; x < col + len; x += 1) {
      for (let y = row; y < row + 2; y += 1) main.data[y * width + x] = blockId;
    }
  }

  const obj = (name, x, y, w, h) => ({
    name, x, y, width: w, height: h, visible: true, type: '',
    rotation: 0, id: 0, point: false,
  });
  const objects = [
    obj('player', 32, 128, 32, 32),
    // Ground patrols on the same shelves the upstream objects used.
    obj('opossum', 300, 335, 36, 28),
    obj('opossum', 600, 335, 36, 28),
    obj('frog', 220, 165, 35, 32),
    obj('frog', 760, 165, 35, 32),
    // Aerial patrols.
    obj('eagle', 360, 130, 40, 41),
    obj('eagle', 640, 90, 40, 41),
    // Reward lines, including gems on the stamped platforms.
    ...[
      [200, 250], [216, 250], [232, 250],
      [392, 224], [408, 224],
      [616, 196], [632, 196],
    ].map(([x, y]) => obj('gem', x, y, 15, 13)),
    obj('fruit', 127, 320, 21, 21),
    obj('fruit', 480, 300, 21, 21),
    obj('fruit', 700, 140, 21, 21),
    // Same exit shelf as the source map.
    obj('win', 881, 71, 14, 73),
  ];
  objects.forEach((o, i) => { o.id = i + 1; });
  const objectLayer = layers.find((l) => l.type === 'objectgroup');
  objectLayer.objects = objects;
  return map;
}
