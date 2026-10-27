# Duskfall Survivors

A complete, original **16-bit pixel-art horde-survival game** that runs entirely in the
browser. Auto-firing weapons, fifteen minutes of escalating waves, screen-filling bosses,
roguelite upgrade drafts, a persistent vault and a full bestiary — built on Next.js 16,
React 19 and the **Canvas 2D API** (no Three.js, no DOM-rectangle "models").

> Every sprite is authored as an explicit pixel map and rendered nearest-neighbour
> (see [`src/game/sprites.ts`](src/game/sprites.ts)); every sound and the adaptive
> soundtrack are synthesized at runtime with the Web Audio API
> ([`src/game/audio.ts`](src/game/audio.ts)). No third-party game art, audio or names
> are bundled — characters, enemies, weapons and lore are all original.

## Play

```bash
npm install
npm run dev      # http://localhost:3000
```

### Controls

| Input | Action |
| --- | --- |
| `WASD` / arrow keys | Move |
| `Esc` / `P` | Pause |
| `1`–`4` | Pick a level-up upgrade |
| Touch | Drag anywhere for the virtual joystick |

Weapons fire automatically. Collect XP gems to level up, draft three upgrades per level,
and survive the bosses at **05:00 / 10:00 / 14:00** until the stage clears at **15:00**.
Cleared runs can continue in endless mode with continuously scaling difficulty.

## Features

- **8 weapons, 8 ranks each** — homing bolts, arcing whips, lobbing axes, directional
  daggers, a damage aura, orbiting tomes, called lightning and a nova ring, each with
  distinct projectile/zone/behaviour code.
- **10 passive relics** (might, cooldown, area, speed, health, magnet, regen, armor,
  growth, luck) and weighted upgrade drafts so builds cohere.
- **4 playable survivors** (two unlockable with vault coins) and **3 hand-built stages**
  with palettes, props, enemy rosters, tinted variant monsters and three bosses each.
- **Four enemy AI archetypes** beyond the chasing horde — ranged cultists that kite and
  fire arcane bolts, charging beetles with a telegraphed wind-up, fuse-lit bloaters that
  explode in an area, and slimes that split into smaller kin on death.
- **Dynamic night lighting** — a screen-space darkness layer deepens over the first eight
  minutes, punched through by the player's flickering light pool, projectile glows,
  lightning strikes and explosions, plus stage weather (drifting fog, spores, embers).
- **Game feel** — freeze-frame hit stops, spawn portals, death shockwaves, per-enemy
  health bars, fuse rings and charge tells, layered on top of particles, damage numbers
  and screen shake.
- **Upgrade meta controls** — two rerolls per run and a skip option that banks a quarter
  level of XP, alongside the weighted three-card draft.
- **Full game loop** — title, character/stage select, field manual (with threat atlas),
  bestiary & records, run HUD, level-up modals, boss chests, pause, defeat/victory
  screens, achievements and `localStorage` persistence.
- **Procedural presentation** — pixel sprites generated in code, ground tiles, fog
  vignette, particles, damage numbers, screen shake, chiptune music that intensifies
  with the clock and ~16 synthesized SFX.
- **Headless test harness** — a DOM/canvas stub drives the real engine through thousands
  of frames (sprite integrity, every character × stage combo, upgrades, chests, death,
  victory, endless continuation and achievements).

## Project structure

```
src/
  app/                     Next.js App Router (single state-driven screen machine)
    page.tsx               routing between title / select / manual / collection / game
    layout.tsx, globals.css  dark gothic pixel theme, scanlines, chunky UI buttons
  components/game/
    GameView.tsx           canvas host + HUD + all modals + touch joystick
    TitleScreen.tsx        animated pixel-diorama landing screen
    SelectScreen.tsx       survivor & stage selection, coin purchases
    HowToPlay.tsx          weapon / relic / pickup field manual
    CollectionScreen.tsx  bestiary, stage records, achievements
    AmbientCanvas.tsx      menu background diorama
    SpriteIcon.tsx         renders any pixel sprite into React
  game/
    engine.ts              fixed-step game engine: spawning director, combat, AI,
                           collision, pickups, particles, camera, full renderer
    sprites.ts             pixel-map sprite factory + recolor + ground tile generator
    content.ts             weapons, relics, characters, enemies, stages, achievements
    audio.ts               Web Audio chiptune music + synthesized SFX
    storage.ts             save/load, run settlement, achievement evaluation
    types.ts               shared types
  lib/format.ts            time / number formatting
scripts/
  smoke-test.cjs           headless engine smoke tests (npm run smoke)
  render-sprites.cjs       exports every sprite to a PNG contact sheet for art review
  render-scene.cjs         exports a simulated in-engine frame to PNG
  longrun.cjs / endgame.cjs  AI-kite balance simulations (15-minute runs)
```

## Design references

The build applies the visual language catalogued by the three reference sites rather
than copying any protected assets:

- **gameartstyle.loopyhop.com** — the "16-bit-inspired" and "top-down tile-based pixel"
  styles drive the authored pixel maps, limited palettes, hard outlines and ground tiles.
- **gameplayatlas.loopyhop.com** — its *Defense & waves*, *Aiming & projectiles*,
  *Progression & legacy* and *Inventory & resources* mechanic groups map directly onto
  the wave director, eight weapon behaviours and roguelite upgrade economy.
- **collectui.com** — dark-mode card/modal/navigation patterns inform the menu chrome,
  upgrade draft cards and HUD chips.

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run check      # eslint + typecheck + build
npm run smoke      # compile the engine and run headless smoke tests
```

## License

MIT — original code and original art/audio only. All game names, characters and assets
in this repository are fictional and created for this project.
