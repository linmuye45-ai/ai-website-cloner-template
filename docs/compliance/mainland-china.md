# Mainland China launch and data compliance checklist

This is an engineering checklist, not legal advice. Obtain qualified Chinese counsel before accepting customers or processing personal information.

## Hosting and filing
- Mainland-hosted public websites generally require ICP filing; commercial/transactional platform activity may require an ICP commercial licence depending on service and business model.
- Assess public security filing, domain ownership, entity eligibility and required licence scope before launch.
- Vercel preview URLs are not a mainland production architecture.

## AI-generated content
- Implement explicit and implicit AI-generated-content labels where applicable under the Measures for the Identification of AI-Generated Synthetic Content, effective 1 September 2025.
- Keep generation provenance, provider/model and human approval records.
- Do not remove or obscure platform-required labels.

## Personal information and cross-border data
- Minimize personal information. The initial product should primarily process merchant product data, not consumer profiles.
- Keep mainland merchant workspace data in a mainland-region production environment when required by business and applicable rules.
- Do not send personal information or important data overseas by default. Determine whether security assessment, standard contract, certification or an exemption applies before transfer.
- Separate domestic and overseas data planes; document access, retention, deletion and incident response.

## Platform and advertising compliance
- Use official platform APIs and permitted exports. Do not rely on credential sharing, account automation or prohibited scraping.
- Require human approval for claims about origin, materials, certification, safety, performance and sustainability.
- Build category-specific checks for product safety, labelling, customs, sanctions and restricted goods before publication.

## Release blockers
- Legal entity and business scope review.
- ICP / commercial licence determination and approvals.
- Privacy policy, terms, data processing and retention policy.
- AI content marking implementation.
- Data residency and cross-border transfer assessment.
- Security test, incident response plan and vendor DPAs.
