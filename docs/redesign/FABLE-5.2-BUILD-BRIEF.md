# Fable 5.2 — NEXORA / The Dream Station Full Frontend Redesign

## Mission

Completely replace the current frontend presentation of **The Dream Station** with a premium, globally understandable, mobile-first interactive-fiction experience. This is a full visual and interaction redesign, not a color refresh.

The internal project code is NEXORA. The Dream Station is the first story world. KURU remains a candidate character pending a rights audit. Do not rename the project, invent a new business model, or change the approved product boundary.

## Hard constraints

1. Use Fable 5.2 as the design and implementation agent.
2. Do not use Floot.
3. Do not hand-build the frontend from a blank canvas. Start from mature, maintained, open-source templates and components.
4. Preferred component source: https://github.com/ColorlibHQ/velora-ui (MIT; Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, Motion). Reuse appropriate primitives and patterns, then apply the project's own design tokens and page compositions. Do not copy Velora's SaaS branding or generic SaaS page structure.
5. Use shadcn/ui accessible primitives for dialogs, menus, buttons, tabs, selects, progress, tooltips, and other standard controls. Do not invent a new component library.
6. Preserve the existing Next.js project, story data, story branching, local save behavior, age confirmation, share-link format, and existing tests unless a verified defect requires a change.
7. Do not create accounts, payments, public UGC, AI companion chat, global votes, or server-side social features in this redesign.
8. Do not use paid APIs, paid templates, paid image services, or any new recurring subscription.
9. Do not publish to production. Create a preview deployment only.
10. Never claim the interface is complete until the actual browser rendering and screenshots have been inspected.

## Product definition

A visitor opens a shareable link and enters a short, original interactive story without forced registration. The first meaningful action should be obvious and available within 10 seconds. A chapter takes about 2–5 minutes. Choices visibly affect the story state and ending. The result gives the visitor a reason to replay or share.

The prototype contains:
- One original story world.
- Three short authored chapters.
- Finite branching and authored endings.
- Local progress and saved endings.
- Shareable story result links.
- A self-declared 18+ private-beta entry step.
- No runtime open-ended AI story generation.

## Design exploration — do this before implementation

Create three genuinely different high-fidelity directions:

A. **Cinematic Night Atlas** — recommended default. Midnight ink, moonlit ivory, signal amber and cool cyan; cinematic station environments; luminous signal paths; editorial story typography; minimal UI chrome.

B. **Storybook Editorial** — warm archival paper, deep ink, restrained vermilion, large narrative typography, illustrated chapter spreads, tactile page transitions.

C. **Modern Consumer Play** — clean ivory/graphite surfaces, one vivid signal color, bold product imagery, highly legible mobile navigation, concise interaction copy.

Do not make three color variants of the same layout. Each direction must have a different hero composition, chapter discovery pattern, story-player composition, and ending presentation.

Score all three with the rubric below. Select the strongest direction automatically; do not stop to ask the user.

## Selected art direction target: Cinematic Night Atlas

Build an original visual identity around a quiet night station and a signal that connects story moments.

- Primary canvas: midnight blue-black, not pure black.
- Secondary surfaces: deep blue-grey and moonlit ivory.
- Primary action: warm signal amber.
- Secondary state signal: cool cyan.
- UI font: Manrope or another open-license, highly legible sans-serif.
- Story display font: Newsreader or another open-license editorial serif.
- Real scene artwork is the visual hero. Do not rely on generic gradients, random floating cards, decorative orbit rings, emojis, or generic AI illustrations.
- Use restrained depth, environmental light, controlled grain, and precise typography.
- All text remains real selectable text; never bake interface copy into images.
- Keep the story emotionally warm, but the interface crisp and easy to understand.

Use the design contract in the repository root DESIGN.md as the single source of truth for tokens, layout, motion, and accessibility.

## Required end-to-end screens and states

1. **Age / beta entry**
   - Elegant self-declared 18+ confirmation.
   - Clear explanation that this is a creative story experience, not therapy or counselling.
   - Do not make this page look like a generic legal form.

2. **Home / story world**
   - Cinematic station scene with a clear title and one-sentence premise.
   - Prominent Begin action.
   - Visible estimated duration and no-account-needed reassurance.
   - Navigation to chapters, saved progress, language, and about.

3. **Story shelf**
   - Three distinct chapter covers using real scene art.
   - Duration, progress, completion/unlock state.
   - Clear resume / replay action.
   - No fake popularity, ratings, or social counts.

4. **Story player**
   - Scene artwork and character presence.
   - Readable dialogue area with strong hierarchy.
   - Progress indicator that does not dominate the story.
   - Two or three meaningful choices with large touch targets.
   - Choice labels must be plain and globally understandable, not cryptic literary riddles.

5. **Choice feedback**
   - Immediate, concise character or world response.
   - A visible but subtle transition into the next scene.
   - No artificial waiting or unnecessary loading screen.

6. **Ending**
   - Distinct ending title and visual identity.
   - Brief explanation of what changed.
   - Clear share, replay, and continue actions.
   - Shareable result card that works when opened directly by another person.

7. **Story shelf / saved endings**
   - Completed chapters and saved outcomes.
   - Replay controls and progress state.
   - Designed empty state for a first-time visitor.
   - Local progress deletion remains available.

8. **About / safety / privacy**
   - Concise explanation of the product and content boundaries.
   - Clear data handling and local progress deletion.
   - Support/contact route.
   - Do not invent legal claims or certifications.

For every screen, design and implement loading, empty, error, completed, disabled, hover, focus, pressed, and mobile states where applicable.

## Internationalization — required

Initial locales:
- English (en)
- Simplified Chinese (zh-CN)
- Japanese (ja)
- Korean (ko)
- Spanish (es)
- French (fr)
- German (de)
- Brazilian Portuguese (pt-BR)

Requirements:
- Externalize every UI string and story string into locale resources.
- Visible language selector with persisted preference.
- No hardcoded copy inside components.
- No text embedded in artwork.
- Check text expansion and line wrapping in every language.
- Do not machine-translate story content at runtime. Mark unfinished story translations as draft rather than presenting them as reviewed.
- Use locale-aware date/number formatting and reliable font fallbacks.

## Motion and interaction quality

Use motion only when it communicates a state change, maintains spatial continuity, or adds a rare story moment.

- Button press: 100–160ms.
- Standard UI transition: 120–220ms.
- Dropdown / popover: 150–250ms, anchored to its trigger.
- Story scene transition: 350–650ms when justified.
- Prefer cubic-bezier(0.23, 1, 0.32, 1) for UI entrances.
- Animate transform and opacity; avoid layout-property animation.
- No transition: all, no scale(0), no ease-in on UI, no unnecessary cursor-following effects, no motion on frequent keyboard actions.
- Respect prefers-reduced-motion.
- Hover motion only on devices that support hover.
- Review against the project's emil-design-eng and review-animations guidance.

## Asset and rights rules

- Use only original assets supplied in the project or assets with documented commercial-use rights.
- Maintain an asset ledger: asset, creator/source, license, attribution requirement, modification, and proof URL.
- Do not assume KURU is cleared for commercial use. Retain it only as a provisional beta asset until the rights audit is complete.
- No scraped game artwork, no copied character designs, no unlicensed fonts, no stock watermarks, and no text embedded in generated images.
- Prefer a small, coherent set of scene illustrations over a large quantity of inconsistent generic images.

## Reference products — inspect complete flows, not just marketing pages

Study these products for specific interaction lessons, then create an original interface:

- Episode — story discovery, chapter reading, choice presentation, endings, and multilingual mobile storytelling: https://episodeinteractive.com/
- Choices: Stories You Play — chapter progression, choice feedback, story shelf and replay cues: https://apps.apple.com/us/app/choices-stories-you-play/id1071310449
- Netflix Stories — story collection discovery and branded world entry: https://apps.apple.com/us/app/netflix-stories/id6446507664
- Dorian — visual, template-driven interactive story creation and creator-owned IP positioning: https://home.dorian.live/
- Reigns — simple, instantly understandable choice interaction and replay loop: https://www.devolverdigital.com/games/reigns

Use Stripe as a reference for hierarchy, spacing, and interaction precision; Airbnb for consumer clarity and human-friendly discovery; Apple for restrained cinematic product presentation. Do not copy logos, exact compositions, proprietary fonts, illustrations, copy, or brand colors.

## Responsive QA

Capture actual rendered browser screenshots at:
- 390×844 (primary mobile)
- 768×1024 (tablet)
- 1440×900 (desktop)

Minimum screenshot set: 24 images (8 required screens × 3 viewports), plus at least 12 key interaction states:
- age confirmed / not confirmed
- first visit / returning visitor
- chapter locked / unlocked / completed
- choice pressed / choice selected
- ending / replay
- share success / share fallback
- empty shelf / populated shelf
- each language selector state

Check:
- no horizontal overflow
- no clipped dialogue or choices
- no broken deep links
- no broken local progress
- no inaccessible controls
- no console errors
- keyboard and touch both work
- reduced-motion mode works
- all eight locales remain readable

## Quality score and stop rule

Score the final interface out of 100:

- Art direction and visual identity: 20
- Composition and hierarchy: 20
- Typography and readability: 15
- Color and material system: 10
- Spacing and component consistency: 15
- Motion and interaction: 10
- Responsive design and accessibility: 10

Release threshold: 90/100. Under 85 is rejected. Between 85–89 requires another full correction pass.

Complete at least two screenshot-based critique/fix rounds. The final report must include:
- chosen visual direction and why
- template and component sources with license evidence
- list of screens and states completed
- 24+ real screenshots
- automated test/build results
- known defects and unresolved rights/compliance items
- final score with evidence

Do not claim revenue, virality, or commercial success from a visual prototype. Do not stop at a polished landing page: the complete story flow must work.
