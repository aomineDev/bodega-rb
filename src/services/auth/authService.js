import { apiFetch } from '../api/apiClient'
import { apiConfig } from '../../config/api'
import { useRouter } from 'vue-router'

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
  logout: () => {
    console.log('borrar del pinia')
    console.log('borrar de local storage')
    const router = useRouter()

    router.push('/login?logout=true')
  },
  getCurrentUser: async () => apiFetch('/auth/me'),
}
