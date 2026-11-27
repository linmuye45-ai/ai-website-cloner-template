# Open-source adoption strategy

Only adopt projects with a clear product boundary, compatible commercial license and measurable reduction in delivery risk. Do not embed a large commerce engine merely because it is popular.

## Adopted in the current build

| Project | Role | License / note |
|---|---|---|
| Next.js | App Router, server rendering and route handlers | Open-source framework; pinned to patched 16.x release line |
| Supabase | Postgres, Auth, Storage and RLS | Managed service is a deployment dependency; isolate NEXUS from other applications |
| @supabase/ssr | Cookie-aware server/client auth | Official Supabase SSR package |
| Zod | Request and model-output validation | MIT |
| Lucide | Consistent operational iconography | ISC |

## Candidate projects for later phases

| Project | License / status | Intended use | Decision |
|---|---|---|---|
| Vercel AI SDK (`vercel/ai`) | Apache-2.0 | Multi-provider model calls, streaming and tool orchestration | Evaluate after the current OpenAI-compatible adapter proves insufficient |
| Trigger.dev (`triggerdotdev/trigger.dev`) | Apache-2.0 | Durable long-running workflows, retries, schedules and concurrency control | Preferred candidate when agent jobs outgrow short serverless requests |
| MCP TypeScript SDK (`modelcontextprotocol/typescript-sdk`) | Licensing transition to Apache-2.0; legacy contributions may remain MIT | Permissioned tool interface for official commerce connectors | Pin the stable SDK line and review license notices before distribution |
| Medusa (`medusajs/medusa`) | MIT for core; Enterprise Edition materials excluded | Headless commerce backend if NEXUS later owns checkout/order orchestration | Do not adopt in the first release; avoid duplicating merchant systems |
| Shopify app SDK (`Shopify/shopify-app-js`) | Use the maintained successor; `shopify-api-js` repository is archived/moved | Official Shopify app and Admin API adapter | Use only for a real merchant-authorized integration |
| Open Design (`linmuye45-ai/open-design`) | Apache-2.0 | Design-system research and workflow references | Reuse patterns and evaluation methods, not copied brand assets |

## Explicit non-adoptions

- Do not embed n8n's fair-code product as a proprietary multi-tenant automation engine without a separate licence review.
- Do not fork marketplace or social crawlers that depend on credential sharing or prohibited scraping.
- Do not use OOTDiffusion or other non-commercial image model licences in paid features.
- Do not add a workflow engine, vector database or message broker until usage proves the need.

## Architecture rule

Keep business-domain interfaces stable. Providers and integrations are adapters behind explicit interfaces; changing an LLM, storage provider or commerce platform must not require rewriting the canonical product graph.