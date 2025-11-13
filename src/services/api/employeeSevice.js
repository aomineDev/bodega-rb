import { apiFetch } from './apiClient'

const service = '/empleados'

export const employeeService = {
  getAll: () => apiFetch(service),

  getAllByRol: (rol) => apiFetch(`${service}?rol=${rol}`),

  getById: (id) => apiFetch(`${service}/${id}`),

  create: (data) => apiFetch(service, { method: 'POST', body: JSON.stringify(data) }),

  update: ({ id, ...data }) =>
    apiFetch(`${service}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) => apiFetch(`${service}/${id}`, { method: 'DELETE' }),

  getCustomerByDni: (dni) => apiFetch(`${service}/reniec/${dni}`),

  changePassword: ({ id, currentPassword, newPassword }) =>
    apiFetch(`${service}/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
}
