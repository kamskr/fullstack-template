---
summary: Provider-neutral deployment assumptions with a concrete Render Web Service + PostgreSQL runbook.
read_when:
  - Deploying the API to staging or production.
  - Changing build/start commands, runtime dependencies, or deployment env vars.
---

# Backend deployment

Deployment targets are project-specific. This doc uses Render as the worked example because a NestJS API plus managed PostgreSQL fits it with little setup. The template itself assumes no provider and stays local-first.

Suggested staging names:

- Web Service: `<project>-api-staging`
- PostgreSQL: `<project>-db-staging`

## Render web service

- Runtime: Node
- Build command from repo root: `pnpm install --frozen-lockfile && pnpm turbo build --filter @template/api`. Use Turbo, not a bare pnpm filter. The API imports `@template/validators`, whose `dist/` is gitignored, so on a clean checkout only the Turbo task (`dependsOn: ["^build"]`) builds that package first. `pnpm --filter @template/api build` fails during `nest build`.
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

Use the Render Postgres "Internal Database URL" as `DATABASE_URL` for the web service when the database and service are in the same Render region and account.

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

Use `APP_ENV=production` only for a separate production web service and database.

Generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32`.

Migrations are Drizzle migrations in `apps/api/drizzle/` and run with `pnpm --filter @template/api db:migrate`.
