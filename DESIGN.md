# NEXORA / The Dream Station — Design Contract

> Internal project code: NEXORA. Public brand and character rights remain subject to clearance. This file governs the visual and interaction system for the first interactive-fiction experience, **The Dream Station**.

## Product boundary

- A mobile-first, shareable interactive micro-narrative experience.
- One original story world; three short, finite chapters; approximately 2–5 minutes per chapter.
- The player makes meaningful choices; choices change story state and endings.
- The result is a distinct ending and a shareable story card/link.
- No open-ended AI chat, AI companion, public UGC, global vote tally, forced registration, or payment in this prototype.
- KURU is a candidate character only. Do not imply ownership or commercial clearance until the rights audit is complete.
- Preserve the existing story engine, chapter data, branching, local progress, and share-link behavior unless a verified defect requires a change.

## Art direction: Cinematic Night Atlas

A premium, cinematic night-world experience: the quiet atmosphere of a late-night station, luminous signal paths, distant architecture, and carefully art-directed character moments. It must feel like an original entertainment product, not a SaaS dashboard, generic AI landing page, pastel template, or visual-novel clone.

### Design principles

1. The story world is the hero. Use high-quality, rights-cleared scene artwork as the primary visual surface; UI chrome should recede.
2. One clear primary action per screen. Make the next action obvious without explanatory paragraphs.
3. Emotional warmth comes from lighting, composition, character expression, and pacing—not decorative clutter.
4. Use real interface states and real story content. Never use fake users, fake ratings, fake community counts, or fabricated testimonials.
5. Keep mobile hierarchy deliberate. The 390px experience is the primary design target; desktop is an intentional expanded composition, not a stretched phone layout.
6. No text baked into images. All product copy must remain localizable.

## Design tokens

### Color

- ink-950: #0B1220 — primary night canvas
- ink-900: #111B2D — elevated night surface
- ink-800: #1C2A3D — secondary surface
- ivory-100: #F4F0E7 — primary light canvas / text on dark
- ivory-200: #E9E3D7 — secondary light surface
- signal-amber: #E6B35A — primary action and important signal
- signal-cyan: #6CC6D7 — secondary signal / navigation feedback
- muted-ink: #A5B0BC — secondary text on dark
- hairline-dark: rgba(226, 232, 240, 0.14) — subtle dividers
- danger: #D97865 — errors only

Do not reuse the current lavender / pastel-purple / honey palette. Do not apply gradients to every card. Gradients are reserved for environmental light and one or two atmospheric hero treatments.

### Typography

- UI: Manrope or an equivalent open-license, highly legible sans-serif.
- Story titles / selected narrative moments: Newsreader or an equivalent open-license editorial serif.
- Body copy: 16px minimum on mobile for reading surfaces; 14px only for supporting metadata.
- Use clear line lengths, comfortable leading, and restrained letter spacing. Do not use tiny uppercase labels as the primary information carrier.

### Shape and layout

- Use a restrained radius scale: 10 / 16 / 24px. Avoid turning every element into a pill.
- Large scene compositions may be full-bleed or edge-to-edge.
- Cards should exist only when they represent a real object: chapter, saved ending, choice, character, or story result.
- Avoid floating-card piles, ornamental orbit rings, random badges, and empty bento grids.

## Motion system

Motion must explain state, preserve spatial continuity, or add rare narrative delight.

- Common UI transitions: 120–220ms; never delay input.
- Button press feedback: 100–160ms.
- Dropdowns / popovers: 150–250ms, anchored to their trigger.
- Story scene transitions: 350–650ms, only where a scene change benefits from a cinematic beat.
- Preferred UI easing: cubic-bezier(0.23, 1, 0.32, 1) for entrances and feedback.
- Animate transform and opacity; avoid layout-property animation.
- No transition: all, no scale(0) entrances, no ease-in on UI, no motion on frequent keyboard actions.
- Respect prefers-reduced-motion; preserve state feedback while removing parallax, drift, and large movement.
- Hover-only effects must be gated to devices that actually support hover.

## Reusable UI foundation

Use a mature, maintained component foundation instead of creating components from scratch:

- Preferred source: https://github.com/ColorlibHQ/velora-ui — MIT-licensed, Next.js 16 / React 19 / Tailwind CSS 4 / shadcn UI / Motion. Use only the components that fit the product; do not copy its generic SaaS visual identity.
- Base primitives: shadcn/ui components with accessible semantics and keyboard support.
- Motion guidance: https://github.com/linmuye45-ai/skills/tree/main/skills/emil-design-eng and https://github.com/linmuye45-ai/skills/tree/main/skills/review-animations.
- Do not use Floot.
- Do not invent a new UI framework or hand-write a component library.
- Keep the existing Next.js application and story logic. Migrate styling foundations only when the agent can demonstrate a clear benefit and preserve all current behavior.

## Required screens

1. **Age / beta entry** — elegant, compact self-declared 18+ confirmation; explain that the beta is a creative story experience, not therapy or counselling.
2. **Home / story world** — cinematic station scene, one-sentence premise, duration, primary “Begin” action, and clear access to chapters and saved progress.
3. **Story shelf** — three chapter covers with real progress, duration, unlock/completion state, and distinct scene artwork.
4. **Story player** — scene art, character/dialogue area, progress indicator, and 2–3 large, clearly differentiated choices. Choice text must explain the action, not hide meaning in metaphor.
5. **Choice feedback** — concise character/world reaction; no unnecessary loading screen.
6. **Ending** — unique ending title, short consequence summary, world/character state, share card, replay, and next chapter.
7. **Story shelf / saved endings** — completed chapters, saved outcomes, replay controls, and clear empty state.
8. **About / safety / privacy** — concise product explanation, content boundaries, data handling, local progress deletion, and contact/support route.

## Internationalization

Initial UI locales: en, zh-CN, ja, ko, es, fr, de, pt-BR.

- All UI strings and story content must be externalized into locale resources; no hardcoded UI text in components.
- Add a visible language selector that persists the user's choice.
- Handle text expansion, line wrapping, date/number formatting, and font fallback.
- Do not machine-translate story text at runtime. Localized story versions must be reviewed before being presented as final.
- Do not place copy inside artwork.

## Responsive and accessibility requirements

- Validate 390×844, 768×1024, and 1440×900.
- No horizontal overflow, clipped choices, or fixed-height text traps.
- Minimum touch target 44×44px.
- Visible keyboard focus, semantic landmarks, accessible labels, contrast, and reduced-motion behavior.
- Reading surfaces must remain comfortable for 2–5 minute sessions.
- Preserve progress and share behavior on refresh and direct-link entry.

## Non-negotiable release gates

- No broken core interactions.
- No loss of existing story branching, progress, or share-link behavior.
- No unlicensed artwork, fonts, audio, or character assets.
- No fabricated social proof or commercial claims.
- At least two complete visual critique / correction rounds.
- Screenshot QA at all three viewport sizes.
- Final visual quality score at least 90/100; below 85 is rejected.
