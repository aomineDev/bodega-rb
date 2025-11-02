import { apiFetch } from './apiClient'

const service = '/inventarios'

export const inventoryService = {
  getAll: () => apiFetch(service),

  getById: (id) => apiFetch(`${service}/${id}`),

  create: (data) => apiFetch(service, { method: 'POST', body: JSON.stringify(data) }),

  updateById: ({ id, ...data }) =>
    apiFetch(`${service}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteById: (id) => apiFetch(`${service}/${id}`, { method: 'DELETE' }),
}
