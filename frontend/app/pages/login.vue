<template>
  <div class="max-w-md mx-auto mt-12 md:mt-20">
    <div class="bg-surface border border-border rounded-2xl p-8 md:p-10 shadow-xl shadow-black/20">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-black text-white mb-2 tracking-wide">BIENVENIDO DE VUELTA</h1>
        <p class="text-text-muted text-sm">Inicia sesion para acceder a tu Questboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="you@questboard.com"
          >
        </div>

        <div>
          <label class="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="••••••••"
          >
        </div>

        <!-- Error Alert -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="error" class="bg-secondary/10 border border-secondary text-secondary text-sm px-4 py-3 rounded-lg">
            {{ error }}
          </div>
        </Transition>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary text-background font-black py-3.5 rounded-lg hover:bg-white hover:shadow-lg hover:shadow-primary/20 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Iniciando sesion...' : 'Iniciar Sesion' }}
        </button>
      </form>

      <p class="text-center text-text-muted text-sm mt-8">
        ¿No tienes cuenta?
        <NuxtLink to="/registro" class="text-primary hover:text-white transition-colors font-bold ml-1">Registrate</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await authStore.login(form)
    router.push('/juegos')
  } catch (err) {
    error.value = err.response?.data?.error || 'Credenciales incorrectas. Intentalo de nuevo.'
  } finally {
    isLoading.value = false
  }
}
</script>
