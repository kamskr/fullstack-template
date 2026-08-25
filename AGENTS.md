# AGENTS.md

## Mission

Build this repo as a reusable full-stack template: NestJS API, Expo mobile app, TanStack Start web app, shared API contract, and as little shared implementation as possible.

## Repo map

- `apps/api`: NestJS API with PostgreSQL, Drizzle, Better Auth, OpenAPI.
- `apps/mobile`: Expo / React Native app.
- `apps/web`: TanStack Start web app.
- `packages/api-client`: generated API client and types.
- `packages/validators`: shared Zod input schemas used by app forms and API boundaries.
- `packages/`: keep small. Prefer API contracts and validation schemas over shared implementation.
- `bruno/`: repo-level API request workspace.
- `docs/`: the only place for lasting documentation (architecture, setup, workflows, runbooks, gotchas).
- `.agents/skills/`: repository-local workflow skills.
- `scripts/docs/`: dependency-free docs tooling (`docs:list`, `docs:check`).

## Operating rules

- Use pnpm workspaces from the repo root; the root `packageManager` field pins the version.
- Use Turborepo for cross-package scripts.
- Use Conventional Commits for commit messages.
- Use Conventional-style branch names such as `feat/show-build-number` or
  `fix/settings-scroll`; never prefix branches with an agent or tool name such
  as `agent/`, `claude/`, `codex/`, or similar.
- Keep app `.gitignore` files app-local unless a rule applies to the whole repo.
- Share contracts and validation schemas, not implementation.
- The backend defines API behavior.
- Do not add `shared`, `common`, `core`, `utils`, or UI packages until repeated real use proves the need.
- Keep documentation in `docs/`; do not create parallel agent-note trees.

## Read before work

Start from the docs index: `docs/README.md`.

- Monorepo or tooling: `docs/shared/monorepo.md`.
- Creating a new project from the template: `docs/shared/template-checklist.md`.
- API/backend: `apps/api/AGENTS.md` and `docs/backend/`.
- Mobile: `apps/mobile/AGENTS.md` and `docs/mobile/`.
- Web: `apps/web/AGENTS.md` and `docs/web/`.
- API contract and generated client: `docs/shared/api-contract.md`.
- API requests: `docs/shared/bruno.md` and `bruno/`.

## Documentation impact

For any change to behavior, API endpoints or models, config, environment, setup, commands, or workflow:

1. Run the `.agents/skills/docs-impact` skill to map the change to affected docs.
2. Update the one doc that owns the fact in the same change, or state `docs unaffected` with a one-line reason in the handoff.
3. Regenerate contracts (`pnpm api-contract:generate`) when the API contract changed.

Never duplicate knowledge across docs; link to the owning doc instead.

## Verification

Run the narrowest useful checks for your change. Common commands:

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
pnpm api-contract:generate
pnpm contract:check   # fails if committed contract artifacts are stale or untracked
pnpm docs:list
pnpm docs:check       # docs frontmatter + local Markdown links
pnpm docs:test        # tests for the docs tooling
```

If a check cannot run, say why in the handoff.

## Definition of done

- The change is in and the narrowest relevant checks pass.
- Docs are updated, or the handoff states `docs unaffected` with a reason.
- If the API changed, the regenerated contract artifacts are committed.
- If endpoints changed, the Bruno requests match.
