import { apiFetch } from './apiClient'

//backend service spring boot - conexi[on api]
const service = '/ingreso-productos'

export const productEntryService = {
  getAll: async () => apiFetch(service),

  getById: async (id) => apiFetch(`${service}/${id}`),

  create: async (data) => apiFetch(service, { method: 'POST', body: JSON.stringify(data) }),

  update: async ({ id, ...data }) =>
    apiFetch(`${service}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: async (id) => apiFetch(`${service}/${id}`, { method: 'DELETE' }),
}
