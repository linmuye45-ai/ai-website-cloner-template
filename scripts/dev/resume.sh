#!/usr/bin/env bash
#
# One-command recovery after a sandbox reset: reinstalls dependencies if they
# were wiped and starts the dev server on 0.0.0.0:3000. For a reset-proof
# public URL, use `npm run deploy:pages` (GitHub Pages) instead.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."

if [ ! -d node_modules ]; then
  echo "==> node_modules missing — installing"
  npm install --no-audit --no-fund
fi

if curl -sf -o /dev/null --max-time 3 http://localhost:3000/; then
  echo "==> dev server already responding on :3000"
else
  echo "==> starting dev server on 0.0.0.0:3000"
  exec npm run dev -- --hostname 0.0.0.0 --port 3000
fi
