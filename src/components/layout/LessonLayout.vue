<template>
  <div class="max-w-5xl mx-auto px-6 py-8">

    <!-- Lesson header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <span class="text-xs font-bold px-2 py-0.5 rounded bg-panel-border text-gray-400 uppercase tracking-wider">
          Lesson {{ lessonNum }}
        </span>
        <span class="text-xs text-gray-500">{{ duration }}</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-100">{{ title }}</h1>
      <p v-if="subtitle" class="text-gray-400 mt-1 text-sm">{{ subtitle }}</p>
    </div>

    <!-- Interactive section: controls + visualization side by side -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
      <div class="bg-panel-bg rounded-lg border border-panel-border p-5">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Controls</h2>
        <slot name="controls" />
      </div>
      <div class="bg-screen-bg rounded-lg border border-panel-border p-4 flex flex-col gap-3">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500">Visualization</h2>
        <slot name="visualization" />
      </div>
    </div>

    <!-- Math section -->
    <div class="bg-panel-bg rounded-lg border border-panel-border p-5 mb-5">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">The Math</h2>
      <slot name="math" />
    </div>

    <!-- Engineering context / course connection -->
    <div v-if="$slots.context" class="bg-panel-bg rounded-lg border border-signal-blue/20 p-5 mb-8">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-signal-blue mb-3">
        Course Connection
      </h2>
      <slot name="context" />
    </div>

    <!-- Prev / Next navigation -->
    <div class="flex items-center justify-between pt-4 border-t border-panel-border">
      <RouterLink
        v-if="lessonNum > 1"
        :to="`/lesson/${lessonNum - 1}`"
        class="flex items-center gap-2 text-sm text-gray-400 hover:text-signal-green transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Lesson {{ lessonNum - 1 }}
      </RouterLink>
      <span v-else />

      <RouterLink
        v-if="lessonNum < 6"
        :to="`/lesson/${lessonNum + 1}`"
        class="flex items-center gap-2 text-sm text-gray-400 hover:text-signal-green transition-colors"
      >
        Lesson {{ lessonNum + 1 }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </RouterLink>
      <span v-else />
    </div>

  </div>
</template>

<script setup>
defineProps({
  lessonNum: { type: Number, required: true },
  title: { type: String, required: true },
  duration: { type: String, default: '' },
  subtitle: { type: String, default: '' }
})
</script>
