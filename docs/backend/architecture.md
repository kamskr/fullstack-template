# Backend Architecture

The API app uses NestJS, PostgreSQL, Drizzle ORM, Better Auth, and OpenAPI.

Principles:

- NestJS modules define clear app boundaries.
- Controllers stay thin; services own business behavior.
- Drizzle schema and migrations live with the API app.
- Better Auth is part of the template baseline.
- OpenAPI is generated from the running NestJS app and committed for client generation.
- Local development uses Docker-backed PostgreSQL.

Template baseline schema contains only Better Auth tables. Add domain tables per project and generate migrations from a clean initial state.
