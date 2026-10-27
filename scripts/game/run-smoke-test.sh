#!/usr/bin/env bash
# Headless Ember Trail physics smoke test.
# Compiles the game TypeScript to CommonJS in a temp dir and runs the
# DOM-shimmed fixed-step simulation. No browser required.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$(mktemp -d)"
trap 'rm -rf "$OUT"' EXIT

npx tsc \
  "$ROOT"/src/game/engine.ts \
  "$ROOT"/src/game/levels.ts \
  "$ROOT"/src/game/font.ts \
  "$ROOT"/src/game/font-data.ts \
  --outDir "$OUT" \
  --module commonjs \
  --target ES2020 \
  --moduleResolution node \
  --lib dom,es2020 \
  --skipLibCheck \
  --esModuleInterop

cp "$ROOT/scripts/game/smoke-test.cjs" "$OUT/run.cjs"
node "$OUT/run.cjs"
