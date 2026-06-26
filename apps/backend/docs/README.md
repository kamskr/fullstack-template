# API Docs

Product/API documentation lives here.

## OpenAPI

- Checked-in schema: `openapi.json`
- Runtime Swagger UI: `/api`
- Runtime OpenAPI JSON: `/api-json`

Regenerate after adding or changing API endpoints, models, auth responses, or error responses:

```bash
pnpm run openapi:generate
```

Commit `docs/openapi.json` with the endpoint change so client apps can generate stable models from source control.
