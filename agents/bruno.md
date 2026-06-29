# Bruno Notes

The Bruno workspace lives at the repo root in `bruno/`.

Bruno 3 expects `workspace.yml` at the workspace root. The API collection lives under `bruno/collections/template-api/`.

Use the committed `Local` environment for local development:

- `baseUrl`: `http://localhost:3000`
- `authEmail`: local test email
- `authPassword`: local test password

Keep `baseUrl` pointed at the API on port `3000`. The web dev server uses port `3001`.

Suggested manual flow:

1. `Auth/OK`
2. `Auth/Sign Up Email`
3. `Auth/Sign In Email`
4. `Auth/Get Session`
5. `Timestamps/Create Timestamp`
6. Copy the returned `id` into `timestampId` in the active environment.
7. `Timestamps/List Timestamps`
8. `Timestamps/Get Timestamp`
9. `Timestamps/Update Timestamp`
10. `Timestamps/Delete Timestamp`
11. `Health`
12. `OpenAPI/OpenAPI JSON`

Bruno should keep Better Auth cookies in its cookie jar after sign-up or sign-in. If `Sign Up Email` returns an existing-user error, change `authEmail` in the active environment or use `Sign In Email`.

Better Auth state-changing endpoints require an `Origin` header for CSRF/origin checks. Keep `origin: {{baseUrl}}` on auth POST requests in Bruno.

Whenever adding or changing API endpoints, update the Bruno collection in the same change so the route can be tested manually. Add request bodies, useful headers, and environment variables needed for local smoke testing.

Do not commit personal Bruno environment files or production tokens.
