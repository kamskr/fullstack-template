# API Contract Notes

The backend OpenAPI document is the contract between the API, web app, and mobile app.

Current source:

```text
apps/api/docs/openapi.json
```

Regenerate after API endpoint, response model, auth response, or error response changes:

```bash
pnpm api:openapi
```

Generated client target:

```text
packages/api-client
```

Generate the whole contract flow with:

```bash
pnpm api-contract:generate
```

`packages/api-client` uses `@hey-api/openapi-ts` and outputs generated code under `packages/api-client/src/generated/`.

That package should contain generated TypeScript models/client plus a very thin optional helper layer. Do not share backend implementation code with frontend apps.

Keep TanStack Query hooks app-local in `apps/web` and `apps/mobile`.

Shared Zod schemas live in `packages/validators`. Use them for cross-client form/API input shapes; do not put query hooks or implementation logic there.
