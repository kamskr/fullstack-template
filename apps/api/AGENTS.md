# AGENTS.md

## Mission

Build the API as a plain NestJS service for the template. It must run locally without cloud services, keep strict TypeScript types, and publish its contract through OpenAPI.

## Read before work

- Backend docs: `../../docs/backend/` (architecture, development, database, auth, openapi, environment, deployment, nestjs).
- Package LLM docs: `llms/`. Check for a local package doc before deep package work, then fall back to the official docs.
- Local skills: `.agents/skills/` (Better Auth best practices).
- Local-first rule: `../../docs/shared/local-first.md`. No production cloud dependency in normal development or tests.

## Coding standards

- Keep changes small and use NestJS's own building blocks: modules, providers, dependency injection, pipes, guards, interceptors, filters, and testing utilities. See `../../docs/backend/nestjs.md`.
- Do not use `any` without a reason.
- Controllers call services; services hold the logic. Keep module boundaries explicit.
- Validate request input at the boundary.
- For every new or changed endpoint, follow the checklist in `../../docs/backend/openapi.md`: models from `src/models/`, Swagger decorators, e2e tests, Bruno requests, and contract regeneration. Never return database or internal rows directly.

## Documentation impact

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

If a check cannot run, say why in the final response.
