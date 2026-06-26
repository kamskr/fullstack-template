# Template Mobile

Expo / React Native mobile app for the full-stack template.

## Commands

From the repo root:

```bash
pnpm mobile:dev
pnpm --filter @template/mobile ios
pnpm --filter @template/mobile android
pnpm --filter @template/mobile web
pnpm --filter @template/mobile lint
```

## Architecture

- Routing: Expo Router.
- Server state: TanStack Query once API client wiring is added.
- UI/client state: Zustand only when needed.
- API access: generated OpenAPI client once `packages/api-client` exists.

See `../../docs/mobile/architecture.md` for durable mobile notes.
