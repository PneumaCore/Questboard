/**
 * Middleware de ruta global para proteccion de rutas.
 *
 * - Rutas protegidas (/juegos/*): redirigen a /login si no hay sesion activa.
 * - Rutas publicas exclusivas (/login, /registro): redirigen a /juegos si ya esta logueado.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  const protectedRoutes = ['/juegos']
  const publicOnlyRoutes = ['/login', '/registro']

  const isProtected = protectedRoutes.some(route => to.path.startsWith(route))
  const isPublicOnly = publicOnlyRoutes.some(route => to.path === route)

  if (isProtected && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  if (isPublicOnly && authStore.isAuthenticated) {
    return navigateTo('/juegos')
  }
})
