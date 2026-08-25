---
summary: API architecture principles, the Better Auth baseline, and the timestamps example pattern.
read_when:
  - Changing backend behavior, infrastructure, auth, database, or contract generation.
  - Adding a new domain feature to the API.
---

# Backend architecture

The API app uses NestJS, PostgreSQL, Drizzle ORM, Better Auth, and OpenAPI.

Principles:

- Each feature is a NestJS module.
- Controllers map HTTP to service calls; services hold the logic.
- Drizzle schema and migrations live with the API app.
- Better Auth is part of the template baseline.
- Better Auth includes the Expo plugin so native clients can use SecureStore-backed auth cookies.
- `pnpm api:openapi` boots the Nest app under ts-node and writes `apps/api/docs/openapi.json`. That file is committed and feeds client generation.
- Local development uses Docker-backed PostgreSQL.

The baseline schema contains the Better Auth tables plus a small authenticated `timestamps` example feature. Add project-domain tables per project and generate migrations from the existing template state.

The `timestamps` feature shows the pattern: DB rows are scoped by `user_id`, controllers return API models instead of Drizzle rows, and generated clients consume the OpenAPI response models. When an anonymous Better Auth user signs up with email/password, the anonymous plugin's link hook moves that user's timestamp rows to the new user id.
