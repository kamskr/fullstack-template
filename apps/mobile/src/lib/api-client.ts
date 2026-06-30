import { apiClient } from '@template/api-client';
import { Platform } from 'react-native';

import { authClient } from './auth-client';
import { API_BASE_URL } from './env';

apiClient.setConfig({
  baseUrl: API_BASE_URL,
  credentials: Platform.OS === 'web' ? 'include' : 'omit',
  fetch: async (input, init) => {
    const headers = new Headers(
      input instanceof Request ? input.headers : init?.headers,
    );

    if (Platform.OS !== 'web') {
      const cookie = authClient.getCookie();
      if (cookie) {
        headers.set('Cookie', cookie);
      }
    }

    return fetch(input, {
      ...init,
      headers,
      credentials: Platform.OS === 'web' ? 'include' : 'omit',
    });
  },
});

export { apiClient };
