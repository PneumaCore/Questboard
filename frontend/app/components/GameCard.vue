<template>
  <div class="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary transition-colors group relative flex flex-col">
    <!-- Cover Image Hero -->
    <div v-if="game.coverImage" class="h-36 w-full overflow-hidden">
      <img
        :src="game.coverImage"
        alt="cover"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      >
    </div>

    <!-- Priority Badge (KPI estilo mision) -->
    <div
      :class="priorityClass"
      class="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg z-10 border border-white/10 text-center"
    >
      <span class="block text-[10px] opacity-80 leading-none">Priority</span>
      <span class="text-lg leading-none">{{ Math.round(game.priority) ?? '-' }}</span>
    </div>

    <div class="p-6 flex flex-col flex-grow">
      <!-- Header -->
      <div class="mb-4 pr-16">
        <h3 class="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors truncate">
          {{ game.name }}
        </h3>
        <p class="text-accent text-sm font-medium">{{ game.category }}</p>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in parsedTags"
          :key="tag"
          class="px-2 py-1 bg-background text-text-muted text-xs rounded-md border border-border"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Status & Rating -->
      <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div class="bg-background rounded-lg p-3 border border-border">
          <p class="text-text-muted text-xs mb-1">Status</p>
          <p :class="statusClass" class="font-bold text-sm flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" :class="statusDotClass"></span>
            {{ statusLabel }}
          </p>
        </div>
        <div class="bg-background rounded-lg p-3 border border-border">
          <p class="text-text-muted text-xs mb-1">Rating</p>
          <div class="flex gap-0.5">
            <span
              v-for="n in 5"
              :key="n"
              class="text-base"
              :class="n <= (game.rating || 0) ? 'text-warning' : 'text-surface-light'"
            >
              ★
            </span>
          </div>
        </div>
      </div>

      <!-- Completion Info -->
      <div v-if="game.completedAt" class="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
        <div class="flex items-center gap-2 text-success text-xs font-bold mb-1">
          <span>✓</span> Completed
        </div>
        <p class="text-text-muted text-xs">{{ formatDate(game.completedAt) }}</p>
      </div>

      <!-- Notes -->
      <div v-if="game.notes" class="mb-4 text-xs text-text-muted italic border-l-2 border-primary/50 pl-3 py-1 bg-background/30 rounded-r">
        "{{ game.notes }}"
      </div>

      <!-- Actions -->
      <div class="flex gap-2 mt-auto pt-4 border-t border-border">
        <NuxtLink
          :to="`/juegos/edicion/${game.id}`"
          class="flex-1 py-2.5 text-center text-xs font-bold bg-surface-light text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-background transition-all uppercase tracking-wide"
        >
          Edit
        </NuxtLink>
        <button
          @click="$emit('delete', game.id)"
          class="flex-1 py-2.5 text-xs font-bold bg-surface-light text-secondary border border-secondary/30 rounded-lg hover:bg-secondary hover:text-white transition-all uppercase tracking-wide"
        >
          Delete
        </button>
        <button
          v-if="!game.completedAt"
          @click="$emit('complete', game)"
          class="flex-1 py-2.5 text-xs font-bold bg-surface-light text-success border border-success/30 rounded-lg hover:bg-success hover:text-background transition-all uppercase tracking-wide"
        >
          Complete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

defineEmits(['delete', 'complete'])

const parsedTags = computed(() => {
  if (!props.game.tags) return []
  if (Array.isArray(props.game.tags)) {
    return props.game.tags
      .map(t => typeof t === 'object' ? t.name : t)
      .filter(Boolean)
  }
  return props.game.tags.split(',').map(t => t.trim()).filter(Boolean)
})

const statusLabel = computed(() => (props.game.completedAt ? 'Completed' : 'Pending'))
const statusClass = computed(() => (props.game.completedAt ? 'text-success' : 'text-warning'))
const statusDotClass = computed(() => (props.game.completedAt ? 'bg-success' : 'bg-warning'))

const priorityClass = computed(() => {
  const p = props.game.priority || 0
  if (p >= 8) return 'bg-secondary text-white'
  if (p >= 5) return 'bg-warning text-background'
  return 'bg-success text-background'
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
