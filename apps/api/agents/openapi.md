# OpenAPI And Health Notes

## Routes

- Swagger UI: `/api`
- OpenAPI JSON: `/api-json`
- Health: `/health`
- Timestamps: `/timestamps`
- Checked-in schema: `docs/openapi.json`

`/docs` is intentionally unused so it remains available for product/API documentation if needed later.

## Setup

OpenAPI setup lives in `src/openapi.ts` and is called from `src/main.ts`. E2E tests should call the same helper before `app.init()` when asserting Swagger routes.

The source-controlled schema is generated with:

```bash
pnpm api:openapi
```

Commit `docs/openapi.json` and regenerated `../../../packages/api-client/src/generated/` files whenever endpoint/DTO changes alter the generated contract.

## Controller And Model Conventions

- Use model classes from `src/models/` for every request body and response body that should appear in OpenAPI.
- Decorate model properties with `@ApiProperty()` or `@ApiPropertyOptional()` so generated clients get stable models.
- Add `@ApiTags()` to every controller.
- Add explicit response decorators such as `@ApiOkResponse()`, `@ApiCreatedResponse()`, and error responses for generated client clarity.
- Do not return Drizzle rows, Better Auth internals, or other persistence/internal objects directly from controllers. Map them to API response models.
- For arrays, use `@ApiOkResponse({ type: SomeModel, isArray: true })`.
- For enums, use `@ApiProperty({ enum: SomeEnum })`.
- For nullable fields, use `@ApiProperty({ nullable: true })` and a TypeScript `| null` type.

## Endpoint Checklist

When adding or changing an endpoint:

1. Define request model classes for body/query params when needed.
2. Define response model classes for returned data.
3. Add validation decorators/pipes at the API boundary when inputs exist.
4. Add `@ApiTags()` on the controller.
5. Add route-level Swagger decorators for success and expected error responses.
6. Add or update e2e tests.
7. Add or update matching Bruno requests under `../../../bruno/collections/template-api/` for local manual testing.
8. Run `pnpm api-contract:generate`.
9. Check `docs/openapi.json`, `packages/api-client/src/generated/`, or `/api-json` and confirm the schema includes the route and DTO models needed by client apps.

Client apps should generate models/clients from `docs/openapi.json` in source control, or from the runtime OpenAPI JSON route (`/api-json`) during local experiments.

The `timestamps` feature is the template reference for generated client usage. It exposes only API models (`TimestampModel`, `CreateTimestampModel`, `UpdateTimestampModel`) and does not expose internal `user_id` persistence fields.

## Health

`/health` returns a shallow app health response: status, timestamp, uptime, `APP_ENV`, and `NODE_ENV`.

Add database readiness later when we have behavior that genuinely depends on database availability. Keep readiness checks fast and deterministic.
