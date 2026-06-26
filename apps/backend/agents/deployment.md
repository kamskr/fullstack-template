# Deployment Notes

Production/staging currently use Render for both the NestJS API and PostgreSQL. Keep separate Render resources per environment.

Suggested staging names:

- Web Service: `baby-app-backend-staging`
- PostgreSQL: `baby-app-db-staging`

## Render Web Service

- Runtime: Node
- Build command: `pnpm install --frozen-lockfile && pnpm run build`
- Render Free staging start command: `pnpm run db:migrate && pnpm run start:staging`
- Render Free production start command: `pnpm run db:migrate && pnpm run start:production`
- Paid Render preferred setup: pre-deploy command `pnpm run db:migrate`, start command `pnpm run start:staging` for staging or `pnpm run start:production` for production
- Compiled start scripts run `node dist/src/main.js`; Nest currently emits compiled files under `dist/src/`.
- Do not set `PORT`; Render injects it.
- Do not run `corepack enable` on Render. It can fail with `EROFS: read-only file system, unlink '/usr/bin/pnpm'` because Render already provides `pnpm` at a read-only path.
- Optional env var: `NODE_VERSION=22` for LTS Node.
- Runtime imports must be direct `dependencies`, not only transitive dependencies. Example: `src/body-parsing.ts` imports `express`, so `express` must stay in production dependencies even though Nest platform-express also uses it internally.

If this backend lives inside a monorepo, set Render's root directory to `baby_app_backend`. If the backend folder is the repository root, leave root directory empty.

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

Migrations are Drizzle migrations in `drizzle/` and run with `pnpm run db:migrate`.
