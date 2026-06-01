<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click.self="close"
      >
        <div class="bg-surface border border-border rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl shadow-primary/10">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-white mb-1">Complete Mission</h2>
            <p class="text-text-muted text-sm">{{ game?.name }}</p>
          </div>

          <div class="space-y-6">
            <!-- Rating -->
            <div>
              <label class="block text-sm font-bold text-text-muted mb-3 uppercase tracking-wider">Valoracion (1-5)</label>
              <div class="flex gap-2">
                <button
                  v-for="n in 5"
                  :key="n"
                  type="button"
                  @click="rating = n"
                  class="text-3xl transition-all duration-200 hover:scale-110"
                  :class="n <= rating ? 'text-warning drop-shadow-md' : 'text-surface-light hover:text-text-muted'"
                >
                  ★
                </button>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wider">Notas (opcional)</label>
              <textarea
                v-model="notes"
                rows="3"
                class="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                placeholder="Tus impresiones sobre el juego..."
              ></textarea>
            </div>
          </div>

          <div class="flex gap-3 mt-8">
            <button
              @click="submit"
              class="flex-1 bg-success text-background font-bold py-3 rounded-lg hover:bg-white hover:shadow-lg hover:shadow-success/25 transition-all uppercase tracking-wide"
            >
              Confirmar
            </button>
            <button
              @click="close"
              class="flex-1 bg-surface-light text-text-main font-bold py-3 rounded-lg border border-border hover:border-text-muted hover:bg-background transition-all uppercase tracking-wide"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  game: Object
})

const emit = defineEmits(['close', 'submit'])

const rating = ref(0)
const notes = ref('')

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      rating.value = 0
      notes.value = ''
    }
  }
)

const close = () => emit('close')

const submit = () => {
  emit('submit', { rating: rating.value, notes: notes.value })
}
</script>
