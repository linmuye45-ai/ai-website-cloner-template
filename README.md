# VESTI Studio

**The operating system for fashion creators.**

VESTI brings creator identity, fashion composition, campaign production, digital wardrobe, creator intelligence, and commercial workflows into one considered workspace.

## Product principles
- Identity consistency: preserve a creator's recognisable visual language.
- Structured fashion composition: make model, styling, scene, light, and output format deliberate inputs.
- Creator publishing: turn one creative direction into a coordinated multi-channel campaign.
- Creator-owned data: keep creator assets and identity under the creator's control.

## Current build
This branch contains the interactive VESTI Studio frontend preview:
- Overview dashboard and creator identity profile
- Fashion Studio with local creative-brief creation
- Campaign desk with campaign creation
- Digital Wardrobe sample and add-piece flow
- Creator Intelligence preview
- Commercial workspace preview
- Responsive desktop, tablet, and mobile layouts

The current interactions are frontend demo state only. AI image generation, persistent cloud storage, authentication, billing, publishing integrations, and live analytics are not yet connected. No API keys or customer data are stored in this repository.

## Run locally
Requires Node.js 24+.

```bash
npm install
npm run dev
```

## Product roadmap
1. Connect authentication and tenant-scoped persistence.
2. Integrate a fashion image generation / virtual try-on provider behind explicit user consent and clear credit usage.
3. Implement identity references and consistency evaluation.
4. Connect campaign publishing workflows and creator analytics.
5. Add creator plans, credit metering, and a template marketplace.

## Commercial hypotheses (not validated)
- Creator: USD $19–29/month
- Pro: USD $49–79/month
- Optional generation credits
- Later: creator templates and recommendation revenue

Pricing is a hypothesis for testing, not a published offer.
