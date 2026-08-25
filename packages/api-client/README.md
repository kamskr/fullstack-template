# API client

Generated TypeScript API client for the web and mobile apps.

Source contract:

```text
../../apps/api/docs/openapi.json
```

Generate from the repo root:

```bash
pnpm api-contract:generate
```

This package holds the contract and client only. Keep TanStack Query hooks app-local in `apps/web` and `apps/mobile`.

The package exports the generated operations and types plus `apiClient`, which each app configures locally (for example `baseUrl` and `credentials`).
