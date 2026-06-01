<template>
  <div class="max-w-md mx-auto mt-12 md:mt-20">
    <div class="bg-surface border border-border rounded-2xl p-8 md:p-10 shadow-xl shadow-black/20">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-black text-white mb-2 tracking-wide">UNETE A LA MISION</h1>
        <p class="text-text-muted text-sm">Crea tu cuenta y empieza a dominar tu backlog</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Alias</label>
          <input
            v-model="form.alias"
            type="text"
            required
            class="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="Tu gamertag"
          >
        </div>

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
            minlength="6"
            class="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="Minimo 6 caracteres"
          >
        </div>

        <!-- Alerts -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="error" class="bg-secondary/10 border border-secondary text-secondary text-sm px-4 py-3 rounded-lg">
            {{ error }}
          </div>
        </Transition>

        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="success" class="bg-success/10 border border-success text-success text-sm px-4 py-3 rounded-lg">
            Cuenta creada con exito. Redirigiendo al login...
          </div>
        </Transition>

        <button
          type="submit"
          :disabled="isLoading || success"
          class="w-full bg-primary text-background font-black py-3.5 rounded-lg hover:bg-white hover:shadow-lg hover:shadow-primary/20 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>
      </form>

      <p class="text-center text-text-muted text-sm mt-8">
        ¿Ya tienes cuenta?
        <NuxtLink to="/login" class="text-primary hover:text-white transition-colors font-bold ml-1">Inicia sesion</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  alias: '',
  email: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')
const success = ref(false)

const handleRegister = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await authStore.register(form)
    success.value = true
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Error de conexion. Comprueba que el servidor esta activo.'
  } finally {
    isLoading.value = false
  }
}
</script>
