import { apiFetch } from './apiClient'

const service = '/inventarios'

export const inventoryService = {
  getAll: () => apiFetch(service),

  getAllByState: (state) => apiFetch(`${service}?estado=${state}`),

  getById: (id) => apiFetch(`${service}/${id}`),

  create: (data) => apiFetch(service, { method: 'POST', body: JSON.stringify(data) }),

  updateById: ({ id, ...data }) =>
    apiFetch(`${service}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  addAssistantById: ({ id, asistente }) =>
    apiFetch(`${service}/asistente/${id}`, { method: 'PATCH', body: JSON.stringify(asistente) }),

  closeInventoryById: (id) => apiFetch(`${service}/cerrar/${id}`, { method: 'PATCH' }),

  deleteById: (id) => apiFetch(`${service}/${id}`, { method: 'DELETE' }),
}
