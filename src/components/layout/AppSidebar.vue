<template>
  <!-- Sidebar: fixed on lg+, slide-over on mobile -->
  <aside
    class="fixed top-0 left-0 h-full w-64 bg-panel-bg border-r border-panel-border z-30 flex flex-col
           transition-transform duration-200"
    :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Logo / title -->
    <div class="px-5 py-5 border-b border-panel-border">
      <RouterLink to="/" class="flex items-center gap-2.5 group" @click="$emit('close')">
        <!-- simple waveform icon -->
        <svg class="w-6 h-6 text-signal-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="2,12 5,12 7,4 9,20 11,10 13,14 15,8 17,16 19,12 22,12"/>
        </svg>
        <span class="text-signal-green font-bold tracking-widest text-sm uppercase">AV Club</span>
      </RouterLink>
      <p class="text-gray-500 text-xs mt-1.5 pl-8">Audio Engineering Intro</p>
    </div>

    <!-- Nav: Home -->
    <div class="px-3 pt-3">
      <RouterLink
        to="/"
        class="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-gray-400
               hover:bg-panel-hover hover:text-gray-100 transition-colors"
        :class="{ 'text-signal-green bg-panel-active': $route.path === '/' }"
        @click="$emit('close')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        Home
      </RouterLink>
    </div>

    <!-- Lessons label -->
    <div class="px-5 pt-5 pb-1">
      <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Lessons</span>
    </div>

    <!-- Lesson list -->
    <nav class="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
      <RouterLink
        v-for="lesson in lessons"
        :key="lesson.num"
        :to="lesson.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors group"
        :class="isActive(lesson.num)
          ? 'bg-panel-active text-signal-green'
          : 'text-gray-400 hover:bg-panel-hover hover:text-gray-100'"
        @click="$emit('close')"
      >
        <!-- Lesson number badge -->
        <span
          class="flex-shrink-0 w-5 h-5 rounded text-xs font-bold flex items-center justify-center"
          :class="isActive(lesson.num)
            ? 'bg-signal-green text-black'
            : 'bg-panel-border text-gray-500 group-hover:bg-gray-600 group-hover:text-gray-200'"
        >{{ lesson.num }}</span>

        <!-- Title + duration -->
        <div class="flex-1 min-w-0">
          <div class="truncate leading-tight">{{ lesson.title }}</div>
          <div class="text-xs text-gray-600 mt-0.5">{{ lesson.duration }}</div>
        </div>
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div class="px-5 py-3 border-t border-panel-border">
      <p class="text-xs text-gray-600">6 lessons · ~60 min</p>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { lessons } from '@/router/index.js'

defineProps({ open: Boolean })
defineEmits(['close'])

const route = useRoute()
const isActive = (num) => route.meta?.lessonNum === num
</script>
