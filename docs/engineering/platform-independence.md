# Platform-independent engineering workflow

Status: operating baseline, 2026-11-28.

## Objective

The product source, data model, deployment process and release evidence must remain portable. No product may depend on a single AI builder, model vendor or hosted IDE to remain buildable.

## System of record

- GitHub is the canonical source of truth for code, issues, pull requests, migrations, product specifications and release notes.
- Every production change must be represented by a commit and a reviewable diff.
- Vercel is a replaceable deployment target. Production deploys only from an explicitly selected production branch; feature branches and pull requests use previews.
- Supabase is a replaceable managed Postgres/Auth/Storage layer. Keep SQL migrations in the repository and use a separate Supabase project for each unrelated product.
- Model providers sit behind server-side adapters. Never make a product depend on a model-specific response shape without validation.

## Replaceable development agents

Use agents as interchangeable contributors, not as project owners:

1. TRAE SOLO or Qoder CN: China-accessible IDE/agent option, subject to account, network and model availability.
2. Codex CLI: local repository editing, command execution, tests and code review when the existing subscription is available.
3. OpenHands or bolt.diy: optional self-hosted/locally controlled agent workbench after a separate security and cost review.

No agent is allowed to push directly to the production branch. Each task must produce a branch, a diff, test output and a concise handoff.

## Local development baseline

- Node.js: 24.x for this application.
- Install: `npm install` while no lockfile exists; use `npm ci` after a committed package-lock.json is available.
- Required checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
- Do not claim a build passed unless the command or CI result is available.
- Never commit `.env.local`, access tokens, service-role keys, private customer data or production exports.

## Branch and release policy

- `main` or the explicitly designated product branch: protected production source.
- `feat/*`: feature work.
- `fix/*`: defect correction.
- `ops/*`: engineering infrastructure and operational controls.
- Pull requests must include: problem, scope, screenshots for UI changes, tests run, migration impact, rollback plan and known limitations.
- Vercel preview is not production approval.
- Production release requires passing CI, smoke tests, secret review, database migration review and an explicit release decision.

## Data and security policy

- Public Supabase publishable keys may be used in the browser only with correctly scoped Row Level Security.
- Service-role keys, provider API keys and storage write tokens remain server-side.
- Use a dedicated Supabase project per independent product. Do not attach the GTEN procurement database to unrelated consumer products.
- Every public data source must record provider, source URL, retrieval time, geography, platform, metric definition and licence/terms basis.
- Do not bypass authentication, rate limits, paywalls or robots restrictions to collect third-party data.
- Back up production data before schema changes. Migrations must be additive where possible and reversible where practical.

## Current engineering debt

- The NEXORA branch has no package-lock.json; CI warns and uses npm install until a lockfile is committed.
- The VESTI/NEXUS branch documents a dedicated Supabase project but does not yet have that project wired into its Vercel environment.
- Signal Atlas is currently an inline/static Vercel deployment rather than a GitHub-controlled source branch. Recover or recreate its complete source before treating it as migrated.
- Existing Vercel projects must not be deleted until their source, environment, domain, storage, database and rollback paths have been verified.

## Definition of done

A product is considered independently operable only when:
1. Its full source is in GitHub.
2. A clean checkout can install and build from documented commands.
3. CI runs lint, type checks, tests and production build.
4. Secrets are externalized and documented by name, never by value.
5. Database schema is represented by migrations and RLS is tested.
6. Preview and production deployments are separately controlled.
7. A release can be rolled back without relying on the original AI builder.
