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
npm run build    # emits a fully static site into out/ (no server needed)
```

The production build is a **self-contained static export** in `out/`. It runs from
any static host (GitHub Pages, Cloudflare Pages, Netlify, S3, nginx) and never
depends on a long-lived Node process. A service worker (`public/sw.js`) caches the
app shell after the first visit, so the game also works **offline** and can be
installed as a PWA. No external fonts, CDNs or trackers are loaded, so the site
behaves identically across regions.

### Languages

Four fully localized experiences — English, 简体中文, 日本語 and Español — with
`hreflang` alternates, localized OG metadata and an in-game language switcher
(preference persisted in `localStorage`, browser language auto-detected on first
visit). Marketing/legal pages live under `/en/`, `/zh/`, `/ja/`, `/es/`; the game
itself is `/play` and switches language client-side.

### Permanent deployment

**GitHub Pages (recommended, zero cost):** push to `master` (or an `arena/**`
branch) and the `Deploy to GitHub Pages` workflow publishes `out/` automatically.
One-time setup: repository **Settings → Pages → Source: GitHub Actions**. The
workflow sets `NEXT_PUBLIC_BASE_PATH=/<repo-name>` automatically for project
sites; for a custom domain set repository variables `BASE_PATH` (empty) and
`SITE_URL`.

**Any other static host:** upload the contents of `out/`. For sub-path hosting,
build with `NEXT_PUBLIC_BASE_PATH=/your-path`; for an apex domain leave it empty.

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

- **8 weapons, 8 ranks each, plus 8 evolutions** — homing bolts, arcing whips, lobbing
  axes, directional daggers, a damage aura, orbiting tomes, called lightning and a nova
  ring, each with distinct projectile/zone/behaviour code. Maxing a weapon together with
  its paired relic unlocks a single ultimate evolution (e.g. Arcbolt Scepter + Hourglass
  → Tempest Scepter) that replaces it in the same slot and is guaranteed a draft slot.
- **10 passive relics** (might, cooldown, area, speed, health, magnet, regen, armor,
  growth, luck) and weighted upgrade drafts so builds cohere.
- **4 playable survivors** (two unlockable with vault coins) and **3 hand-built stages**
  with palettes, props, enemy rosters, tinted variant monsters and three bosses each.
- **Four enemy AI archetypes** beyond the chasing horde — ranged cultists that kite and
  fire arcane bolts, charging beetles with a telegraphed wind-up, fuse-lit bloaters that
  explode in an area, and slimes that split into smaller kin on death.
- **Boss phase 2** — every boss enrages at half health: speed and damage spike, a minion
  swarm is summoned and a radial bullet burst fires, then repeating bullet volleys keep
  the pressure on. The HUD bar switches to a pulsing ENRAGED state.
- **Dynamic night lighting** — a screen-space darkness layer deepens over the first eight
  minutes, punched through by the player's flickering light pool, projectile glows,
  lightning strikes and explosions, plus stage weather (drifting fog, spores, embers).
- **Game feel** — freeze-frame hit stops, spawn portals, death shockwaves, per-enemy
  health bars, fuse rings and charge tells, layered on top of particles, damage numbers
  and screen shake.
- **Upgrade meta controls** — two rerolls per run and a skip option that banks a quarter
  level of XP, alongside the weighted three-card draft.
- **Full game loop** — title, character/stage select, field manual (with threat atlas and
  evolution forge), bestiary & records, run HUD, level-up modals, boss chests, pause,
  defeat/victory screens, achievements and `localStorage` persistence.
- **Storefront & compliance layer** — an SSR conversion landing page at `/` (the game
  lives at `/play`, deep-linkable via `#howto` / `#collection` hashes), VideoGame
  JSON-LD, Open Graph/Twitter cards generated from in-repo sprites, `sitemap.xml`,
  `robots.txt`, PWA manifest with icons, `llms.txt` for AI crawlers, and first-party
  privacy/terms pages disclosing the localStorage-only, no-tracking data model.
- **Procedural presentation** — pixel sprites generated in code, ground tiles, fog
  vignette, particles, damage numbers, screen shake, chiptune music that intensifies
  with the clock and ~16 synthesized SFX.
- **Headless test harness** — a DOM/canvas stub drives the real engine through thousands
  of frames (sprite integrity, every character × stage combo, upgrades, chests, death,
  victory, endless continuation and achievements).

## Project structure

```
src/
  app/                     Next.js App Router (static export, no server runtime)
    page.tsx               root redirect to the visitor's localized landing
    [locale]/              /en /zh /ja /es marketing + legal pages (hreflang)
    play/page.tsx          state-driven screen machine: title / select / manual /
                           collection / game, with hash deep-linking
    layout.tsx, globals.css  metadata, JSON-LD, PWA icons, dark gothic pixel theme
    sitemap.ts, robots.ts, manifest.ts  SEO/GEO and PWA MetadataRoute files
  i18n/
    config.ts              locale list, detection, persistence, BCP-47 tags
    dictionaries/          en/zh/ja/es full dictionaries (type-checked key parity)
    I18nProvider.tsx       client provider, useI18n hook, language switcher
  components/game/
    GameView.tsx           canvas host + HUD + all modals + touch joystick
    TitleScreen.tsx        animated pixel-diorama landing screen
    SelectScreen.tsx       survivor & stage selection, coin purchases
    HowToPlay.tsx          weapon / relic / evolution / pickup field manual
    CollectionScreen.tsx  bestiary, stage records, achievements
    AmbientCanvas.tsx      hero firefly/night-fog particle backdrop
    ServiceWorkerRegistrar.tsx  offline PWA registration
    SpriteIcon.tsx         renders any pixel sprite into React
  game/
    engine.ts              fixed-step game engine: spawning director, combat, AI,
                           collision, pickups, particles, camera, full renderer
    i18n.ts                self-contained engine-side banner/toast localization
    sprites.ts             pixel-map sprite factory + recolor + ground tile generator
    content.ts             weapons, relics, characters, enemies, stages, achievements
    audio.ts               Web Audio chiptune music + synthesized SFX
    storage.ts             save/load, run settlement, achievement evaluation
    types.ts               shared types
  lib/format.ts            time / number formatting
public/
  sw.js                   offline-first cache-first service worker
  og.png, icon-192/512.png original share card and PWA icons
scripts/
  smoke-test.cjs           headless engine smoke tests (npm run smoke)
  render-sprites.cjs       exports every sprite to a PNG contact sheet for art review
  render-scene.cjs         exports a simulated in-engine frame to PNG
  render-og.cjs            builds og.png and PWA icons from in-repo sprites (bundled
                           5x7 bitmap font, no external assets)
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
