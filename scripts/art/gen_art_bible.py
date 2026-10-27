"""
Generates every pixel-correct reference sheet for the Hearthwarden art bible.

Run:  /home/user/.venv-art/bin/python scripts/art/gen_art_bible.py
Out:  docs/art-bible/assets/*.png        (native, palette-indexed)
      docs/art-bible/assets/*@4x.png     (nearest-neighbour preview)
      docs/art-bible/palette.json        (machine-readable locked palette)
"""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from pixelart import (Canvas, GlowLayer, ID, HEX, PALETTE, RAMPS, RGB,
                      export_palette_json, snap_to_palette)

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "docs", "art-bible", "assets")
DOCS = os.path.join(ROOT, "docs", "art-bible")


def text_w(s: str, scale: int = 1) -> int:
    from pixel_font import text_width
    return text_width(s, scale)


# ---------------------------------------------------------------------------
# 1. Locked palette sheet — one row per ramp group, index digits on swatches
# ---------------------------------------------------------------------------

def palette_sheet() -> None:
    groups = ["neutral", "stone", "foliage", "teal", "red", "wood",
              "skin", "metal", "ember", "water", "parchment"]
    title = "HEARTHWARDEN LOCKED PALETTE V1"
    sw, sh, gap = 18, 16, 3
    label_w = max(text_w(g.upper(), 2) for g in groups) + 12
    widest = max(len(RAMPS[g]) for g in groups)
    title_h = 7 * 2 + 8
    row_h = max(sh, 7 * 2) + 10
    swatch_w = label_w + widest * (sw + gap) + 6
    w = max(swatch_w, text_w(title, 2) + 8)
    h = title_h + len(groups) * row_h + 6
    c = Canvas(w, h, "PANEL")
    c.text(4, 4, title, "PARCH2", scale=2)
    y = title_h
    for g in groups:
        c.text(4, y + (row_h - 14) // 2, g.upper(), "PARCH1", scale=2)
        x = label_w
        for name in RAMPS[g]:
            c.rect(x, y, x + sw - 1, y + sh - 1, name)
            # near-black swatches need a light border to stay visible
            border = "PARCH1" if name in ("INK", "PANEL") else "INK"
            c.rect(x, y, x + sw - 1, y, border)
            c.rect(x, y + sh - 1, x + sw - 1, y + sh - 1, border)
            c.rect(x, y, x, y + sh - 1, border)
            c.rect(x + sw - 1, y, x + sw - 1, y + sh - 1, border)
            r, g_, b = RGB[name]
            txt = "INK" if (r + g_ + b) > 380 else "PARCH2"
            idx = str(ID[name])
            c.text(x + (sw - text_w(idx)) // 2, y + 5, idx, txt)
            x += sw + gap
        y += row_h
    c.save(os.path.join(OUT, "palette-sheet.png"))


# ---------------------------------------------------------------------------
# 2. Material studies — stone, foliage, cloth, timber with ramp strips
# ---------------------------------------------------------------------------

def ramp_strip(c: Canvas, x: int, y: int, ramp: list[str]) -> None:
    for i, name in enumerate(ramp):
        c.rect(x + i * 9, y, x + i * 9 + 8, y + 6, name)
        c.rect(x + i * 9, y, x + i * 9 + 8, y, "INK")


def study_stone(c: Canvas, ox: int, oy: int) -> None:
    # 48x48 masonry block, key light top-left
    c.rect(ox, oy, ox + 47, oy + 47, "STONE3")
    courses = [0, 12, 24, 36]
    for k, top in enumerate(courses):
        bottom = min(top + 11, 47)
        offset = 0 if k % 2 == 0 else 10
        for vx in range(offset, 48, 22):
            c.vline(ox + vx, oy + top, oy + bottom, "STONE1")
        c.hline(ox, ox + 47, oy + bottom, "STONE1")
    # bevel: warm light top/left, cool shadow bottom/right
    c.hline(ox + 1, ox + 46, oy + 1, "STONE6")
    c.vline(ox + 1, oy + 1, oy + 46, "STONE5")
    c.hline(ox + 1, ox + 46, oy + 46, "STONE2")
    c.vline(ox + 46, oy + 1, oy + 46, "STONE2")
    c.px(ox + 2, oy + 2, "STONE7")
    c.px(ox + 5, oy + 2, "STONE7")
    # stepped crack, 1px ink, deliberately shaped
    crack = [(34, 10), (33, 14), (34, 18), (32, 22), (33, 26), (31, 30)]
    for x, y in crack:
        c.px(ox + x, oy + y, "INK")
    c.px(ox + 35, oy + 15, "STONE1")
    # moss cluster at the foot, foliage language reused on stone
    for x, y in [(6, 44), (7, 44), (8, 43), (12, 45), (13, 44), (14, 44),
                 (18, 45), (19, 44), (9, 42), (10, 42)]:
        c.px(ox + x, oy + y, "FOL3")
    for x, y in [(7, 43), (13, 43), (19, 43), (10, 41)]:
        c.px(ox + x, oy + y, "FOL5")
    c.px(ox + 8, oy + 42, "FOL6")


def study_foliage(c: Canvas, ox: int, oy: int) -> None:
    # Built on a transparent sub-canvas so an INK contour can be traced
    # around the whole cluster: the silhouette must read on any backdrop.
    b = Canvas(52, 52)
    # layered bush: big dark clusters behind, shaped leaf clusters forward
    b.disc(26, 31, 17, "FOL2")
    b.disc(14, 33, 11, "FOL3")
    b.disc(38, 34, 12, "FOL3")
    b.disc(26, 23, 12, "FOL4")
    # leaf clusters: 3x3 / 2x2 blocks, never single-pixel scatter
    leaves = [
        (12, 29, "FOL4"), (17, 25, "FOL5"), (24, 18, "FOL5"),
        (32, 21, "FOL4"), (39, 28, "FOL5"), (33, 34, "FOL4"),
        (20, 36, "FOL4"), (27, 39, "FOL3"), (10, 37, "FOL3"),
    ]
    for x, y, col in leaves:
        b.rect(x, y, x + 2, y + 2, col)
    tips = [(18, 23), (25, 16), (40, 26), (14, 27), (31, 19), (22, 34),
            (36, 32), (27, 26)]
    for x, y in tips:
        b.px(x, y, "FOL6")
        b.px(x + 1, y, "FOL6")
    for x, y in [(25, 15), (40, 25), (17, 22)]:
        b.px(x, y, "FOL7")
    # interior depth gaps, then the traced 1px INK silhouette
    for x, y in [(22, 31), (30, 37), (16, 39)]:
        b.px(x, y, "FOL1")
    b.outline("INK")
    c.stamp(b, ox, oy)


def study_cloth(c: Canvas, ox: int, oy: int) -> None:
    # hanging cloak fragment, 40 wide x 48 tall
    c.poly([(ox + 6, oy), (ox + 34, oy), (ox + 39, oy + 44),
            (ox + 1, oy + 44)], "TEAL3")
    # shadow folds (cool side) and lit folds (warm side), stepped bands
    c.poly([(ox + 6, oy + 2), (ox + 12, oy + 2), (ox + 9, oy + 42),
            (ox + 3, oy + 42)], "TEAL2")
    c.poly([(ox + 24, oy + 3), (ox + 30, oy + 3), (ox + 34, oy + 42),
            (ox + 28, oy + 42)], "TEAL4")
    c.rect(ox + 14, oy + 6, ox + 15, oy + 38, "TEAL2")
    c.rect(ox + 16, oy + 8, ox + 16, oy + 36, "TEAL1")
    c.rect(ox + 20, oy + 5, ox + 21, oy + 40, "TEAL4")
    c.px(ox + 21, oy + 6, "TEAL5")
    c.px(ox + 21, oy + 12, "TEAL5")
    # red lining at the inner hem
    c.poly([(ox + 3, oy + 40), (ox + 9, oy + 40), (ox + 10, oy + 44),
            (ox + 1, oy + 44)], "RED2")
    c.poly([(ox + 30, oy + 40), (ox + 37, oy + 40), (ox + 39, oy + 44),
            (ox + 28, oy + 44)], "RED3")
    # gathered collar + parchment stitch dots on hem
    c.hline(ox + 7, ox + 33, oy + 1, "TEAL1")
    for x in range(5, 38, 4):
        c.px(ox + x, oy + 42, "PARCH1")
    # rim light, one px on the lit silhouette edge
    c.line(ox + 30, oy + 4, ox + 35, oy + 40, "TEAL6")


def study_timber(c: Canvas, ox: int, oy: int) -> None:
    # half-timbered wall section, 52 x 44
    c.rect(ox, oy, ox + 51, oy + 43, "STONE5")           # plaster
    c.rect(ox, oy + 30, ox + 51, oy + 43, "STONE4")
    for x, y in [(8, 10), (34, 14), (44, 24), (14, 34)]:  # plaster mottle
        c.px(ox + x, oy + y, "STONE6")
        c.px(ox + x + 1, oy + y, "STONE6")
    # beams: frame + diagonal brace
    c.rect(ox, oy, ox + 51, oy + 5, "WOOD3")
    c.rect(ox, oy + 38, ox + 51, oy + 43, "WOOD2")
    c.rect(ox, oy, ox + 5, oy + 43, "WOOD3")
    c.rect(ox + 46, oy, ox + 51, oy + 43, "WOOD3")
    c.line(ox + 8, oy + 8, ox + 42, oy + 36, "WOOD3")
    c.line(ox + 9, oy + 8, ox + 43, oy + 36, "WOOD2")
    # grain grooves + worn top edges + rivets
    for gx in (2, 4, 48, 50):
        c.vline(ox + gx, oy + 8, oy + 34, "WOOD1")
    c.hline(ox + 1, ox + 50, oy + 1, "WOOD5")
    for rx, ry in [(3, 3), (48, 3), (3, 41), (48, 41)]:
        c.px(ox + rx, oy + ry, "METAL3")
        c.px(ox + rx + 1, oy + ry, "METAL2")
        c.px(ox + rx, oy + ry + 1, "METAL2")
    # carved notch in the brace
    c.px(ox + 24, oy + 21, "WOOD1")
    c.px(ox + 25, oy + 22, "WOOD1")


def materials_sheet() -> None:
    title = "MATERIAL STUDIES - CLUSTER LANGUAGE"
    studies = [
        ("STONE MASONRY", study_stone, "stone", 48),
        ("FOLIAGE BUSH", study_foliage, "foliage", 52),
        ("WARDEN CLOTH", study_cloth, "teal", 40),
        ("TIMBER FRAME", study_timber, "wood", 52),
    ]
    margin, gutter = 10, 16
    title_h = 7 * 2 + 10
    label_h = 7 * 2
    row_h = label_h + 6 + 52 + 8 + 8 + 8          # label, art, ramp strip
    cell_w = max(
        [text_w(t, 2) for t, *_ in studies]
        + [len(RAMPS[r]) * 9 for _t, _f, r, _a in studies]
    ) + 20
    w = max(margin * 2 + cell_w * 2 + gutter, text_w(title, 2) + 10)
    h = title_h + row_h * 2 + margin
    c = Canvas(w, h, "PANEL")
    c.text(4, 4, title, "PARCH2", scale=2)
    for k, (name, fn, ramp, art_w) in enumerate(studies):
        col, row = k % 2, k // 2
        ox = margin + col * (cell_w + gutter)
        oy = title_h + row * row_h
        c.text(ox, oy, name, "PARCH1", scale=2)
        art_x = ox + (cell_w - art_w) // 2
        fn(c, art_x, oy + label_h + 6)
        strip_w = len(RAMPS[ramp]) * 9
        ramp_strip(c, ox + (cell_w - strip_w) // 2, oy + label_h + 66,
                   RAMPS[ramp])
    c.save(os.path.join(OUT, "materials.png"))


# ---------------------------------------------------------------------------
# 3. Tile set — every tile authored at 16x16, plus an assembled micro-scene
# ---------------------------------------------------------------------------

def tile_grass() -> Canvas:
    # full-coverage top-down turf: quiet FOL3/FOL4 base, shaped blade clusters
    t = Canvas(16, 16, "FOL3")
    for x, y in [(2, 3), (10, 2), (13, 8), (4, 10), (9, 12), (14, 14),
                 (1, 13), (7, 6)]:
        t.rect(x, y, x + 2, y + 2, "FOL4")
    for x, y in [(3, 2), (11, 1), (5, 9), (10, 11), (14, 7), (2, 12)]:
        t.px(x, y, "FOL5")
        t.px(x, y - 1, "FOL6")
    t.px(11, 0, "FOL7")
    t.px(6, 5, "FOL7")
    for x, y in [(6, 13), (12, 5), (0, 7)]:     # depth gaps, never scattered noise
        t.px(x, y, "FOL2")
    return t


def tile_path() -> Canvas:
    # packed dirt footpath with a few worn stones
    t = Canvas(16, 16, "WOOD3")
    for x, y in [(3, 4), (11, 9), (6, 13)]:
        t.rect(x, y, x + 2, y + 1, "WOOD4")
    for x, y in [(8, 3), (2, 10), (13, 12), (5, 7)]:
        t.px(x, y, "WOOD2")
    t.px(4, 5, "WOOD5")
    t.px(12, 10, "WOOD5")
    t.px(9, 14, "STONE4")
    t.px(10, 14, "STONE5")
    return t


def tile_stonebrick() -> Canvas:
    t = Canvas(16, 16, "STONE3")
    t.hline(0, 15, 7, "STONE1")
    t.hline(0, 15, 15, "STONE1")
    t.vline(7, 0, 7, "STONE1")
    t.vline(3, 8, 15, "STONE1")
    t.vline(12, 8, 15, "STONE1")
    t.hline(0, 15, 0, "STONE5")
    t.px(1, 1, "STONE6")
    t.px(5, 9, "STONE4")
    t.px(10, 3, "STONE2")
    return t


def tile_plank() -> Canvas:
    t = Canvas(16, 16, "WOOD2")
    t.hline(0, 15, 5, "WOOD1")
    t.hline(0, 15, 11, "WOOD1")
    t.hline(0, 15, 0, "WOOD4")
    for y in (2, 8, 13):
        t.hline(2, 13, y, "WOOD3")
    t.px(3, 3, "METAL2")
    t.px(12, 3, "METAL2")
    t.px(3, 9, "METAL2")
    t.px(12, 14, "METAL3")
    return t


def tile_water(frame: int) -> Canvas:
    t = Canvas(16, 16, "WATER2")
    t.rect(0, 0, 15, 3, "WATER1")
    t.rect(0, 12, 15, 15, "WATER3")
    shift = frame * 3
    for x in range(0, 16, 6):
        t.hline((x + shift) % 16, min(15, (x + shift) % 16 + 2), 6, "WATER4")
        t.hline((x + 3 + shift) % 16, min(15, (x + 3 + shift) % 16 + 1),
                10, "WATER3")
    t.px((2 + shift) % 16, 2, "WATER3")
    return t


def tile_canopy() -> Canvas:
    t = Canvas(16, 16, "FOL2")
    for x, y, col in [(2, 3, "FOL3"), (8, 2, "FOL4"), (12, 6, "FOL3"),
                      (4, 9, "FOL4"), (10, 11, "FOL3"), (13, 13, "FOL4"),
                      (1, 13, "FOL3")]:
        t.rect(x, y, x + 2, y + 2, col)
    for x, y in [(3, 2), (9, 1), (12, 5), (5, 8)]:
        t.px(x, y, "FOL6")
    t.px(9, 0, "FOL7")
    t.px(6, 7, "FOL1")
    t.px(11, 14, "FOL1")
    return t


def tile_cobble() -> Canvas:
    t = Canvas(16, 16, "STONE2")
    for x, y in [(1, 1), (7, 2), (2, 8), (9, 9), (5, 13)]:
        t.rect(x, y, x + 4, y + 3, "STONE3")
        t.px(x, y, "STONE4")
        t.px(x + 1, y, "STONE5")
    return t


def tiles_sheet() -> None:
    makers = [
        ("GRASS", tile_grass()),
        ("PATH", tile_path()),
        ("STONE", tile_stonebrick()),
        ("PLANK", tile_plank()),
        ("WATER A", tile_water(0)),
        ("WATER B", tile_water(1)),
        ("CANOPY", tile_canopy()),
        ("COBBLE", tile_cobble()),
    ]
    margin, pitch = 10, 52
    strip_w = margin * 2 + len(makers) * pitch
    title_h = 7 * 2 + 8
    c = Canvas(strip_w, title_h + 16 + 4 + 7 + 8, "PANEL")
    c.text(4, 4, "16X16 TILE SET - AUTHORED NATIVELY", "PARCH2", scale=2)
    for i, (name, tile) in enumerate(makers):
        x = margin + i * pitch
        c.stamp(tile, x + (pitch - 16) // 2, title_h)
        c.text(x + (pitch - text_w(name)) // 2, title_h + 20,
               name, "PARCH1")
    c.save(os.path.join(OUT, "tiles-strip.png"))

    # assembled 10x8 micro-scene: regions, not stripes.
    # distant canopy band, grass field, a cobble path bending toward a stone
    # building pad, a pond crossed by a plank bridge, one focal lantern.
    W, H = 10, 8
    scene = Canvas(16 * W, 16 * H)
    grass, stone, plank = tile_grass(), tile_stonebrick(), tile_plank()
    path = tile_path()
    water_a, water_b, canopy, cobble = (tile_water(0), tile_water(1),
                                        tile_canopy(), tile_cobble())
    pond = {(0, 5), (1, 5), (2, 5), (0, 6), (1, 6), (2, 6),
            (0, 7), (1, 7)}                       # 3x3 pond minus lower-right
    pad = {(tx, ty) for tx in range(7, 10) for ty in range(2, 5)}
    walk = {(4, 3), (4, 4), (5, 4), (5, 5), (6, 5), (6, 6), (7, 6)}
    for ty in range(H):
        for tx in range(W):
            if ty < 2:
                tile = canopy
            elif (tx, ty) in pond:
                tile = water_a if (tx + ty) % 2 == 0 else water_b
            elif (tx, ty) in pad:
                tile = stone
            elif (tx, ty) in walk:
                tile = cobble
            else:
                tile = grass
            scene.stamp(tile, tx * 16, ty * 16)
    # worn dirt approach where the cobble path meets the field
    scene.stamp(path, 4 * 16, 5 * 16)
    # plank bridge: two tiles spanning the pond's upper edge
    scene.stamp(plank, 3 * 16, 5 * 16)
    scene.stamp(plank, 3 * 16, 6 * 16)
    # focal prop: lantern post where the path meets the building pad
    px, py = 7 * 16, 5 * 16
    scene.rect(px + 7, py - 10, px + 8, py + 16, "WOOD3")
    scene.vline(px + 7, py - 10, py + 16, "WOOD1")
    scene.px(px + 9, py - 10, "WOOD4")
    scene.rect(px + 4, py - 20, px + 11, py - 11, "METAL2")
    scene.rect(px + 5, py - 19, px + 10, py - 13, "PANEL")
    scene.rect(px + 6, py - 18, px + 9, py - 14, "EMBER4")
    scene.px(px + 7, py - 17, "EMBER5")
    scene.px(px + 8, py - 15, "EMBER3")
    scene.hline(px + 4, px + 11, py - 20, "METAL3")
    scene.hline(px + 4, px + 11, py - 11, "METAL3")
    glow = GlowLayer(16 * W, 16 * H)
    glow.glow(px + 7, py - 16, 14, "EMBER3", max_alpha=120)
    merged = Canvas(16 * W, 16 * H)
    merged.img = snap_to_palette(glow.composite(scene.img))
    merged.save(os.path.join(OUT, "tiles-scene.png"))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    export_palette_json(os.path.join(DOCS, "palette.json"))
    palette_sheet()
    materials_sheet()
    tiles_sheet()
    print("art bible refs generated in", OUT)
