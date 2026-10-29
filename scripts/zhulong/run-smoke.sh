#!/usr/bin/env bash
# ZHULONG verification: gameplay smoke test, then a rendered frame check.
# There is no browser in this sandbox, so the frames are drawn with the same
# tile rules the Phaser scene uses and written to the OS temp dir.
set -euo pipefail
cd "$(dirname "$0")/../.."
node scripts/zhulong/smoke.mjs
node scripts/zhulong/preview.mjs >/dev/null
echo "preview frames: $(node -e "console.log(require('node:os').tmpdir())")/zhulong-preview"
