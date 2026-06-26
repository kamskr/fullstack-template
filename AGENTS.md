# AGENTS.md

## Mission

Build this repo as a reusable full-stack template: NestJS API, Expo mobile app, TanStack Start web app, shared API contract, and minimal shared implementation.

## Repo Map

- `apps/api`: NestJS API with PostgreSQL, Drizzle, Better Auth, OpenAPI.
- `apps/mobile`: Expo / React Native app.
- `apps/web`: TanStack Start web app.
- `packages/`: intentionally small shared packages. Prefer API contracts over shared implementation.
- `bruno/`: repo-level API request workspace.
- `docs/`: durable architecture and workflow docs.
- `agents/`: monorepo-wide notes for future agents.

## Operating Rules

- Use pnpm workspaces from the repo root.
- Use Turborepo for cross-package scripts.
- Keep app `.gitignore` files app-local unless a rule is truly repo-wide.
- Share contracts, not implementation.
- Backend is the source of truth for API behavior.
- Do not add `shared`, `common`, `core`, `utils`, or UI packages until repeated real use proves the need.

## Read Before Work

- Monorepo or tooling: `docs/shared/monorepo.md` and `agents/`.
- Creating a new project from the template: `docs/shared/template-checklist.md`.
- API/backend: `apps/api/AGENTS.md`, `docs/backend/`, and `apps/api/agents/`.
- Mobile: `apps/mobile/AGENTS.md` and `docs/mobile/`.
- Web: `apps/web/AGENTS.md` and `docs/web/`.
- API requests: `agents/bruno.md` and `bruno/`.

## Agent Notes Duties

Keep `agents/` and app-level `apps/*/agents/` current.

Add or update notes whenever you discover a setup issue, command, convention, framework gotcha, package-specific behavior, API workflow, database migration detail, Bruno flow, or deployment assumption that would save the next agent time.

Use root `agents/` for monorepo-wide knowledge. Use app-level `agents/` directories for app-specific knowledge.

When changing setup, commands, environment variables, local services, API contract generation, database workflow, Bruno collections, or deployment workflow, update the relevant docs and agent notes in the same change.

## Verification

Run the narrowest useful checks for your change. Common commands:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm api-contract:generate
```

If a check cannot run, document why in the handoff.
