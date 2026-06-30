# Web App Notes

TanStack Start app.

Local web dev server uses port `3001`. Keep API on `3000` so Bruno and Better Auth defaults hit the Nest app, not the web app.

Before changing routing, data loading, SSR behavior, or Vite config, check TanStack Start and TanStack Router docs for the installed versions.

Keep API access behind the generated OpenAPI client in `packages/api-client`. Keep TanStack Query hooks local to the web app.

Better Auth client lives in `src/lib/auth-client.ts`. Use package methods (`signIn.email`, `signUp.email`, `signIn.anonymous`, `signOut`, `useSession`) instead of hand-rolled auth fetches.

Generated Hey API client config lives in `src/lib/api-client.ts`; it sets `credentials: 'include'` for Better Auth cookies. Timestamp query helpers live in `src/lib/timestamps.ts`.

Forms use React Hook Form. Shared Zod schemas live in `@template/validators`; wire them via submit-time parsing or a resolver when validation UX is added.

Current template routes: `/login`, `/create-account`, `/timestamps`, `/timestamps/$timestampId`.
