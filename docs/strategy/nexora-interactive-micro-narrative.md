# NEXORA — Original-IP Interactive Micro-Narrative Network

Status: approved strategic direction, 2026-11-27. NEXORA is an internal project code, not a cleared public brand. This document is the primary product decision for the current engineering portfolio.

## 1. Strategic decision

The only active commercial validation track is an original-IP interactive micro-narrative experience that can later expand into a creator network. Do not build a generic AI social platform, AI game generator, game-discovery app, AI companion or a collection of unrelated SaaS products.

The long-term ambition is a global interactive-content, creator-economy and digital-entertainment network. A "hundred-cornerstone" valuation is a distant aspiration, not a forecast or operating commitment.

## 2. Product definition

A visitor opens a shareable link and, without forced registration, enters a short original story with a clear goal, meaningful choices and visible character/world consequences. A chapter takes about 2–5 minutes. After finishing, the visitor receives a distinct ending or relationship/world-state result and has a reason to share it, invite a friend to influence a later event, or unlock a continuation.

### First-session loop

1. Discover through a creator link, community post or recommendation card.
2. See the character, conflict, estimated duration and content rating.
3. Start without registration; first meaningful action appears within 10 seconds.
4. Make 2–5 meaningful choices or complete a light challenge.
5. Receive a distinct ending, character relationship or world-event result.
6. Share a privacy-safe result card/link or invite a friend.
7. Return for a new chapter, world event or friend response.

### Initial content scope

- One original story world.
- One to three core characters.
- Three independently completable chapters.
- Each chapter lasts approximately 2–5 minutes.
- Each chapter has at least one meaningful choice, one explainable consequence and one share reason.
- Use finite branching and state variables, not unbounded free chat.
- All AI-generated content passes rules, review and content classification; apply required AI-generated-content labels.
- No emotional dependency, coercive streaks or infinite-scroll retention design.

## 3. Explicit exclusions

Do not build in the first release:
- General chatbot, AI companion, open-world multiplayer 3D, livestream or short-video feed.
- Cross-platform game library, game-account aggregation or private third-party game APIs.
- Unmoderated public UGC or immediate public publishing.
- NFT, tokens, cash gambling, loot boxes or high-risk monetisation for minors.
- Native multi-platform apps, complex recommender systems or a proprietary foundation model.
- A general-purpose AI game editor.

AI music supports atmosphere, character themes, chapter soundtracks and content packs; it is not a separate platform. AI game capabilities are one expression format inside the interactive story; do not launch multiple standalone games in parallel. Creator tools begin as internal authoring templates and review tools.

## 4. First audience and market

- Initial audience hypothesis: 18–34-year-old users interested in original characters, interactive stories, indie games and internet culture.
- Initial acquisition sources: original-IP fans, interactive-story/indie-game communities and creator communities.
- Test one reachable, compliant, English-speaking market first. Do not launch in every country at once.
- Mainland China is the creation and R&D base. Before serving the mainland public, obtain a specific regulatory assessment covering applicable generative-AI, algorithmic recommendation, synthetic-content labelling, privacy and minor-protection requirements.
- KURU is a candidate first test world/character only after rights-chain review. Do not claim ownership, exclusivity or commercial clearance before evidence is complete.
- Public brand naming and trademark investment wait for clearance; NEXORA remains an internal codename.

## 5. Product architecture

| Layer | Initial implementation | Constraint |
|---|---|---|
| Client | Responsive mobile-first Web/PWA and shareable deep links | Validate the experience before building native apps |
| Interactive runtime | Finite-state machine, branch-story JSON and reproducible seeds | Every branch must be regression-testable |
| Content management | Characters, world rules, chapters, branches, assets and versions | Review before publishing; support rollback |
| AI layer | Provider adapter for drafts, variants, translation and production assistance | Core story must not require live token generation on every interaction |
| Data | Anonymous user ID, events, content version, rights status and consent | Data minimisation; no sensitive data in model training |
| Recommendation | Explicit tags, completion and user-stated preferences | No complex personalised ranking until sufficient data exists |
| Payments | Small, lawful payment test after provider/entity checks | Verify legal entity, tax, refunds and payment coverage by market |
| Safety | Age rating, report/block, content moderation, logs and exit controls | Complete security and incident-response review before launch |

Use mature managed infrastructure and provider adapters. Do not build microservices, a blockchain, a large real-time multiplayer backend or a foundation model before the product requires them.

## 6. Monetisation sequence

| Period | Revenue model | Gate |
|---|---|---|
| Months 0–3 | No revenue target; small real-payment experiment only | Users complete, replay and share content |
| Months 3–12 | Paid chapters, world/season passes and character/theme packs | Users pay for continuing content, not merely one-off AI generation |
| Months 12–24 | Creator revenue share, brand/IP partnerships and subscriptions | Creator supply, review capacity and transaction demand are stable |
| 24+ months | Creator tools, IP licensing and cross-platform distribution | Verified active creators, repeat transactions and positive contribution margin |

Track net revenue, not gross bookings or valuation. Contribution margin must deduct payment fees, refunds, creator share, model/cloud variable cost, content production/licensing, moderation, support and attributable acquisition cost.

## 7. Defensibility — earned, not claimed

The early product has no moat. Build cumulative assets and only claim defensibility when measured:
- Original-IP rights chain: source files, authorship, prompts, human edits, licences, model terms, publication history and trademark/copyright review.
- Structured content graph linking character, event, choice, ending and user feedback.
- Repeatable quality system using completion, choice distribution, exit points, complaints and replay.
- Creator network: approved creator identities, works, audiences, collaboration and revenue-share records.
- Sharing graph: invitations, shared decisions, world events and return visits.
- Recognisable visual/ narrative standards and world continuity.

AI models, prompts, attractive UI, generic recommendation algorithms and a single mini-game are not moats.

## 8. Ninety-day execution gates

| Period | Work | Deliverable | Continue only if |
|---|---|---|---|
| Days 1–7 | Rights audit, target-user interviews, competitor teardown and first-world bible | Rights ledger, competitor matrix, user problem list and content bible | A specific audience and pain are evidenced |
| Days 8–14 | Write three chapters, interaction flow and playable low-fidelity prototype | End-to-end shareable story | 5–10 target users independently complete the first session |
| Days 15–30 | Visual direction, responsive Web MVP, event tracking and content review tool | Usable MVP, test report and asset-rights ledger | First-session completion >=70%; no blocking interaction defects |
| Days 31–45 | Closed test; refine pacing, loading, share cards and return loop | At least 100 target-user test records | Users can explain the value; real sharing occurs |
| Days 46–60 | Expand to three chapters; test small payments and creator collaboration | Payment experiment and reusable content workflow | Real payment or strong, evidenced willingness to pay |
| Days 61–90 | Cohort analysis of retention, sharing, revenue and content cost | 90-day operating review and continue/pivot decision | Challenge targets: D7 >=15%, D30 >=8% |

These are internal challenge thresholds, not industry benchmarks or forecasts. Always report sample size, channel mix and uncertainty.

## 9. Budget and founder time

Maximum initial cash envelope: RMB 20,000. First-stage spend ceiling: RMB 3,000; do not release the reserve before a stage gate.

| Budget | Cap (RMB) | Purpose |
|---|---:|---|
| Prototype and hosting | 3,000 | Web prototype, domain/hosting and basic services |
| User research and testing | 2,000 | Recruitment, incentives and session analysis |
| AI models and media | 2,000 | Necessary inference, licensed assets and music |
| IP rights and compliance pre-review | 3,000 | Trademark search and professional advice reserve |
| Visual and content production | 3,000 | Core character, three chapters and share assets |
| Reserve | 7,000 | Released only after gates |
| Total | 20,000 | Maximum risk budget, not a spending target |

Daily 1–2 hour allocation: 30 minutes metrics/feedback/risk; 30 minutes agent-output and story/art review; 30 minutes interviews/creator contact/content distribution; 30 minutes next-day priority and spend approval.

## 10. Design and frontend implementation contract

- Fable 5.2 is the designated design/implementation agent for the visual redesign.
- Do not hand-build a new frontend from a blank canvas. Reuse a maintained, MIT-licensed component foundation and mature accessible primitives; apply the product's own visual identity.
- The existing branch `redesign/cinematic-night-atlas-20261128` contains `DESIGN.md` and `docs/redesign/FABLE-5.2-BUILD-BRIEF.md`. Those files are the visual handoff source of truth.
- Preserve the current story engine, chapter data, branching, local progress and share-link behaviour unless a verified defect requires a change.
- Do not add accounts, payments, public UGC, AI companion chat, global votes or server-side social features to the prototype redesign.
- Build preview only; no production publication.
- Inspect three distinct high-fidelity directions before choosing one. Use screenshot-based QA at 390, 768 and 1440 px, two critique/fix rounds, keyboard/touch states, reduced motion and localisation.
- Visual target >=90/100; below 85 is rejected. No fake users, ratings, community counts, testimonials or fabricated data.

## 11. China and global compliance

Before operating, review the founder's public-institution/teacher employment restrictions on business activity, outside employment, directorship and equity. Confirm operating entity, data flows, server region, payment entity and target user age. Before a mainland public launch, assess applicable filing/registration and requirements for generative AI, recommendation, synthetic-content labels, personal information and minors. For each overseas market, assess privacy, consumer protection, minors, content moderation, payments, tax, copyright and cross-border transfers. Obtain qualified legal advice; this document is a checklist, not legal advice.

Every AI image, music track, character, font, model output and third-party asset needs a source, licence, permitted commercial use and modification record. Do not assume AI output is automatically exclusive or copyrightable.

## 12. Stop rules and financial realism

Stop or redesign if two product iterations fail to improve replay, sharing or willingness to pay. Do not scale platform features when users only say they like the prototype but do not return, share or pay. Do not buy traffic before natural distribution, D30 retention and positive contribution margin are demonstrated. Remove any content with unclear rights or safety issues.

A personal net profit target of hundreds of millions of RMB in one year is not a responsible base-case plan under the current capital and time constraints. Keep it as an extreme upside aspiration, not a promise. Measure users, net revenue, net profit, cash flow, retention and equity value separately.
