import { apiFetch } from './apiClient'

const service = '/caja'

export const checkoutService = {
  getAll: () => apiFetch(service),

  getById: (id) => apiFetch(`${service}/${id}`),

  create: (data) => apiFetch(service, { method: 'POST', body: JSON.stringify(data) }),

  update: ({ id, ...data }) =>
    apiFetch(`${service}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) => apiFetch(`${service}/${id}`, { method: 'DELETE' }),

  getCajaAbierta: () => apiFetch(`${service}/abierta`),

  getResumenCaja: (id) => apiFetch(`${service}/${id}/resumen`),

  cerrarCaja: ({ id, ...data }) =>
    apiFetch(`${service}/${id}/cerrar`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}
