# Platform architecture

## Product boundary
NEXUS is a cross-channel product-truth and operations control layer. It does not initially own inventory, fulfilment, merchant-of-record status, payment custody or marketplace publishing authority.

## Core flow
1. Merchant imports a product through CSV or a connected channel.
2. Canonical product record stores source facts, SKU, variants, materials, colours, sizes, price and source reference.
3. Market agent reads the canonical record and generates localized draft content.
4. Zod validates the structured result; unsupported claims are surfaced as unknowns.
5. Draft is saved as a versioned channel listing.
6. A human reviews and approves the content.
7. Future channel adapters publish only after explicit authorization and platform approval.
8. Performance and returns are imported to connect content versions with outcomes.

## Services
- Next.js App Router: UI and authenticated route handlers.
- Supabase Postgres/Auth/Storage: tenant data, identity, RLS and private assets.
- OpenAI-compatible LLM adapter: DashScope/Qwen default for China-based operators; DeepSeek or other compatible endpoints configurable server-side.
- CSV import/export: first data integration; no unofficial scraping.
- Future adapters: Shopify Admin API, Amazon SP-API, TikTok Shop Partner API, Shoplazza and WooCommerce.

## Security boundaries
- Publishable key may be public; Supabase secret/service-role keys must never enter browser bundles.
- Every exposed table uses RLS; authorization is workspace-scoped and checked in Postgres.
- Asset bucket is private; object paths begin with workspace UUID.
- API routes validate payloads, enforce per-user agent limits and avoid returning provider error bodies.
- Channel credentials are never stored as plaintext in channel_connections; only a secret reference is stored.

## Deployment
Use separate Supabase projects for development, staging and production. The existing gten-core project belongs to a different application and must not be reused. Apply migrations only after a dedicated NEXUS project is provisioned and verified. Vercel preview is for development; mainland-China production needs China-capable hosting and ICP/permit review.
