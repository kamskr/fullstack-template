# Backend Migrations

This is a template for fresh databases. Do not preserve app-specific historical migration chains.

Baseline migration target:

```text
apps/api/drizzle/0000_initial.sql
apps/api/drizzle/0001_add_timestamps.sql
apps/api/drizzle/meta/0000_snapshot.json
apps/api/drizzle/meta/_journal.json
```

The baseline schema contains Better Auth tables and the tiny authenticated `timestamps` example feature.

When adding project-specific schema:

1. Add or update files under `apps/api/src/database/schema/`.
2. Export them from `schema/index.ts`.
3. Run `pnpm --filter @template/api db:generate`.
4. Inspect generated SQL.
5. Run `pnpm --filter @template/api db:migrate` against a fresh local database.
