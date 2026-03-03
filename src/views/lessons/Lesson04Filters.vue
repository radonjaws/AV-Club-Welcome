<template>
  <LessonLayout
    :lesson-num="4"
    title="Filters"
    subtitle="Shaping the frequency content of a signal"
    duration="12 min"
  >
    <template #controls>
      <SliderControl label="Source Frequency" :min="80" :max="1000" :step="1" unit="Hz" v-model="sourceFreq" />
      <SliderControl label="Cutoff" :min="100" :max="4000" :step="10" unit="Hz" v-model="cutoff" />
      <SliderControl label="Resonance (Q)" :min="0.1" :max="20" :step="0.1" unit="" v-model="q" />
      <div class="mt-4">
        <p class="text-xs text-audio-muted uppercase tracking-widest mb-2">Filter Type</p>
        <div class="flex gap-2 flex-wrap">
          <button v-for="type in filterTypes" :key="type" @click="filterType = type"
            class="px-3 py-1 rounded text-sm capitalize transition-colors"
            :class="filterType === type
              ? 'bg-audio-accent text-audio-bg font-semibold'
              : 'bg-audio-surface text-audio-muted border border-audio-border hover:border-audio-accent'">
            {{ type }}
          </button>
        </div>
      </div>
      <button @click="togglePlay" class="mt-4 w-full py-2 rounded font-semibold transition-colors"
        :class="isPlaying ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-audio-accent hover:bg-audio-accent/80 text-audio-bg'">
        {{ isPlaying ? 'Stop' : 'Play' }}
      </button>
    </template>

    <template #visualization>
      <SpectrumCanvas :analyser="analyserNode" />
    </template>

    <template #math>
      <MathBlock expression="H(f) = \frac{1}{1 + j(f / f_c)}" />
      <p class="text-audio-muted text-sm mt-3 leading-relaxed">
        A filter's transfer function <em>H(f)</em> describes how each frequency is
        attenuated or amplified. The cutoff frequency <em>f<sub>c</sub></em> marks the
        −3 dB point; resonance (Q) controls the sharpness of the rolloff.
      </p>
    </template>

    <template #context>
      Filters are everywhere: high-pass filters remove rumble from microphones, low-pass
      filters smooth out harsh transients, and parametric EQ bands are tunable
      bandpass/notch filters. The BiquadFilterNode used here is the same circuit found
      in hardware analog gear.
    </template>
  </LessonLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import LessonLayout from '@/components/layout/LessonLayout.vue'
import SpectrumCanvas from '@/components/canvas/SpectrumCanvas.vue'
import MathBlock from '@/components/ui/MathBlock.vue'
import SliderControl from '@/components/ui/SliderControl.vue'
import { useAudioEngine } from '@/composables/useAudioEngine.js'

const sourceFreq = ref(220)
const cutoff = ref(800)
const q = ref(1)
const filterType = ref('lowpass')
const filterTypes = ['lowpass', 'highpass', 'bandpass', 'notch']

const { startOscillator, stopOscillator, setGain, setFilter, analyserNode, isPlaying } = useAudioEngine()

function togglePlay() {
  if (isPlaying.value) {
    stopOscillator()
  } else {
    startOscillator(sourceFreq.value, 'sawtooth')
    setGain(0.5)
    setFilter(filterType.value, cutoff.value, q.value)
  }
}

watch(cutoff, (c) => setFilter(filterType.value, c, q.value))
watch(q, (qv) => setFilter(filterType.value, cutoff.value, qv))
watch(filterType, (t) => setFilter(t, cutoff.value, q.value))
watch(sourceFreq, (f) => { if (isPlaying.value) startOscillator(f, 'sawtooth') })
</script>
