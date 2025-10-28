import { apiFetch } from './apiClient'

const service = '/roles'

export const roleService = {
    getAll: async () => apiFetch(service),
}
