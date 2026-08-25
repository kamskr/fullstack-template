---
summary: APP_ENV/NODE_ENV split, env file loading order, and the start script matrix.
read_when:
  - Adding or changing environment variables or env files.
  - Choosing the right start script for an environment.
---

# Backend environment

Use two environment variables:

- `APP_ENV`: deployment target, one of `local`, `staging`, or `production`.
- `NODE_ENV`: Node runtime mode, one of `development`, `test`, or `production`.

## File loading

Nest config loads env files from `src/config/env-file-paths.ts`.

Loading order:

- `APP_ENV=local`: `.env.local`, then `.env`
- `APP_ENV=staging`: `.env.staging.local`, then `.env.staging`, then `.env`
- `APP_ENV=production`: `.env.production.local`, then `.env.production`, then `.env`

Earlier files win. Later files only fill in what earlier ones left unset.

## Template

Only one env template is committed:

- `.env.example`

Git ignores the real env files. Keep production and staging secrets in the deployment platform, not in the repository.

## Scripts

```bash
pnpm --filter @template/api start:local
pnpm --filter @template/api start:local:dev
pnpm --filter @template/api start:staging
pnpm --filter @template/api start:staging:dev
pnpm --filter @template/api start:production
pnpm --filter @template/api start:production:dev
```

`start:staging` and `start:production` run `node dist/src/main.js`, so run `pnpm api:build` first (Turbo builds workspace dependencies before the API).

Under `APP_ENV=staging` or `production`, `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` are required and must differ from the local defaults. `src/config/env.validation.ts` refuses to boot a hosted service that would otherwise fall back to the committed development values. `drizzle.config.ts` loads env files through the same `loadEnvFiles()` helper, so `db:migrate` sees the same layering as the app.
