import { apiClient } from '@template/api-client'
import { API_BASE_URL } from './env'

apiClient.setConfig({
  baseUrl: API_BASE_URL,
  credentials: 'include',
})

export { apiClient }
