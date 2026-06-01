import { defineStore } from 'pinia'
import apiClient from '~/services/axios'

/**
 * Store de Pinia para gestionar el estado de autenticacion del usuario.
 * Mantiene la sesion persistente usando localStorage.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    userId: null,
    alias: null,
    isAuthenticated: false
  }),

  actions: {
    /**
     * Recupera la sesion desde localStorage al iniciar la aplicacion.
     * Se debe llamar en el plugin de inicializacion o en el layout.
     */
    initialize() {
      if (process.client) {
        const savedToken = localStorage.getItem('questboard_token')
        const savedUserId = localStorage.getItem('questboard_userId')
        const savedAlias = localStorage.getItem('questboard_alias')

        if (savedToken) {
          this.token = savedToken
          this.userId = savedUserId
          this.alias = savedAlias
          this.isAuthenticated = true
        }
      }
    },

    /**
     * Guarda los datos de sesion en el estado y en localStorage.
     */
    setSession(token, userId, alias) {
      this.token = token
      this.userId = userId
      this.alias = alias
      this.isAuthenticated = true

      if (process.client) {
        localStorage.setItem('questboard_token', token)
        localStorage.setItem('questboard_userId', userId)
        localStorage.setItem('questboard_alias', alias)
      }
    },

    /**
     * Limpia la sesion del estado y del almacenamiento local.
     */
    clearSession() {
      this.token = null
      this.userId = null
      this.alias = null
      this.isAuthenticated = false

      if (process.client) {
        localStorage.removeItem('questboard_token')
        localStorage.removeItem('questboard_userId')
        localStorage.removeItem('questboard_alias')
      }
    },

    /**
     * Inicia sesion enviando credenciales a la API.
     */
    async login(credentials) {
      const { data } = await apiClient.post('/auth/login', credentials)
      this.setSession(data.token, data.userId, data.alias)
      return data
    },

    /**
     * Registra un nuevo usuario en la API.
     */
    async register(userData) {
      const { data } = await apiClient.post('/auth/register', userData)
      return data
    },

    /**
     * Cierra la sesion del usuario de forma limpia.
     */
    logout() {
      this.clearSession()
    }
  }
})
