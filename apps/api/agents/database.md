# Database Notes

## Local PostgreSQL

Local development uses Docker Compose PostgreSQL. Start it with:

```bash
pnpm --filter @template/api docker:up
```

If Docker reports `Bind for 0.0.0.0:5432 failed: port is already allocated`, another local PostgreSQL container is already using the default port. Inspect with:

```bash
docker ps --format 'table {{.Names}}\t{{.Ports}}\t{{.Status}}'
```

Do not stop unrelated containers without user approval.

To run this template alongside another local PostgreSQL on `5432`, set these in `apps/api/.env.local`:

```env
POSTGRES_PORT=5433
DATABASE_URL=postgres://app_template:app_template@localhost:5433/app_template
```

Default connection URL:

```text
postgres://app_template:app_template@localhost:5432/app_template
```

These values are mirrored in `.env.example`, `docker-compose.yml`, and `drizzle.config.ts`.

## Drizzle

- Config: `drizzle.config.ts`
- Schema entrypoint: `src/database/schema/index.ts`
- Domain tables: split by topic under `src/database/schema/`. `timestamps.ts` is the template example feature.
- Generated migrations: `drizzle/`
- Nest adapter: `src/database/database.service.ts`

Useful commands:

```bash
pnpm --filter @template/api db:generate
pnpm --filter @template/api db:migrate
pnpm --filter @template/api db:push
pnpm --filter @template/api db:studio
```

Use `db:generate` + `db:migrate` for durable schema changes. `db:push` is only for early local prototyping.

DB-backed e2e tests expect local PostgreSQL to be running and migrations to be applied:

```bash
pnpm --filter @template/api docker:up
pnpm --filter @template/api db:migrate
pnpm --filter @template/api test:e2e
```

## NestJS Integration

Use `DatabaseService` through dependency injection instead of importing a global client. This keeps tests and future app modules aligned with Nest conventions.

The template baseline contains Better Auth tables and a tiny authenticated `timestamps` example. Add app-domain tables per project, scope user-owned rows by `user_id`, map Drizzle rows to API models, and generate migrations from the current baseline.
