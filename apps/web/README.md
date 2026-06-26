# Template Web

TanStack Start web app for the full-stack template.

## Commands

From the repo root:

```bash
pnpm web:dev
pnpm --filter @template/web build
pnpm --filter @template/web test
pnpm --filter @template/web lint
```

## Architecture

- Routing: TanStack Router / TanStack Start file routing.
- Server state: TanStack Query.
- API access: generated OpenAPI client once `packages/api-client` exists.

See `../../docs/web/architecture.md` for durable web notes.
