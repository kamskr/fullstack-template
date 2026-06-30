# Backend Architecture

The API app uses NestJS, PostgreSQL, Drizzle ORM, Better Auth, and OpenAPI.

Principles:

- NestJS modules define clear app boundaries.
- Controllers stay thin; services own business behavior.
- Drizzle schema and migrations live with the API app.
- Better Auth is part of the template baseline.
- OpenAPI is generated from the running NestJS app and committed for client generation.
- Local development uses Docker-backed PostgreSQL.

Template baseline schema contains Better Auth tables plus a tiny authenticated `timestamps` example feature. Add project-domain tables per project and generate migrations from the existing template state.

The `timestamps` feature demonstrates the backend pattern: DB rows are scoped by `user_id`, controllers return API models instead of Drizzle rows, and generated clients consume OpenAPI response models. When an anonymous Better Auth user links/signs up with email/password, the anonymous plugin transfer hook moves timestamp rows from the anonymous user id to the new user id.
