# Package Manager Notes

This repo is pinned to pnpm 10 through the `packageManager` field in `package.json`.

Why: the existing `node_modules` store was created by pnpm 10. Corepack attempted to use pnpm 9, which produced an unexpected store location error.

If Corepack fails to fetch pnpm 10 with a signature/key error, this env-scoped command worked locally:

```bash
COREPACK_INTEGRITY_KEYS=0 corepack use pnpm@10.34.3
```

After that, use normal project commands:

```bash
pnpm install
pnpm add <package>
pnpm add -D <package>
```
