# API Contract

The NestJS API is the source of truth.

Flow:

```text
NestJS controllers/models
  -> OpenAPI JSON
  -> generated TypeScript client
  -> web + mobile TanStack Query usage
```

Current checked-in contract:

```text
apps/api/docs/openapi.json
```

Generated shared package:

```text
packages/api-client
```

Shared input/schema package:

```text
packages/validators
```

Generate both the OpenAPI schema and TypeScript client from the repo root:

```bash
pnpm api-contract:generate
```

This runs:

1. `pnpm api:openapi`
2. `pnpm api-client:generate`

The API client uses `@hey-api/openapi-ts` with the fetch client plugin. It should stay platform-neutral: generated types, SDK functions, and fetch client support only.

Do not put TanStack Query hooks in `packages/api-client`. Keep query hooks app-local in `apps/web` and `apps/mobile` so each app controls cache keys, retries, auth/session handling, offline behavior, and UX.

Use `packages/validators` for Zod schemas that intentionally apply across web, mobile, and API. Keep broad business logic out of shared packages.
