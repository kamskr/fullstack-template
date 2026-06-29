# Monorepo

This template uses pnpm workspaces and Turborepo.

```text
apps/api      NestJS API
apps/mobile   Expo app
apps/web      TanStack Start app
packages/*    small, intentional shared packages
```

Root scripts orchestrate apps. App-specific scripts stay in app `package.json` files.

Run all app dev servers:

```bash
pnpm dev
```

`pnpm dev` runs app `dev` scripts through Turborepo:

- API Nest watch server.
- Mobile Expo dev server.
- Web TanStack Start/Vite dev server.

Default local URLs:

- API: `http://localhost:3000`
- Web: `http://localhost:3001`

Turbo is configured with `ui: "tui"`, so dev output opens in Turbo's terminal UI with selectable task log panes. The root `dev` script also uses `--continue` so one failed dev task does not immediately stop the others.

Docker, migrations, and contract generation are separate explicit steps.

Keep shared packages small. Prefer generated API contracts over shared runtime implementation.
