import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

/**
 * Instancia global de Axios configurada para consumir la API REST local.
 * Inyecta automaticamente el token JWT desde el store de Pinia si existe.
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    // Solo accedemos al store cuando estamos en el cliente o dentro de un contexto Vue
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient
