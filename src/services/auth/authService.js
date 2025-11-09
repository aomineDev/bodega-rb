import { apiFetch } from '../api/apiClient'
import { apiConfig } from '../../config/api'

const { API_URL } = apiConfig

export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) throw new Error('Error al iniciar sesión')

    const data = await response.json()

    return data
  },
  getCurrentUser: async () => apiFetch('/auth/me'),
}
