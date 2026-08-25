---
summary: Better Auth routes, anonymous login, route policy, env keys, schema regeneration, and body parsing.
read_when:
  - Changing auth config, plugins, or protected/public route policy.
  - Debugging auth cookies, CSRF/origin errors, or request body parsing.
  - Regenerating the Better Auth Drizzle schema.
---

# Backend auth

## Better Auth

Better Auth runs inside NestJS at `/api/auth/*` through `@thallesp/nestjs-better-auth`.

The API also installs `@better-auth/expo` so Expo native clients can persist and replay auth cookies through the Better Auth Expo client plugin.

Smoke check:

```bash
curl http://localhost:3000/api/auth/ok
```

Expected response:

```json
{"ok":true}
```

## Anonymous login

The Better Auth anonymous plugin handles anonymous sign-in.

Smoke check:

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

## Route policy

The Better Auth Nest module's global guard is on. App/domain routes require authentication by default.

Use `@AllowAnonymous()` only for routes that should be public. Current public controllers:

- `AppController` (`/`)
- `HealthController` (`/health`)

Swagger middleware routes (`/api`, `/api-json`) are not controller routes, but keep e2e coverage so OpenAPI stays reachable locally.

## Local environment

`.env.example` lists the required env keys:

- `BETTER_AUTH_SECRET`: 32+ chars. Use `openssl rand -base64 32` for real environments.
- `BETTER_AUTH_URL`: backend base URL, e.g. `http://localhost:3000` locally.
- `BETTER_AUTH_TRUSTED_ORIGINS`: comma-separated origins allowed for auth callbacks/CORS.

The local defaults include the web and Expo dev origins:

```text
http://localhost:3000,http://localhost:3001,templatemobile://,templatemobile://*,exp://,exp://**
```

List origins explicitly for cookie auth. Do not use `*` for browser credentialed requests.

The local defaults are not safe for staging or production. Do not reuse them there.

## Schema and migrations

The Better Auth Drizzle schema lives in `src/database/schema/auth.ts` and is exported from `src/database/schema/index.ts`.

When Better Auth config or plugins change:

```bash
pnpm --dir apps/api dlx @better-auth/cli@latest generate --config src/auth/auth.ts --output src/database/schema/auth.ts --yes
pnpm --filter @template/api db:generate
pnpm --filter @template/api db:migrate
```

Use Drizzle migrations for schema changes; do not run Better Auth's own migrations against the app database.

## Body parsing

Better Auth needs Nest booted with `bodyParser: false` so `/api/auth/*` can handle request bodies itself.

App JSON endpoints still need parsed bodies. Call `setupJsonBodyParsing(app)` from `src/body-parsing.ts` after creating the Nest app and before `app.init()`/`app.listen()`. It skips `/api/auth/*` and applies `express.json()` to the rest of the app.
