/**
 * Single source of truth for web asset URLs.
 *
 * In dev/standalone mode this is '' and absolute `/vendor/...` paths resolve
 * at the site root. For the GitHub Pages static export the build sets
 * NEXT_PUBLIC_BASE_PATH=/ai-website-cloner-template, which is inlined here
 * so every hardcoded asset URL keeps working under the project subpath.
 */
export const ASSET_BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const SUNNYLAND = `${ASSET_BASE}/vendor/sunnyland`;
