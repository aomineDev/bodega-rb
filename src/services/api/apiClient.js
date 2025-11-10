import { apiConfig } from '@/config/api'
import { useAuthStore } from '@/stores/auth'

const { API_URL } = apiConfig

export const apiFetch = async (endpoint, options = {}) => {
  const { token, logout } = useAuthStore()

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  if (response.status === 401 || response.status === 403) {
    logout()
    throw new Error('Session expirada, Por favor vuelva a iniciar sesión')
  }

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Error en la peticion')
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null
  }

  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/pdf')) {
    return response.arrayBuffer()
  }

  return response.json()
}
