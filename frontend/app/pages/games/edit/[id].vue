<template>
  <div>
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-black text-white tracking-tight mb-2">EDITAR MISION</h1>
      <p class="text-text-muted text-sm">Actualiza los detalles de tu contrato</p>
    </div>
    <div v-if="isLoading" class="text-center text-text-muted py-12">
      <div class="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
      <p>Cargando datos...</p>
    </div>
    <GameForm v-else :initial-data="game" :is-editing="true" @submit="updateGame" />
  </div>
</template>

<script setup>
import apiClient from '~/services/axios'

const route = useRoute()
const router = useRouter()

const game = ref(null)
const isLoading = ref(true)

/**
 * Fetches the specific game data for editing.
 */
const fetchGame = async () => {
  try {
    const { data } = await apiClient.get(`/games/${route.params.id}`)
    game.value = data
  } catch (err) {
    console.error('Error fetching game:', err)
    router.push('/juegos')
  } finally {
    isLoading.value = false
  }
}

/**
 * Updates the game via API and redirects to the games list.
 */
const updateGame = async (formData) => {
  try {
    await apiClient.put(`/games/${route.params.id}`, {
      name: formData.name,
      category: formData.category,
      hours: formData.hours,
      metacriticScore: formData.metacriticScore,
      tags: formData.tags,
      coverImage: formData.coverImage,
      description: formData.description,
      platforms: formData.platforms,
      releaseDate: formData.releaseDate,
      developer: formData.developer,
      publisher: formData.publisher,
      ageRating: formData.ageRating,
      rawgId: formData.rawgId
    })
    router.push('/juegos')
  } catch (err) {
    console.error('Error updating game:', err)
    alert(err.response?.data?.error || 'Error al actualizar el juego')
  }
}

onMounted(() => {
  fetchGame()
})
</script>
