# NEXUS Commerce OS

**Cross-channel product truth and AI-assisted commerce operations.**

NEXUS is a neutral operations control layer for China-based cross-border merchants. The first wedge is apparel, footwear and accessories brands that manage product data, localized content and assets across multiple overseas channels.

## Product thesis

A merchant should maintain one verified product record and use it to create, review, version and distribute channel-specific content. The system connects later performance and quality feedback without pretending to replace the merchant's existing storefront or marketplace.

## Current branch

- `/commerce`: NEXUS merchant console (in active development).
- `/fashion`: retained VESTI creator surface.
- Dedicated Supabase schema and RLS migration.
- CSV import/export as the first integration surface.
- Server-side OpenAI-compatible provider adapter; DashScope/Qwen default.
- External channel integrations remain disconnected until official API credentials, approvals and customer authorization exist.

## Setup

1. Create a dedicated Supabase project for NEXUS. Do not use the unrelated `gten-core` project.
2. Apply the migration in `supabase/migrations/`.
3. Copy `.env.example` to `.env.local` and configure Supabase and a server-only LLM API key.
4. Run `npm install`, `npm run check` and `npm run dev`.

Never commit real credentials. Never expose Supabase secret/service-role keys or model API keys to the browser.

## Commercial boundary

This branch is a development build. It is not production-ready until a dedicated database is provisioned, migrations and RLS are verified, auth and storage smoke tests pass, provider keys are configured, mainland-China compliance is reviewed, and paid pilot customers validate retention.

See `docs/` for competitive research, architecture, compliance and validation gates.
