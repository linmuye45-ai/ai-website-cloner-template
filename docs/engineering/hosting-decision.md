# Hosting decision for the first commercial product

Audit date: 2026-11-28.

## Current constraint

The connected Vercel team is on Hobby. Vercel's official terms restrict Hobby to personal/non-commercial use. Existing Vercel previews are useful for engineering QA, but no revenue-generating product should launch on this plan.

The approved first product is NEXORA (internal project code): a mobile-first, shareable interactive micro-narrative experience. Its first release is deliberately Web/PWA, finite-branching and does not require accounts, live AI generation or a complex backend. Do not choose hosting based on frozen projects such as Signal Atlas.

## Options

| Provider | Current entry cost | Best fit | Constraint / decision |
|---|---:|---|---|
| Vercel Pro | USD 20/month, includes USD 20 usage credit | Existing Next.js app with minimal migration | Lowest engineering friction. Metered overages; set spend alerts and limits |
| Cloudflare Pages | USD 0 for static asset hosting | NEXORA if Next.js static export passes all route and deep-link tests | Static asset requests are free/unlimited; Pages Functions count against Workers usage |
| Cloudflare Workers Paid | USD 5/month minimum | Server-side routes and compatible Next.js workloads | Strong cost profile; test current vinext/OpenNext compatibility before migration |
| Railway Pro | USD 20/month minimum usage | Persistent services, background workers and containerized APIs | Not required for the initial static-first NEXORA release |
| Render Free | USD 0 | Temporary demos only | Render explicitly says not to use free instances for production |

## Decision

1. Do not upgrade Vercel solely to preserve prototypes.
2. First test whether the NEXORA Web/PWA can be exported as a static site. The current prototype's local progress, finite branching and share-link behaviour should not require a server-side runtime.
3. If static export and deep links pass tests, deploy the public English-market beta to Cloudflare Pages. Keep the data/event layer minimal and privacy-conscious.
4. If a required Next.js route cannot be statically exported, test Cloudflare Workers using the currently supported Next.js adapter and route-by-route smoke tests. Do not force a rewrite.
5. If adapter compatibility or build reliability is inadequate, use Vercel Pro rather than shipping a fragile runtime.
6. Keep GitHub as the canonical source and CI system regardless of hosting provider. Keep previews separate from production and use a separate environment for each launch market.

## Spend controls

- No paid upgrade or external account has been created in this migration.
- No production domain has been switched.
- Start with static hosting and the smallest paid compute tier only when a server-side workload exists.
- Configure provider spend limits before enabling public APIs or AI inference.
- Do not move production traffic until domain, environment variables, authentication (if added), logs, backups and rollback have been tested.
