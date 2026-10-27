"""
Ember Trail (2.5D platformer) asset generator.

Produces every side-view sprite, tile, item and parallax plane for the web
game from the locked Hearthwarden palette, plus a contact sheet for the art
bible and the TypeScript port of the authored 5x7 pixel font.

Run:  /home/user/.venv-art/bin/python scripts/art/gen_platformer.py
"""
from __future__ import annotations

import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from pixelart import Canvas, PALETTE  # noqa: E402
from pixel_font import FONT5X7  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PUB = os.path.join(ROOT, "public", "images", "game")
DOCS = os.path.join(ROOT, "docs", "art-bible", "assets")
GAME_TS = os.path.join(ROOT, "src", "game")

HERO_FRAMES = ["idle", "run0", "run1", "run2", "run3", "jump", "fall"]


# ---------------------------------------------------------------------------
# Hero — the Warden in side view, 32x48, facing right (flip at runtime)
# ---------------------------------------------------------------------------

def hero_pose(pose: str) -> Canvas:
    c = Canvas(32, 48)
    p = {
        "idle":  dict(bob=0, flare=0, lift=0, back=(10, 41), front=(17, 41), hand=(24, 30), arm_up=False),
        "run0":  dict(bob=1, flare=0, lift=0, back=(6, 41),  front=(20, 41), hand=(25, 28), arm_up=False),
        "run1":  dict(bob=2, flare=0, lift=1, back=(11, 42), front=(17, 42), hand=(23, 30), arm_up=False),
        "run2":  dict(bob=1, flare=1, lift=1, back=(8, 42),  front=(18, 39), hand=(25, 24), arm_up=False),
        "run3":  dict(bob=0, flare=1, lift=2, back=(12, 41), front=(16, 38), hand=(24, 22), arm_up=False),
        "jump":  dict(bob=0, flare=2, lift=3, back=(9, 39),  front=(18, 37), hand=(25, 20), arm_up=True),
        "fall":  dict(bob=0, flare=2, lift=1, back=(13, 42), front=(19, 42), hand=(26, 26), arm_up=True),
    }[pose]
    bob, flare, lift = p["bob"], p["flare"], p["lift"]
    y = bob

    # legs: trousers under the cloak, boots at pose positions
    for (bx, by), dark in ((p["back"], True), (p["front"], False)):
        trouser_col = "STONE3" if dark else "STONE4"
        c.rect(bx, 33 + y, bx + 3, by + y, trouser_col)
        c.rect(bx - 1, by + y, bx + 4, by + 4 + y, "WOOD1")
        c.hline(bx - 1, bx + 4, by + y, "WOOD4")
        c.px(bx + 3, by + 2 + y, "WOOD2")

    # cloak body with pose-driven flare / hem lift
    c.poly([(10, 12 + y), (21, 12 + y),
            (26 + flare, 40 - lift + y), (6 - flare, 40 - lift + y)], "TEAL3")
    c.poly([(10, 13 + y), (14, 13 + y),
            (11 - flare, 39 - lift + y), (7 - flare, 39 - lift + y)], "TEAL2")
    c.poly([(19, 13 + y), (21, 13 + y),
            (25 + flare, 39 - lift + y), (22, 39 - lift + y)], "TEAL4")
    c.vline(15, 16 + y, 36 - lift + y, "TEAL2")
    c.px(16, 20 + y, "TEAL1")
    c.px(16, 27 + y, "TEAL1")
    c.line(21, 14 + y, 25 + flare, 38 - lift + y, "TEAL6")      # rim light
    c.hline(7 - flare, 25 + flare, 40 - lift + y, "TEAL1")      # hem
    c.rect(8 - flare, 41 - lift + y, 13 - flare, 42 - lift + y, "RED2")
    c.rect(20 + flare, 41 - lift + y, 25 + flare, 42 - lift + y, "RED3")

    # red sash + belt (identity accent and torso break)
    c.rect(11, 21 + y, 22, 23 + y, "RED3")
    c.hline(11, 22, 21 + y, "RED4")
    c.rect(22, 21 + y, 24, 24 + y, "RED2")
    c.rect(9, 27 + y, 23, 28 + y, "WOOD2")
    c.rect(15, 26 + y, 17, 29 + y, "METAL3")
    c.px(16, 27 + y, "METAL4")

    # front arm + hand
    hx, hy = p["hand"]
    if p["arm_up"]:
        c.rect(21, 15 + y, 24, 20 + y, "TEAL4")
        c.rect(23, hy + y, 25, hy + 3 + y, "TEAL4")
    else:
        c.rect(21, 15 + y, 24, hy + y, "TEAL4")
    c.rect(hx, hy + y, hx + 2, hy + 2 + y, "SKIN3")
    c.px(hx, hy + y, "SKIN4")

    # hood and face (face opens to the right)
    c.disc(15, 9 + y, 7, "TEAL2")
    c.rect(16, 7 + y, 21, 13 + y, "SKIN3")
    c.hline(16, 21, 13 + y, "SKIN1")
    c.hline(17, 21, 7 + y, "SKIN4")
    c.px(20, 10 + y, "INK")                                   # eye
    c.px(19, 9 + y, "SKIN4")                                  # brow highlight
    c.hline(12, 21, 5 + y, "TEAL4")                           # hood rim
    c.vline(12, 6 + y, 13 + y, "TEAL3")
    c.vline(21, 6 + y, 13 + y, "TEAL1")
    c.px(15, 2 + y, "TEAL5")                                  # hood point
    c.px(14, 3 + y, "TEAL4")
    c.px(16, 3 + y, "TEAL4")
    c.outline("INK")
    return c


def hero_sheet() -> None:
    sheet = Canvas(32 * len(HERO_FRAMES), 48)
    for i, name in enumerate(HERO_FRAMES):
        sheet.stamp(hero_pose(name), i * 32, 0)
    sheet.save(os.path.join(PUB, "hero.png"), previews=False)


# ---------------------------------------------------------------------------
# Enemies — original designs only
# ---------------------------------------------------------------------------

def thornling(frame: int) -> Canvas:
    c = Canvas(32, 32)
    if frame == 2:  # squashed after stomp
        c.disc(11, 24, 3, "FOL3")
        c.disc(21, 24, 3, "FOL3")
        c.rect(9, 21, 23, 27, "FOL3")
        c.rect(11, 20, 21, 23, "FOL4")
        for sx in (11, 16, 21):
            c.poly([(sx - 2, 21), (sx, 15), (sx + 2, 21)], "FOL5")
            c.px(sx, 16, "FOL6")
        c.px(14, 24, "INK")
        c.px(15, 24, "INK")
        c.px(18, 24, "INK")
        c.px(19, 24, "INK")
        c.outline("INK")
        return c
    shift = frame
    c.disc(16, 17 + shift, 9, "FOL3")
    c.disc(16, 20 + shift, 6, "FOL4")
    spikes = [(7, 12), (12, 8), (17, 7), (22, 9), (26, 13)]
    for sx, sy in spikes:
        c.poly([(sx - 3, sy + 4 + shift), (sx, sy - 3 + shift),
                (sx + 3, sy + 4 + shift)], "FOL5")
        c.px(sx, sy - 2 + shift, "FOL6")
    c.rect(10, 25 + shift, 13, 27 + shift, "WOOD3")           # feet
    c.rect(19, 25 + shift, 22, 27 + shift, "WOOD3")
    c.px(20, 15 + shift, "INK")                               # eye
    c.line(18, 13 + shift, 21, 14 + shift, "INK")             # brow
    c.px(12, 19 + shift, "FOL2")                              # belly depth
    c.outline("INK")
    return c


def wisp(frame: int) -> Canvas:
    c = Canvas(32, 32)
    up = frame
    outer = [(16, 4 + up), (22 - frame, 10 + up), (24, 18 + up),
             (20, 26 + up), (12, 26 + up), (8, 18 + up), (10 + frame, 10 + up)]
    c.poly(outer, "EMBER2")
    inner = [(16, 9 + up), (20, 14 + up), (21, 19 + up),
             (18, 24 + up), (14, 24 + up), (11, 19 + up), (12, 14 + up)]
    c.poly(inner, "EMBER3")
    c.disc(16, 19 + up, 3, "EMBER4")
    c.px(16, 18 + up, "EMBER5")
    c.px(14, 17 + up, "INK")
    c.px(18, 17 + up, "INK")
    c.outline("INK")
    return c


def enemy_sheets() -> None:
    t = Canvas(96, 32)
    for i in range(3):
        t.stamp(thornling(i), i * 32, 0)
    t.save(os.path.join(PUB, "thornling.png"), previews=False)
    w = Canvas(64, 32)
    for i in range(2):
        w.stamp(wisp(i), i * 32, 0)
    w.save(os.path.join(PUB, "wisp.png"), previews=False)


# ---------------------------------------------------------------------------
# Side-view 16x16 tile library
# ---------------------------------------------------------------------------

def tile_grass_cap() -> Canvas:
    t = Canvas(16, 16, "WOOD3")
    t.rect(0, 0, 15, 4, "FOL4")
    t.hline(0, 15, 5, "FOL2")
    for x in (1, 5, 9, 13):
        t.px(x, 2, "FOL5")
        t.px(x, 1, "FOL6")
    t.px(10, 0, "FOL7")
    t.hline(0, 15, 15, "WOOD2")
    for x, y in ((3, 9), (11, 11), (7, 13), (13, 8)):
        t.px(x, y, "WOOD2")
    t.px(5, 10, "WOOD4")
    return t


def tile_dirt() -> Canvas:
    t = Canvas(16, 16, "WOOD3")
    for x, y in ((3, 4), (10, 6), (6, 10), (12, 12), (2, 13)):
        t.rect(x, y, x + 1, y, "WOOD2")
    t.px(8, 3, "WOOD4")
    t.px(13, 9, "WOOD4")
    t.hline(0, 15, 15, "WOOD2")
    return t


def tile_stone() -> Canvas:
    t = Canvas(16, 16, "STONE3")
    t.hline(0, 15, 7, "STONE1")
    t.hline(0, 15, 15, "STONE1")
    t.vline(7, 0, 7, "STONE1")
    t.vline(3, 8, 15, "STONE1")
    t.vline(12, 8, 15, "STONE1")
    t.hline(0, 15, 0, "STONE6")
    t.vline(0, 0, 15, "STONE5")
    t.hline(0, 15, 15, "STONE2")
    t.px(5, 9, "STONE4")
    t.px(10, 3, "STONE2")
    return t


def tile_brick() -> Canvas:
    t = Canvas(16, 16, "STONE2")
    for hy in (5, 10, 15):
        t.hline(0, 15, hy, "STONE1")
    t.vline(8, 0, 5, "STONE1")
    t.vline(4, 6, 10, "STONE1")
    t.vline(12, 6, 10, "STONE1")
    t.vline(8, 11, 15, "STONE1")
    t.hline(0, 15, 0, "STONE4")
    t.px(2, 2, "STONE3")
    t.px(11, 7, "STONE3")
    t.px(6, 12, "STONE3")
    return t


def tile_plank() -> Canvas:
    t = Canvas(16, 16)                       # one-way: transparent below
    t.rect(0, 4, 15, 10, "WOOD4")
    t.hline(0, 15, 4, "WOOD5")
    t.hline(0, 15, 10, "WOOD1")
    t.hline(2, 13, 7, "WOOD3")
    for x in (2, 13):
        t.px(x, 6, "METAL2")
        t.px(x, 8, "METAL2")
    return t


def tile_spike() -> Canvas:
    t = Canvas(16, 16)
    t.rect(0, 12, 15, 15, "WOOD2")
    t.hline(0, 15, 12, "WOOD4")
    for bx in (2, 8, 14):
        t.poly([(bx - 3, 12), (bx, 3), (bx + 3, 12)], "METAL3")
        t.line(bx - 1, 11, bx, 4, "METAL4")
    return t


def tile_backwall() -> Canvas:
    t = Canvas(16, 16, "STONE1")
    t.hline(0, 15, 7, "STONE2")
    t.hline(0, 15, 15, "STONE2")
    t.vline(8, 0, 7, "STONE2")
    t.vline(4, 8, 15, "STONE2")
    t.vline(12, 8, 15, "STONE2")
    t.px(2, 2, "STONE2")
    t.px(11, 10, "STONE2")
    return t


def tile_moss_stone() -> Canvas:
    t = tile_stone()
    for x, y in ((1, 1), (2, 1), (3, 2), (12, 1), (13, 2), (14, 14)):
        t.px(x, y, "FOL4")
    t.px(2, 0, "FOL5")
    t.px(13, 0, "FOL5")
    t.px(14, 13, "FOL5")
    return t


def tile_sheet() -> None:
    tiles = [tile_grass_cap(), tile_dirt(), tile_stone(), tile_brick(),
             tile_plank(), tile_spike(), tile_backwall(), tile_moss_stone()]
    strip = Canvas(16 * len(tiles), 16)
    for i, t in enumerate(tiles):
        strip.stamp(t, i * 16, 0)
    strip.save(os.path.join(PUB, "tiles.png"), previews=False)


# ---------------------------------------------------------------------------
# Items
# ---------------------------------------------------------------------------

def shard(frame: int) -> Canvas:
    # width pulse for a spin read; the narrowest frame still keeps a 6px body
    inset = (0, 1, 2, 1)[frame]
    t = Canvas(16, 16)
    t.poly([(8, 2 + inset), (13 - inset, 8), (8, 14 - inset),
            (3 + inset, 8)], "EMBER2")
    t.poly([(8, 4 + inset), (11 - inset, 8), (8, 12 - inset),
            (5 + inset, 8)], "EMBER4")
    t.px(8, 7, "EMBER5")
    t.px(7, 8, "EMBER5")
    t.outline("INK")
    return t


def heart() -> Canvas:
    t = Canvas(16, 16)
    t.disc(6, 6, 3, "RED3")
    t.disc(10, 6, 3, "RED3")
    t.poly([(3, 7), (13, 7), (8, 14)], "RED3")
    t.px(5, 5, "RED5")
    t.px(6, 4, "RED5")
    t.px(4, 7, "RED4")
    t.outline("INK")
    return t


def lantern_states() -> Canvas:
    sheet = Canvas(32, 24)
    for state in range(2):
        ox = state * 16
        t = Canvas(16, 24)
        t.rect(7, 10, 8, 23, "WOOD3")
        t.vline(7, 10, 23, "WOOD1")
        t.rect(4, 2, 12, 11, "METAL2")
        if state == 0:                                     # unlit checkpoint
            t.rect(5, 3, 11, 10, "PANEL")
            t.rect(7, 5, 9, 8, "METAL3")
            t.hline(4, 12, 2, "METAL3")
        else:                                              # lit: baked halo
            for rr, col in ((8, "EMBER1"), (6, "EMBER2"), (4, "EMBER3")):
                for dy in range(-rr, rr + 1):
                    for dx in range(-rr, rr + 1):
                        if dx * dx + dy * dy <= rr * rr:
                            t.px(8 + dx, 6 + dy, col)
            t.rect(4, 2, 12, 11, "METAL2")
            t.rect(5, 3, 11, 10, "EMBER4")
            t.px(8, 6, "EMBER5")
            t.hline(4, 12, 2, "METAL3")
            t.hline(4, 12, 11, "METAL3")
        sheet.stamp(t, ox, 0)
    return sheet


def hearth() -> Canvas:
    t = Canvas(32, 48)
    t.rect(2, 10, 29, 47, "STONE3")                        # arch body
    for hy in (18, 26, 34, 42):
        t.hline(2, 29, hy, "STONE1")
    for vx in (10, 20):
        t.vline(vx, 10, 47, "STONE2")
    t.rect(9, 22, 22, 45, "PANEL")                         # firebox
    t.rect(9, 22, 22, 24, "INK")
    # baked stepped flame glow
    for rr, col in ((13, "EMBER1"), (10, "EMBER2"), (7, "EMBER3")):
        for dy in range(-rr, rr + 1):
            for dx in range(-rr, rr + 1):
                if dx * dx + dy * dy <= rr * rr:
                    t.px(16 + dx, 34 + dy, col)
    t.poly([(16, 24), (20, 31), (18, 36), (21, 41), (11, 41),
            (14, 36), (12, 31)], "EMBER3")
    t.disc(16, 37, 3, "EMBER4")
    t.px(16, 35, "EMBER5")
    t.rect(1, 8, 30, 11, "WOOD4")                          # mantel
    t.hline(1, 30, 8, "WOOD5")
    t.hline(2, 29, 10, "STONE6")
    t.outline("INK")
    return t


def sprout_stages() -> Canvas:
    sheet = Canvas(48, 16)
    stages = []
    seed = Canvas(16, 16)
    seed.rect(0, 11, 15, 15, "WOOD3")
    seed.disc(8, 10, 3, "WOOD2")
    seed.px(7, 9, "WOOD4")
    stages.append(seed)
    sp = Canvas(16, 16)
    sp.rect(0, 11, 15, 15, "WOOD3")
    sp.vline(8, 6, 11, "FOL4")
    sp.rect(4, 7, 7, 9, "FOL5")
    sp.rect(9, 8, 12, 10, "FOL5")
    sp.px(5, 7, "FOL6")
    stages.append(sp)
    bloom = Canvas(16, 16)
    bloom.rect(0, 11, 15, 15, "WOOD3")
    bloom.vline(8, 5, 11, "FOL4")
    bloom.rect(3, 8, 6, 10, "FOL5")
    bloom.rect(10, 8, 13, 10, "FOL5")
    for dx, dy in ((8, 2), (6, 4), (10, 4), (8, 6)):      # ember petals
        bloom.px(dx, dy, "EMBER4")
        bloom.px(dx + 1, dy, "EMBER3")
    bloom.px(8, 3, "EMBER5")
    stages.append(bloom)
    for i, s in enumerate(stages):
        sheet.stamp(s, i * 16, 0)
    return sheet


def item_sheets() -> None:
    sh = Canvas(64, 16)
    for i in range(4):
        sh.stamp(shard(i), i * 16, 0)
    sh.save(os.path.join(PUB, "shard.png"), previews=False)
    heart().save(os.path.join(PUB, "heart.png"), previews=False)
    lantern_states().save(os.path.join(PUB, "lantern.png"), previews=False)
    hearth().save(os.path.join(PUB, "hearth.png"), previews=False)
    sprout_stages().save(os.path.join(PUB, "sprout.png"), previews=False)


# ---------------------------------------------------------------------------
# Boss — BRIARHEART, an original giant thorn-creature with an ember core.
# 48x48 per frame, three readable states: idle / windup / core exposed.
# ---------------------------------------------------------------------------

def briarheart(frame: int) -> Canvas:
    t = Canvas(48, 48)
    lift = 2 if frame == 1 else 0                       # windup raises spikes
    # spiked perimeter
    spikes = [(8, 12), (16, 6), (24, 4), (32, 6), (40, 12),
              (43, 22), (40, 32), (32, 40), (24, 43), (16, 40),
              (8, 32), (5, 22)]
    for sx, sy in spikes:
        t.poly([(sx - 4, sy + 5), (sx, sy - 4 - lift), (sx + 4, sy + 5)], "FOL5")
        t.px(sx, sy - 3 - lift, "FOL6")
    # body mass, darker underneath
    t.disc(24, 25, 15, "FOL3")
    t.disc(24, 29, 11, "FOL4")
    t.disc(24, 34, 8, "FOL2")
    # feet
    t.rect(12, 38, 18, 42, "WOOD3")
    t.rect(30, 38, 36, 42, "WOOD3")
    t.hline(12, 18, 38, "WOOD4")
    t.hline(30, 36, 38, "WOOD4")
    # ember core: dim armour plate normally, blazing when exposed
    if frame == 2:
        for rr, col in ((9, "EMBER1"), (7, "EMBER2"), (5, "EMBER3")):
            for dy in range(-rr, rr + 1):
                for dx in range(-rr, rr + 1):
                    if dx * dx + dy * dy <= rr * rr:
                        t.px(24 + dx, 25 + dy, col)
        t.disc(24, 25, 3, "EMBER4")
        t.disc(24, 25, 1, "EMBER5")
        # open petal ring signals the weak point
        for ang in range(8):
            import math
            px = 24 + round(math.cos(ang * math.pi / 4) * 11)
            py = 25 + round(math.sin(ang * math.pi / 4) * 11)
            t.px(px, py, "FOL6")
    else:
        t.disc(24, 25, 6, "METAL2")
        t.disc(24, 25, 4, "EMBER2" if frame == 1 else "STONE2")
        t.disc(24, 25, 2, "EMBER3")
        t.px(23, 24, "EMBER4")
    # angry brows and eyes
    t.line(15, 18, 20, 20, "INK")
    t.line(33, 18, 28, 20, "INK")
    t.px(18, 21, "INK")
    t.px(30, 21, "INK")
    t.outline("INK")
    return t


def ember_seed() -> Canvas:
    t = Canvas(12, 12)
    t.poly([(6, 1), (10, 6), (6, 11), (2, 6)], "EMBER2")
    t.poly([(6, 3), (8, 6), (6, 9), (4, 6)], "EMBER3")
    t.px(6, 5, "EMBER5")
    t.px(5, 6, "EMBER4")
    t.px(7, 7, "EMBER1")
    t.outline("INK")
    return t


def boss_sheets() -> None:
    strip = Canvas(48 * 3, 48)
    for i in range(3):
        strip.stamp(briarheart(i), i * 48, 0)
    strip.save(os.path.join(PUB, "briarheart.png"), previews=False)
    ember_seed().save(os.path.join(PUB, "ember-seed.png"), previews=False)


# ---------------------------------------------------------------------------
# Parallax planes, 320x180. Off-gameplay planes use only the darkest ramps.
# ---------------------------------------------------------------------------

def bg_sky() -> Canvas:
    t = Canvas(320, 180, "INK")
    t.rect(0, 42, 319, 180, "PANEL")
    t.rect(0, 96, 319, 180, "STONE1")
    t.disc(268, 36, 9, "PARCH2")                            # moon
    t.disc(264, 33, 8, "PANEL")                             # crescent bite
    stars = [(24, 18), (52, 34), (84, 14), (118, 40), (150, 22), (186, 36),
             (214, 16), (244, 44), (300, 26), (40, 58), (96, 52), (170, 54),
             (226, 60), (12, 70), (132, 66)]
    for i, (sx, sy) in enumerate(stars):
        t.px(sx, sy, "PARCH1")
        if i % 3 == 0 and sy < 42:                  # cross sparkle only in sky
            t.px(sx + 1, sy, "PARCH1")
            t.px(sx, sy + 1, "PARCH1")
    return t


def bg_far() -> Canvas:
    t = Canvas(320, 180)
    t.poly([(0, 132), (36, 96), (70, 120), (112, 84), (150, 116),
            (196, 90), (240, 118), (286, 96), (320, 112), (320, 180),
            (0, 180)], "STONE2")
    t.poly([(30, 104), (36, 96), (44, 104), (108, 92), (112, 84),
            (120, 94), (192, 98), (196, 90), (204, 100)], "STONE3")
    return t


def bg_mid() -> Canvas:
    t = Canvas(320, 180)
    t.rect(0, 146, 319, 179, "FOL1")
    for bx, r in ((18, 14), (60, 18), (108, 13), (152, 17), (202, 14),
                  (248, 18), (298, 15)):
        t.disc(bx, 146, r, "FOL1")
        t.disc(bx - 4, 142, r - 5, "FOL2")
    for tx in (34, 88, 136, 188, 236, 286):
        t.px(tx, 128, "FOL2")
        t.px(tx, 127, "FOL3")
    return t


def bg_fore() -> Canvas:
    # Near-plane framing silhouette: dense corner foliage + short ground tufts.
    # The central play band (y < 130) is deliberately kept clear.
    t = Canvas(320, 180)
    # corner mounds, dark FOL1 mass with INK depth and a few FOL2 tips
    for cx, cy, r in ((8, 170, 17), (30, 174, 12), (312, 170, 17),
                      (290, 174, 12)):
        t.disc(cx, cy, r, "FOL1")
    for cx, cy in ((10, 162), (28, 166), (310, 162), (292, 166)):
        t.disc(cx, cy, 5, "INK")
    for cx, cy in ((4, 158), (18, 160), (302, 158), (316, 161), (26, 157),
                   (294, 157)):
        t.px(cx, cy, "FOL2")
        t.px(cx + 1, cy, "FOL2")
    # short ground tufts between the mounds, never entering the play band
    for rx in (64, 108, 150, 196, 244):
        t.vline(rx, 170, 179, "FOL1")
        t.vline(rx + 2, 172, 179, "FOL1")
        t.px(rx, 169, "FOL2")
        t.px(rx + 2, 171, "FOL2")
    t.outline("INK")
    return t


def background_sheets() -> None:
    bg_sky().save(os.path.join(PUB, "bg-sky.png"), previews=False)
    bg_far().save(os.path.join(PUB, "bg-far.png"), previews=False)
    bg_mid().save(os.path.join(PUB, "bg-mid.png"), previews=False)
    bg_fore().save(os.path.join(PUB, "bg-fore.png"), previews=False)


# ---------------------------------------------------------------------------
# TypeScript port of the authored 5x7 font for in-canvas HUD text
# ---------------------------------------------------------------------------

def emit_font_ts() -> None:
    os.makedirs(GAME_TS, exist_ok=True)
    lines = [
        "// GENERATED by scripts/art/gen_platformer.py — do not edit by hand.",
        "// Authored 5x7 bitmap font, mirrors scripts/art/pixel_font.py.",
        "export const FONT_GLYPH_W = 5;",
        "export const FONT_GLYPH_H = 7;",
        "export const FONT_ADVANCE = 6;",
        "export const FONT_5X7: Record<string, readonly string[]> = "
        + json.dumps(FONT5X7, indent=2).replace('"\n', '",\n') + ";",
        "",
    ]
    with open(os.path.join(GAME_TS, "font-data.ts"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))


# ---------------------------------------------------------------------------
# Art-bible contact sheet
# ---------------------------------------------------------------------------

def contact_sheet() -> None:
    margin = 10
    title = "EMBER TRAIL - 2.5D PLATFORMER ASSETS"
    title_h = 24
    row_gap = 14
    row_pitch = 48 + row_gap
    w = max(340, len(title) * 12 + 10)
    h = title_h + 6 * row_pitch + 60
    c = Canvas(w, h, "PANEL")
    c.text(4, 4, title, "PARCH2", scale=2)

    def label(y: int, text: str) -> None:
        c.text(margin, y, text, "PARCH1")

    y = title_h
    label(y, "HERO 32X48 - IDLE RUNX4 JUMP FALL")
    c.stamp(load(PUB, "hero.png"), margin, y + 10)
    y += 48 + row_gap

    label(y, "THORNLING 32X32 + WISP 32X32")
    c.stamp(load(PUB, "thornling.png"), margin, y + 10)
    c.stamp(load(PUB, "wisp.png"), margin + 104, y + 10)
    y += 48 + row_gap

    label(y, "TILES 16X16")
    c.stamp(load(PUB, "tiles.png"), margin, y + 10)
    y += 48 + row_gap

    label(y, "SHARD X4 / HEART / LANTERN / HEARTH / SPROUT X3")
    c.stamp(load(PUB, "shard.png"), margin, y + 10)
    c.stamp(load(PUB, "heart.png"), margin + 72, y + 10)
    c.stamp(load(PUB, "lantern.png"), margin + 94, y + 6)
    c.stamp(load(PUB, "hearth.png"), margin + 134, y + 10)
    c.stamp(load(PUB, "sprout.png"), margin + 174, y + 10)
    y += 48 + row_gap

    label(y, "SKY / FAR RIDGE / MID HEDGE / FOREGROUND (DARKEST RAMPS)")
    # integer-cropped 80x45 preview windows — never fractional downscaling
    crops = ((0, 0), (0, 90), (0, 130), (0, 120))
    for i, (name, (cx0, cy0)) in enumerate(
            zip(("bg-sky", "bg-far", "bg-mid", "bg-fore"), crops)):
        c.stamp(load_crop(PUB, name + ".png", (cx0, cy0, cx0 + 80, cy0 + 45)),
                margin + i * 82, y + 10)
    y += row_pitch

    label(y, "BRIARHEART BOSS 48X48 - IDLE / WINDUP / CORE EXPOSED + SEED")
    c.stamp(load(PUB, "briarheart.png"), margin, y + 6)
    c.stamp(load(PUB, "ember-seed.png"), margin + 160, y + 20)
    c.save(os.path.join(DOCS, "platformer-sheet.png"))


def load(directory: str, name: str) -> Canvas:
    from PIL import Image
    img = Image.open(os.path.join(directory, name))
    c = Canvas(img.size[0], img.size[1])
    c.img = img
    return c


def load_crop(directory: str, name: str, box: tuple[int, int, int, int]) -> Canvas:
    from PIL import Image
    img = Image.open(os.path.join(directory, name)).crop(box)
    c = Canvas(img.size[0], img.size[1])
    c.img = img
    return c


def main() -> None:
    os.makedirs(PUB, exist_ok=True)
    os.makedirs(DOCS, exist_ok=True)
    hero_sheet()
    enemy_sheets()
    tile_sheet()
    item_sheets()
    boss_sheets()
    background_sheets()
    emit_font_ts()
    contact_sheet()
    print("platformer assets ->", PUB)
    print("contact sheet ->", os.path.join(DOCS, "platformer-sheet.png"))
    print("font ->", os.path.join(GAME_TS, "font-data.ts"))
    # hard guarantee: every generated colour is a locked palette index
    for name in os.listdir(PUB):
        if not name.endswith(".png"):
            continue
        from PIL import Image
        img = Image.open(os.path.join(PUB, name))
        assert img.mode == "P", name
        used = {b for b in img.tobytes()}
        assert max(used) < len(PALETTE), (name, used)


if __name__ == "__main__":
    main()
