import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import { anonymousClient } from 'better-auth/client/plugins';
import * as SecureStore from 'expo-secure-store';

import { API_BASE_URL, APP_SCHEME } from './env';

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [
    anonymousClient(),
    expoClient({
      scheme: APP_SCHEME,
      storagePrefix: APP_SCHEME,
      storage: SecureStore,
    }),
  ],
});
