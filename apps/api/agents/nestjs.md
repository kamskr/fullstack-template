# NestJS Notes

For non-trivial NestJS work, check official docs before implementing:

- https://docs.nestjs.com
- https://docs.nestjs.com/openapi/introduction
- https://docs.nestjs.com/techniques/database
- https://docs.nestjs.com/recipes/passport

Prefer idiomatic NestJS modules, providers, dependency injection, validation pipes, guards, interceptors, filters, and testing utilities over custom framework bypasses.

Use route parameter pipes for typed IDs before service/database calls. Example: UUID-backed routes should use `@Param('id', ParseUUIDPipe)` so malformed IDs return `400 Bad Request` instead of leaking a Postgres `22P02` error.
