# Web Architecture

TanStack Start app for web clients.

Use TanStack Router and TanStack Query. The web app consumes the same generated API client as mobile from `packages/api-client`.

The baseline web template includes Better Auth screens for email/password login, anonymous login, account creation, and authenticated timestamp CRUD. Timestamp creation uses the current client time; edit screens update the note only. Keep auth calls on Better Auth client methods and keep API data access on generated client functions wrapped by app-local TanStack Query helpers.

The generated API client is configured with `credentials: 'include'` so browser requests carry Better Auth cookies to the API. Override the API URL with `VITE_API_BASE_URL`; local default is `http://localhost:3000`.

Keep web routing and UI implementation separate from mobile.
