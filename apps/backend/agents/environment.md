# Environment Notes

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
pnpm run start:local
pnpm run start:local:dev
pnpm run start:staging
pnpm run start:staging:dev
pnpm run start:production
pnpm run start:production:dev
```

`start:staging` and `start:production` use `node dist/src/main.js`; run `pnpm run build` first.
