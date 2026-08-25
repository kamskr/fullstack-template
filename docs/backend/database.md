---
summary: Local PostgreSQL via Docker Compose, Drizzle workflow, migration baseline, and DB-backed e2e prerequisites.
read_when:
  - Changing database schema or generating migrations.
  - Debugging local PostgreSQL or port conflicts.
  - Running DB-backed e2e tests.
---

# Backend database

## Local PostgreSQL

Local development uses Docker Compose PostgreSQL (`apps/api/docker-compose.yml`, image `postgres:17-alpine`). Start it with:

```bash
pnpm --filter @template/api docker:up
```

Default connection URL:

```text
postgres://app_template:app_template@localhost:5432/app_template
```

The same values appear in `.env.example`, `docker-compose.yml`, and `drizzle.config.ts`.

If Docker reports `Bind for 0.0.0.0:5432 failed: port is already allocated`, another local PostgreSQL already owns the default port. Inspect with:

```bash
docker ps --format 'table {{.Names}}\t{{.Ports}}\t{{.Status}}'
```

Do not stop unrelated containers without user approval. To run this template alongside another local PostgreSQL on `5432`, set these in `apps/api/.env.local`:

```env
POSTGRES_PORT=5433
DATABASE_URL=postgres://app_template:app_template@localhost:5433/app_template
```

## Drizzle

- Config: `drizzle.config.ts`
- Schema entrypoint: `src/database/schema/index.ts`
- Domain tables: split by topic under `src/database/schema/`. `timestamps.ts` is the template example feature.
- Generated migrations: `drizzle/`
- Nest adapter: `src/database/database.service.ts`

Commands:

```bash
pnpm --filter @template/api db:generate
pnpm --filter @template/api db:migrate
pnpm --filter @template/api db:push
pnpm --filter @template/api db:studio
```

Use `db:generate` + `db:migrate` for real schema changes. `db:push` is only for early local prototyping.

## Migrations

This is a template for fresh databases. Do not preserve app-specific historical migration chains.

Baseline migration files:

```text
apps/api/drizzle/0000_initial.sql
apps/api/drizzle/0001_add_timestamps.sql
apps/api/drizzle/meta/
```

The baseline schema contains the Better Auth tables and the small authenticated `timestamps` example feature.

When adding project-specific schema:

1. Add or update files under `apps/api/src/database/schema/`.
2. Export them from `schema/index.ts`.
3. Run `pnpm --filter @template/api db:generate`.
4. Inspect the generated SQL.
5. Run `pnpm --filter @template/api db:migrate` against a fresh local database.

## NestJS integration

Inject `DatabaseService` instead of importing a global client. That keeps it replaceable in tests.

Scope user-owned rows by `user_id`, map Drizzle rows to API models, and generate migrations from the current baseline.

## DB-backed e2e tests

E2E tests expect local PostgreSQL to be running with migrations applied:

```bash
pnpm --filter @template/api docker:up
pnpm --filter @template/api db:migrate
pnpm --filter @template/api test:e2e
```
