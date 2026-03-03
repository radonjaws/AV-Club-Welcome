<template>
  <div class="flex flex-col gap-1.5">
    <div class="flex justify-between items-baseline">
      <label class="text-xs text-gray-400 uppercase tracking-wider">{{ label }}</label>
      <span class="text-xs font-mono text-signal-green">
        {{ displayValue }}<span v-if="unit" class="text-gray-500 ml-0.5">{{ unit }}</span>
      </span>
    </div>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      class="w-full accent-signal-green cursor-pointer"
      @input="$emit('update:modelValue', Number($event.target.value))"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  modelValue: { type: Number, required: true },
  unit: { type: String, default: '' },
  decimals: { type: Number, default: 0 }
})

defineEmits(['update:modelValue'])

const displayValue = computed(() =>
  props.decimals > 0
    ? props.modelValue.toFixed(props.decimals)
    : props.modelValue
)
</script>
