<template>
  <form @submit.prevent="handleSubmit" class="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6 max-w-2xl mx-auto shadow-xl shadow-black/20">
    <!-- Name -->
    <div>
      <label class="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wider">Name</label>
      <input
        v-model="form.name"
        type="text"
        required
        class="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        placeholder="Enter game title..."
      >
    </div>

    <!-- RAWG Search -->
    <div ref="searchWrapper" class="relative">
      <label class="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wider">
        Buscar en RAWG
      </label>
      <input
        v-model="searchQuery"
        type="text"
        autocomplete="off"
        class="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        placeholder="Escribe para buscar y autocompletar..."
        @input="onSearchInput"
        @focus="onSearchFocus"
      >

      <!-- Loading spinner -->
      <div v-if="isSearching" class="absolute right-3 top-[38px]">
        <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Dropdown results -->
      <div
        v-if="showDropdown && searchResults.length"
        class="absolute z-10 w-full mt-1 bg-surface-light border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        <button
          v-for="game in searchResults"
          :key="game.id"
          type="button"
          class="w-full text-left px-4 py-3 hover:bg-background border-b border-border last:border-0 flex items-center gap-3 transition-colors"
          @click="selectGame(game)"
        >
          <img
            v-if="game.backgroundImage"
            :src="game.backgroundImage"
            class="w-10 h-10 object-cover rounded"
            alt="cover"
          >
          <div class="w-10 h-10 bg-surface rounded flex-shrink-0" v-else></div>
          <div class="min-w-0">
            <p class="text-white font-medium truncate">{{ game.name }}</p>
            <p class="text-text-muted text-xs truncate">
              <span v-if="game.category">{{ game.category }}</span>
              <span v-if="game.metacriticScore || game.hours" class="ml-2">
                <span v-if="game.metacriticScore">⭐ {{ game.metacriticScore }}</span>
                <span v-if="game.hours" class="ml-1">⏱ {{ game.hours }}h</span>
              </span>
              <span v-else class="ml-2">Sin datos extra</span>
            </p>
          </div>
        </button>
      </div>

      <p class="text-text-muted text-xs mt-1">
        Los campos se rellenarán automáticamente si el juego existe en la base de datos. Puedes editarlos manualmente si es necesario.
      </p>
    </div>

    <!-- Category -->
    <div>
      <label class="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wider">Category</label>
      <input
        v-model="form.category"
        type="text"
        required
        class="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        placeholder="e.g. RPG, Action, Strategy"
      >
    </div>

    <!-- Hours -->
    <div>
      <label class="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wider">Hours to Beat</label>
      <input
        v-model.number="form.hours"
        type="number"
        step="0.1"
        required
        class="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        placeholder="Estimated playtime in hours"
      >
    </div>

    <!-- Metacritic -->
    <div>
      <label class="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wider">Metacritic Score</label>
      <input
        v-model.number="form.metacriticScore"
        type="number"
        min="0"
        max="100"
        required
        class="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        placeholder="Score from 0 to 100"
      >
    </div>

    <!-- Tags -->
    <div>
      <label class="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wider">Tags</label>
      <input
        v-model="tagsInput"
        type="text"
        class="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        placeholder="open-world, multiplayer, story-rich (comma separated)"
      >
    </div>

    <div class="flex flex-col sm:flex-row gap-4 pt-4">
      <button
        type="submit"
        class="flex-1 bg-primary text-background font-bold py-3.5 rounded-lg hover:bg-white hover:shadow-lg hover:shadow-primary/25 transition-all uppercase tracking-wide"
      >
        {{ isEditing ? 'Save Changes' : 'Create Game' }}
      </button>
      <NuxtLink
        to="/juegos"
        class="flex-1 text-center bg-surface-light text-text-main font-bold py-3.5 rounded-lg border border-border hover:border-text-muted hover:bg-background transition-all uppercase tracking-wide"
      >
        Cancel
      </NuxtLink>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import apiClient from '~/services/axios'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  category: '',
  hours: null,
  metacriticScore: null,
  tags: []
})

const tagsInput = ref('')

// Estado de busqueda RAWG
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const showDropdown = ref(false)
const searchWrapper = ref(null)
let debounceTimer = null

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.name = newVal.name || ''
      form.category = newVal.category || ''
      form.hours = newVal.hours ?? null
      form.metacriticScore = newVal.metacriticScore ?? null
      tagsInput.value = Array.isArray(newVal.tags)
        ? newVal.tags.map(t => t.name || t).join(', ')
        : (newVal.tags || '')
    }
  },
  { immediate: true }
)

const onSearchInput = () => {
  clearTimeout(debounceTimer)
  if (!searchQuery.value || searchQuery.value.trim().length < 2) {
    searchResults.value = []
    showDropdown.value = false
    return
  }
  debounceTimer = setTimeout(() => performSearch(searchQuery.value.trim()), 400)
}

const onSearchFocus = () => {
  if (searchResults.value.length > 0) {
    showDropdown.value = true
  }
}

const performSearch = async (query) => {
  isSearching.value = true
  showDropdown.value = false
  try {
    const { data } = await apiClient.get('/rawg/search', {
      params: { q: query }
    })
    searchResults.value = data.results || []
    showDropdown.value = searchResults.value.length > 0
  } catch (err) {
    console.error('Error searching RAWG:', err)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

const selectGame = (game) => {
  searchQuery.value = ''
  searchResults.value = []
  showDropdown.value = false

  // Solo sobreescribimos si hay valor; de lo contrario dejamos el campo editable tal cual o vacio
  if (game.name) form.name = game.name
  if (game.category) form.category = game.category
  if (game.hours !== null && game.hours !== undefined) form.hours = game.hours
  if (game.metacriticScore !== null && game.metacriticScore !== undefined) form.metacriticScore = game.metacriticScore

  // Si RAWG trae generos, los sugerimos como tags si no habia nada
  if (game.genres && game.genres.length > 0 && !tagsInput.value.trim()) {
    tagsInput.value = game.genres.join(', ')
  }
}

const handleClickOutside = (event) => {
  if (searchWrapper.value && !searchWrapper.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleSubmit = () => {
  const tagsArray = tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)

  emit('submit', {
    name: form.name,
    category: form.category,
    hours: form.hours,
    metacriticScore: form.metacriticScore,
    tags: tagsArray
  })
}
</script>
