import { createAuthClient } from 'better-auth/react'
import { anonymousClient } from 'better-auth/client/plugins'
import { API_BASE_URL } from './env'

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [anonymousClient()],
})
