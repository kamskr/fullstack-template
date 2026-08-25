---
summary: NestJS convention reminders, official doc links, and framework gotchas discovered in this repo.
read_when:
  - Doing non-trivial NestJS work (pipes, guards, interceptors, testing utilities).
  - Unsure whether to follow a framework convention or hand-roll something.
---

# NestJS notes

For non-trivial NestJS work, check the official docs before implementing:

- https://docs.nestjs.com
- https://docs.nestjs.com/openapi/introduction
- https://docs.nestjs.com/techniques/database
- https://docs.nestjs.com/recipes/passport

Use the framework's own modules, providers, dependency injection, validation pipes, guards, interceptors, filters, and testing utilities instead of working around them.

Use route parameter pipes for typed IDs before service/database calls. Example: UUID-backed routes should use `@Param('id', ParseUUIDPipe)` so malformed IDs return `400 Bad Request` instead of leaking a Postgres `22P02` error.

Before package-specific work in the API, check `apps/api/llms/` for a local package LLM doc, then fall back to the official docs.
