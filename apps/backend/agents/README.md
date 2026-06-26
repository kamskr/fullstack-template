# Agent Notes

Agent-friendly backend notes live here.

Use this directory for implementation knowledge that is too detailed for the root `README.md` but useful for future work: local setup gotchas, database migration workflow, OpenAPI generation, auth decisions, testing strategy, and NestJS framework notes.

Keep `docs/` available for product/API documentation such as generated Swagger/OpenAPI docs.

Use `llms/` for package-specific LLM docs copied from upstream package documentation. Check those files before deep package work, then fall back to official docs when missing or insufficient.

## Current Sources

- `../README.md`: backend overview, setup, commands, and workflow entrypoint.
- `../ARCHITECTURE.md`: stack decisions and local-first infrastructure constraints.
- `../AGENTS.md`: agent operating instructions for this backend.
- `../llms/`: package-specific LLM docs, when available.

## Notes

- `database.md`: local PostgreSQL, Drizzle, and database adapter workflow.
- `auth.md`: Better Auth route policy, env, smoke checks, and migration workflow.
- `bruno.md`: local Bruno API collection and auth testing flow.
- `body-parsing.md`: JSON body parsing helper that skips Better Auth routes.
- `environment.md`: APP_ENV, env file loading order, and start scripts.
- `deployment.md`: Render Web Service/PostgreSQL deployment commands and env vars.
- `openapi.md`: Swagger/OpenAPI and health endpoint conventions.
- `nestjs.md`: NestJS docs links and framework-convention reminders.
- `package-manager.md`: pnpm/Corepack version note for this repo.

## Maintenance Rule

When adding a new agent note, include a short description here so future agents can find it quickly.
