# Mobile Architecture

Expo app for React Native mobile clients.

Use Expo Router for routing, TanStack Query for server state, and Zustand only for UI/client state when needed.

Do not copy API data into Zustand. Use the generated API client from `packages/api-client` and keep TanStack Query hooks app-local.
