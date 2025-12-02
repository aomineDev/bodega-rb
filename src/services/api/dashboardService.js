import { apiFetch } from './apiClient'

const service = '/dashboard'

export const dashboardService = {
  get: () => apiFetch(service),
}
