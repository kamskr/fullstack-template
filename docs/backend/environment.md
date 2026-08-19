---
summary: APP_ENV/NODE_ENV split, env file loading order, and the start script matrix.
read_when:
  - Adding or changing environment variables or env files.
  - Choosing the right start script for an environment.
---

# Backend Environment

Use two environment variables:

- `APP_ENV`: deployment target: `local`, `staging`, or `production`.
- `NODE_ENV`: Node/runtime mode: `development`, `test`, or `production`.

## File Loading

Nest config loads env files from `src/config/env-file-paths.ts`.

Loading order:

- `APP_ENV=local`: `.env.local`, then `.env`
- `APP_ENV=staging`: `.env.staging.local`, then `.env.staging`, then `.env`
- `APP_ENV=production`: `.env.production.local`, then `.env.production`, then `.env`

Later files in the list are fallbacks. Earlier files win.

## Template

Only one env template is committed:

- `.env.example`

Real env files are ignored by Git. Keep production and staging secrets in the deployment platform, not in the repository.

## Scripts

```bash
pnpm --filter @template/api start:local
pnpm --filter @template/api start:local:dev
pnpm --filter @template/api start:staging
pnpm --filter @template/api start:staging:dev
pnpm --filter @template/api start:production
pnpm --filter @template/api start:production:dev
```

`start:staging` and `start:production` use `node dist/src/main.js`; run `pnpm api:build` (Turbo, builds workspace dependencies first) beforehand.

Under `APP_ENV=staging` or `production`, `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` are required and must differ from the local defaults; the schema in `src/config/env.validation.ts` rejects a hosted boot that would silently fall back to the committed development values. `drizzle.config.ts` loads env files through the same `loadEnvFiles()` helper, so `db:migrate` sees the same layering as the app.
