# Hearthwarden art bible

Governing art-direction document and its generated pixel-correct references.

- **[`ART_BIBLE.md`](./ART_BIBLE.md)** — the art bible: assumptions, locked
  palette, silhouette/proportion rules, materials, lighting, UI/icon rules,
  motion, measurable specs, validation, and the "do not" list.
- **[`palette.json`](./palette.json)** — machine-readable locked master
  palette (52 slots, index 0 = transparency) and ramp definitions.
- **[`assets/`](./assets)** — reference sheets. The plain `*.png` files are
  the authoritative native, palette-indexed assets; `*@4x.png` are
  nearest-neighbour previews for review only.

## Regenerate or validate

Tooling is Python + Pillow and lives in `scripts/art/`. It renders every
sheet from the single locked palette in `pixelart.py`.

```bash
python3 -m venv .venv-art
.venv-art/bin/pip install -r docs/art-bible/requirements-art.txt

# regenerate all sheets into docs/art-bible/assets/ and palette.json
.venv-art/bin/python scripts/art/gen_art_bible.py
.venv-art/bin/python scripts/art/gen_art_bible_2.py

# regenerate the Ember Trail platformer sprites into public/images/game/
# (plus docs/art-bible/assets/platformer-sheet.png and src/game/font-data.ts)
.venv-art/bin/python scripts/art/gen_platformer.py

# enforce palette + native-size rules (non-zero exit on failure)
.venv-art/bin/python scripts/art/validate_assets.py

# headless platformer physics smoke test (Node, no browser needed)
npm run test:game
```

Do not hand-edit the generated PNGs and re-commit them: change the source in
`scripts/art/`, regenerate, and confirm the validator passes.
