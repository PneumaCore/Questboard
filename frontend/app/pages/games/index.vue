<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-black text-white mb-1 tracking-tight">MIS MISIONES</h1>
        <p class="text-text-muted text-sm">{{ filteredGames.length }} contratos activos</p>
      </div>
      <NuxtLink
        to="/juegos/nuevo"
        class="px-6 py-3 bg-primary text-background font-black rounded-xl hover:bg-white hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 text-sm uppercase tracking-wider"
      >
        <span class="text-lg leading-none">+</span> Nueva Mision
      </NuxtLink>
    </div>

    <!-- Filters & Sorting Panel -->
    <div class="bg-surface border border-border rounded-xl p-5 mb-8 shadow-lg shadow-black/10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <input
            v-model="filters.name"
            @input="applyFilters"
            type="text"
            placeholder="Buscar por nombre..."
            class="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          >
        </div>

        <select
          v-model="filters.category"
          @change="applyFilters"
          class="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
        >
          <option value="">Todas las categorias</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <input
          v-model="filters.tags"
          @input="applyFilters"
          type="text"
          placeholder="Filtrar por etiquetas..."
          class="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        >

        <select
          v-model="sortBy"
          @change="applyFilters"
          class="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
        >
          <option value="priority_desc">Prioridad (Alta primero)</option>
          <option value="priority_asc">Prioridad (Baja primero)</option>
          <option value="completed">Completados primero</option>
          <option value="pending">Pendientes primero</option>
        </select>
      </div>
    </div>

    <!-- Games Grid -->
    <div v-if="filteredGames.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <GameCard
        v-for="game in filteredGames"
        :key="game.id"
        :game="game"
        @delete="confirmDelete"
        @complete="openCompleteModal"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-24">
      <div class="text-6xl mb-4 opacity-20">🎮</div>
      <p class="text-text-muted text-lg mb-2">No se encontraron misiones</p>
      <p class="text-text-muted/60 text-sm">Ajusta los filtros o empieza tu primera quest</p>
    </div>

    <!-- Delete Confirmation Modal -->
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

    <!-- Complete Game Modal -->
    <CompleteModal
      :is-open="showCompleteModal"
      :game="selectedGame"
      @close="showCompleteModal = false"
      @submit="handleComplete"
    />
  </div>
</template>

<script setup>
import apiClient from '~/services/axios'

const games = ref([])
const filteredGames = ref([])
const categories = ref([])
const sortBy = ref('priority_desc')

const filters = reactive({
  name: '',
  category: '',
  tags: ''
})

const showDeleteModal = ref(false)
const showCompleteModal = ref(false)
const selectedGame = ref(null)
const gameToDelete = ref(null)

/**
 * Fetches the authenticated user's games from the API.
 */
const fetchGames = async () => {
  try {
    const { data } = await apiClient.get('/games')
    games.value = data
    applyFilters()

    // Extract unique categories for the filter selector
    const cats = new Set(data.map(g => g.category).filter(Boolean))
    categories.value = Array.from(cats)
  } catch (err) {
    console.error('Error fetching games:', err)
  }
}

/**
 * Applies active filters and sorting to the raw games list.
 */
const applyFilters = () => {
  let result = [...games.value]

  if (filters.name) {
    result = result.filter(g => g.name.toLowerCase().includes(filters.name.toLowerCase()))
  }
  if (filters.category) {
    result = result.filter(g => g.category === filters.category)
  }
  if (filters.tags) {
    const tagQuery = filters.tags.toLowerCase()
    result = result.filter(g => {
      const tagNames = Array.isArray(g.tags)
        ? g.tags.map(t => typeof t === 'object' ? t.name : t)
        : []
      const tagStr = tagNames.join(',')
      return tagStr.toLowerCase().includes(tagQuery)
    })
  }

  // Sorting logic
  switch (sortBy.value) {
    case 'priority_desc':
      result.sort((a, b) => (b.priority || 0) - (a.priority || 0))
      break
    case 'priority_asc':
      result.sort((a, b) => (a.priority || 0) - (b.priority || 0))
      break
    case 'completed':
      result.sort((a, b) => (a.completedAt ? -1 : 1) - (b.completedAt ? -1 : 1))
      break
    case 'pending':
      result.sort((a, b) => (a.completedAt ? 1 : -1) - (b.completedAt ? 1 : -1))
      break
  }

  filteredGames.value = result
}

const confirmDelete = (id) => {
  gameToDelete.value = id
  showDeleteModal.value = true
}

const deleteGame = async () => {
  try {
    await apiClient.delete(`/games/${gameToDelete.value}`)
    games.value = games.value.filter(g => g.id !== gameToDelete.value)
    applyFilters()
    showDeleteModal.value = false
  } catch (err) {
    console.error('Error deleting game:', err)
  }
}

const openCompleteModal = (game) => {
  selectedGame.value = game
  showCompleteModal.value = true
}

const handleComplete = async ({ rating, notes }) => {
  try {
    await apiClient.patch(`/games/${selectedGame.value.id}/complete`, {
      rating,
      notes
    })
    showCompleteModal.value = false
    await fetchGames()
  } catch (err) {
    console.error('Error completing game:', err)
  }
}

onMounted(() => {
  fetchGames()
})
</script>
