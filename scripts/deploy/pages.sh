#!/usr/bin/env bash
#
# Builds the fully static export and force-pushes it to the gh-pages branch,
# which GitHub Pages serves at a permanent URL independent of any sandbox:
#   https://linmuye45-ai.github.io/ai-website-cloner-template/
#
# Requires: gh authenticated with push permission on the current repo.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ORIGIN_URL="$(git -C "$REPO_ROOT" remote get-url origin)"
# Accept both https://github.com/owner/repo(.git) and git@github.com:owner/repo(.git)
REPO_SLUG="$(printf '%s' "$ORIGIN_URL" | sed -E 's#(https://github.com/|git@github.com:)##; s#\.git$##')"
REPO_NAME="${REPO_SLUG#*/}"
BASE_PATH="/${REPO_NAME}"
PAGES_BRANCH="gh-pages"

cd "$REPO_ROOT"

echo "==> Static export (basePath=${BASE_PATH})"
NEXT_PUBLIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH="${BASE_PATH}" npm run build

echo "==> Preparing out/ for Pages"
cd out
# Bypass Jekyll so underscore-prefixed _next assets are published untouched.
touch .nojekyll

echo "==> Force-pushing to ${PAGES_BRANCH}"
git init -q
git checkout -q -b "${PAGES_BRANCH}" 2>/dev/null || git checkout -q "${PAGES_BRANCH}"
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add -A
git commit -q -m "Deploy static export to GitHub Pages"
git remote add origin "${ORIGIN_URL}" 2>/dev/null || git remote set-url origin "${ORIGIN_URL}"
git push -f "origin" "${PAGES_BRANCH}"

echo "==> Enabling Pages (best effort; may already be enabled)"
gh api "repos/${REPO_SLUG}/pages" \
  -X POST \
  -f "build_type=branch" \
  -f "source[branch]=${PAGES_BRANCH}" \
  -f "source[path]=/" 2>/dev/null || true

echo "==> Done. Site:"
echo "    https://${REPO_SLUG%%/*}.github.io/${REPO_NAME}/"
