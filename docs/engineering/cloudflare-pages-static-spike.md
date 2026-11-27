# NEXORA static hosting spike

This branch tests whether the current mobile-first story prototype can be deployed as a portable static Web/PWA without a proprietary server runtime.

## Changes in this spike
- Next.js static export is enabled with `output: "export"`.
- Images are configured as unoptimized for static hosting.
- `public/_headers` carries preview security and noindex headers for Cloudflare Pages.
- `wrangler.toml` points Pages to the `out/` directory.
- GitHub Actions verifies that `out/index.html` exists after the production build.

## Why this fits the first release
The current experience uses client-side story state, local progress and query-string share links. It does not require server-side authentication, a database, API routes or live AI generation for every interaction. Static hosting reduces cost and vendor lock-in.

## Acceptance tests before merge
- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `test -f out/index.html`
- Verify direct refresh of `/?chapter=...` and `/?ending=...` links on the static host.
- Verify local progress, chapter transitions, share links, PWA manifest and service worker.
- Verify all routes and assets use relative/portable paths.
- Verify `_headers` is applied by Cloudflare Pages and that the preview remains noindex.

## Rollback
If any required route needs server-side rendering or a server API, revert this spike and use Cloudflare Workers with a supported Next.js adapter or Vercel Pro. Do not force static export if it breaks core story behaviour.

No Cloudflare account, API token, custom domain, paid service or production deployment is created by this branch.
