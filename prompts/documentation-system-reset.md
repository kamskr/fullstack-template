---
summary: Rebuild a project's agent documentation system around canonical docs, local skills, and deterministic checks.
read_when:
  - Applying this full-stack template's documentation workflow to a derived project.
  - Consolidating duplicate agent notes, stale docs, or undocumented project conventions.
---

# Documentation System Reset

Audit and implement a documentation-system reset for this repository.

## Goal

Make documentation useful for coding agents without adding OpenSpec or Superpowers. Keep reusable workflow skills in the repository under `.agents/skills/`; do not create global skills.

## First Pass

1. Read every applicable `AGENTS.md` and `docs/subagent.md` when present.
2. Run the repository's existing documentation inventory command, if one exists.
3. Inspect `git status`; preserve unrelated user changes.
4. Read the current `AGENTS.md`, `docs/`, README files, agent-note directories, package scripts, CI, config, tests, and runtime source of truth.

## Target Model

- `AGENTS.md`: concise operating rules, routing, commands, and definition of done.
- `docs/`: single durable knowledge layer for architecture, setup, workflows, behavior, runbooks, and framework gotchas.
- `.agents/skills/docs-impact`: repository-local workflow for assessing and updating documentation impact.
- Generated contracts and references: derived from source and checked, never manually duplicated as prose.
- No parallel `agents/` knowledge tree.

## Implement

1. Find duplicated, stale, or contradictory docs. Derive ports, routes, commands, URLs, package-manager choice, and deployment behavior from source, config, and tests; never assume them.
2. Move useful legacy agent notes into focused canonical docs. Use `trash` only after content is migrated and indexed.
3. Add `summary` and non-empty `read_when` YAML frontmatter to canonical docs Markdown files.
4. Make `docs/README.md` the entrypoint and index. Prefer focused subsystem docs over one catch-all file.
5. Simplify root and nested `AGENTS.md` files:
   - link to relevant docs;
   - require documentation-impact assessment for behavior, API, config, setup, or workflow changes;
   - require an authoritative docs update or an explicit `docs unaffected` explanation;
   - use actual repository commands.
6. Create `.agents/skills/docs-impact` with the skill-creator workflow. It must inventory docs, map code/config/tests to affected docs, update the smallest canonical surface, avoid duplicate knowledge, verify claims against evidence, run checks, and report evidence at handoff.
7. Add portable, dependency-free docs tooling when missing:
   - `docs:list`;
   - `docs:check`;
   - tests for that tooling;
   - frontmatter and local Markdown-link validation.
8. When generated API/schema/client artifacts exist, add a freshness check that regenerates and fails on a diff.
9. Add CI for docs checks and generated-contract freshness using the repository's existing runtime and package manager.
10. Update README references and remove stale paths only after verifying the actual files.

## Constraints

- No new dependencies unless necessary.
- No broad search/replace.
- No commits, pushes, or branch changes.
- Do not launch persistent dev servers or emulators.
- Keep factual docs concise and source-backed.
- Report ambiguity instead of guessing.

## Verify And Handoff

Run docs inventory and checks, docs-tool tests, generated-contract freshness when applicable, the narrowest relevant lint/tests/build checks, and `git diff --check`.

Report:

- canonical sources established;
- docs moved or removed;
- commands and CI added;
- unresolved ambiguities;
- exact verification results.
