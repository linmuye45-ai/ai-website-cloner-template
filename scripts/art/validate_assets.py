"""
Art-bible asset gate. Run before committing any new pixel art batch:

  /home/user/.venv-art/bin/python scripts/art/validate_assets.py

Checks every PNG under docs/art-bible/assets:
  1. palette-indexed mode P (no RGB/RGBA exports sneaking in)
  2. its palette equals the locked master palette, in the same index order
  3. every painted index is within 0..len(palette)-1
  4. known native assets match their locked pixel dimensions
  5. upscaled *@Nx previews are exact integer multiples of the native file

Exits non-zero on the first failure so it can run in CI.
"""
from __future__ import annotations

import glob
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image
from pixelart import PALETTE

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ASSETS = os.path.join(ROOT, "docs", "art-bible", "assets")

LOCKED_HEX = [h for _n, h, _r in PALETTE]

# native (unscaled) asset dimensions that must never change without a
# versioned art-bible revision
NATIVE_SIZES = {
    "tiles-strip.png": None,           # sheet, informational only
    "tiles-scene.png": (160, 128),
    "character-warden.png": None,
    "ui-icons.png": None,
    "vfx.png": None,
    "materials.png": None,
    "palette-sheet.png": None,
    "key-art.png": (320, 180),
    "loading-screen.png": (320, 180),
}


def palette_hex_list(img: Image.Image) -> list[str | None]:
    flat = img.getpalette() or []
    out: list[str | None] = []
    for i in range(len(LOCKED_HEX)):
        triplet = flat[i * 3:i * 3 + 3]
        out.append("#%02X%02X%02X" % tuple(triplet) if len(triplet) == 3
                   else None)
    return out


def main() -> int:
    errors: list[str] = []
    pngs = sorted(glob.glob(os.path.join(ASSETS, "*.png")))
    if not pngs:
        print("no assets found at", ASSETS)
        return 1

    native_dims: dict[str, tuple[int, int]] = {}
    for path in pngs:
        name = os.path.basename(path)
        img = Image.open(path)
        head = f"{name} {img.size} {img.mode}"

        if img.mode != "P":
            errors.append(f"{head}: must be palette-indexed (P), got {img.mode}")
            continue

        got = palette_hex_list(img)
        if got != LOCKED_HEX:
            diff = [
                (i, g, l) for i, (g, l) in enumerate(zip(got, LOCKED_HEX))
                if g != l
            ]
            errors.append(f"{head}: palette mismatch, first diffs {diff[:3]}")

        # P-mode stores one byte per pixel; raw bytes are the palette indices
        used = {b for b in img.tobytes()}
        bad = [i for i in used if i >= len(LOCKED_HEX)]
        if bad:
            errors.append(f"{head}: off-palette indices {sorted(bad)}")

        m = re.match(r"^(?P<base>.+?)@(?P<scale>\d+)x\.png$", name)
        if m:
            base = m.group("base") + ".png"
            scale = int(m.group("scale"))
            native = native_dims.get(base)
            if native is None:
                native_path = os.path.join(ASSETS, base)
                if os.path.exists(native_path):
                    native = Image.open(native_path).size
                    native_dims[base] = native
            if native:
                expect = (native[0] * scale, native[1] * scale)
                if img.size != expect:
                    errors.append(
                        f"{head}: {scale}x preview must be {expect}, "
                        f"native {base} is {native}")
        else:
            native_dims[name] = img.size
            want = NATIVE_SIZES.get(name)
            if want and img.size != want:
                errors.append(f"{head}: native size locked to {want}")

    for e in errors:
        print("FAIL", e)
    if errors:
        print(f"\n{len(errors)} validation error(s)")
        return 1
    print(f"OK: {len(pngs)} files conform to the locked "
          f"{len(LOCKED_HEX)}-colour palette and size rules")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
