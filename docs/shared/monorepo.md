---
summary: pnpm workspace and Turborepo conventions, root scripts, package names, and default ports.
read_when:
  - Adding or renaming workspace packages or root scripts.
  - Changing Turborepo config or dev-server orchestration.
  - Installing dependencies anywhere in the monorepo.
---

# Monorepo

This template uses pnpm workspaces and Turborepo.

```text
apps/api      NestJS API
apps/mobile   Expo app
apps/web      TanStack Start app
packages/*    small shared packages
```

Workspace globs are `apps/*` and `packages/*` (`pnpm-workspace.yaml`). Packages: `@template/api`, `@template/mobile`, `@template/web`, `@template/api-client`, `@template/validators`.

## Package manager

The root `packageManager` field pins pnpm. Always run pnpm from the repo root so installs and scripts see the workspace:

```bash
pnpm install
pnpm --filter @template/api add <package>
```

No app-local lockfiles. The root lockfile is the only package lock.

## Scripts and dev servers

Root scripts orchestrate apps; app-specific scripts stay in app `package.json` files.

```bash
pnpm dev          # all app dev servers through Turborepo
pnpm api:dev
pnpm mobile:dev
pnpm web:dev
pnpm --filter @template/api build   # app-local work
```

`pnpm dev` runs the API Nest watch server, the Expo dev server, and the web Vite/TanStack Start dev server. `turbo.json` sets `ui: "tui"`, so dev output opens in selectable task log panes, and the root `dev` script passes `--continue` so one failed dev task does not stop the others.

Docker, migrations, and contract generation are separate steps. `pnpm dev` never runs them.

Default local URLs: API `http://localhost:3000`, web `http://localhost:3001`. Keep Bruno pointed at the API on `3000`.

Turborepo does orchestration and caching, nothing else. Keep app code inside each app and shared packages small. Share the generated API contract, not runtime code.
