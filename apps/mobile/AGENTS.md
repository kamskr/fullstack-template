# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

Use Expo Router for routing. Use TanStack Query for server state and Zustand only for UI/client state when needed. Do not copy API data into Zustand.

Use the generated OpenAPI client in `packages/api-client` for API calls. Keep TanStack Query hooks local to the mobile app.

Better Auth mobile client lives in `src/lib/auth-client.ts`. Use `@better-auth/expo/client` with `expo-secure-store`; do not hand-roll auth endpoints.

Generated Hey API client config lives in `src/lib/api-client.ts`. Native requests manually attach `Cookie: authClient.getCookie()` and use `credentials: 'omit'`; web uses `credentials: 'include'`.

Set `EXPO_PUBLIC_API_BASE_URL` for non-iOS-simulator targets. Defaults: Android emulator `http://10.0.2.2:3000`, others `http://localhost:3000`.

Current template routes: `/login`, `/create-account`, `/timestamps`, `/timestamps/[timestampId]`.

Forms use React Hook Form. Shared Zod schemas live in `@template/validators`; native forms currently parse on submit without validation UI.
