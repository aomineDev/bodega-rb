import { apiFetch } from './apiClient'

const service = '/empleados'

export const employeeService = {
    getAll: async () => apiFetch(service),

    getById: async (id) => apiFetch(`${service}/${id}`),

    create: async (data) => apiFetch(service, { method: 'POST', body: JSON.stringify(data) }),

    update: async ({ id, ...data }) =>
        apiFetch(`${service}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: async (id) => apiFetch(`${service}/${id}`, { method: 'DELETE' }),

    getCustomerByDni: async (dni) => apiFetch(`${service}/reniec/${dni}`),
}
