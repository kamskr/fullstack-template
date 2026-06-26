# Package Manager Notes

This repo is pinned to pnpm 10.34.3 through the root `packageManager` field.

Use pnpm from the repo root for workspace-aware installs and scripts:

```bash
pnpm install
pnpm --filter @template/api add <package>
pnpm --filter @template/web add <package>
pnpm --filter @template/mobile add <package>
```

Avoid app-local lockfiles. The root lockfile is the only package lock for the template.
