# Baby App Backend

NestJS backend for the Baby App native mobile clients.

This service is the API boundary for the Swift iOS app, future Android app, and any future web clients. The backend follows the stack and constraints documented in `ARCHITECTURE.md`.

## Architecture Direction

- Framework: NestJS
- API contract: OpenAPI / Swagger generated from the running NestJS app
- Database: PostgreSQL
- ORM: Drizzle ORM
- Auth: Better Auth inside the NestJS backend
- Local infrastructure: Docker Compose for PostgreSQL and future dependencies
- Production targets: Render Web Service for the API, Render PostgreSQL for managed PostgreSQL

Production cloud services must not be required for normal local development. The app should run locally with Node.js plus Docker-backed dependencies.

## Local Development Model

```text
Swift iOS App / API Client
        ↓
Local NestJS API on host machine
        ↓
Dockerized PostgreSQL
```

Local development rules:

- Run NestJS directly on the developer machine.
- Run backend dependencies in Docker Compose.
- Keep PostgreSQL local via Docker for development and tests.
- Generate OpenAPI locally from the running NestJS app.
- Do not require Render, Cloudflare, Upstash, Sentry, or other cloud services for feature work.
- Any future infrastructure dependency needs a local Docker equivalent, documented emulator/mock, or adapter boundary.

## Project Setup

```bash
pnpm install
cp .env.example .env
```

The default `.env.example` values target the local PostgreSQL container from `docker-compose.yml`.

## Run Locally

```bash
pnpm install
cp .env.example .env.local
pnpm run docker:up
pnpm run start:local:dev
```

Then open:

```bash
curl http://localhost:3000
```

Expected response:

```json
{
  "name": "baby_app_backend",
  "version": "0.0.1",
  "status": "ok",
  "appEnv": "local",
  "nodeEnv": "development",
  "timestamp": "2026-06-17T00:00:00.000Z"
}
```

If port `3000` is already in use, change `PORT` in `.env.local`.

Local API docs:

- Swagger UI: http://localhost:3000/api
- OpenAPI JSON: http://localhost:3000/api-json

Current app endpoints include authenticated `/children` routes and public `/timestamps` routes. The `timestamps` resource is a global POC table for now; it is not scoped to a user or child yet.

Local Bruno workspace:

- Open `bruno/` in Bruno with **Open workspace**.
- Select the `Local` environment for local development or `Staging` for the deployed Render staging API.
- Run `Auth/OK`, then `Auth/Sign In Anonymous`, `Auth/Sign Up Email`, or `Auth/Sign In Email`.
- Bruno should keep Better Auth cookies for authenticated requests such as `Children/List Children`.
- If the seeded local email already exists, change `authEmail` in the Bruno `Local` environment or sign in instead.
- If the seeded staging email already exists, change `authEmail` in the Bruno `Staging` environment or sign in instead.
- Auth POST requests include `Origin: {{baseUrl}}` because Better Auth requires an origin header for CSRF protection.

## Environments

Use `APP_ENV` for deployment target selection and `NODE_ENV` for runtime mode.

Supported `APP_ENV` values:

- `local`
- `staging`
- `production`

Config files are loaded in this order:

- `APP_ENV=local`: `.env.local`, then `.env`
- `APP_ENV=staging`: `.env.staging.local`, then `.env.staging`, then `.env`
- `APP_ENV=production`: `.env.production.local`, then `.env.production`, then `.env`

Only one env template is committed:

- `.env.example`

Do not commit real `.env`, `.env.local`, `.env.staging`, `.env.staging.local`, `.env.production`, or `.env.production.local` files.

## Local Services

Start Docker-backed dependencies:

```bash
pnpm run docker:up
```

Stop them:

```bash
pnpm run docker:down
```

Local PostgreSQL defaults:

- Host port: `5432`
- Database: `baby_app`
- User: `baby_app`
- Password: `baby_app`
- URL: `postgres://baby_app:baby_app@localhost:5432/baby_app`

## Authentication

Better Auth is mounted inside NestJS at `/api/auth/*`.

Smoke check:

```bash
curl http://localhost:3000/api/auth/ok
```

Expected response:

```json
{"ok":true}
```

Auth environment variables:

- `BETTER_AUTH_SECRET`: 32+ character secret. Generate real secrets with `openssl rand -base64 32`.
- `BETTER_AUTH_URL`: backend base URL, for example `http://localhost:3000` locally.
- `BETTER_AUTH_TRUSTED_ORIGINS`: comma-separated trusted origins for auth callbacks/CORS.

The Better Auth Nest global guard is enabled. App routes require authentication by default. Public controllers must opt out explicitly with `@AllowAnonymous()`.

Anonymous auth is enabled through Better Auth's anonymous plugin:

```bash
curl -X POST http://localhost:3000/api/auth/sign-in/anonymous \
  -H 'Origin: http://localhost:3000'
```

The response includes a session token and a user with `isAnonymous: true`. Anonymous users can later link to email/OAuth accounts through Better Auth's normal sign-in/sign-up flows. By default, Better Auth deletes the old anonymous user after linking.

Better Auth schema is managed through Drizzle in `src/database/schema/auth.ts`. Regenerate schema and migrations after auth config/plugin changes:

```bash
pnpm dlx @better-auth/cli@latest generate --config src/auth/auth.ts --output src/database/schema/auth.ts --yes
pnpm run db:generate
pnpm run db:migrate
```

## Run The App

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

Environment-specific scripts:

```bash
# local
pnpm run start:local
pnpm run start:local:dev

# staging
pnpm run start:staging
pnpm run start:staging:dev

# production
pnpm run start:production
pnpm run start:production:dev
```

`start:staging` and `start:production` run the compiled app, so run `pnpm run build` first.

## Tests And Checks

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# coverage
pnpm run test:cov

# lint and auto-fix
pnpm run lint

# format
pnpm run format
```

## Database

Drizzle is configured in `drizzle.config.ts` and reads `DATABASE_URL` from `.env`, falling back to the local Docker PostgreSQL URL.

```bash
# generate migrations from Drizzle schema changes
pnpm run db:generate

# run migrations
pnpm run db:migrate

# push schema directly during early local prototyping
pnpm run db:push

# open Drizzle Studio
pnpm run db:studio
```

Database schema definitions live under `src/database/schema/`. Use `src/database/schema/index.ts` as the schema barrel and split domain tables into focused files such as `children.ts`. The Nest database adapter lives in `src/database/` and exposes `DatabaseService` for dependency injection.

## Deploy To Render

Use Render for both the NestJS API and managed PostgreSQL. Local development stays Docker-backed and does not require Render credentials.

Create separate Render resources per environment. For the first staging deploy, use names like:

- Web Service: `baby-app-backend-staging`
- PostgreSQL: `baby-app-db-staging`

### 1. Create the PostgreSQL database

1. Open Render Dashboard.
2. Click **New +** -> **PostgreSQL**.
3. Name it `baby-app-db-staging` for staging or `baby-app-db-production` for production.
4. Pick the same region you will use for the web service.
5. Create the database.
6. Copy the **Internal Database URL**. Use this as `DATABASE_URL` for the Render web service.

### 2. Create the Web Service

1. Click **New +** -> **Web Service**.
2. Connect the GitHub repository.
3. Select the branch you want to deploy.
4. If the repository root is the monorepo root, set **Root Directory** to `baby_app_backend`. If the repository root is already this backend folder, leave it empty.
5. Set **Runtime** to `Node`.
6. Set **Build Command**:

```bash
pnpm install --frozen-lockfile && pnpm run build
```

Do not run `corepack enable` on Render. Render already provides `pnpm`, and `corepack enable` can fail with a read-only filesystem error while trying to replace `/usr/bin/pnpm`.

7. Render Free does not support **Pre-Deploy Command**. Run migrations in the start command instead. On paid Render plans, prefer a separate **Pre-Deploy Command**:

```bash
pnpm run db:migrate
```

8. Set **Start Command** for Render Free staging:

```bash
pnpm run db:migrate && pnpm run start:staging
```

For production, use:

```bash
pnpm run db:migrate && pnpm run start:production
```

Both compiled start scripts use `node dist/src/main.js`.

On paid Render plans with **Pre-Deploy Command** configured, use this staging start command instead:

```bash
pnpm run start:staging
```

For production paid deploys, use:

```bash
pnpm run start:production
```

9. Optional but recommended: set Node version to an LTS release with the `NODE_VERSION` environment variable:

```text
NODE_VERSION=22
```

10. Set **Health Check Path** to `/`.

If changing build/start commands after a failed deploy, use **Manual Deploy** -> **Clear build cache & deploy**.

### 3. Set Render environment variables

Set these on the Render web service:

```text
APP_ENV=staging
NODE_ENV=production
NODE_VERSION=22
DATABASE_URL=<Render Internal Database URL>
BETTER_AUTH_SECRET=<32+ character generated secret>
BETTER_AUTH_URL=https://<your-render-service>.onrender.com
BETTER_AUTH_TRUSTED_ORIGINS=https://<your-render-service>.onrender.com
```

For production, use `APP_ENV=production` with a separate production database and production web service.

Generate the auth secret locally:

```bash
openssl rand -base64 32
```

Do not set `PORT` manually on Render. Render provides it automatically.

### 4. Deploy and smoke-check

After the first deploy finishes, check:

```bash
curl https://<your-render-service>.onrender.com/
curl https://<your-render-service>.onrender.com/api/auth/ok
curl https://<your-render-service>.onrender.com/api-json
```

Expected results:

- `/` returns app info with `status: "ok"`.
- `/api/auth/ok` returns `{"ok":true}`.
- `/api-json` returns the OpenAPI document.

### 5. Future releases

On Render Free, migrations run from the start command before starting the app. This is acceptable for staging/free because there is only one instance. On paid Render plans, move migrations to **Pre-Deploy Command** and change the start command back to `pnpm run start:staging` for staging or `pnpm run start:production` for production.

Keep migrations committed under `drizzle/`.

### Troubleshooting

If Render fails with this error:

```text
Internal Error: EROFS: read-only file system, unlink '/usr/bin/pnpm'
```

remove `corepack enable` from the build command, then use **Manual Deploy** -> **Clear build cache & deploy**.

If `pnpm` is missing, use npm to activate it without modifying `/usr/bin`:

```bash
npm install -g pnpm@10.34.3 && pnpm install --frozen-lockfile && pnpm run build
```

## API Contract

OpenAPI is generated from the running NestJS app with `@nestjs/swagger`.

- Swagger UI route: `/api`
- OpenAPI JSON route: `/api-json`
- Setup helper: `src/openapi.ts`
- Checked-in schema: `docs/openapi.json`

Keep request/response model classes in `src/models/` decorated enough for generated mobile clients. Prefer model classes over inline object types for request/response bodies.

Regenerate the checked-in schema after adding or changing endpoints, models, auth responses, or error responses:

```bash
pnpm run openapi:generate
```

## Project Notes

- `ARCHITECTURE.md` is the source of truth for stack decisions and infrastructure constraints.
- `agents/` contains backend-specific implementation notes, workflows, and decisions discovered while building this service.
- Start with `agents/README.md` for agent-facing notes.
- `llms/` contains package-specific LLM docs when available; check it before package-specific implementation work.
- `docs/` is intentionally left available for product/API docs, including future Swagger/OpenAPI documentation if needed.
- Update `README.md` when setup, commands, environment variables, or development workflow changes.

## License

UNLICENSED
