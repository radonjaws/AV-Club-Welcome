<template>
  <div class="flex h-full">
    <!-- Sidebar -->
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/60 z-20 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0 lg:ml-64">
      <!-- Mobile header -->
      <header class="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-panel-border bg-panel-bg">
        <button
          class="p-1.5 rounded hover:bg-panel-hover transition-colors"
          aria-label="Open menu"
          @click="sidebarOpen = true"
        >
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span class="text-signal-green font-bold tracking-wider text-sm">AV CLUB</span>
      </header>

      <!-- Route content -->
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const sidebarOpen = ref(false)
</script>
