# Deployment Notes

Deployment targets are project-specific. Render works well for a simple NestJS API + managed PostgreSQL setup, but the template should stay local-first and provider-neutral.

Suggested staging names:

- Web Service: `<project>-api-staging`
- PostgreSQL: `<project>-db-staging`

## Render Web Service

- Runtime: Node
- Build command from repo root: `pnpm install --frozen-lockfile && pnpm --filter @template/api build`
- Render Free staging start command: `pnpm --filter @template/api db:migrate && pnpm --filter @template/api start:staging`
- Render Free production start command: `pnpm --filter @template/api db:migrate && pnpm --filter @template/api start:production`
- Paid Render preferred setup: pre-deploy command `pnpm --filter @template/api db:migrate`, start command `pnpm --filter @template/api start:staging` for staging or `pnpm --filter @template/api start:production` for production
- Compiled start scripts run `node dist/src/main.js`; Nest currently emits compiled files under `dist/src/`.
- Do not set `PORT`; Render injects it.
- Do not run `corepack enable` on Render. It can fail with `EROFS: read-only file system, unlink '/usr/bin/pnpm'` because Render already provides `pnpm` at a read-only path.
- Optional env var: `NODE_VERSION=22` for LTS Node.
- Runtime imports must be direct `dependencies`, not only transitive dependencies. Example: `src/body-parsing.ts` imports `express`, so `express` must stay in production dependencies even though Nest platform-express also uses it internally.

If deploying only the API app from this monorepo, set the service root directory to `apps/api` or use repo-root commands with pnpm filters.

## Render PostgreSQL

Use the Render Postgres **Internal Database URL** as `DATABASE_URL` for the web service when the database and service are in the same Render region/account.

Required staging env vars:

```text
APP_ENV=staging
NODE_ENV=production
NODE_VERSION=22
DATABASE_URL=<Render Internal Database URL>
BETTER_AUTH_SECRET=<32+ character generated secret>
BETTER_AUTH_URL=https://<render-service>.onrender.com
BETTER_AUTH_TRUSTED_ORIGINS=https://<render-service>.onrender.com
```

Use `APP_ENV=production` only for a separate production web service/database.

Generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32`.

Migrations are Drizzle migrations in `apps/api/drizzle/` and run with `pnpm --filter @template/api db:migrate`.
