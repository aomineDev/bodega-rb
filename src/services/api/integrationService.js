import { apiFetch } from './apiClient'

const service = '/integracion'

export const integrationService = {
  getCustomerByDni: async (dni) => apiFetch(`${service}/buscar/reniec/${dni}`),

  getCustomerByRuc: async (ruc) => apiFetch(`${service}/buscar/sunat/${ruc}`),

  createCustomerByDni: async (dni) => apiFetch(`${service}/crear/reniec/${dni}`),

  createCustomerByRuc: async (ruc) => apiFetch(`${service}/crear/sunat/${ruc}`),
}
