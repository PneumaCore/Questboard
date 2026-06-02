import axios from 'axios'
import { useAuthStore } from '~/stores/auth'
import { useRuntimeConfig } from '#app'

/**
 * Instancia global de Axios configurada para consumir la API.
 * La URL base se toma de runtimeConfig para soportar local y producción.
 * Inyecta automáticamente el token JWT desde el store de Pinia si existe.
 */
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const runtimeConfig = useRuntimeConfig()
    config.baseURL = runtimeConfig.public.apiBaseUrl || 'http://localhost:3000/api'

    // Solo accedemos al store cuando estamos en el cliente
    if (process.client) {
      const authStore = useAuthStore()
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient
