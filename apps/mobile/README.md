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
- Auth: Better Auth Expo client with SecureStore-backed cookies.
- Server state: TanStack Query app-local helpers.
- UI/client state: Zustand only when needed.
- API access: generated OpenAPI client from `@template/api-client`.

Template screens:

- `/login`: email/password login plus anonymous login.
- `/create-account`: email/password signup. Anonymous timestamps transfer to the created account through the API auth hook.
- `/timestamps`: authenticated timestamp list, create, delete.
- `/timestamps/[timestampId]`: authenticated timestamp details, edit, delete.

Set `EXPO_PUBLIC_API_BASE_URL` when running against a device or emulator:

```bash
# iOS simulator / web
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000 pnpm --filter @template/mobile ios

# Android emulator
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000 pnpm --filter @template/mobile android

# Physical device on same LAN
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:3000 pnpm --filter @template/mobile start
```

See `../../docs/mobile/architecture.md` for durable mobile notes.
