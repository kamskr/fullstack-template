# Web App Notes

TanStack Start app.

Local web dev server uses port `3001`. Keep API on `3000` so Bruno and Better Auth defaults hit the Nest app, not the web app.

Before changing routing, data loading, SSR behavior, or Vite config, check TanStack Start and TanStack Router docs for the installed versions.

Keep API access behind the generated OpenAPI client in `packages/api-client`. Keep TanStack Query hooks local to the web app.
