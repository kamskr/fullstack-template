# Auth Notes

## Better Auth

Better Auth runs inside NestJS at `/api/auth/*` through `@thallesp/nestjs-better-auth`.

Useful smoke check:

```bash
curl http://localhost:3000/api/auth/ok
```

Expected response:

```json
{"ok":true}
```

## Anonymous Login

Anonymous auth is enabled with Better Auth's anonymous plugin.

Useful smoke check:

```bash
curl -X POST http://localhost:3000/api/auth/sign-in/anonymous \
  -H 'Origin: http://localhost:3000'
```

Expected shape:

```json
{"token":"...","user":{"id":"...","isAnonymous":true}}
```

The plugin adds `user.is_anonymous` in Drizzle/PostgreSQL. The template config uses `onLinkAccount` to move timestamp rows from the anonymous user id to the newly linked email/password user id before Better Auth deletes the anonymous user.

Anonymous users can delete themselves with:

```bash
curl -X POST http://localhost:3000/api/auth/delete-anonymous-user \
  -H 'Origin: http://localhost:3000' \
  -H 'Cookie: better-auth.session_token=...'
```

## Route Policy

The Better Auth Nest module global guard is intentionally enabled. App/domain routes require authentication by default.

Use `@AllowAnonymous()` only for deliberate public routes. Current public controllers:

- `AppController` (`/`)
- `HealthController` (`/health`)

Swagger middleware routes (`/api`, `/api-json`) are not controller routes, but keep e2e coverage so OpenAPI remains reachable locally.

## Local Environment

Required env keys are documented in `.env.example`:

- `BETTER_AUTH_SECRET`: 32+ chars. Use `openssl rand -base64 32` for real environments.
- `BETTER_AUTH_URL`: backend base URL, e.g. `http://localhost:3000` locally.
- `BETTER_AUTH_TRUSTED_ORIGINS`: comma-separated origins allowed for auth callbacks/CORS.

Local defaults are intentionally non-production. Do not reuse them in staging or production.

## Schema And Migrations

Better Auth Drizzle schema lives in `src/database/schema/auth.ts` and is exported from `src/database/schema/index.ts`.

When Better Auth config or plugins change:

```bash
pnpm --dir apps/api dlx @better-auth/cli@latest generate --config src/auth/auth.ts --output src/database/schema/auth.ts --yes
pnpm --filter @template/api db:generate
pnpm --filter @template/api db:migrate
```

Use Drizzle migrations for durable schema changes; do not run Better Auth direct migrations against the app database.
