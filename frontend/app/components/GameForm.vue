<template>
  <form @submit.prevent="handleSubmit" class="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6 max-w-2xl mx-auto shadow-xl shadow-black/20">
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
