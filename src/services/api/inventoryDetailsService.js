import { apiFetch } from './apiClient'

const service = '/inventario-detalles'

export const inventoryDetailsService = {
  getAll: () => apiFetch(service),

  getById: (id) => apiFetch(`${service}/${id}`),

  create: (data) => apiFetch(service, { method: 'POST', body: JSON.stringify(data) }),

  updateById: ({ id, ...data }) =>
    apiFetch(`${service}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  updateObservationsById: ({ id, ...data }) =>
    apiFetch(`${service}/observaciones/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  addStockById: ({ id, ...data }) =>
    apiFetch(`${service}/stock/add/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  updateStockById: ({ id, ...data }) =>
    apiFetch(`${service}/stock/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  deleteById: (id) => apiFetch(`${service}/${id}`, { method: 'DELETE' }),
}
