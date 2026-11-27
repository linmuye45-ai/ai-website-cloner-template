# Product and infrastructure inventory

Audit date: 2026-11-28. This is an evidence-based inventory of connected GitHub, Vercel and Supabase resources. A READY deployment means the deployment completed; it does not prove product-market fit, public accessibility, payment readiness or production quality.

## Portfolio decisions

The approved strategy dated 2026-11-27 makes NEXORA (internal project code, not a cleared public brand) the sole primary product line: an original-IP interactive micro-narrative network. The current first product is a mobile-first, shareable 2–5 minute story experience. KURU is only a candidate world/character pending rights audit. AI music, AI game capabilities and creator tooling support this line; they are not parallel products. Signal Atlas, GTEN and unrelated websites are frozen or paused. See `docs/strategy/nexora-interactive-micro-narrative.md`.

| Asset | Verified state | Commercial assessment | Decision |
|---|---|---|---|
| NEXORA / The Dream Station | GitHub branch `nexora`; Vercel preview READY; separate redesign branch `redesign/cinematic-night-atlas-20261128` contains the design contract and Fable 5.2 build brief | Three short chapters, finite choices, saved endings and shareable story results; no full creator network, production backend or payments yet | **Primary product line:** original-IP interactive micro-narrative network. Continue only through the approved 90-day validation gates; KURU is a provisional test-world candidate pending rights audit |
| Signal Atlas | Vercel production deployment READY; two source files in the deployment package; no Vercel environment variables; no GitHub source association found | Static-first research workspace; no verified live data ingestion, paid data rights, accounts, database or automated crawlers | Freeze as a supporting research asset; not the primary product and no additional build budget |
| VESTI / NEXUS | GitHub branch `vesti-platform`; Vercel preview READY; no Vercel environment variables | NEXUS Commerce OS is designed for cross-border merchant operations; VESTI is a static fashion-creator surface with sample data. The README requires a dedicated Supabase project | Preserve code and design assets; pause merchant/B2B development under the current no-B2B constraint |
| GTEN Agent Control | Vercel production deployment READY with SSO protection; uses Supabase project `gten-core` | Procurement control plane with RFQ/quote/supplier workflows; three live agent roles are read-only or draft-only | Pause as B2B; preserve code and data, no new commercial investment |
| GTEN Trade Workspace | Vercel production deployment READY; SSO protection is enabled for previews | Supplier and trade workflow interface, connected to the GTEN database | Pause as B2B; keep isolated and do not repurpose its database |
| SayReady Echo Studio | Vercel staging deployment READY; includes AI, gifts, health and telemetry routes; not a production launch | Separate prototype with no verified fit to the approved interactive-IP product line | Freeze; preserve source and review the flagged storage-token configuration before any future public exposure |
| Yingde Consumer Agent | Vercel production deployment READY; deployment source is a single HTML file; no environment variables | Static prototype, not a verified operating consumer agent | Archive as prototype pending a specific use case |
| Longform, LoopPlay, Scrapswarm, CuePlay | Vercel deployments READY; current deployment packages are single-file HTML prototypes | Unvalidated standalone content/game concepts; not part of the approved first product | Freeze as reusable IP/interaction experiments; no parallel commercial investment |
| Sort Shift playable demo | Vercel project exists, but no deployment was returned in this audit | No deployed playable build verified; standalone game is outside the current first-product scope | Preserve the project; do not fund a separate launch while NEXORA is the sole active track |

## GTEN database audit

Supabase project `gten-core` is ACTIVE_HEALTHY and has six recorded migrations. The public schema contains organization, membership, supplier, RFQ, quote, order, document and agent-control tables. The table listing reported zero rows at audit time.

- Security advisor: no lints returned.
- Health advisor: no lints returned.
- Performance advisor: six foreign keys without covering indexes and two multiple-permissive-policy findings.
- Fifty-one unused-index notices are not grounds for deleting indexes on an empty or low-traffic database.
- One `supplier-portal` Edge Function is configured with `verify_jwt=false`; its token validation and abuse controls must be reviewed before broader exposure.

Do not migrate GTEN schema into Signal Atlas. They are different products and data domains.

## Portfolio rule

Do not maintain many simultaneous product launches. NEXORA is the only active commercial validation track. The Dream Station is the first interactive story experience; KURU is provisional until rights are cleared. AI music is soundtrack/content support, MINDMESH is internal creator tooling, and standalone games, Signal Atlas, GTEN, VESTI/NEXUS and unrelated sites remain frozen or paused. A project earns further investment only after users demonstrate repeated use, sharing and willingness to pay.


## Floot-only projects discovered after the initial audit

The connected Floot account contains these project roots and branches:

| Project | Floot project ID | Publish state | Notes |
|---|---|---|---|
| Night Signal — Prototype | `cc07ece1-1de1-4061-be46-273d2a2c2cec` | Unpublished | Most recent/highest activity; TRADEPASS exists as a separate branch |
| TRADEPASS — Prototype | `72cb5093-2644-4621-be89-1531a292eab5` | Unpublished | Branch of Night Signal |
| MINDMESH | `27ec4443-7fab-4a99-a39c-36e91419ee9d` | Unpublished | KINSHIP exists as a separate branch |
| KINSHIP — Prototype | `ad0ac641-79ac-4e4d-bc31-ee1f8ea3d550` | Unpublished | Branch of MINDMESH |
| EBB | `6afb382c-ec23-4ff8-81b4-d2ea196dcddd` | Unpublished | No custom domain |
| Trust & Action OS | `e64e2ad5-7efd-451d-a67b-3fddf70467d5` | Unpublished | No custom domain |
| ROOM STUDIO OS | `77843c7b-0fae-4757-8366-4f88dc4c4d37` | Unpublished | No custom domain |

All seven roots/branches returned `published=false`, `paid=false`, Floot plan `free`, no custom domains, and two unused native app builds. Night Signal and MINDMESH previews are available, but no live commercial launch or payment evidence was found. The exact mapping of Night Signal/TRADEPASS and MINDMESH/KINSHIP to the approved NEXORA product has not been established; do not assume they are the primary source or merge their concepts into NEXORA.

### Floot migration blocker

At audit time, the Floot account had exhausted its 100 daily build-action allowance. The account-day resets at 2026-11-28 08:00 UTC. File listing, file reads and resource inventory calls were refused by the quota; unmetered status calls still worked. Therefore the source files, dependencies, database schema and environment-resource mappings for these Floot projects have NOT yet been migrated or fully audited.

Do not delete or overwrite any Floot project. After the quota reset, export the project instructions, pages, components, endpoints, static assets, dependencies, database schema and resource names into GitHub. Never copy secret values. Rebuild each project in an independent GitHub branch and run CI before replacing its Floot preview.

No Floot upgrade, paid action boost, project deletion or publication was performed.
