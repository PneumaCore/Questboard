// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  },

  hooks: {
    'pages:extend': (pages) => {
      for (const page of pages) {
        if (page.path.startsWith('/games')) {
          // Mapea /games/* -> /juegos/* para cumplir con las rutas del entregable
          let newPath = page.path.replace('/games', '/juegos')
          newPath = newPath.replace('/new', '/nuevo')
          newPath = newPath.replace('/edit/', '/edicion/')
          page.path = newPath
        }
      }
    }
  },

  compatibilityDate: '2025-05-31'
})
