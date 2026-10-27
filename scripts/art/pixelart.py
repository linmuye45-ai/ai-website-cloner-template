"""
Hearthwarden art bible — pixel art core library.

Single source of truth for the locked master palette plus palette-indexed
canvas primitives. Every reference sheet in docs/art-bible/assets is rendered
through this module so an off-palette pixel cannot be produced by accident.

Convention:
  - index 0 is reserved for transparency (P-mode PNG, tRNS chunk)
  - every other index is a locked palette colour with a stable id + role
  - glow is the ONLY thing allowed to live outside index mode, and it is
    drawn on a separate RGBA layer (see GlowLayer) so contours stay opaque
"""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from PIL import Image

# ---------------------------------------------------------------------------
# Locked master palette — 51 colours + reserved transparency slot.
# Ramps are ordered dark -> light and carry deliberate hue shifts:
# shadows drift cool (blue/violet), highlights drift warm (yellow/cream).
# ---------------------------------------------------------------------------

PALETTE: list[tuple[str, str, str]] = [
    # id, hex, role
    ("TRANSPARENT", "#000000", "reserved transparency index (never painted)"),
    ("INK", "#16131F", "deepest linework / silhouette separation / UI text"),
    ("PANEL", "#211C2E", "UI panel fill / near-black interiors"),

    # Stone ramp (7) — cool violet-grey, warming as it lifts
    ("STONE1", "#2A2733", "stone shadow, mortar, cave depth"),
    ("STONE2", "#3A3646", "stone mid-shadow"),
    ("STONE3", "#4E495C", "stone base midtone"),
    ("STONE4", "#676078", "stone lit midtone"),
    ("STONE5", "#857D94", "stone highlight"),
    ("STONE6", "#A79FB4", "stone bright edge, plaster"),
    ("STONE7", "#CBC3D6", "sunlit stone top, rim light"),

    # Foliage ramp (7) — blue-green shadow to warm yellow-green tip
    ("FOL1", "#16281C", "foliage interior shadow, canopy gaps"),
    ("FOL2", "#1F3D28", "foliage deep"),
    ("FOL3", "#2E5A37", "foliage base"),
    ("FOL4", "#477A45", "foliage midtone"),
    ("FOL5", "#6AA252", "foliage lit"),
    ("FOL6", "#A4CC6A", "leaf highlight"),
    ("FOL7", "#D6E88A", "sunlit leaf tip (focal sparkle)"),

    # Warden teal — hero cloth ramp (6)
    ("TEAL1", "#10282C", "cloak shadow / fold deep"),
    ("TEAL2", "#173F47", "cloak dark"),
    ("TEAL3", "#1F5C66", "cloak base"),
    ("TEAL4", "#2D7F8A", "cloak lit"),
    ("TEAL5", "#49A8B0", "cloak highlight"),
    ("TEAL6", "#86D4D2", "cloak rim / sun edge"),

    # Ember red — accent cloth / danger ramp (5)
    ("RED1", "#3A1420", "red shadow, lining dark"),
    ("RED2", "#6A2230", "red dark"),
    ("RED3", "#9C3540", "red base, UI danger"),
    ("RED4", "#D15C52", "red lit"),
    ("RED5", "#F29578", "red rim / warm skin flush"),

    # Timber ramp (5) — brown, slight warm lift
    ("WOOD1", "#2B1A14", "wood shadow, bark groove"),
    ("WOOD2", "#452B1C", "wood dark"),
    ("WOOD3", "#6B4426", "wood base"),
    ("WOOD4", "#96653A", "wood lit"),
    ("WOOD5", "#C7955C", "wood highlight / worn edge"),

    # Skin ramp (4)
    ("SKIN1", "#5A3A32", "skin shadow (jaw, neck)"),
    ("SKIN2", "#8A5C4A", "skin midtone"),
    ("SKIN3", "#BD8A6E", "skin base"),
    ("SKIN4", "#E8BF9C", "skin highlight (cheek, nose)"),

    # Metal ramp (4) — cool steel
    ("METAL1", "#23262E", "metal shadow"),
    ("METAL2", "#3D4450", "metal dark"),
    ("METAL3", "#6B7686", "metal base"),
    ("METAL4", "#B9C4D2", "metal specular edge"),

    # Ember / lantern ramp (5) — the game's warm light signature
    ("EMBER1", "#5C2417", "ember bed, glow falloff far"),
    ("EMBER2", "#A8451E", "ember deep"),
    ("EMBER3", "#E8782C", "flame base"),
    ("EMBER4", "#F7B733", "flame body / UI gold"),
    ("EMBER5", "#FFE9A8", "flame core / lit parchment glint"),

    # Water ramp (4)
    ("WATER1", "#122B3E", "deep water"),
    ("WATER2", "#1C4663", "water dark"),
    ("WATER3", "#2F6F96", "water body"),
    ("WATER4", "#6FB4D0", "water glint / ripple crest"),

    # Parchment / UI paper (2)
    ("PARCH1", "#D8C9A3", "parchment base, icon canvas"),
    ("PARCH2", "#F0E6C8", "parchment bright, text on dark"),
]

ID: dict[str, int] = {name: i for i, (name, _hex, _role) in enumerate(PALETTE)}
HEX: dict[str, str] = {name: h for name, h, _role in PALETTE}
RGB: dict[str, tuple[int, int, int]] = {
    name: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
    for name, h, _role in PALETTE
}

# Ramp groupings (ids in dark -> light order) for sheets and documentation
RAMPS: dict[str, list[str]] = {
    "stone": [f"STONE{i}" for i in range(1, 8)],
    "foliage": [f"FOL{i}" for i in range(1, 8)],
    "teal": [f"TEAL{i}" for i in range(1, 7)],
    "red": [f"RED{i}" for i in range(1, 6)],
    "wood": [f"WOOD{i}" for i in range(1, 6)],
    "skin": [f"SKIN{i}" for i in range(1, 5)],
    "metal": [f"METAL{i}" for i in range(1, 5)],
    "ember": [f"EMBER{i}" for i in range(1, 6)],
    "water": [f"WATER{i}" for i in range(1, 5)],
    "parchment": ["PARCH1", "PARCH2"],
    "neutral": ["INK", "PANEL"],
}


def export_palette_json(path: str) -> None:
    """Write the machine-readable locked palette next to the art bible."""
    data = {
        "name": "Hearthwarden master palette",
        "version": "1.0.0-locked",
        "rule": "all sprites are indexed to this palette; index 0 is transparency",
        "colors": [
            {"index": i, "id": name, "hex": h, "role": role}
            for i, (name, h, role) in enumerate(PALETTE)
        ],
        "ramps": RAMPS,
    }
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2)


# ---------------------------------------------------------------------------
# Bitmap lettering lives in pixel_font.py (authored 5x7, integer scale)
# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# Palette-indexed pixel canvas
# ---------------------------------------------------------------------------

@dataclass
class Canvas:
    w: int
    h: int
    bg: str = "TRANSPARENT"

    def __post_init__(self) -> None:
        self.img = Image.new("P", (self.w, self.h), 0)
        flat = [v for pname, _h, _r in PALETTE for v in RGB[pname]]
        self.img.putpalette(flat)
        self.img.info["transparency"] = 0
        if self.bg != "TRANSPARENT":
            self.rect(0, 0, self.w - 1, self.h - 1, self.bg)

    # -- primitives --------------------------------------------------------
    def px(self, x: int, y: int, color: str) -> None:
        if 0 <= x < self.w and 0 <= y < self.h and color != "TRANSPARENT":
            self.img.putpixel((x, y), ID[color])

    def rect(self, x0: int, y0: int, x1: int, y1: int, color: str) -> None:
        for y in range(max(0, y0), min(self.h, y1 + 1)):
            for x in range(max(0, x0), min(self.w, x1 + 1)):
                self.px(x, y, color)

    def hline(self, x0: int, x1: int, y: int, color: str) -> None:
        self.rect(x0, y, x1, y, color)

    def vline(self, x: int, y0: int, y1: int, color: str) -> None:
        self.rect(x, y0, x, y1, color)

    def line(self, x0: int, y0: int, x1: int, y1: int, color: str) -> None:
        """Bresenham, any angle."""
        dx, dy = abs(x1 - x0), -abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx + dy
        while True:
            self.px(x0, y0, color)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                x0 += sx
            if e2 <= dx:
                err += dx
                y0 += sy

    def disc(self, cx: int, cy: int, r: int, color: str) -> None:
        """Filled circle as shaped pixel clusters (no sub-pixel softness)."""
        for dy in range(-r, r + 1):
            for dx in range(-r, r + 1):
                if dx * dx + dy * dy <= r * r + r * 0.6:
                    self.px(cx + dx, cy + dy, color)

    def poly(self, points: list[tuple[int, int]], color: str) -> None:
        """Scanline fill for convex/blocky polygons (cloaks, roofs, hills)."""
        ys = [y for _x, y in points]
        for y in range(min(ys), max(ys) + 1):
            xs: list[int] = []
            for i, (x0, y0) in enumerate(points):
                x1, y1 = points[(i + 1) % len(points)]
                if y0 == y1:
                    continue
                if min(y0, y1) <= y < max(y0, y1):
                    xs.append(x0 + (y - y0) * (x1 - x0) / (y1 - y0))
            xs.sort()
            for i in range(0, len(xs) - 1, 2):
                self.rect(int(round(xs[i])), y, int(round(xs[i + 1])), y, color)

    def blit(self, x: int, y: int, rows: list[str], mapping: dict[str, str]) -> None:
        """Paint a text pixel-map. '.' or missing keys = transparent."""
        for j, row in enumerate(rows):
            for i, ch in enumerate(row):
                color = mapping.get(ch)
                if color:
                    self.px(x + i, y + j, color)

    def text(self, x: int, y: int, s: str, color: str, scale: int = 1) -> int:
        from pixel_font import draw_text, text_width, GLYPH_H
        width = text_width(s, scale)
        height = GLYPH_H * scale
        # hard guard: label may not clip the canvas (keeps every sheet legible)
        if x < 0 or y < 0 or x + width > self.w or y + height > self.h:
            raise ValueError(
                f"text {s!r} at ({x},{y}) scale {scale} needs "
                f"{width}x{height} but canvas is {self.w}x{self.h}")
        draw_text(self.px, x, y, s, color, scale)
        return width

    def stamp(self, other: "Canvas", x: int, y: int) -> None:
        """Composite another palette canvas (index 0 transparent), clipped."""
        for j in range(other.h):
            if not (0 <= y + j < self.h):
                continue
            for i in range(other.w):
                if not (0 <= x + i < self.w):
                    continue
                idx = other.img.getpixel((i, j))
                if idx:
                    self.img.putpixel((x + i, y + j), idx)

    def fill_silhouette(self, color: str = "INK") -> None:
        """Flatten every opaque pixel to one colour (readability pass)."""
        for y in range(self.h):
            for x in range(self.w):
                if self.img.getpixel((x, y)) != 0:
                    self.img.putpixel((x, y), ID[color])

    def contour_only(self, color: str = "INK") -> None:
        """Keep only opaque pixels adjacent to transparency (edge pass)."""
        opaque = {
            (x, y)
            for y in range(self.h)
            for x in range(self.w)
            if self.img.getpixel((x, y)) != 0
        }
        edge = {
            (x, y)
            for x, y in opaque
            if any((x + dx, y + dy) not in opaque
                   for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        }
        self.img = Image.new("P", (self.w, self.h), 0)
        flat = [v for pname, _h, _r in PALETTE for v in RGB[pname]]
        self.img.putpalette(flat)
        self.img.info["transparency"] = 0
        for x, y in edge:
            self.img.putpixel((x, y), ID[color])

    def outline(self, color: str = "INK") -> None:
        """
        Add a 1px contour around every opaque cluster on a transparent canvas.
        This is the sanctioned silhouette rule: every transparent-background
        asset carries an INK (or specified) edge so it reads on any backdrop.
        """
        opaque = {
            (x, y)
            for y in range(self.h)
            for x in range(self.w)
            if self.img.getpixel((x, y)) != 0
        }
        border: set[tuple[int, int]] = set()
        for x, y in opaque:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                p = (x + dx, y + dy)
                if p not in opaque and 0 <= p[0] < self.w and 0 <= p[1] < self.h:
                    border.add(p)
        for x, y in border:
            self.img.putpixel((x, y), ID[color])

    # -- output ------------------------------------------------------------
    def save(self, path: str, scales: tuple[int, ...] = (1, 4),
             previews: bool = True) -> None:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.img.save(path)
        if not previews:
            return
        base, ext = os.path.splitext(path)
        for s in scales:
            if s == 1:
                continue
            up = self.img.resize((self.w * s, self.h * s), Image.NEAREST)
            up.save(f"{base}@{s}x{ext}")


def snap_to_palette(rgb: Image.Image) -> Image.Image:
    """
    Re-index an RGBA/RGB composite (e.g. after a glow pass) onto the locked
    palette by nearest RGB distance. Transparent pixels stay index 0, so the
    exported PNG remains a strict palette-indexed file.
    """
    rgba = rgb.convert("RGBA")
    out = Image.new("P", rgba.size, 0)
    flat = [v for pname, _h, _r in PALETTE for v in RGB[pname]]
    out.putpalette(flat)
    out.info["transparency"] = 0
    names = [pname for pname, _h, _r in PALETTE]
    px = rgba.load()
    op = out.load()
    for y in range(rgba.size[1]):
        for x in range(rgba.size[0]):
            r, g, b, a = px[x, y]
            if a < 16:
                op[x, y] = 0
                continue
            best, best_d = 1, 10**9
            for i, name in enumerate(names):
                if i == 0:
                    continue
                pr, pg, pb = RGB[name]
                d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2
                if d < best_d:
                    best, best_d = i, d
            op[x, y] = best
    return out


class GlowLayer:
    """
    Separate RGBA additive-light layer. Stepped alpha bands (not smooth
    gradients) keep the light pixel-shaped; the opaque contour layer beneath
    always remains readable. This is the only sanctioned off-palette output.
    """

    def __init__(self, w: int, h: int) -> None:
        self.w, self.h = w, h
        self.img = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    def glow(self, cx: int, cy: int, radius: int, color: str,
             max_alpha: int = 110, bands: int = 4) -> None:
        r, g, b = RGB[color]
        for band in range(bands, 0, -1):
            rr = max(1, round(radius * band / bands))
            # inner band is brightest; each outer band loses one step
            alpha = round(max_alpha * band / bands)
            for y in range(cy - rr, cy + rr + 1):
                for x in range(cx - rr, cy + rr + 1):
                    if not (0 <= x < self.w and 0 <= y < self.h):
                        continue
                    if (x - cx) ** 2 + (y - cy) ** 2 <= rr * rr:
                        self.img.putpixel((x, y), (r, g, b, alpha))

    def composite(self, base: Image.Image) -> Image.Image:
        rgba = base.convert("RGBA")
        return Image.alpha_composite(rgba, self.img)
