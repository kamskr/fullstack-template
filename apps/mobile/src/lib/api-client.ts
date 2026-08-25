import { apiClient } from '@template/api-client';

import { authClient } from './auth-client';
import { API_BASE_URL } from './env';

apiClient.setConfig({
  baseUrl: API_BASE_URL,
  credentials: 'omit',
  fetch: async (input, init) => {
    const headers = new Headers(
      input instanceof Request ? input.headers : init?.headers,
    );

    const cookie = authClient.getCookie();
    if (cookie) {
      headers.set('Cookie', cookie);
    }

    return fetch(input, {
      ...init,
      headers,
      credentials: 'omit',
    });
  },
});

export { apiClient };
