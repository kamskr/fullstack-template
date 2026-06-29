# Monorepo Notes

Use pnpm workspaces from the repo root.

Workspace packages:

```text
apps/*
packages/*
```

Primary app packages:

- `@template/api`
- `@template/mobile`
- `@template/web`

Use root scripts for common flows and filtered pnpm commands for app-local work:

```bash
pnpm dev
pnpm api:dev
pnpm mobile:dev
pnpm web:dev
pnpm --filter @template/api build
```

`pnpm dev` runs API, mobile, and web dev servers through Turborepo. Turbo uses `ui: "tui"`, so dev logs show in selectable task panes. It does not start Docker, run migrations, or regenerate API contracts.

Default ports: API `3000`, web `3001`. Keep Bruno pointed at API `http://localhost:3000`.

Turborepo is intentionally minimal: orchestration and caching only. Keep app implementation details inside each app.
