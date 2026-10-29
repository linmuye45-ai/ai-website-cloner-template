# Asset attribution

All art below is by **Kenney** (https://kenney.nl) and released under
**CC0 1.0 Universal** (public domain). CC0 needs no attribution, but crediting
the author is both correct and required by this project's own rules.

| Folder | Source pack | Licence |
| --- | --- | --- |
| `rockmass.png` | *Retro Textures Fantasy* — `wall_rock.png` (64×128 seamless wall), colour-graded to cold slate and used as the cave mass | CC0-1.0 |
| `props/` | *Tiny Dungeon* — characters, monsters, weapons, items (16×16) | CC0-1.0 |
| `light/` | *Light Masks* — radial falloff masks | CC0-1.0 |

Retrieved from the community mirror `github.com/shorepine/kenney`, which
republishes the official Kenney packs. Individual tiles were renamed for
readability; no pixels were modified.

## Why one texture instead of tiles

The block-style tilesets were tried first and rejected: every tile carries its
own bevel, so a wall built from them always reads as a stack of crates. The
cave is instead carved out of one seamless wall texture, sampled in 16×16
windows by world position, so neighbouring cells line up into a single rock
mass. `src/zhulong/sim/look.ts` owns that rule.

## Font

`VonwaonBitmap-16px.ttf` from the CC0 *Sunny Land* pack (WispSnow) is used for
CJK UI text. It covers U+0020–U+FFFF.
