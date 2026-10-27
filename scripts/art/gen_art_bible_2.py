"""
Character, UI/icon, VFX and promotional reference sheets for the art bible.

Run:  /home/user/.venv-art/bin/python scripts/art/gen_art_bible_2.py
All output is palette-indexed and rendered through pixelart.py.
"""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from pixelart import Canvas, GlowLayer, snap_to_palette
from pixel_font import text_width
from gen_art_bible import tile_grass, tile_canopy, OUT

CW, CH = 32, 48          # locked character native resolution


# ---------------------------------------------------------------------------
# The Warden — original hero, authored at 32x48. Four expressive walk frames.
# ---------------------------------------------------------------------------

def warden(frame: int = 0) -> Canvas:
    c = Canvas(CW, CH)
    bob = (0, 1, 1, 0)[frame]
    lx, rx = ((0, 0), (1, -1), (0, 0), (-1, 1))[frame]      # leg offsets
    ax, ar = ((0, 0), (-1, 1), (0, 0), (1, -1))[frame]      # arm offsets
    sway = (0, 1, 0, -1)[frame]                              # cloak response
    y = bob

    # ground contact shadow (quiet cluster, same language as environment)
    c.rect(7, 46, 25, 47, "STONE2")

    # legs + boots, drawn under the cloak hem
    c.rect(12 + lx, 33 + y, 15 + lx, 42 + y, "STONE3")
    c.rect(17 + rx, 33 + y, 20 + rx, 42 + y, "STONE3")
    c.vline(12 + lx, 34 + y, 41 + y, "STONE2")
    c.vline(20 + rx, 34 + y, 41 + y, "STONE2")
    c.rect(11 + lx, 41 + y, 15 + lx, 45 + y, "WOOD1")
    c.rect(17 + rx, 41 + y, 21 + rx, 45 + y, "WOOD1")
    c.hline(11 + lx, 15 + lx, 41 + y, "WOOD4")
    c.hline(17 + rx, 21 + rx, 41 + y, "WOOD4")

    # cloak body: broad A-line, cool shadow side / warm lit side
    c.poly([(9, 13 + y), (23, 13 + y), (28 + sway, 40 + y),
            (4 - sway, 40 + y)], "TEAL3")
    c.poly([(9, 14 + y), (14, 14 + y), (12, 39 + y), (5 - sway, 39 + y)],
           "TEAL2")
    c.poly([(21, 14 + y), (23, 14 + y), (27 + sway, 39 + y),
            (23, 39 + y)], "TEAL4")
    c.vline(16, 16 + y, 38 + y, "TEAL2")
    c.px(17, 19 + y, "TEAL1")
    c.px(17, 25 + y, "TEAL1")
    c.line(23, 15 + y, 27 + sway, 39 + y, "TEAL6")     # 1px rim light
    c.hline(5 - sway, 27 + sway, 40 + y, "TEAL1")      # hem
    c.rect(6 - sway, 41 + y, 12 - sway, 42 + y, "RED2")   # red lining
    c.rect(21 + sway, 41 + y, 27 + sway, 42 + y, "RED3")

    # sleeves + hands, swinging opposite to the legs
    c.rect(6 + ax, 15 + y, 9 + ax, 29 + y, "TEAL2")
    c.rect(23 + ar, 15 + y, 26 + ar, 29 + y, "TEAL4")
    c.rect(6 + ax, 30 + y, 9 + ax, 32 + y, "SKIN3")
    c.rect(23 + ar, 30 + y, 26 + ar, 32 + y, "SKIN3")
    c.px(7 + ax, 30 + y, "SKIN4")
    c.px(24 + ar, 30 + y, "SKIN4")

    # red sash: the single high-chroma identity accent
    c.rect(10, 20 + y, 22, 22 + y, "RED3")
    c.hline(10, 22, 20 + y, "RED4")
    c.rect(22, 20 + y, 24, 23 + y, "RED2")

    # belt + buckle
    c.rect(8, 26 + y, 24, 27 + y, "WOOD2")
    c.rect(15, 25 + y, 17, 28 + y, "METAL3")
    c.px(16, 26 + y, "METAL4")

    # hood behind the face, then face opening, then hood rim
    c.disc(16, 9 + y, 7, "TEAL2")
    c.rect(13, 7 + y, 19, 13 + y, "SKIN3")
    c.hline(13, 19, 13 + y, "SKIN4")
    c.hline(13, 19, 12 + y, "SKIN1")                  # jaw shadow
    c.px(14, 10 + y, "INK")                          # eyes, 1px each
    c.px(18, 10 + y, "INK")
    c.px(15, 8 + y, "SKIN4")
    # hood rim: shaped cluster wrapping the face
    c.hline(12, 20, 5 + y, "TEAL4")
    c.vline(12, 6 + y, 13 + y, "TEAL3")
    c.vline(20, 6 + y, 13 + y, "TEAL1")
    c.px(16, 3 + y, "TEAL5")
    c.px(15, 4 + y, "TEAL4")
    c.px(17, 4 + y, "TEAL4")

    c.outline("INK")
    return c


def character_sheet() -> None:
    margin, cell = 10, 44
    title = "THE WARDEN - 32X48 NATIVE, 4-FRAME WALK"
    title_h = 7 * 2 + 10
    row_h = CH + 22
    w = max(margin * 2 + cell * 4, text_width(title, 2) + 10)
    h = title_h + row_h * 2 + 8
    c = Canvas(w, h, "PANEL")
    c.text(4, 4, title, "PARCH2", scale=2)

    # row 1: silhouette / full render / contour / proportion rule
    ref = warden(0)
    sil, con = Canvas(CW, CH), Canvas(CW, CH)
    sil.img = ref.img.copy()
    sil.fill_silhouette("INK")
    con.img = ref.img.copy()
    con.contour_only("PARCH1")
    passes = [("MASS", sil), ("FULL", ref), ("EDGES", con)]
    for i, (label, spr) in enumerate(passes):
        x = margin + i * cell
        c.stamp(spr, x, title_h + 12)
        c.text(x, title_h + 12 + CH + 3, label, "PARCH1")

    # proportion rule column: 4.3-head ladder against the full render
    rx = margin + 3 * cell
    c.vline(rx, title_h + 14, title_h + 14 + CH - 2, "STONE6")
    for head in range(5):
        ty = title_h + 14 + head * 11
        c.hline(rx - 3, rx + 3, ty, "STONE6")
        c.text(rx + 6, ty - 3, str(head + 1), "PARCH1")
    c.text(rx - 2, title_h + 14 + CH + 3, "4.3 HEADS", "PARCH1")

    # row 2: walk cycle frames
    for f in range(4):
        x = margin + f * cell
        c.stamp(warden(f), x, title_h + row_h + 12)
        c.text(x + 6, title_h + row_h + 12 + CH + 3, f"WALK {f}", "PARCH1")
    c.save(os.path.join(OUT, "character-warden.png"))


# ---------------------------------------------------------------------------
# UI icons — every icon authored natively at 16x16, never downscaled.
# ---------------------------------------------------------------------------

def _icon() -> Canvas:
    return Canvas(16, 16)


def icon_heart() -> Canvas:
    c = _icon()
    c.disc(6, 6, 3, "RED3")
    c.disc(10, 6, 3, "RED3")
    c.poly([(3, 7), (13, 7), (8, 14)], "RED3")
    c.px(5, 5, "RED5")
    c.px(6, 4, "RED5")
    c.px(4, 7, "RED4")
    c.outline("INK")
    return c


def icon_flame() -> Canvas:
    c = _icon()
    c.disc(8, 10, 4, "EMBER2")
    c.poly([(8, 2), (11, 7), (9, 10), (12, 13), (5, 13), (7, 10), (6, 6)],
           "EMBER3")
    c.disc(8, 10, 2, "EMBER4")
    c.px(8, 9, "EMBER5")
    c.px(7, 11, "EMBER5")
    c.outline("INK")
    return c


def icon_key() -> Canvas:
    c = _icon()
    c.disc(5, 5, 3, "METAL3")
    c.disc(5, 5, 1, "PANEL")
    c.rect(7, 7, 12, 9, "METAL3")
    c.rect(10, 9, 12, 12, "METAL3")
    c.px(8, 7, "METAL4")
    c.px(5, 4, "METAL4")
    c.outline("INK")
    return c


def icon_sword() -> Canvas:
    c = _icon()
    c.line(11, 2, 4, 11, "METAL4")
    c.line(12, 3, 5, 12, "METAL3")
    c.line(3, 9, 7, 13, "WOOD4")          # crossguard
    c.line(2, 12, 4, 14, "WOOD2")         # grip
    c.px(11, 2, "PARCH2")                 # blade glint
    c.outline("INK")
    return c


def icon_potion() -> Canvas:
    c = _icon()
    c.rect(7, 2, 8, 4, "WOOD4")           # cork
    c.disc(8, 10, 5, "WATER3")
    c.poly([(3, 9), (13, 9), (12, 14), (4, 14)], "WATER2")
    c.rect(7, 4, 8, 5, "WATER4")
    c.px(6, 8, "WATER4")
    c.px(5, 10, "WATER4")
    c.outline("INK")
    return c


def icon_shield() -> Canvas:
    c = _icon()
    c.poly([(8, 1), (13, 3), (13, 8), (8, 14), (3, 8), (3, 3)], "METAL2")
    c.poly([(8, 3), (11, 4), (11, 8), (8, 12), (5, 8), (5, 4)], "METAL3")
    c.disc(8, 7, 2, "EMBER4")
    c.px(8, 6, "EMBER5")
    c.outline("INK")
    return c


def icon_coin() -> Canvas:
    c = _icon()
    c.disc(8, 8, 6, "EMBER3")
    c.disc(8, 8, 4, "EMBER4")
    c.px(6, 6, "EMBER5")
    c.px(7, 5, "EMBER5")
    c.px(10, 10, "EMBER2")
    c.outline("INK")
    return c


def icon_lantern() -> Canvas:
    c = _icon()
    c.line(6, 1, 10, 1, "METAL3")
    c.line(6, 1, 8, 3, "METAL3")
    c.rect(6, 2, 9, 3, "METAL2")
    c.rect(5, 4, 10, 12, "METAL2")
    c.rect(6, 5, 9, 11, "EMBER4")
    c.px(7, 7, "EMBER5")
    c.px(8, 9, "EMBER3")
    c.rect(5, 12, 10, 13, "METAL3")
    c.outline("INK")
    return c


def icon_chest() -> Canvas:
    c = _icon()
    c.rect(3, 7, 13, 13, "WOOD3")
    c.rect(3, 5, 13, 8, "WOOD4")
    c.vline(6, 5, 13, "METAL2")
    c.vline(10, 5, 13, "METAL2")
    c.rect(7, 8, 9, 10, "EMBER4")
    c.hline(3, 13, 7, "WOOD1")
    c.px(4, 6, "WOOD5")
    c.outline("INK")
    return c


def icon_leaf() -> Canvas:
    c = _icon()
    c.poly([(3, 12), (7, 3), (13, 4), (12, 11), (7, 13)], "FOL4")
    c.line(4, 12, 11, 5, "FOL6")
    c.px(8, 5, "FOL7")
    c.px(9, 6, "FOL7")
    c.line(2, 13, 4, 11, "WOOD2")
    c.outline("INK")
    return c


def icon_scroll() -> Canvas:
    c = _icon()
    c.rect(4, 4, 12, 13, "PARCH1")
    c.rect(3, 3, 13, 5, "WOOD4")
    c.rect(3, 12, 13, 14, "WOOD4")
    c.hline(6, 10, 8, "STONE3")
    c.hline(6, 9, 10, "STONE3")
    c.disc(10, 11, 2, "RED3")
    c.px(10, 10, "RED4")
    c.outline("INK")
    return c


def icon_gear() -> Canvas:
    c = _icon()
    c.disc(8, 8, 5, "METAL3")
    for dx, dy in ((0, -6), (0, 6), (-6, 0), (6, 0)):
        c.rect(8 + dx - 1, 8 + dy - 1, 8 + dx + 1, 8 + dy + 1, "METAL3")
    c.disc(8, 8, 2, "PANEL")
    c.px(6, 6, "METAL4")
    c.px(7, 5, "METAL4")
    c.outline("INK")
    return c


ICONS = [
    ("HEART", icon_heart), ("FLAME", icon_flame), ("KEY", icon_key),
    ("SWORD", icon_sword), ("POTION", icon_potion), ("SHIELD", icon_shield),
    ("COIN", icon_coin), ("LANTERN", icon_lantern), ("CHEST", icon_chest),
    ("LEAF", icon_leaf), ("SCROLL", icon_scroll), ("GEAR", icon_gear),
]


def ui_sheet() -> None:
    margin, pitch = 10, 40
    cols = 6
    title = "UI ICONS - AUTHORED AT 16X16, INTEGER SCALE ONLY"
    title_h = 7 * 2 + 10
    grid_h = 2 * (16 + 12)
    panel_h = 52
    w = max(margin * 2 + cols * pitch, text_width(title, 2) + 10)
    h = title_h + grid_h + panel_h + 10
    c = Canvas(w, h, "PANEL")
    c.text(4, 4, title, "PARCH2", scale=2)
    for i, (name, fn) in enumerate(ICONS):
        col, row = i % cols, i // cols
        x = margin + col * pitch + (pitch - 16) // 2
        y = title_h + row * (16 + 12)
        c.stamp(fn(), x, y)
        c.text(x - (text_width(name) - 16) // 2, y + 18, name, "PARCH1")

    # HUD mock: 24px interactive targets, 16px icons, accessible text
    py = title_h + grid_h + 6
    c.rect(margin, py, w - margin - 1, py + panel_h - 4, "PANEL")
    c.rect(margin, py, w - margin - 1, py, "PARCH1")
    c.rect(margin, py + panel_h - 4, w - margin - 1, py + panel_h - 4,
           "PARCH1")
    c.vline(margin, py, py + panel_h - 4, "PARCH1")
    c.vline(w - margin - 1, py, py + panel_h - 4, "PARCH1")
    c.text(margin + 6, py + 5, "HUD - 24PX TARGETS, 16PX ICONS", "PARCH2")
    # health row
    c.stamp(icon_heart(), margin + 8, py + 18)
    c.rect(margin + 30, py + 21, margin + 150, py + 28, "STONE1")
    c.rect(margin + 30, py + 21, margin + 102, py + 28, "RED3")
    c.hline(margin + 30, margin + 102, py + 21, "RED4")
    c.text(margin + 156, py + 21, "HP 60/100", "PARCH1")
    # stamina row
    c.stamp(icon_flame(), margin + 8, py + 32)
    c.rect(margin + 30, py + 35, margin + 150, py + 42, "STONE1")
    c.rect(margin + 30, py + 35, margin + 126, py + 42, "EMBER3")
    c.hline(margin + 30, margin + 126, py + 35, "EMBER4")
    c.text(margin + 156, py + 35, "STAMINA 80", "PARCH1")
    c.save(os.path.join(OUT, "ui-icons.png"))


# ---------------------------------------------------------------------------
# VFX — stepped, pixel-shaped light. Contours underneath stay opaque.
# ---------------------------------------------------------------------------

def burst_frame(f: int) -> Canvas:
    c = Canvas(16, 16)
    radii = (2, 4, 6, 5)
    r = radii[f]
    outer = ("EMBER3", "EMBER2", "EMBER1", "EMBER1")[f]
    inner = ("EMBER5", "EMBER4", "EMBER3", "EMBER2")[f]
    c.disc(8, 8, r, outer)
    c.disc(8, 8, max(1, r - 2), inner)
    if f < 3:
        c.px(8, 8, "EMBER5")
        for dx, dy in ((0, -1), (0, 1), (-1, 0), (1, 0)):
            c.px(8 + dx * (r + 1), 8 + dy * (r + 1), "EMBER4")
    else:  # dissipate: sparse shaped clusters, no scatter noise
        for dx, dy in ((-4, -3), (4, -2), (-3, 4), (3, 3), (0, -5)):
            c.px(8 + dx, 8 + dy, "EMBER2")
            c.px(8 + dx + 1, 8 + dy, "EMBER1")
    return c


def smoke_frame(f: int) -> Canvas:
    c = Canvas(16, 16)
    rise = f * 2
    c.disc(8, 11 - rise, 4 - f, "STONE3" if f < 2 else "STONE4")
    c.disc(6, 12 - rise, 2, "STONE4")
    c.px(9, 9 - rise, "STONE5")
    return c


def sparkle_frame(f: int) -> Canvas:
    c = Canvas(16, 16)
    sizes = (1, 2, 3, 1)
    s = sizes[f]
    col = ("PARCH2", "TEAL6", "TEAL5", "PARCH2")[f]
    c.rect(8 - s, 7, 8 + s, 8, col)
    c.rect(7, 8 - s, 8, 8 + s, col)
    if f == 3:
        c.px(8, 8, "PARCH1")
    return c


def slash_frame(f: int) -> Canvas:
    c = Canvas(16, 16)
    col = "PARCH2" if f == 0 else "TEAL6"
    c.line(4, 11 - f, 12, 3 + f, col)
    c.line(5, 12 - f, 13, 4 + f, "TEAL5")
    c.px(3, 12 - f, "PARCH1")
    return c


def vfx_sheet() -> None:
    margin, pitch = 10, 26
    title = "VFX - STEPPED LIGHT, OPAQUE CONTOURS PRESERVED"
    title_h = 7 * 2 + 10
    rows = [
        ("EMBER BURST", [burst_frame(f) for f in range(4)]),
        ("SMOKE", [smoke_frame(f) for f in range(3)]),
        ("HEAL SPARK", [sparkle_frame(f) for f in range(4)]),
        ("SLASH", [slash_frame(f) for f in range(2)]),
    ]
    w = max(margin + 96 + 4 * pitch + margin, text_width(title, 2) + 10)
    h = title_h + len(rows) * 30 + 48
    c = Canvas(w, h, "PANEL")
    c.text(4, 4, title, "PARCH2", scale=2)
    for ri, (label, frames) in enumerate(rows):
        y = title_h + ri * 30
        c.text(margin, y + 4, label, "PARCH1")
        for fi, frm in enumerate(frames):
            c.stamp(frm, margin + 96 + fi * pitch, y)
    # glow rule demo: lantern, bare vs additive stepped glow
    gy = title_h + len(rows) * 30 + 6
    c.text(margin, gy + 4, "GLOW PASS", "PARCH1")
    c.stamp(icon_lantern(), margin + 96, gy)
    c.text(margin + 96 - 2, gy + 19, "NONE", "PARCH1")
    glow_c = Canvas(16, 16)
    glow_c.stamp(icon_lantern(), 0, 0)
    glow = GlowLayer(16, 16)
    glow.glow(8, 8, 8, "EMBER3", max_alpha=130)
    glow_c.img = snap_to_palette(glow.composite(glow_c.img))
    c.stamp(glow_c, margin + 96 + pitch, gy)
    c.text(margin + 96 + pitch - 2, gy + 19, "GLOW", "PARCH1")
    c.save(os.path.join(OUT, "vfx.png"))


# ---------------------------------------------------------------------------
# Loading screen + key art — one original scene, with and without UI chrome
# ---------------------------------------------------------------------------

SCENE_W, SCENE_H = 320, 180      # base framebuffer; integer x6 = 1920x1080
GROUND_Y = 104                   # hero feet and tower base sit on this line


def build_scene() -> Canvas:
    from gen_art_bible import tile_cobble
    c = Canvas(SCENE_W, SCENE_H, "PANEL")
    # distant masonry ridge, two depth layers (quiet, low-contrast)
    c.poly([(0, 88), (42, 54), (88, 82), (140, 48), (196, 74), (250, 52),
            (320, 72), (320, GROUND_Y), (0, GROUND_Y)], "STONE2")
    c.poly([(0, 96), (60, 72), (120, 94), (188, 68), (260, 90), (320, 78),
            (320, GROUND_Y), (0, GROUND_Y)], "STONE3")
    # hedge line where ridge meets field
    canopy = tile_canopy()
    for tx in range(SCENE_W // 16):
        c.stamp(canopy, tx * 16, GROUND_Y - 16)
    # field: quiet FOL3 base plus detailed grass tiles
    c.rect(0, GROUND_Y, SCENE_W - 1, SCENE_H - 1, "FOL3")
    grass, cobble = tile_grass(), tile_cobble()
    for ty in range(GROUND_Y, SCENE_H, 16):
        for tx in range(SCENE_W // 16):
            c.stamp(grass, tx * 16, ty)
    # worn cobble approach leading from hero toward the tower door
    for tx, ty in ((9, 7), (10, 7), (11, 7), (12, 7), (13, 7),
                   (14, 7), (14, 8)):
        c.stamp(cobble, tx * 16, ty * 16)
    # stone watchtower: deliberately taller than the 48px hero
    tx0, tx1, ty0, ty1 = 248, 298, 40, GROUND_Y + 40
    c.rect(tx0, ty0, tx1, ty1, "STONE3")
    for ty in range(ty0 + 8, ty1, 8):
        c.hline(tx0, tx1, ty, "STONE1")
    for txc in (tx0 + 16, tx0 + 34):
        c.vline(txc, ty0, ty1, "STONE2")
    for txc in range(tx0, tx1 + 1, 10):              # battlements
        c.rect(txc, ty0 - 7, txc + 5, ty0, "STONE4")
    c.rect(tx0 + 16, GROUND_Y + 8, tx0 + 32, ty1, "WOOD1")   # door
    c.hline(tx0 + 16, tx0 + 32, GROUND_Y + 8, "WOOD4")
    c.px(tx0 + 29, GROUND_Y + 26, "EMBER4")          # door lamp
    c.hline(tx0 + 1, tx1 - 1, ty0 + 1, "STONE6")     # lit top edge
    # hero at rest on the field, world scale preserved (48px native)
    c.stamp(warden(0), 60, GROUND_Y - 2)
    # lantern focal point between hero and tower
    lx, ly = 188, GROUND_Y - 38
    c.rect(lx - 1, ly + 8, lx + 1, GROUND_Y - 2, "WOOD3")
    c.vline(lx - 1, ly + 8, GROUND_Y - 2, "WOOD1")
    c.rect(lx - 5, ly - 6, lx + 5, ly + 8, "METAL2")
    c.rect(lx - 4, ly - 5, lx + 4, ly + 7, "EMBER4")
    c.px(lx, ly, "EMBER5")
    c.px(lx - 1, ly + 3, "EMBER3")
    glow = GlowLayer(SCENE_W, SCENE_H)
    glow.glow(lx, ly + 1, 24, "EMBER3", max_alpha=120)
    c.img = snap_to_palette(glow.composite(c.img))
    return c


def promo_sheets() -> None:
    scene = build_scene()
    scene.save(os.path.join(OUT, "key-art.png"))

    load = Canvas(SCENE_W, SCENE_H)
    load.img = scene.img.copy()
    # title-safe frame: 8px inset with corner ticks
    for x in range(8, SCENE_W - 8):
        load.px(x, 8, "METAL3")
        load.px(x, SCENE_H - 9, "METAL3")
    for y in range(8, SCENE_H - 8):
        load.px(8, y, "METAL3")
        load.px(SCENE_W - 9, y, "METAL3")
    for cx, cy in ((8, 8), (SCENE_W - 9, 8), (8, SCENE_H - 9),
                   (SCENE_W - 9, SCENE_H - 9)):
        load.rect(cx - 1, cy - 1, cx + 1, cy + 1, "PARCH1")
    # wordmark and loading bar
    title = "HEARTHWARDEN"
    load.text((SCENE_W - text_width(title, 3)) // 2, 14, title,
              "PARCH2", scale=3)
    bx0, bx1, by0, by1 = 88, SCENE_W - 88, SCENE_H - 26, SCENE_H - 14
    load.rect(bx0, by0, bx1, by1, "PANEL")
    load.rect(bx0, by0, bx1, by0, "PARCH1")
    load.rect(bx0, by1, bx1, by1, "PARCH1")
    load.vline(bx0, by0, by1, "PARCH1")
    load.vline(bx1, by0, by1, "PARCH1")
    fill_to = bx0 + round((bx1 - bx0) * 0.62)
    load.rect(bx0 + 3, by0 + 3, fill_to, by1 - 3, "EMBER3")
    load.hline(bx0 + 3, fill_to, by0 + 3, "EMBER4")
    label = "LOADING"
    load.text((SCENE_W - text_width(label, 2)) // 2, by0 - 18,
              label, "PARCH1", scale=2)
    load.save(os.path.join(OUT, "loading-screen.png"))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    character_sheet()
    ui_sheet()
    vfx_sheet()
    promo_sheets()
    print("character/ui/vfx/promo refs generated in", OUT)
