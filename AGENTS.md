# AGENTS.md

## Mission

Build this repo as a reusable full-stack template: NestJS API, Expo mobile app, TanStack Start web app, shared API contract, and minimal shared implementation.

## Repo Map

- `apps/api`: NestJS API with PostgreSQL, Drizzle, Better Auth, OpenAPI.
- `apps/mobile`: Expo / React Native app.
- `apps/web`: TanStack Start web app.
- `packages/api-client`: generated API client and types.
- `packages/validators`: shared Zod input schemas used across app forms and API boundaries.
- `packages/`: intentionally small shared packages. Prefer API contracts and validation schemas over shared implementation.
- `bruno/`: repo-level API request workspace.
- `docs/`: the single durable knowledge layer (architecture, setup, workflows, runbooks, gotchas).
- `.agents/skills/`: repository-local workflow skills.
- `scripts/docs/`: dependency-free docs tooling (`docs:list`, `docs:check`).

## Operating Rules

- Use pnpm workspaces from the repo root; the repo is pinned via the root `packageManager` field.
- Use Turborepo for cross-package scripts.
- Keep app `.gitignore` files app-local unless a rule is truly repo-wide.
- Share contracts and validation schemas, not implementation.
- Backend is the source of truth for API behavior.
- Do not add `shared`, `common`, `core`, `utils`, or UI packages until repeated real use proves the need.
- Keep documentation in `docs/`; do not create parallel agent-note trees.

## Read Before Work

Start from the docs index: `docs/README.md`.

- Monorepo or tooling: `docs/shared/monorepo.md`.
- Creating a new project from the template: `docs/shared/template-checklist.md`.
- API/backend: `apps/api/AGENTS.md` and `docs/backend/`.
- Mobile: `apps/mobile/AGENTS.md` and `docs/mobile/`.
- Web: `apps/web/AGENTS.md` and `docs/web/`.
- API contract and generated client: `docs/shared/api-contract.md`.
- API requests: `docs/shared/bruno.md` and `bruno/`.
- Documentation-system reset prompt: `prompts/documentation-system-reset.md`.

## Documentation Impact

For any change to behavior, API surface, config, environment, setup, commands, or workflow:

1. Run the `.agents/skills/docs-impact` skill to map the change to affected docs.
2. Update the smallest authoritative doc surface in the same change, or state `docs unaffected` with a one-line reason in the handoff.
3. Regenerate contracts (`pnpm api-contract:generate`) when the API contract changed.

Never duplicate knowledge across docs; link to the canonical doc instead.

## Verification

Run the narrowest useful checks for your change. Common commands:

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
pnpm api-contract:generate
pnpm contract:check   # fails if committed contract artifacts are stale
pnpm docs:list
pnpm docs:check       # docs frontmatter + local Markdown links
pnpm docs:test        # tests for the docs tooling
```

If a check cannot run, document why in the handoff.

## Definition Of Done

- Change is implemented and the narrowest relevant checks pass.
- Documentation impact is assessed and docs are updated or `docs unaffected` is stated.
- Generated contract artifacts are regenerated and committed when the API changed.
- Bruno requests are updated when endpoints changed.
