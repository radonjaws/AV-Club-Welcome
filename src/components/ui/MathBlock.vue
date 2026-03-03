<template>
  <div class="my-2 overflow-x-auto" v-html="rendered" />
</template>

<script setup>
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps({
  expression: { type: String, required: true },
})

const rendered = computed(() =>
  katex.renderToString(props.expression, { displayMode: true, throwOnError: false })
)
</script>
