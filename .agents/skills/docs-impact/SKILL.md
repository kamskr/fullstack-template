---
name: docs-impact
description: Assess and update the documentation impact of a change in this repository. Use before handoff after changing behavior, API endpoints or models, config, environment variables, setup, commands, database workflow, Bruno collections, or deployment assumptions.
---

# Docs impact

Keeps `docs/` truthful when code, config, or workflows change. Every fact in `docs/` must trace back to source, and each fact has exactly one home.

## When to use

Run this before handoff whenever a change touches:

- runtime behavior or API endpoints/models/auth/error responses;
- configuration, environment variables, ports, or local services;
- setup steps, package scripts, or commands;
- database schema or migration workflow;
- Bruno collections;
- deployment assumptions;
- CI or docs tooling itself.

Internal refactors with identical behavior usually end at step 3 with `docs unaffected`.

## Workflow

1. **Inventory the docs.** Run `pnpm docs:list` from the repo root to see every doc and its summary. `docs/README.md` is the index.
2. **Map the change to docs.** For each changed file (code, config, tests, scripts, CI), ask which doc states a fact that the change could invalidate: ports, routes, commands, env keys, file paths, workflows, conventions. Grep `docs/` for the identifiers you touched (route paths, script names, env vars, package names).
3. **Decide.** If no doc is affected, record `docs unaffected: <one-line reason>` for the handoff and stop. Otherwise continue.
4. **Update the doc that owns the fact.** Edit that one doc. Do not restate the fact in other docs, AGENTS.md files, or READMEs; link to the owning doc instead. If a new topic has no home, add a focused doc under `docs/<area>/` with `summary` and non-empty `read_when` frontmatter, and add it to the index in `docs/README.md`.
5. **Verify claims against evidence.** Confirm every stated port, route, command, env key, or path from source, config, package scripts, or tests. Not from memory, and not from another doc. Fix or remove claims you cannot confirm.
6. **Keep generated artifacts fresh.** If the API contract changed, run `pnpm api-contract:generate` and commit `apps/api/docs/openapi.json` and `packages/api-client/src/generated/` alongside the change (`pnpm contract:check` verifies this).
7. **Run the checks.**

   ```bash
   pnpm docs:check
   ```

   Fix any frontmatter or broken-link failures. If you changed the docs tooling itself, also run `pnpm docs:test`.
8. **Report evidence at handoff.** List the docs updated (or `docs unaffected` with the reason), the evidence used for each factual claim, and the exact check commands with their results.

## Rules

- One fact, one home. Duplication is a bug.
- Facts come from source; docs only record them.
- Do not create parallel note trees (`agents/`, scratch notes). Everything lasting goes in `docs/`.
- Keep docs short: what an agent needs to act, not narrative history.
