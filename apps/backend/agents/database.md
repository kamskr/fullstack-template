# Database Notes

## Local PostgreSQL

Local development uses Docker Compose PostgreSQL. Start it with:

```bash
pnpm run docker:up
```

Default connection URL:

```text
postgres://baby_app:baby_app@localhost:5432/baby_app
```

These values are mirrored in `.env.example`, `docker-compose.yml`, and `drizzle.config.ts`.

## Drizzle

- Config: `drizzle.config.ts`
- Schema entrypoint: `src/database/schema/index.ts`
- Domain tables: split by topic under `src/database/schema/` such as `children.ts` and `timestamps.ts`
- Generated migrations: `drizzle/`
- Nest adapter: `src/database/database.service.ts`

Useful commands:

```bash
pnpm run db:generate
pnpm run db:migrate
pnpm run db:push
pnpm run db:studio
```

Use `db:generate` + `db:migrate` for durable schema changes. `db:push` is only for early local prototyping.

DB-backed e2e tests expect local PostgreSQL to be running and migrations to be applied:

```bash
pnpm run docker:up
pnpm run db:migrate
pnpm run test:e2e
```

## NestJS Integration

Use `DatabaseService` through dependency injection instead of importing a global client. This keeps tests and future app modules aligned with Nest conventions.

The first app-domain table is `children`; `GET /children` maps Drizzle rows to `ChildModel` before returning them.

`timestamps` is a global POC table, intentionally without `user_id` or `child_id` for now. The `/timestamps` CRUD API is public for unauthenticated POC access.
