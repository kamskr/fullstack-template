---
summary: API local development workflow - setup order, daily commands, local URLs, and the timestamps example feature map.
read_when:
  - Setting up or running the API locally.
  - Looking for the right command for database, contract, or test work.
---

# Backend Development

From the repo root:

```bash
pnpm install
pnpm --filter @template/api docker:up
pnpm --filter @template/api db:migrate
pnpm api:dev
```

Docker and migrations are separate from `pnpm dev`. Start local services explicitly before running app dev servers. See `database.md` for the database and migration workflow.

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

Bruno API requests live at the repo root in `bruno/`; see `../shared/bruno.md`.

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
