---
summary: Index of the canonical documentation layer and the rules for maintaining it.
read_when:
  - Starting work in this repository and deciding which docs apply.
  - Adding, moving, or removing a doc in docs/.
---

# Docs

`docs/` is the single durable knowledge layer for this template: architecture, setup, workflows, behavior, runbooks, and framework gotchas. There is no parallel `agents/` notes tree.

Rules:

- Every doc here carries `summary` and `read_when` YAML frontmatter, validated by `pnpm docs:check`.
- Derive facts (ports, routes, commands, env keys) from source and config; do not restate guesses.
- Update the smallest relevant doc in the same change that alters behavior, and use the `.agents/skills/docs-impact` skill to assess impact.

## Index

Shared:

- [shared/monorepo.md](shared/monorepo.md): pnpm workspace and Turborepo conventions, root scripts, ports.
- [shared/api-contract.md](shared/api-contract.md): OpenAPI contract flow and the generated TypeScript client.
- [shared/bruno.md](shared/bruno.md): Bruno API request workspace and manual smoke-test flow.
- [shared/local-first.md](shared/local-first.md): local development infrastructure rule.
- [shared/template-checklist.md](shared/template-checklist.md): steps for turning the template into a named project.

Backend (`apps/api`):

- [backend/architecture.md](backend/architecture.md): API architecture and principles.
- [backend/development.md](backend/development.md): API local workflow and commands.
- [backend/database.md](backend/database.md): local PostgreSQL, Drizzle workflow, and migrations.
- [backend/auth.md](backend/auth.md): Better Auth integration, route policy, and body parsing.
- [backend/openapi.md](backend/openapi.md): OpenAPI routes, model conventions, and endpoint checklist.
- [backend/environment.md](backend/environment.md): APP_ENV/NODE_ENV, env file loading, start scripts.
- [backend/deployment.md](backend/deployment.md): provider-neutral deployment notes with a Render example.
- [backend/nestjs.md](backend/nestjs.md): NestJS conventions and framework gotchas.

Apps:

- [mobile/architecture.md](mobile/architecture.md): Expo app architecture notes.
- [web/architecture.md](web/architecture.md): TanStack Start app architecture notes.

## Tooling

```bash
pnpm docs:list    # list canonical docs with summaries
pnpm docs:check   # validate frontmatter and local Markdown links
pnpm docs:test    # test the docs tooling itself
```
