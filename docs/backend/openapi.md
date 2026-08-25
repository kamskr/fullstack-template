---
summary: OpenAPI/Swagger routes, controller and model conventions, endpoint checklist, and the health endpoint contract.
read_when:
  - Adding or changing an API endpoint, request/response model, or Swagger setup.
  - Regenerating or consuming the checked-in OpenAPI schema.
---

# OpenAPI and health

## Routes

- Swagger UI: `/api`
- OpenAPI JSON: `/api-json`
- Health: `/health`
- Timestamps: `/timestamps`
- Checked-in schema: `apps/api/docs/openapi.json`

`/docs` is unused and reserved for product or API documentation later.

## Setup

OpenAPI setup lives in `src/openapi.ts` and `src/main.ts` calls it. E2E tests should call the same helper before `app.init()` when asserting Swagger routes.

Generate the committed schema with:

```bash
pnpm api:openapi
```

Commit `apps/api/docs/openapi.json` and the regenerated `packages/api-client/src/generated/` files whenever an endpoint or DTO change alters the generated contract. CI runs `pnpm contract:check` to catch stale contracts.

## Controller and model conventions

- Use model classes from `src/models/` for every request body and response body that should appear in OpenAPI.
- Decorate model properties with `@ApiProperty()` or `@ApiPropertyOptional()` so generated clients get stable models.
- Add `@ApiTags()` to every controller.
- Add explicit response decorators such as `@ApiOkResponse()`, `@ApiCreatedResponse()`, and error responses, so the generated client knows the response and error shapes.
- Do not return Drizzle rows, Better Auth internals, or other persistence/internal objects directly from controllers. Map them to API response models.
- For arrays, use `@ApiOkResponse({ type: SomeModel, isArray: true })`.
- For enums, use `@ApiProperty({ enum: SomeEnum })`.
- For nullable fields, use `@ApiProperty({ nullable: true })` and a TypeScript `| null` type.

## Endpoint checklist

When adding or changing an endpoint:

1. Define request model classes for body/query params when needed.
2. Define response model classes for returned data.
3. Add validation decorators/pipes at the API boundary when inputs exist.
4. Add `@ApiTags()` on the controller.
5. Add route-level Swagger decorators for success and expected error responses.
6. Add or update e2e tests.
7. Add or update matching Bruno requests under `bruno/collections/template-api/` for local manual testing.
8. Run `pnpm api-contract:generate`.
9. Check `apps/api/docs/openapi.json`, `packages/api-client/src/generated/`, or `/api-json` and confirm the schema includes the route and DTO models the client apps need.

Client apps should generate models and clients from the committed `apps/api/docs/openapi.json`, or from the runtime `/api-json` route during local experiments.

The `timestamps` feature is the template reference for generated client usage. It exposes only API models (`TimestampModel`, `CreateTimestampModel`, `UpdateTimestampModel`) and hides the internal `user_id` persistence field.

## Health

`/health` returns a shallow app health response: status, timestamp, uptime, `APP_ENV`, and `NODE_ENV`.

Add a database readiness check only once something depends on database availability. Keep readiness checks fast and deterministic.
