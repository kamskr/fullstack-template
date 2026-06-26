# Backend Setup Plan

## Goal

Set up a local-first backend where NestJS runs on the host machine and all backend infrastructure dependencies run locally through Docker.

Cloud services are deployment targets only. Normal backend development must work without Render, Cloudflare, Upstash, Sentry, or other production credentials.

---

## Target Structure

```text
baby_app/
  ARCHITECTURE.md
  PLAN.md
  backend/
    src/
    drizzle/
    test/
    docker-compose.yml
    .env.example
    drizzle.config.ts
    package.json
```

---

## Recommended Stack

```text
Runtime:
- Node.js on host machine
- NestJS API

Local infrastructure:
- PostgreSQL in Docker Compose

Database:
- Drizzle ORM
- Drizzle Kit migrations

Auth:
- Better Auth
- Email/password locally
- Sign in with Apple later, not required for local backend development

API contract:
- NestJS Swagger / OpenAPI
```

---

## Setup Steps

### 1. Create NestJS Project

```bash
nest new backend
```

Recommended choices:

```text
Package manager: pnpm
Nest platform: default Express
```

---

### 2. Add Dependencies

```bash
cd backend

pnpm add @nestjs/config @nestjs/swagger swagger-ui-express
pnpm add drizzle-orm postgres
pnpm add better-auth
pnpm add zod
pnpm add -D drizzle-kit
```

Optional hardening dependencies:

```bash
pnpm add @nestjs/throttler
pnpm add helmet
```

---

### 3. Add Local PostgreSQL

Create `backend/docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:17
    container_name: baby_app_postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: baby_app
      POSTGRES_PASSWORD: baby_app
      POSTGRES_DB: baby_app_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start local infrastructure:

```bash
docker compose up -d
```

---

### 4. Add Environment Config

Create `backend/.env.example`:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=postgres://baby_app:baby_app@localhost:5432/baby_app_dev

APP_BASE_URL=http://localhost:3000
AUTH_SECRET=replace-with-local-dev-secret
```

Local setup:

```bash
cp .env.example .env
```

---

### 5. Add Drizzle Config

Create `backend/drizzle.config.ts`:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Add scripts to `backend/package.json`:

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
}
```

---

### 6. Add Database Module

Create:

```text
src/db/
  db.module.ts
  db.provider.ts
  schema.ts
```

Use:

```text
- postgres driver
- drizzle-orm/postgres-js
```

---

### 7. Add Better Auth

Create:

```text
src/auth/
  auth.ts
  auth.module.ts
  auth.controller.ts
```

Initial local auth requirements:

```text
- Email/password auth works locally
- Sessions stored in local PostgreSQL
- Better Auth uses the same local database as the app
```

Important rule:

```text
Sign in with Apple must not be required to run or test the backend locally.
```

---

### 8. Add OpenAPI / Swagger

In `src/main.ts`:

```text
- enable validation pipe
- generate Swagger document
- serve docs at /docs
- serve OpenAPI JSON locally
```

Useful local endpoints:

```text
GET /health
GET /docs
GET /docs-json
```

---

### 9. Add Health Endpoint

Create a small health module:

```text
GET /health -> { status: "ok" }
```

This is the first endpoint the iOS app should call locally.

---

## Daily Local Backend Flow

```bash
cd backend
docker compose up -d
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm start:dev
```

Verify:

```bash
curl http://localhost:3000/health
open http://localhost:3000/docs
```

---

## iOS Local Connection

For iOS simulator:

```text
API base URL: http://localhost:3000
```

For real device:

```text
API base URL: http://<your-mac-lan-ip>:3000
```

When testing on a real device, NestJS should listen on:

```text
0.0.0.0
```

---

## Implementation Milestones

Build in this order:

```text
1. NestJS project boots
2. Docker PostgreSQL starts
3. Drizzle connects
4. /health works
5. Swagger works
6. First DB-backed endpoint works
7. Better Auth email/password works locally
8. OpenAPI JSON is generated locally
9. iOS app calls /health
```

---

## Local Parity Rule

Every backend infrastructure dependency must have one of:

1. A local Docker-based equivalent.
2. A documented local emulator or mock.
3. An adapter boundary that allows the backend to run without the cloud service.

Production infrastructure must not be required for normal feature development, testing, or API contract generation.
