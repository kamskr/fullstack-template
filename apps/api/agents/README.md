# Agent Notes

Agent-friendly API/backend notes live here.

Use this directory for implementation knowledge that is too detailed for the root `README.md` but useful for future work: local setup gotchas, database migration workflow, OpenAPI generation, auth decisions, testing strategy, and NestJS framework notes.

Keep `docs/` available for product/API documentation such as generated Swagger/OpenAPI docs.

Use `llms/` for package-specific LLM docs copied from upstream package documentation. Check those files before deep package work, then fall back to official docs when missing or insufficient.

## Current Sources

- `../README.md`: backend overview, setup, commands, and workflow entrypoint.
- `../../../docs/backend/`: durable backend architecture and workflow docs.
- `../AGENTS.md`: agent operating instructions for this backend.
- `../llms/`: package-specific LLM docs, when available.
- `../../../agents/`: monorepo-wide notes such as Bruno and package manager details.

## Notes

- `database.md`: local PostgreSQL, Drizzle, and database adapter workflow.
- `auth.md`: Better Auth route policy, env, smoke checks, and migration workflow.
- `body-parsing.md`: JSON body parsing helper that skips Better Auth routes.
- `environment.md`: APP_ENV, env file loading order, and start scripts.
- `deployment.md`: Render Web Service/PostgreSQL deployment commands and env vars.
- `openapi.md`: Swagger/OpenAPI and health endpoint conventions.
- `nestjs.md`: NestJS docs links and framework-convention reminders.

## Maintenance Rule

When adding a new agent note, include a short description here so future agents can find it quickly.
