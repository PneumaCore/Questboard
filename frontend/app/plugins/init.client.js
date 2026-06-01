/**
 * Plugin cliente que inicializa el store de autenticacion desde localStorage
 * al arrancar la aplicacion. Esto mantiene la sesion activa tras recargar la pagina.
 */
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  authStore.initialize()
})
