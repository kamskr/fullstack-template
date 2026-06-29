# Template API

NestJS API app for the full-stack template.

Stack:

- NestJS
- PostgreSQL
- Drizzle ORM
- Better Auth
- OpenAPI / Swagger

## Setup

From the repo root:

```bash
pnpm install
cp apps/api/.env.example apps/api/.env.local
pnpm --filter @template/api docker:up
pnpm api:dev
```

Then open:

- App info: http://localhost:3000
- Health: http://localhost:3000/health
- Swagger UI: http://localhost:3000/api
- OpenAPI JSON: http://localhost:3000/api-json

The web app uses `http://localhost:3001` during local development so `http://localhost:3000` stays reserved for the API.

## Commands

```bash
pnpm --filter @template/api build
pnpm --filter @template/api test
pnpm --filter @template/api lint
pnpm --filter @template/api db:generate
pnpm --filter @template/api db:migrate
pnpm --filter @template/api db:studio
pnpm api:openapi
```

## Database

The template baseline contains only Better Auth tables. Add project-domain schema under `src/database/schema/`, export it from `src/database/schema/index.ts`, then generate a new Drizzle migration.

Local PostgreSQL defaults:

```text
postgres://app_template:app_template@localhost:5432/app_template
```

If host port `5432` is already occupied, set `POSTGRES_PORT=5433` and update `DATABASE_URL` to use port `5433` in your local env file.

## Auth

Better Auth is mounted at `/api/auth/*`. Email/password and anonymous auth are enabled for template prototyping.

Required env keys are documented in `.env.example`.

## Docs

- Backend architecture: `../../docs/backend/architecture.md`
- Backend development: `../../docs/backend/development.md`
- Migration workflow: `../../docs/backend/migrations.md`
- Agent notes: `agents/`
