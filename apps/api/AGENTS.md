# AGENTS.md

## Mission

Build the API app as an idiomatic NestJS service for the full-stack template. Optimize for local-first development, strong type safety, clear API contracts, and easy onboarding.

## Read Before Work

- Backend docs: `../../docs/backend/` (architecture, development, database, auth, openapi, environment, deployment, nestjs).
- Package LLM docs: `llms/` — check for a local package doc before deep package work, then fall back to official docs.
- Local skills: `.agents/skills/` (Better Auth best practices).
- Local-first rule: `../../docs/shared/local-first.md` — no production cloud dependency in normal development or tests.

## Coding Standards

- Keep changes small and idiomatic NestJS: modules, providers, dependency injection, pipes, guards, interceptors, filters, and testing utilities. See `../../docs/backend/nestjs.md`.
- Preserve strong TypeScript types; avoid `any` unless justified.
- Keep controllers thin; put business logic in providers/services. Keep module boundaries explicit.
- Validate request input at the boundary.
- For every new or changed endpoint, follow the checklist in `../../docs/backend/openapi.md`: models from `src/models/`, Swagger decorators, e2e tests, Bruno requests, and contract regeneration. Never return database/internal rows directly.

## Documentation Impact

For changes to behavior, endpoints, config, env vars, local services, testing, or workflow: run the `.agents/skills/docs-impact` skill (repo root), update the relevant `docs/backend/` doc in the same change, or state `docs unaffected` with a reason.

## Verification

Run the narrowest useful checks before handoff:

```bash
pnpm --filter @template/api lint
pnpm --filter @template/api test
pnpm --filter @template/api test:e2e   # needs local PostgreSQL + migrations
pnpm --filter @template/api build
pnpm api-contract:generate             # when the API contract changed
```

If a check cannot run, document why in the final response.
