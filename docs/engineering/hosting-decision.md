# Hosting decision for the first commercial product

Audit date: 2026-11-28.

## Current constraint

The connected Vercel team is on Hobby. Vercel's official terms restrict Hobby to personal/non-commercial use. Existing Vercel previews are useful for engineering QA, but no revenue-generating product should launch on this plan.

## Options

| Provider | Current entry cost | Best fit | Constraint / decision |
|---|---:|---|---|
| Vercel Pro | USD 20/month, includes USD 20 usage credit | Existing Next.js projects with minimal migration | Lowest engineering friction. Overages are metered; set spend alerts and limits |
| Cloudflare Pages | USD 0 for static asset hosting | Signal Atlas static frontend after source recovery | Static requests are free/unlimited; Pages Functions count against Workers usage |
| Cloudflare Workers Paid | USD 5/month minimum | APIs, edge functions and compatible Next.js workloads | Excellent cost profile; test runtime compatibility before moving Next.js apps |
| Railway Pro | USD 20/month minimum usage | Persistent services, background workers and containerized APIs | Strong option for long-running jobs; not needed for a static-first MVP |
| Render Free | USD 0 | Temporary demos only | Render explicitly says not to use free instances for production |

## Decision

1. Do not pay for Vercel Pro solely to preserve the current prototypes.
2. Recover Signal Atlas source and move its static frontend to Cloudflare Pages first.
3. Keep the data API separate from the static frontend. Use Cloudflare Workers for bounded request/response functions; move durable jobs to a queue/worker service only when real usage requires it.
4. For existing Next.js apps that need SSR, evaluate Cloudflare's current vinext migration path with route-by-route smoke tests. If compatibility or build reliability is inadequate, use Vercel Pro rather than forcing a risky rewrite.
5. Keep GitHub as the canonical source and CI system regardless of hosting provider.

## Spend controls

- No paid upgrade or external account has been created in this migration.
- Start with static hosting and the smallest paid compute tier only when a server-side workload exists.
- Configure provider spend limits before enabling public APIs or AI inference.
- Do not move production traffic until domain, environment variables, authentication, logs, backups and rollback have been tested.
