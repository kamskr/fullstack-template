# Template Usage Checklist

Use this when turning the template into a real project.

## Rename Project Identifiers

- Root package: `package.json`
  - `name`
- API package: `apps/api/package.json`
  - `name` currently `@template/api`
- Mobile package: `apps/mobile/package.json`
  - `name` currently `@template/mobile`
- Web package: `apps/web/package.json`
  - `name` currently `@template/web`
- API client package: `packages/api-client/package.json`
  - `name` currently `@template/api-client`
- Root scripts and docs that reference package filters:
  - `package.json`
  - `AGENTS.md`
  - `agents/*.md`
  - `docs/**/*.md`

## Rename Mobile App Metadata

- Expo app config: `apps/mobile/app.json`
  - `expo.name`
  - `expo.slug`
  - `expo.scheme`
- Mobile README/docs if desired:
  - `apps/mobile/README.md`
  - `docs/mobile/architecture.md`

## Rename API Metadata

- OpenAPI metadata: `apps/api/src/openapi.ts`
  - API title
  - description
  - version
- App info response: `apps/api/src/app.service.ts`
  - app name
  - version
- App info OpenAPI example: `apps/api/src/models/app-info.model.ts`
- API package metadata: `apps/api/package.json`

After changing API metadata, regenerate the contract:

```bash
pnpm api-contract:generate
```

## Rename Database Defaults

- API env template: `apps/api/.env.example`
  - `POSTGRES_PORT`
  - `DATABASE_URL`
  - `BETTER_AUTH_URL`
  - `BETTER_AUTH_TRUSTED_ORIGINS`
- API Docker Compose: `apps/api/docker-compose.yml`
  - `POSTGRES_DB`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - volume name, if desired
- API config defaults:
  - `apps/api/src/config/database.config.ts`
  - `apps/api/src/config/env.validation.ts`
  - `apps/api/src/auth/auth.ts`
  - `apps/api/drizzle.config.ts`

If local port `5432` is occupied, use `POSTGRES_PORT=5433` and update `DATABASE_URL` to use `5433`.

## Rename Bruno Workspace

- Workspace metadata: `bruno/workspace.yml`
- Collection metadata: `bruno/collections/template-api/bruno.json`
- Optional collection directory name: `bruno/collections/template-api/`
- Local environment values: `bruno/collections/template-api/environments/Local.bru`

If you rename the collection directory, also update `bruno/workspace.yml` and `agents/bruno.md`.

## Add Project Domain

- Use the existing authenticated `timestamps` feature as the example pattern.
- Add domain schema files under `apps/api/src/database/schema/`.
- Export them from `apps/api/src/database/schema/index.ts`.
- Add API models under `apps/api/src/models/`.
- Add Nest modules/controllers/services under `apps/api/src/`.
- Generate a new migration:

```bash
pnpm --filter @template/api db:generate
```

## Regenerate Contracts

After API changes:

```bash
pnpm api-contract:generate
```

This updates:

- `apps/api/docs/openapi.json`
- `packages/api-client/src/generated/`

## Verify Template Health

```bash
pnpm install
pnpm lint
pnpm build
pnpm test
pnpm api-contract:generate
```
