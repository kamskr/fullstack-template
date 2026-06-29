# Backend Development

From the repo root:

```bash
pnpm install
pnpm --filter @template/api docker:up
pnpm --filter @template/api db:migrate
pnpm api:dev
```

Docker and migrations are separate from `pnpm dev`. Start local services explicitly before running app dev servers.

Useful commands:

```bash
pnpm --filter @template/api db:generate
pnpm --filter @template/api db:migrate
pnpm --filter @template/api db:studio
pnpm api:openapi
pnpm api-client:generate
pnpm api:test
pnpm api:build
pnpm dev
```

Local docs:

- Swagger UI: `http://localhost:3000/api`
- OpenAPI JSON: `http://localhost:3000/api-json`

Bruno API requests live at the repo root in `bruno/`.

## Example Feature

Authenticated timestamp CRUD is available under `/timestamps`. Use it as the reference for adding a domain feature:

- schema: `src/database/schema/timestamps.ts`
- Nest module: `src/timestamps/`
- API models: `src/models/*timestamp*.ts`
- Bruno requests: `bruno/collections/template-api/Timestamps/`
- generated client: `packages/api-client/src/generated/`

## API Client

Generate OpenAPI and the shared TypeScript API client:

```bash
pnpm api-contract:generate
```

Generated client output lives in `packages/api-client/src/generated/`.

## PostgreSQL Port Conflicts

Docker Compose maps PostgreSQL to host port `5432` by default. If another local database already uses that port, set a different host port in `apps/api/.env.local`:

```env
POSTGRES_PORT=5433
DATABASE_URL=postgres://app_template:app_template@localhost:5433/app_template
```

Then start Docker Compose from the repo root:

```bash
pnpm --filter @template/api docker:up
```
