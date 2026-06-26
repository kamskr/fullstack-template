# AGENTS.md

## Mission

Build the Baby App backend as an idiomatic NestJS service that matches `ARCHITECTURE.md`.

Optimize for local-first development, strong type safety, clear API contracts, and easy onboarding for future agents and developers.

## Architecture Source Of Truth

- Read `ARCHITECTURE.md` before changing behavior, infrastructure, auth, database, API contract generation, deployment, or local setup.
- Keep this backend runnable locally with Node.js plus Docker-backed dependencies.
- Do not introduce a production cloud dependency into normal development or tests.
- Production services are deployment targets, not development requirements.

## NestJS Guidance

- Use idiomatic NestJS modules, controllers, providers, dependency injection, pipes, guards, interceptors, filters, and testing utilities.
- Before doing package-specific work, check `llms/` for an available package LLM doc, then use official docs if the local LLM doc is missing or insufficient.
- For complex or unfamiliar NestJS work, check the official docs first: https://docs.nestjs.com.
- For OpenAPI work, check the NestJS OpenAPI docs: https://docs.nestjs.com/openapi/introduction.
- For persistence patterns, check the NestJS database techniques docs and adapt them to Drizzle/PostgreSQL.
- Prefer framework conventions over custom bootstrapping, global state, or manual dependency wiring.

## Backend Stack Direction

- NestJS for the API service.
- OpenAPI / Swagger generated from the running NestJS app.
- PostgreSQL as the primary database.
- Drizzle ORM for schema, queries, and migrations.
- Better Auth for authentication inside the NestJS backend.
- Docker Compose for local dependencies.
- Render Web Service and Render PostgreSQL are the current staging/production targets.

## Local-First Rule

Every new infrastructure dependency must have one of:

- A local Docker-based equivalent.
- A documented local emulator or mock.
- An adapter boundary that lets the backend run without the cloud service.

If adding storage, queues, analytics, feature flags, monitoring, email, or external APIs, document how local development works without production credentials.

## Agent Notes Duties

- Add relevant notes to `agents/` whenever you learn something that would save the next agent time.
- If you spent meaningful time discovering a convention, command, setup issue, framework pattern, or gotcha, document it in `agents/` before handoff.
- Update `README.md` when setup, commands, environment variables, local services, testing, OpenAPI generation, or workflow changes.
- Prefer short, agent-friendly docs with clear filenames and practical examples.
- If `agents/` has an index, update it when adding a new note.
- Add package LLM docs to `llms/` when available, named `<package>-llms.txt`, and prefer linking/listing them from `llms/README.md`.
- Keep `docs/` available for product/API documentation such as generated Swagger/OpenAPI docs if we add it later.

Good candidates for `agents/`:

- Local development setup beyond simple `pnpm install`.
- Docker Compose service notes.
- Database migration workflow.
- OpenAPI generation workflow.
- Better Auth integration decisions.
- Testing strategy and useful commands.
- Deployment assumptions.
- Framework gotchas discovered from NestJS docs.

## Coding Standards

- Keep changes small and idiomatic.
- Add tests for behavior changes when practical.
- Preserve strong TypeScript types; avoid `any` unless justified.
- Keep controllers thin; put business logic in providers/services.
- Keep module boundaries explicit.
- Prefer dependency injection over importing concrete singletons.
- Validate request input at the boundary.
- For every new or changed API endpoint, keep OpenAPI client generation in mind: use request/response model classes from `src/models/`, decorate model fields, add Swagger route responses, and avoid returning database/internal rows directly.
- Keep API models compatible with OpenAPI generation for iOS, Android, and future web clients.

## Verification

Before handoff, run the narrowest useful checks for your change:

- `pnpm run test` for unit behavior.
- `pnpm run test:e2e` for API behavior.
- `pnpm run lint` for TypeScript and style issues.
- `pnpm run build` for compile/runtime wiring changes.
- `pnpm run openapi:generate` when API endpoints, models, auth responses, or error responses change.

If a check cannot run, document why in the final response.
