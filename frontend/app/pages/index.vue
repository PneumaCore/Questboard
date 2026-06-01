<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <!-- Hero Section -->
    <div class="mb-10 relative">
      <!-- Decorative glow -->
      <div class="absolute -inset-10 bg-primary/5 blur-3xl rounded-full pointer-events-none"></div>

      <h1 class="relative text-6xl md:text-8xl font-black tracking-tighter mb-4">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
          QUESTBOARD
        </span>
      </h1>
      <p class="relative text-xl md:text-2xl text-text-muted font-light tracking-widest uppercase">
        "Cada juego es un contrato. Cumplelo."
      </p>
    </div>

    <div class="max-w-2xl text-text-muted mb-12 leading-relaxed text-lg">
      <p>
        Tu mando de mision definitivo para dominar tu backlog. Organiza, prioriza y conquista cada titulo pendiente como un verdadero profesional.
      </p>
    </div>

    <!-- Dynamic CTAs -->
    <div class="flex flex-col sm:flex-row gap-4 relative z-10">
      <template v-if="authStore.isAuthenticated">
        <NuxtLink
          to="/juegos"
          class="px-10 py-4 bg-primary text-background font-black rounded-xl hover:bg-white hover:scale-105 transition-all shadow-xl shadow-primary/20 text-lg uppercase tracking-wider"
        >
          Ir a mi Tablero
        </NuxtLink>
      </template>
      <template v-else>
        <NuxtLink
          to="/login"
          class="px-10 py-4 bg-primary text-background font-black rounded-xl hover:bg-white hover:scale-105 transition-all shadow-xl shadow-primary/20 text-lg uppercase tracking-wider"
        >
          Login
        </NuxtLink>
        <NuxtLink
          to="/registro"
          class="px-10 py-4 border-2 border-secondary text-secondary font-black rounded-xl hover:bg-secondary hover:text-white hover:scale-105 transition-all text-lg uppercase tracking-wider"
        >
          Registro
        </NuxtLink>
      </template>
    </div>

    <!-- Stats decoration -->
    <div class="mt-16 grid grid-cols-3 gap-8 text-center opacity-60">
      <div>
        <div class="text-2xl font-bold text-primary">Track</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-1">Tu Progreso</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-accent">Filter</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-1">Tu Estilo</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-secondary">Complete</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-1">Tus Misiones</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
</script>
