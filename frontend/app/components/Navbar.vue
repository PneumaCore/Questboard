<template>
  <nav class="bg-surface border-b border-border sticky top-0 z-40">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo / Brand -->
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
          <span class="text-background font-black text-lg">Q</span>
        </div>
        <div class="hidden sm:block">
          <span class="text-xl font-bold text-white group-hover:text-primary transition-colors">
            QUESTBOARD
          </span>
        </div>
      </NuxtLink>

      <!-- User Actions -->
      <ClientOnly>
        <div class="flex items-center gap-4">
          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center gap-3">
              <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-light rounded-lg border border-border">
                <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                <span class="text-text-muted text-sm">
                  <span class="text-primary font-semibold">{{ authStore.alias }}</span>
                </span>
              </div>
              <button
                @click="handleLogout"
                class="px-4 py-2 text-sm font-medium text-secondary border border-secondary rounded-lg hover:bg-secondary hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-background transition-all"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/registro"
              class="px-4 py-2 text-sm font-medium text-background bg-primary rounded-lg hover:bg-white transition-all"
            >
              Register
            </NuxtLink>
          </template>
        </div>
        <template #fallback>
          <div class="h-10 w-32 bg-surface-light rounded-lg border border-border animate-pulse"></div>
        </template>
      </ClientOnly>
    </div>
  </nav>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

/**
 * Handles user logout and redirects to Home.
 */
const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>
