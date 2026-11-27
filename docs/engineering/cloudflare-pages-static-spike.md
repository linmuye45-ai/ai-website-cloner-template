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


## Verified status (2026-11-28)

This static-export change has been merged into `redesign/cinematic-night-atlas-20261128` by PR #5. GitHub Actions passed dependency installation, lint, type-check, unit tests, static production build and the `out/index.html` artifact check. The first build failure was the Next.js manifest metadata route; adding `export const dynamic = "force-static"` resolved it.

This verifies a static build, not a live Cloudflare deployment, full offline QA on devices or public production readiness.

## Cloudflare Pages connection steps

No Cloudflare account or API token is connected to this ChatGPT session. To create a preview without paying for Vercel Pro:

1. In Cloudflare Dashboard, open **Workers & Pages → Create application → Pages → Connect to Git**.
2. Connect the GitHub repository `linmuye45-ai/ai-website-cloner-template`.
3. Use `redesign/cinematic-night-atlas-20261128` as a preview branch. Keep the production branch unset or on an inactive branch until rights, content, legal and product gates pass.
4. Set the build command to `npm ci && npm run build` and the output directory to `out`. Use Node.js 24.
5. Deploy the preview branch and verify direct refresh, query-string share links, PWA manifest, service worker, asset paths and noindex headers.
6. Keep the preview private/unlisted and noindex. Do not connect a paid domain or accept payments yet.

If the Cloudflare Pages Git integration is not available, the repository already contains `wrangler.toml`; a CI-based deployment can be added after the Cloudflare account ID and API token are supplied as GitHub secrets. Never put those values in source code.
