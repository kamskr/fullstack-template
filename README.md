# Full-stack Template

Reusable full-stack template with one API, one generated API client, and separate web/mobile apps.

## Stack

- API: NestJS, PostgreSQL, Drizzle, Better Auth, OpenAPI.
- Mobile: Expo / React Native.
- Web: TanStack Start.
- Contract: OpenAPI generated from the API, TypeScript client generated with Hey API.
- Monorepo: pnpm workspaces and Turborepo.

## Repo Map

```text
apps/api              NestJS API
apps/mobile           Expo app
apps/web              TanStack Start app
packages/api-client   generated TypeScript API client
bruno/                API request workspace
docs/                 architecture and workflow docs
agents/               notes for future agents
```

## First Setup

```bash
pnpm install
cp apps/api/.env.example apps/api/.env.local
pnpm --filter @template/api docker:up
pnpm --filter @template/api db:migrate
pnpm api-contract:generate
```

Docker and migrations are separate from the dev command. Start local services before running the apps.

If host port `5432` is already occupied, set these in `apps/api/.env.local` before starting Docker:

```env
POSTGRES_PORT=5433
DATABASE_URL=postgres://app_template:app_template@localhost:5433/app_template
```

## Daily Development

Run all app dev servers:

```bash
pnpm dev
```

This runs app `dev` scripts through Turborepo:

- API: Nest watch server.
- Mobile: Expo dev server.
- Web: Vite/TanStack Start dev server.

It does not run Docker, migrations, or contract generation.

Run individual apps:

```bash
pnpm api:dev
pnpm mobile:dev
pnpm web:dev
```

## API Contract

Regenerate OpenAPI and the shared TypeScript client:

```bash
pnpm api-contract:generate
```

Outputs:

- `apps/api/docs/openapi.json`
- `packages/api-client/src/generated/`

Keep TanStack Query hooks app-local in `apps/web` and `apps/mobile`.

## Checks

```bash
pnpm lint
pnpm build
pnpm test
```

API e2e checks need local PostgreSQL and migrations:

```bash
pnpm --filter @template/api docker:up
pnpm --filter @template/api db:migrate
pnpm --filter @template/api test:e2e
```

## Creating A Project From This Template

Use the checklist:

```text
docs/shared/template-checklist.md
```

It lists every place to rename package names, Expo metadata, API metadata, database defaults, and Bruno workspace names.

## Useful Docs

- Docs index: `docs/README.md`
- Monorepo notes: `docs/shared/monorepo.md`
- API contract: `docs/shared/api-contract.md`
- Backend development: `docs/backend/development.md`
- Agent instructions: `AGENTS.md`
