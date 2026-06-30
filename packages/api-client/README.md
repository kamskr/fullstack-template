# API Client

Generated TypeScript API client for web and mobile apps.

Source contract:

```text
../../apps/api/docs/openapi.json
```

Generate from the repo root:

```bash
pnpm api-contract:generate
```

This package should stay contract/client-only. Keep TanStack Query hooks app-local in `apps/web` and `apps/mobile`.

The package exports generated operations/types plus `apiClient` for app-local configuration, e.g. setting `baseUrl` and `credentials` in each client app.
