# Signal Atlas: commercial wedge and validation plan

Status: recommended lead candidate, not yet validated. The current deployment is a static-first prototype, not a revenue-generating product.

## Positioning

Do not position Signal Atlas as a cheap Sensor Tower clone or a dashboard of guessed download/revenue estimates.

Position it as:

> Evidence-backed product opportunity intelligence for independent builders: discover a painful, underserved user problem, understand existing alternatives, test willingness to pay, and turn the evidence into a build decision.

The buyer is a self-serve independent developer, solo founder, small game/app studio or AI creator. Avoid dependence on enterprise procurement and custom consulting sales.

## The first job to be done

"Before I spend two weeks building, show me whether a specific audience has a repeated, expensive problem, what they use today, what they dislike, and how I can test a better alternative."

## MVP scope

1. Opportunity feed: narrowly curated, evidence-linked opportunities rather than an unverified global score.
2. Evidence cards: source URL, source type, publication/retrieval date, country, platform, sample size, repeated complaint, severity and confidence.
3. Competitor gap: existing alternatives, price/plan, recurring complaints, feature gaps and evidence freshness.
4. Validation brief: audience, pain statement, proposed wedge, test hypothesis, landing-page copy, interview prompts and success threshold.
5. Watchlists: saved opportunities and weekly change alerts.
6. Outcome feedback: record test visits, sign-ups, preorders, interviews and launch outcomes so predicted demand can be compared with actual demand.

Start with three source families only. Candidate sources include permitted App Store / Google Play listing and review data, licensed market-data providers, public GitHub issues/discussions, Steam reviews and community sources whose API and commercial terms permit the intended use. Do not build a business on unlicensed scraping or estimates presented as first-party facts.

## Defensibility

The moat is not the LLM prompt or the dashboard. Build it in layers:

- Provenance graph: every claim links to a dated source and metric definition.
- Longitudinal dataset: track how complaints, prices, feature gaps and demand signals change over time.
- Outcome loop: capture what users tested and whether users actually converted or paid.
- Personalised opportunity ranking: learn which evidence predicts success for different builder profiles and distribution channels.
- Workflow lock-in: saved watchlists, research histories, experiments and outcome records make the product more useful with continued use.

This is a potential data and workflow moat. It is not impossible to copy and must be earned through sustained data quality and user outcomes.

## Monetisation experiments

Test self-serve pricing, not enterprise contracts:

| Plan | Initial test price | Limit |
|---|---:|---|
| Free | $0 | Small number of opportunity briefs; public evidence only |
| Maker | $19/month | Saved opportunities, weekly alerts and limited validation reports |
| Pro | $49/month | More watchlists, competitor comparisons and report exports |
| Studio | $149/month | Shared workspace and higher research limits |

Prices are hypotheses, not published market facts. Test willingness to pay before adding costly data providers. Do not sell raw third-party data where the licence does not permit redistribution.

## First 30 days

- Days 1–5: recover the complete current Signal Atlas source, identify all 36 listed sources, classify each by official API, commercial licence, rate limit, geography and update cadence.
- Days 6–10: manually curate 20 evidence-backed opportunity briefs in one narrow category. Remove any unsupported or illustrative records from customer-facing results.
- Days 11–15: launch a focused landing page with example reports, source transparency and a paid founding-member offer.
- Days 16–22: recruit qualified independent builders through relevant communities and direct product demos. Do not buy broad traffic.
- Days 23–30: deliver the first paid reports and measure repeated usage, paid conversion, refund requests and research cost per report.

## Validation gates

Continue only if the product demonstrates real demand:

- At least 20 target-user interviews or equivalent structured feedback.
- At least 5 paid founding users before expanding the data pipeline.
- Qualified-visitor to paid conversion target: 2–5% as an experiment, not a forecast.
- At least 40% of paid users return in week four.
- Gross margin target above 75% after data and model costs.
- Every customer-facing opportunity has traceable evidence and clear uncertainty labels.

If users like the free dashboard but will not pay for validated briefs, alerts or workflow, change the wedge before adding more features.

## Scale gates

Do not add more data vendors, countries or categories until:
- the first category has repeat usage;
- data rights are documented;
- data freshness can be monitored;
- support and inference costs are known;
- paid retention supports the next expansion.

A hundred million RMB of annual net profit would require a very large paid customer base, strong retention and distribution. It cannot be inferred from a working prototype or guaranteed by an AI agent.
