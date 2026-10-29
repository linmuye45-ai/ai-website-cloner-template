#!/usr/bin/env bash
# Compiles the dependency-free sim layer and drives it headlessly.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

OUT=".tmp-zhulong"
rm -rf "$OUT"
npx tsc src/zhulong/sim/*.ts \
  --outDir "$OUT" \
  --module esnext \
  --target es2022 \
  --moduleResolution bundler \
  --skipLibCheck \
  --strict
# Node ESM needs explicit extensions on relative specifiers.
find "$OUT" -name '*.js' -print0 | xargs -0 sed -i -E "s#from '\\./([A-Za-z0-9_]+)'#from './\\1.js'#g"
printf '{"type":"module"}' > "$OUT/package.json"

node scripts/zhulong/smoke.mjs
