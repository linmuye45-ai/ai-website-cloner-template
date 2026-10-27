# Third-Party Asset & Engine Attribution

## Sunny Land asset pack — CC0 1.0 Universal

- Source: https://github.com/WispSnow/SunnyLand
- License: CC0-1.0 (public domain dedication), full text in `LICENSE`
- Used in this project under `public/vendor/sunnyland/`:
  - Actor spritesheets: foxy, frog, opossum, eagle (`textures/Actors/`)
  - Tileset, parallax layers, props, UI kit (`textures/`)
  - Items and particle FX (`textures/Items/`, `textures/FX/`)
  - Music loop and SFX (`audio/`)
  - Tiled map sources (`scripts/vendor/sunnyland/maps/`, prepared into
    `public/vendor/sunnyland/maps/` by `scripts/vendor/prepare-sunnyland.mjs`)
- Frame geometry and hitboxes follow the upstream `actor.tsj` definitions.

## Phaser 3 — MIT License

- Source: https://github.com/phaserjs/phaser
- Installed via npm as the `phaser` dependency; game engine only, no art.

All other code in this repository is original work.
