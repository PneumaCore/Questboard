<template>
  <div v-if="game" class="max-w-5xl mx-auto">
    <!-- Back Button -->
    <div class="mb-4">
      <button
        @click="$router.back()"
        class="text-text-muted text-sm hover:text-primary transition-colors flex items-center gap-2 font-bold uppercase tracking-wide"
      >
        <span class="text-lg">←</span> Volver al tablero
      </button>
    </div>

    <!-- Cover Hero -->
    <div v-if="game.coverImage" class="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden mb-8 group border border-border shadow-2xl">
      <img
        :src="game.coverImage"
        alt="cover"
        class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>

      <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="flex-1 min-w-0">
            <p class="text-accent font-bold text-sm uppercase tracking-wider mb-2">{{ game.category }}</p>
            <h1 class="text-3xl md:text-5xl font-black text-white truncate">{{ game.name }}</h1>
          </div>
          <div
            :class="priorityClass"
            class="px-5 py-3 rounded-xl text-center border border-white/10 shadow-xl flex-shrink-0"
          >
            <span class="block text-xs opacity-80 font-bold uppercase tracking-wider">Priority</span>
            <span class="text-3xl font-black">{{ Math.round(game.priority) ?? '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Header without cover -->
    <div v-else class="mb-8">
      <div class="flex items-start justify-between gap-4 mb-2">
        <div>
          <p class="text-accent font-bold text-sm uppercase tracking-wider mb-2">{{ game.category }}</p>
          <h1 class="text-3xl md:text-5xl font-black text-white">{{ game.name }}</h1>
        </div>
        <div
          :class="priorityClass"
          class="px-5 py-3 rounded-xl text-center border border-white/10 shadow-xl"
        >
          <span class="block text-xs opacity-80 font-bold uppercase tracking-wider">Priority</span>
          <span class="text-3xl font-black">{{ Math.round(game.priority) ?? '-' }}</span>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-surface border border-border rounded-xl p-5 text-center hover:border-primary/50 transition-colors">
        <p class="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Metacritic</p>
        <p class="text-2xl font-black" :class="metacriticColor">{{ game.metacriticScore }}</p>
      </div>
      <div class="bg-surface border border-border rounded-xl p-5 text-center hover:border-primary/50 transition-colors">
        <p class="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Horas</p>
        <p class="text-2xl font-black text-white">{{ game.hours }}h</p>
      </div>
      <div class="bg-surface border border-border rounded-xl p-5 text-center hover:border-primary/50 transition-colors">
        <p class="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Estado</p>
        <p :class="statusClass" class="text-lg font-black flex items-center justify-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full" :class="statusDotClass"></span>
          {{ statusLabel }}
        </p>
      </div>
      <div class="bg-surface border border-border rounded-xl p-5 text-center hover:border-primary/50 transition-colors">
        <p class="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">Valoracion</p>
        <div class="flex justify-center gap-1">
          <span
            v-for="n in 5"
            :key="n"
            class="text-xl"
            :class="n <= (game.rating || 0) ? 'text-warning' : 'text-surface-light'"
          >
            ★
          </span>
        </div>
      </div>
    </div>

    <!-- Tags -->
    <div v-if="parsedTags.length" class="flex flex-wrap gap-2 mb-6">
      <span
        v-for="tag in parsedTags"
        :key="tag"
        class="px-3 py-1.5 bg-surface text-text-muted text-sm rounded-lg border border-border"
      >
        #{{ tag }}
      </span>
    </div>

    <!-- Completion Info -->
    <div v-if="game.completedAt" class="mb-8 p-6 bg-success/10 border border-success/20 rounded-xl">
      <div class="flex items-center gap-3 text-success mb-3">
        <span class="text-2xl">✓</span>
        <h2 class="text-xl font-black uppercase tracking-wide">Mision Completada</h2>
      </div>
      <p class="text-text-main font-medium mb-2">{{ formatDate(game.completedAt) }}</p>
      <div v-if="game.notes" class="mt-4 p-4 bg-background/50 rounded-lg border-l-2 border-primary/50">
        <p class="text-text-muted text-sm italic">"{{ game.notes }}"</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
      <NuxtLink
        :to="`/juegos/edicion/${game.id}`"
        class="flex-1 py-3.5 text-center text-sm font-bold bg-surface-light text-primary border border-primary/30 rounded-xl hover:bg-primary hover:text-background transition-all uppercase tracking-wide"
      >
        Editar Mision
      </NuxtLink>
      <button
        @click="confirmDelete"
        class="flex-1 py-3.5 text-sm font-bold bg-surface-light text-secondary border border-secondary/30 rounded-xl hover:bg-secondary hover:text-white transition-all uppercase tracking-wide"
      >
        Eliminar Mision
      </button>
      <button
        v-if="!game.completedAt"
        @click="openCompleteModal"
        class="flex-1 py-3.5 text-sm font-bold bg-success text-background rounded-xl hover:bg-success/90 hover:shadow-lg hover:shadow-success/20 transition-all uppercase tracking-wide"
      >
        Completar
      </button>
    </div>

    <!-- Delete Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          @click.self="showDeleteModal = false"
        >
          <div class="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl shadow-secondary/10">
            <div class="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-secondary text-xl">⚠</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">¿Eliminar Mision?</h3>
            <p class="text-text-muted text-sm mb-6">Esta accion no se puede deshacer. El juego se eliminara permanentemente.</p>
            <div class="flex gap-3">
              <button
                @click="deleteGame"
                class="flex-1 bg-secondary text-white font-bold py-2.5 rounded-lg hover:bg-red-600 transition-all uppercase tracking-wide text-sm"
              >
                Eliminar
              </button>
              <button
                @click="showDeleteModal = false"
                class="flex-1 bg-surface-light text-text-main font-bold py-2.5 rounded-lg border border-border hover:border-text-muted transition-all uppercase tracking-wide text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Complete Modal -->
    <CompleteModal
      :is-open="showCompleteModal"
      :game="game"
      @close="showCompleteModal = false"
      @submit="handleComplete"
    />
  </div>

  <!-- Loading -->
  <div v-else class="text-center py-24">
    <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    <p class="text-text-muted">Cargando mision...</p>
  </div>
</template>

<script setup>
import apiClient from '~/services/axios'

const route = useRoute()
const router = useRouter()
const game = ref(null)
const showDeleteModal = ref(false)
const showCompleteModal = ref(false)

const fetchGame = async () => {
  try {
    const { data } = await apiClient.get(`/games/${route.params.id}`)
    game.value = data
  } catch (err) {
    console.error('Error fetching game:', err)
    router.push('/juegos')
  }
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const deleteGame = async () => {
  try {
    await apiClient.delete(`/games/${game.value.id}`)
    router.push('/juegos')
  } catch (err) {
    console.error('Error deleting game:', err)
    alert('Error al eliminar el juego')
  }
}

const openCompleteModal = () => {
  showCompleteModal.value = true
}

const handleComplete = async ({ rating, notes }) => {
  try {
    await apiClient.patch(`/games/${game.value.id}/complete`, { rating, notes })
    showCompleteModal.value = false
    await fetchGame()
  } catch (err) {
    console.error('Error completing game:', err)
    alert('Error al completar el juego')
  }
}

const parsedTags = computed(() => {
  if (!game.value?.tags) return []
  if (Array.isArray(game.value.tags)) {
    return game.value.tags
      .map(t => typeof t === 'object' ? t.name : t)
      .filter(Boolean)
  }
  return game.value.tags.split(',').map(t => t.trim()).filter(Boolean)
})

const statusLabel = computed(() => (game.value?.completedAt ? 'Completado' : 'Pendiente'))
const statusClass = computed(() => (game.value?.completedAt ? 'text-success' : 'text-warning'))
const statusDotClass = computed(() => (game.value?.completedAt ? 'bg-success' : 'bg-warning'))

const priorityClass = computed(() => {
  const p = game.value?.priority || 0
  if (p >= 8) return 'bg-secondary text-white'
  if (p >= 5) return 'bg-warning text-background'
  return 'bg-success text-background'
})

const metacriticColor = computed(() => {
  const score = game.value?.metacriticScore || 0
  if (score >= 75) return 'text-success'
  if (score >= 50) return 'text-warning'
  return 'text-secondary'
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchGame()
})
</script>
