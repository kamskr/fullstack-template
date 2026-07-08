# AGENTS.md

## Expo has changed

Expo SDK 56 differs from what older training data describes. Read https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Rules

- Use Expo Router for routing. Use TanStack Query for server state and Zustand only for UI/client state when needed. Do not copy API data into Zustand.
- Use the generated OpenAPI client in `packages/api-client` for API calls. Keep TanStack Query hooks local to the mobile app.
- The Better Auth mobile client lives in `src/lib/auth-client.ts`. Use `@better-auth/expo/client` with `expo-secure-store`; do not hand-roll auth endpoints.
- The generated Hey API client config lives in `src/lib/api-client.ts`. Requests attach `Cookie: authClient.getCookie()` by hand and use `credentials: 'omit'` because React Native has no browser cookie jar.
- Set `EXPO_PUBLIC_API_BASE_URL` for targets other than the iOS simulator. Defaults: Android emulator `http://10.0.2.2:3000`, others `http://localhost:3000`.
- Current template routes: `/login`, `/create-account`, `/timestamps`, `/timestamps/[timestampId]`.
- Forms use React Hook Form. Shared Zod schemas live in `@template/validators`; native forms currently parse on submit without validation UI.

## Docs

Mobile architecture notes: `../../docs/mobile/architecture.md`.

Adding native modules or switching to a development build: `../../docs/mobile/native-modules.md`.

For changes to behavior, routes, auth, config, or workflow: run the `.agents/skills/docs-impact` skill (repo root) and update the relevant doc, or state `docs unaffected` with a reason.

## Verification

```bash
pnpm --filter @template/mobile lint
```
