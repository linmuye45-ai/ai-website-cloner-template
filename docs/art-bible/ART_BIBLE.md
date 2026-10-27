# HEARTHWARDEN — Pixel Art Bible

**Version 1.0.0-locked · Global visual language for every asset in the project**

This document is the single source of truth for art direction. Every batch —
characters, environments, props, items, UI, icons, VFX, animation, loading
screens and promotional art — must satisfy the rules and measurable
specifications below. When a request names one asset, that asset is produced
*inside* this style; the style is never redesigned per request.

All reference sheets are machine-generated from one locked palette in
[`scripts/art/`](../../scripts/art), so the images and these rules cannot
drift apart. A validation gate enforces conformance (see
[§11](#11-validation-and-acceptance)).

---

## 1. Stated assumptions (genre, mechanics, camera, platform)

The repository contains no game design, so the four required anchors are
**assumed and locked here**. If the real design differs, change this section
once and re-version the whole bible rather than bending individual assets.

| Anchor | Locked assumption | Why it matters for art |
| --- | --- | --- |
| **Genre** | Story-driven 2D action-adventure with exploration, light combat, and a home-base "hearth" hub | Drives the warm ember accent, readable hero, and readable props |
| **Mechanics** | Top-down field movement (8-direction), real-time melee + lantern light, inventory/consumables | Drives tile size, hit targets, icon set and VFX vocabulary |
| **Camera** | Fixed top-down field camera on a tile grid; no rotation, no perspective foreshortening | Drives top-down tiles, world scale, and absence of horizon perspective |
| **Target platform** | Desktop + console 16:9, rendered to a low-res framebuffer and integer-scaled | Drives the base resolution and the integer-scaling rule |
| **Game name / IP** | *Hearthwarden* — an **original** setting and cast. No existing game's characters, logos, compositions or artwork are copied | Keeps every design original |

**Visual language: densely detailed pixel illustration** — carefully shaped
pixel clusters, nuanced hue shifts inside stepped ramps, and rich 5–7 step
material ramps, with intricate detail concentrated on focal assets while
quiet surfaces and distance preserve hierarchy.

---

## 2. Display pipeline and pixel scale (the foundational rule)

| Parameter | Locked value |
| --- | --- |
| Base framebuffer | **320 × 180 px** (16:9) |
| Presentation | Integer-only upscaling (×2, ×3 …); 1920×1080 = **×6** |
| Pixel shape | Always square; never rotated, stretched, sub-pixel positioned or anti-aliased |
| Base unit / tile | **16 × 16 px** grid |
| Tile scale to screen | 16 px → 96 px at ×6 |
| Allowed export scaling | Whole integers only; no fractional or "smooth" downscaling of authored art |
| Indexing | All sprites are palette-indexed PNGs (mode `P`); index `0` = transparency |

Everything is authored at its **native resolution** and scaled *up*, never
downscaled from a larger painted/vector source. This single rule keeps detail
visible instead of flickering or vanishing at target size.

Reference for the whole pipeline: `assets/key-art.png` and
`assets/loading-screen.png` are authored at the full 320×180 framebuffer.

---

## 3. Locked master palette

**52 slots (index 0–51). Index 0 is reserved transparency and is never
painted.** The authoritative machine-readable copy is
[`palette.json`](./palette.json); the visual chart is
[`assets/palette-sheet.png`](./assets/palette-sheet.png).

### 3.1 Ramp architecture

Ramps run dark → light with **deliberate hue shifts**, not just brightness:
shadows drift cool (toward blue/violet), highlights drift warm (toward
yellow/cream). This is what makes flat clusters read as lit material.

| Ramp | Steps | IDs | Use |
| --- | --- | --- | --- |
| Neutral | 2 | `INK`, `PANEL` | linework, silhouette, UI fills, text |
| Stone | 7 | `STONE1…7` | masonry, cliffs, architecture, cobble |
| Foliage | 7 | `FOL1…7` | grass, hedges, trees, moss |
| Warden teal | 6 | `TEAL1…6` | hero cloth (identity colour) |
| Ember red | 5 | `RED1…5` | danger, damage, red lining/sash |
| Timber | 5 | `WOOD1…5` | beams, planks, bark, leather, dirt |
| Skin | 4 | `SKIN1…4` | humanoid skin |
| Metal | 4 | `METAL1…4` | steel, fixtures, rivets, blades |
| Ember / gold | 5 | `EMBER1…5` | fire, lantern light, coins, UI gold |
| Water | 4 | `WATER1…4` | water, potions, glints |
| Parchment | 2 | `PARCH1…2` | paper, icon canvas, text on dark |

### 3.2 Palette discipline

- **No off-palette colour may appear in any exported sprite.** The CI gate
  (`scripts/art/validate_assets.py`) fails on any index outside 0–51.
- New materials are built by **re-using and combining existing ramps**, not by
  adding colours. A palette addition requires a versioned bible revision
  (e.g. v1.1.0) and regenerating every sheet.
- Each material uses **one ramp family** for its body; adjacent families only
  meet at a boundary (e.g. moss `FOL*` touching stone `STONE*`).
- Reserve the lightest 1–2 steps of each ramp for focal highlights so they
  stay meaningful. `FOL7`, `TEAL6`, `EMBER5`, `STONE7`, `METAL4` are
  "sparkle" steps — use sparingly, never as a fill.
- Glow is the **only** sanctioned off-palette operation, and even it is
  re-snapped to the nearest locked colour on export (see §6 and
  `snap_to_palette`).

---

## 4. Cluster language and silhouette rules

"Detailed" means *shaped clusters*, not more dots. Demonstrated in
[`assets/materials.png`](./assets/materials.png).

### 4.1 Cluster rules

1. **Build from blocks, not scatter.** Detail is placed as 2×2, 3×3 or larger
   shaped clusters. Isolated single pixels are allowed only as deliberate
   sparkle/eye/rivet points, never as texture noise.
2. **Minimum lit feature** that must survive at target display size: **2×2
   px** (12×12 px at ×6). Any detail smaller than this is merged into its
   neighbour or removed.
3. **Every transparent-background sprite gets a 1px `INK` contour** traced on
   its opaque boundary (the `outline()` helper), so the silhouette reads on
   any backdrop. See the bush study and the Warden.
4. **Consistent cluster density per layer.** Focal assets carry the densest
   clusters; mid-ground uses fewer, larger clusters; distance uses flat
   2–3 colour shapes. Do not put busy clusters everywhere.
5. **No random pixel noise, no dithering gradients across large areas.**
   Transitions between ramp steps are stepped bands or shaped edges.
6. Hue inside a ramp moves **cool in shadow, warm in light**; keep band
   boundaries short and intentional, never long 1-px hairlines across a whole
   surface.

### 4.2 Silhouette rules (character & props)

- A sprite must be identifiable from its **solid black mass alone**. The
  character sheet's `MASS` column is the acceptance test: hood, broad A-line
  cloak, and stance must all read as one clear shape.
- Distinctive read is carried by **one or two bold silhouette features**
  (the Warden's pointed hood and flared cloak), not by surface decoration.
- Avoid internal holes and thin tendrils that break up at 320×180; limbs are
  at least 3–4 px thick at native resolution.
- Keep a clear, stable **ground-contact shadow** (a quiet `STONE2` cluster)
  under every standing character and large prop.

---

## 5. Proportion rules

Reference: [`assets/character-warden.png`](./assets/character-warden.png).

| Rule | Locked value |
| --- | --- |
| Hero native size | **32 × 48 px** |
| Hero height in heads | **≈ 4.3 heads** (stylised, slightly large head for readability) |
| Head/hood block | ≈ 11 px tall of 48 |
| Torso (cloak) | broad A-line, shoulders ≈ 15 px wide flaring to ≈ 24 px at hem |
| Limb thickness | legs/arms ≥ 3–4 px; hands 3 px clusters |
| Enemy/enemy-class scaling | use the same 32-wide grid; vary height in whole 8-px steps (40, 48, 56) so feet still snap to the 16-px tile |
| Tile alignment | character feet and prop bases snap to the 16-px grid |
| World scale | architecture towers over the hero (see key art: tower ≈ 2.5× hero height); never scale a building down to sprite height |

All humanoids share the head-ladder and the same material ramps so they read
as one population.

---

## 6. Lighting hierarchy

### 6.1 Key light

- Single warm key light, conventionally **upper-left**. Lit top/left edges
  take the warm highlight step; bottom/right edges take the cool shadow step.
- Light is communicated by **ramp position and 1-px rim lines**, not by
  gradients. Example: the cloak's `TEAL6` rim runs one pixel down the lit
  edge; the stone block's `STONE6/7` bevel sits on its top and left.

### 6.2 Hierarchy (most → least visually active)

1. **Emissive focal points** — lanterns, hearths, embers (`EMBER*`), always
   the brightest object in a scene.
2. **Hero and interactive props** — full ramp range, `INK` outline, sparkle
   steps.
3. **Mid-ground environment** — mid ramp steps, fewer highlights.
4. **Background / distance** — 2–3 flat dark steps, low contrast, no sparkle.

The key-art scene demonstrates all four tiers at once
(`assets/key-art.png`).

### 6.3 Controlled soft light (glow)

- Glow is drawn on a **separate RGBA layer** using *stepped alpha bands*
  (4 bands), never a smooth gradient, then composited and **re-snapped to the
  locked palette** so the output stays indexed (`GlowLayer` +
  `snap_to_palette`).
- The opaque sprite contour underneath **must remain fully readable**; glow
  never replaces or erases a silhouette edge.
- Compare the `NONE` and `GLOW` lanterns in `assets/vfx.png`: glow adds a
  halo but the lantern's `INK` outline and metal frame stay intact.
- Limit simultaneous glow sources; one dominant emissive per screen region.

---

## 7. Materials

Each material's cluster recipe is shown in
[`assets/materials.png`](./assets/materials.png) and uses exactly one ramp.

| Material | Cluster recipe | Signature detail |
| --- | --- | --- |
| **Stone / masonry** | flat `STONE3` courses, `STONE1` mortar lines, warm `STONE6/7` top-left bevel, cool `STONE2` bottom-right | one shaped `INK` crack; optional `FOL*` moss at the foot |
| **Foliage** | overlapping large dark discs (`FOL2/3`) as mass, 2–3 px leaf clusters (`FOL4/5`) forward, sparse `FOL6/7` tips, `FOL1` interior gaps, `INK` contour | tips face the key light; gaps stay inside the mass |
| **Cloth (warden teal)** | A-line `TEAL3` body, cool `TEAL1/2` fold shadows as vertical stepped bands, `TEAL4/5` lit folds, 1-px `TEAL6` rim | `RED*` lining at the hem, parchment stitch dots |
| **Timber / half-frame** | `WOOD3` beams with `WOOD1` grain grooves, `WOOD5` worn top edge, `METAL*` rivets, plaster `STONE5/6` between beams | diagonal brace uses stepped Bresenham line |
| **Metal** | `METAL2` body, `METAL3` planes, single `METAL4` specular edge | no broad highlights — one sharp edge only |
| **Water** | `WATER1/2` body with animated `WATER3/4` ripple dashes that shift per frame | glints are short horizontal dashes, not sparkle pixels |
| **Skin** | `SKIN3` base, `SKIN4` on nose/cheek toward light, `SKIN1` jaw/neck shadow | eyes are single `INK` pixels, max two |

---

## 8. Environment, tiles and world scale

Reference: [`assets/tiles-strip.png`](./assets/tiles-strip.png) and the
assembled [`assets/tiles-scene.png`](./assets/tiles-scene.png).

- All tiles are **authored natively at 16×16**, full-coverage for top-down
  use (no grass-over-dirt side strips in the field set).
- Each tile must tile seamlessly on all four edges; edge pixels are muted
  base colours, never a highlight that would create a visible seam.
- Tile library (v1): `GRASS, PATH, STONE, PLANK, WATER A/B, CANOPY, COBBLE`.
  Water is a 2-frame loop; everything else is static.
- Build scenes as **regions, not stripes** — see how the scene composes a
  canopy band, grass field, pond + plank bridge, stone building pad and a
  bending cobble path with one focal lantern.
- Quiet surfaces (grass fields) stay low-contrast so focal assets pop; the
  detailed lantern/post is the highest-detail cluster in that scene.
- Focal props sit on the same 16-px grid and use the same outline/rim rules
  as characters.

---

## 9. UI and icons

Reference: [`assets/ui-icons.png`](./assets/ui-icons.png).

### 9.1 Resolution and construction

- Every icon is **authored natively at 16×16** as a palette-indexed sprite —
  never a downscaled painting. (Sheet lettering uses the 5×7 pixel font at
  integer scale; in-game body text uses an 8×8 font on the same grid.)
- Icons use a bold 2–3 px silhouette, an `INK` contour, and at most **two**
  sparkle pixels so they stay legible at native size.
- Icon set v1 (12): heart, flame, key, sword, potion, shield, coin, lantern,
  chest, leaf, scroll, gear. Meaning is carried by silhouette first, colour
  second (colour-blind safe: red never alone signals danger — pair with
  shape/position).

### 9.2 HUD and interactive targets (measurable)

| Spec | Locked value |
| --- | --- |
| Minimum interactive target | **24 × 24 px** native (144 × 144 px at ×6) |
| Icon inside a target | 16×16, centred with ≥ 4 px padding |
| Body text minimum | 8 px cap height (×6 → 48 px), ≥ 4:1 contrast against panel |
| Panel fill / border | `PANEL` fill, `PARCH1` 1-px border; `INK`/`PARCH2` text |
| Bar minimum thickness | 8 px native; track `STONE1`, fill uses one ramp (`RED*`, `EMBER*`) |
| Touch/click spacing | ≥ 8 px gap between adjacent targets |

See the HUD mock in the icon sheet: 24-px target zones, 16-px icons, and
labelled HP/stamina bars with numeric text that clears the contrast rule.

---

## 10. Motion and animation

Reference: the 4-frame walk in
[`assets/character-warden.png`](./assets/character-warden.png) and the VFX
rows in [`assets/vfx.png`](./assets/vfx.png).

### 10.1 Frame rules

- **Hold 2s on twos** as the default (12 fps on a 60 fps clock); hero walk is
  a 4-frame loop. Effects may use 6–8 fps for punch.
- Animate in **whole-pixel** steps only. No sub-pixel translation, no tweened
  scaling, no rotation of raster sprites.
- Walk loop: 1-px vertical bob, opposing arm/leg swing, and a 1-px cloak
  response — expressive but readable; the silhouette never collapses.
- Eyes/facial change are the primary expressive channel; keep faces to
  1–2 px changes so they read at native size.

### 10.2 Effect rules

- Effects are stepped pixel shapes on short loops (burst 4 frames, smoke 3,
  heal 4, slash 2). They grow/shrink by whole clusters, not by smoothing.
- Dissipation uses a few *shaped* clusters, never random scatter (see the
  final ember-burst frame).
- Loop lengths should differ between adjacent effects so loops don't
  synchronise and visibly "pulse" together.
- Every animated effect must still read when paused on any single frame.

### 10.3 Loading & promotional art

- `assets/loading-screen.png` shows the title-safe frame (8-px inset + corner
  ticks), a wordmark, and an ember loading bar built from the same ramps.
- Keep all critical text/logos inside the title-safe inset; never let the
  wordmark touch the frame edge.
- Promotional/key art is the *same* scene language as gameplay
  (`assets/key-art.png`): identical palette, outlines, lighting tiers and
  world scale — no painted, high-colour or painterly "marketing style".

---

## 11. Validation and acceptance

Tooling lives in [`scripts/art/`](../../scripts/art). All output is written
to `docs/art-bible/assets/`.

```bash
# one-time environment
python3 -m venv .venv-art && .venv-art/bin/pip install Pillow

# regenerate every reference sheet from the locked palette
.venv-art/bin/python scripts/art/gen_art_bible.py
.venv-art/bin/python scripts/art/gen_art_bible_2.py

# gate a batch — fails (non-zero exit) on any rule violation
.venv-art/bin/python scripts/art/validate_assets.py
```

The validator enforces, for every PNG:

1. palette-indexed mode `P`;
2. palette equals the locked 52 colours in index order;
3. no painted index outside 0–51;
4. locked native dimensions for framebuffer assets (320×180 key art / loading,
   160×128 tile scene);
5. every `@Nx` preview is an exact integer multiple of its native file.

A batch is accepted only when the validator returns `OK`.

### 11.1 Measurable asset specification table

| Asset class | Native size | Frames | Palette | Outline | Notes |
| --- | --- | --- | --- | --- | --- |
| Field tile | 16×16 | 1 (water: 2) | locked | edge-seam only | tileable all 4 edges |
| Hero character | 32×48 | 4 walk + states | locked | 1px INK | 4.3 heads, grid-snapped feet |
| Humanoid NPC / enemy | 32×(40/48/56) | per need | locked | 1px INK | heights in 8-px steps |
| World prop | multiples of 8, on 16 grid | per need | locked | 1px INK | focal props get sparkle steps |
| Inventory/UI icon | 16×16 | 1 | locked | 1px INK | ≤2 sparkle px |
| VFX sprite | 16×16 (effects) / per need | 2–4 | locked + glow pass | n/a | stepped alpha, contour preserved |
| HUD panel | per layout, 8-px grid | states | locked | 1px PARCH1 | 24-px targets, 8-px bars |
| Framebuffer scene / loading / key art | 320×180 | per need | locked (+snapped glow) | per sprite | integer-scaled only |

### 11.2 Readability at target size (acceptance checklist)

- [ ] Hero is identifiable from its black mass and from a paused mid-walk frame.
- [ ] Every interactive target is ≥ 24×24 native with ≥ 8 px spacing.
- [ ] Body text ≥ 8 px cap height and ≥ 4:1 contrast; no information by colour alone.
- [ ] No detail relies on a feature smaller than 2×2 native px.
- [ ] Glow leaves the underlying `INK` contour fully visible.
- [ ] Background tier has no sparkle steps and lower contrast than the hero.
- [ ] No sprite flickers or loses detail when viewed at the ×6 target size.

---

## 12. Visual mistakes to avoid (hard "don't" list)

1. **No off-palette colours** — including pasted-in reference art, gradients,
   JPEG artefacts, or painterly brushes.
2. **No random single-pixel noise** or large-area dithering as texture.
3. **No inconsistent sprite density** — don't detail every surface; reserve
   clusters for focal assets and keep distance quiet.
4. **No detail that vanishes at 320×180 / ×6** — no 1-px texture fills, no
   sub-2-px features carrying meaning.
5. **No anti-aliasing, sub-pixel movement, fractional scaling, rotation of
   raster sprites, or smooth (non-stepped) glow gradients.**
6. **No sprites without the 1px contour** on transparent backgrounds.
7. **No glow that erases a silhouette** or multiple competing emissive blobs.
8. **No downscaled painted icons/UI** — icons are authored at 16×16.
9. **No stripe-style level layouts** and no buildings scaled to character
   height; compose regions and keep architecture monumental.
10. **No copying of an existing game's characters, logos, compositions or
    artwork** — all designs remain original to *Hearthwarden*.

---

## 13. Reference sheet index

| File | Contents |
| --- | --- |
| [`palette.json`](./palette.json) | Machine-readable locked palette + ramps |
| [`assets/palette-sheet.png`](./assets/palette-sheet.png) | All 52 slots by ramp, with indices |
| [`assets/materials.png`](./assets/materials.png) | Stone, foliage, cloth, timber cluster studies + ramp strips |
| [`assets/tiles-strip.png`](./assets/tiles-strip.png) | The 16×16 tile library, authored natively |
| [`assets/tiles-scene.png`](./assets/tiles-scene.png) | Tiles assembled into a region-based micro-scene |
| [`assets/character-warden.png`](./assets/character-warden.png) | Mass/full/edge passes, head ladder, 4-frame walk |
| [`assets/ui-icons.png`](./assets/ui-icons.png) | 12 native 16×16 icons + HUD target/bar mock |
| [`assets/vfx.png`](./assets/vfx.png) | Burst, smoke, heal, slash frames + glow rule |
| [`assets/key-art.png`](./assets/key-art.png) | Full 320×180 scene showing all lighting tiers |
| [`assets/loading-screen.png`](./assets/loading-screen.png) | Title-safe frame, wordmark, loading bar |

Each PNG has a companion `@4x` nearest-neighbour preview for review; the
non-suffixed file is the authoritative native asset.
