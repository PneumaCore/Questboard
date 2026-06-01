<template>
  <div>
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-black text-white tracking-tight mb-2">NUEVA MISION</h1>
      <p class="text-text-muted text-sm">Anade un nuevo contrato a tu tablero</p>
    </div>
    <GameForm @submit="createGame" />
  </div>
</template>

<script setup>
import apiClient from '~/services/axios'

const router = useRouter()

/**
 * Creates a new game via API and redirects to the games list.
 */
const createGame = async (formData) => {
  try {
    await apiClient.post('/games', {
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
    console.error('Error creating game:', err)
    alert(err.response?.data?.error || 'Error al crear el juego')
  }
}
</script>
