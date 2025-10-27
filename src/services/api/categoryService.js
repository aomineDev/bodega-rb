import { apiFetch } from './apiClient'

const service = '/categorias'


export const categoryService = {
    getAll: () => apiFetch(service),

    getById: (id) => apiFetch(`${service}/${id}`),

    create: (data) => apiFetch(service, { method: 'POST', body: JSON.stringify(data) }),

    update: ({ id, ...data }) =>
        apiFetch(`${service}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id) => apiFetch(`${service}/${id}`, { method: 'DELETE' }),
}