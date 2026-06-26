# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

Use Expo Router for routing. Use TanStack Query for server state and Zustand only for UI/client state when needed. Do not copy API data into Zustand.

Use the generated OpenAPI client in `packages/api-client` for API calls. Keep TanStack Query hooks local to the mobile app.
