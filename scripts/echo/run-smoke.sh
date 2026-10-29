#!/usr/bin/env bash
# Compiles the dependency-free simulation layer, then drives full runs
# headlessly. The sim has no Phaser/DOM imports by design, which is what makes
# this fast, deterministic and CI-friendly.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

OUT=".tmp-echo"
rm -rf "$OUT"
npx tsc src/echo/sim/*.ts \
  --outDir "$OUT" \
  --module esnext \
  --target es2022 \
  --moduleResolution bundler \
  --skipLibCheck \
  --strict
# Node's ESM loader requires explicit file extensions on relative imports,
# while TypeScript source uses extensionless specifiers.
find "$OUT" -name '*.js' -print0 | xargs -0 sed -i -E "s#from '\./([A-Za-z0-9_]+)'#from './\1.js'#g"
printf '{"type":"module"}' > "$OUT/package.json"

node scripts/echo/smoke.mjs
