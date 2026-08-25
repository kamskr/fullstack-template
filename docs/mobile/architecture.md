---
summary: Expo app routing, state, auth cookies via SecureStore, and API reachability config.
read_when:
  - Changing mobile routing, state management, auth, or API access.
  - Running the mobile app against emulators or physical devices.
---

# Mobile architecture

Expo app for React Native mobile clients.

Use Expo Router for routing, TanStack Query for server state, and Zustand only for UI/client state when needed.

Do not copy API data into Zustand. Use the generated API client from `packages/api-client` and keep TanStack Query hooks app-local.

The baseline mobile template includes Better Auth screens for email/password login, anonymous login, account creation, and authenticated timestamp CRUD. Timestamp creation uses the current client time; edit screens update the note only. Better Auth uses the Expo client plugin with SecureStore-backed cookie storage.

React Native has no browser cookie jar, so `src/lib/api-client.ts` reads `authClient.getCookie()` and attaches it as a `Cookie` header on every API request. Set `EXPO_PUBLIC_API_BASE_URL` so Android emulators and physical devices can reach the API.
