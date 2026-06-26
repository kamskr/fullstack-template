# Bruno Notes

The Bruno workspace lives in `bruno/`.

Bruno 3 expects `workspace.yml` at the workspace root. The API collection lives under `bruno/collections/baby-app-backend/`.

Use the committed `Local` environment for local development:

- `baseUrl`: `http://localhost:3000`
- `authEmail`: local test email
- `authPassword`: local test password

Use the committed `Staging` environment for the Render staging API:

- `baseUrl`: `https://baby-app-backend-stg.onrender.com`
- `authEmail`: staging test email
- `authPassword`: staging test password

Suggested manual flow:

1. `Auth/OK`
2. `Auth/Sign Up Email`
3. `Auth/Sign In Email`
4. `Auth/Get Session`
5. `Children/List Children`
6. Timestamp requests under `Timestamps/` for CRUD smoke tests. These are public for the POC, so auth is not required for them.

Bruno should keep Better Auth cookies in its cookie jar after sign-up or sign-in. If `Sign Up Email` returns an existing-user error, change `authEmail` in the active environment or use `Sign In Email`.

Better Auth state-changing endpoints require an `Origin` header for CSRF/origin checks. Keep `origin: {{baseUrl}}` on auth POST requests in Bruno.

Whenever adding or changing API endpoints, update the Bruno collection in the same change so the route can be tested manually. Add request bodies, useful headers, and environment variables needed for local smoke testing.

Do not commit personal Bruno environment files or production tokens.
