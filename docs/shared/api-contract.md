---
summary: OpenAPI contract flow from the NestJS API to the generated TypeScript client and shared validators.
read_when:
  - Adding or changing API endpoints, models, or auth/error responses.
  - Working on packages/api-client or packages/validators.
  - Deciding where shared types, schemas, or query hooks belong.
---

# API contract

The NestJS API defines the contract. Everything else is generated from it.

Flow:

```text
NestJS controllers/models
  -> OpenAPI JSON
  -> generated TypeScript client
  -> web + mobile TanStack Query usage
```

- Checked-in contract: `apps/api/docs/openapi.json`
- Generated shared package: `packages/api-client`
- Shared input/schema package: `packages/validators`

Generate both the OpenAPI schema and TypeScript client from the repo root:

```bash
pnpm api-contract:generate
```

This runs `pnpm api:openapi` (writes `apps/api/docs/openapi.json`), then `pnpm api-client:generate` (writes `packages/api-client/src/generated/`). Commit both outputs with the API change.

CI runs `pnpm contract:check` (`scripts/api-contract-check.mjs`). It regenerates the contract and fails on any diff against the committed files or on untracked generated files.

The API client uses `@hey-api/openapi-ts` with the fetch client plugin. It must run unchanged in the browser and in React Native, so it contains generated types, SDK functions, the fetch client, and at most a small optional helper on top. Do not share backend implementation code with frontend apps.

Do not put TanStack Query hooks in `packages/api-client`. Keep query hooks app-local in `apps/web` and `apps/mobile` so each app controls cache keys, retries, auth/session handling, offline behavior, and UX.

Use `packages/validators` for Zod schemas that web, mobile, and the API all use. Keep business logic out of shared packages.
