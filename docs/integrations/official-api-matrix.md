# Official integration matrix

| Platform | First safe integration | Later capability | Release conditions |
|---|---|---|---|
| Shopify | Merchant CSV import/export | Admin API product sync, webhooks and publishing | App credentials, scopes, merchant install, API-version and rate-limit compliance |
| Amazon | Seller export files | SP-API catalog/listing/analytics APIs | Developer registration, role approval, seller authorization and regional policy review |
| TikTok Shop | Seller export/manual data | Partner API products, orders and analytics | Partner/app review, seller authorization, regional availability and scope approval |
| Shoplazza | CSV export/import | Official Open API | App credentials, scopes and merchant authorization |
| WooCommerce | CSV import/export | REST API | Consumer key/secret, least privilege and merchant authorization |

## Rules
- Never ask a merchant to paste marketplace passwords.
- Store OAuth secrets in a managed secret store; database stores only a secret reference.
- Keep integrations disconnected until verified. Do not display fake connected states.
- Publishing is two-step: draft preview, then explicit human approval.
- Record external request IDs, API version, rate-limit responses and sync timestamps.
- Provide disconnect, token revocation and data deletion flows.
