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

Local web URL:

```text
http://localhost:3001
```

## Architecture

- Routing: TanStack Router / TanStack Start file routing.
- Auth: Better Auth React client pointed at the Nest API on `http://localhost:3000`.
- Server state: TanStack Query app-local hooks/helpers.
- API access: generated OpenAPI client from `@template/api-client`.

Template screens:

- `/login`: email/password login plus anonymous login.
- `/create-account`: email/password signup. If the current session is anonymous, Better Auth links the account and the API transfers timestamps to the new user.
- `/timestamps`: authenticated timestamp list, create with current time, delete.
- `/timestamps/$timestampId`: authenticated timestamp details, edit note, delete.

Set `VITE_API_BASE_URL` to override the API URL. Default: `http://localhost:3000`.

See `../../docs/web/architecture.md` for durable web notes.
