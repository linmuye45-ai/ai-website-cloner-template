#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
WORK="$ROOT/.build/minigames"
COMMIT="f453e18fe822d0c79ccca5fc65149a91a689494f"
rm -rf "$WORK" "$ROOT/dist"
mkdir -p "$ROOT/.build"
git clone --depth 1 --no-checkout https://github.com/trazhub/Mini-Games.git "$WORK"
git -C "$WORK" fetch --depth 1 origin "$COMMIT"
git -C "$WORK" checkout --detach "$COMMIT"
node "$ROOT/apply-brand.mjs" "$WORK"
export VITE_APP_NAME="PlayMesh"
export VITE_BASE_PATH="/"
export VITE_API_URL="${VITE_API_URL:-}"
cd "$WORK"
npm ci
npm run verify
mkdir -p "$ROOT/dist"
cp -R "$WORK/apps/web/dist/." "$ROOT/dist/"
cp "$ROOT/LICENSE" "$ROOT/NOTICE.md" "$ROOT/dist/"
printf '\nPlayMesh static build complete. Backend connection: %s\n' "${VITE_API_URL:-not configured}"
