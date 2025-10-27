import { apiConfig } from '@/config/api'

const { API_URL } = apiConfig

export const storageService = {
  upload: async (folder = 'images', file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_URL}/api/storage/${folder}`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('Error al subir la imagen')

    return response.text()
  },
}
