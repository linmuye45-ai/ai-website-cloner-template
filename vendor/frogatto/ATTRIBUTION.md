# Asset attribution

## Frogatto & Friends (primary art)

Source: <https://github.com/frogatto/frogatto> — the *Frogatto & Friends*
open-source game by Lost Pixels / Frogatto team.

Frogatto splits its asset licence in two. Per the project's `LICENSE`:

| Path used here | Licence |
| --- | --- |
| `images/tiles/` (`dungeon-walls`, `dungeon-floor-cement`, `dungeon-pillars`, `dungeon-parallax-wall`, `cave`) | **CC BY-NC-SA 4.0** |
| `images/characters/` (`nene-spritesheet1`, `kinguin-spritesheet1`, `pato-spritesheet1`) | **CC BY-NC-SA 4.0** |
| `images/enemies/` (`bat-black`, `beetle-black-armor`, `mushroom-walker-green`, `jellybug-green`, `maggot-grey`, `moth-black`) | **CC BY 3.0** |
| Everything else in that repository | CC BY 3.0 |

- CC BY 3.0 — <https://creativecommons.org/licenses/by/3.0/>
- CC BY-NC-SA 4.0 — <https://creativecommons.org/licenses/by-nc-sa/4.0/>

**This matters commercially.** The tile and character art is *non-commercial*
and *share-alike*: this build is a free, non-commercial demo and is itself
share-alike. Shipping ZHULONG commercially would require replacing the
NC-licensed sheets (tiles + player) with commercial-safe art; the enemy art is
CC BY 3.0 and only needs credit.

## Processing applied

`scripts/zhulong/import-frogatto.mjs` derives every file in
`public/vendor/frogatto/` from the original sheets. No pixels are redrawn; the
script only:

1. keys out the olive background plate (the source sheets ship without alpha),
2. erases the red 1 px animation-frame guides that are part of the authoring
   files, and
3. repacks frames into fixed-width strips, bottom-aligned so feet stay planted,
   or repacks 32×32 tile cells into a compact atlas.

## Font

`VonwaonBitmap-16px.ttf` from the CC0 *Sunny Land* pack (WispSnow), used for
CJK UI text.

## Retired

All earlier art (Kenney CC0 packs) was removed on request; it remains credited
in git history for reference.
