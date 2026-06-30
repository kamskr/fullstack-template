# Mobile Architecture

Expo app for React Native mobile clients.

Use Expo Router for routing, TanStack Query for server state, and Zustand only for UI/client state when needed.

Do not copy API data into Zustand. Use the generated API client from `packages/api-client` and keep TanStack Query hooks app-local.

The baseline mobile template includes Better Auth screens for email/password login, anonymous login, account creation, and authenticated timestamp CRUD. Better Auth uses the Expo client plugin with SecureStore-backed cookie storage.

Native API requests do not rely on browser cookie behavior. The generated Hey API client is configured app-locally to read `authClient.getCookie()` and attach a `Cookie` header. Configure API reachability with `EXPO_PUBLIC_API_BASE_URL` for Android emulators and physical devices.
