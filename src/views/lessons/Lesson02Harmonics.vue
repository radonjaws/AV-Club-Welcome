<template>
  <LessonLayout
    :lesson-num="2"
    title="Harmonics"
    subtitle="Building complex tones from integer multiples"
    duration="12 min"
  >
    <template #controls>
      <SliderControl label="Fundamental" :min="80" :max="500" :step="1" unit="Hz" v-model="fundamental" />
      <SliderControl label="Amplitude" :min="0" :max="1" :step="0.01" unit="" v-model="amplitude" />
      <div class="mt-4">
        <p class="text-xs text-audio-muted uppercase tracking-widest mb-2">Waveform</p>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="shape in shapes"
            :key="shape"
            @click="waveform = shape"
            class="px-3 py-1 rounded text-sm capitalize transition-colors"
            :class="waveform === shape
              ? 'bg-audio-accent text-audio-bg font-semibold'
              : 'bg-audio-surface text-audio-muted border border-audio-border hover:border-audio-accent'"
          >
            {{ shape }}
          </button>
        </div>
      </div>
      <button @click="togglePlay" class="mt-4 w-full py-2 rounded font-semibold transition-colors"
        :class="isPlaying ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-audio-accent hover:bg-audio-accent/80 text-audio-bg'">
        {{ isPlaying ? 'Stop' : 'Play' }}
      </button>
    </template>

    <template #visualization>
      <div class="flex flex-col gap-3 h-full">
        <WaveformCanvas :analyser="analyserNode" class="flex-1" />
        <SpectrumCanvas :analyser="analyserNode" class="flex-1" />
      </div>
    </template>

    <template #math>
      <MathBlock expression="x(t) = \sum_{n=1}^{N} \frac{A}{n} \sin(2\pi n f_0 t)" />
      <p class="text-audio-muted text-sm mt-3 leading-relaxed">
        Harmonics are integer multiples of a fundamental frequency. A sawtooth wave
        contains all harmonics; a square wave contains only odd harmonics. The relative
        amplitudes of harmonics define a sound's timbre.
      </p>
    </template>

    <template #context>
      Every acoustic instrument produces a characteristic harmonic series. The ratio and
      rolloff of those harmonics is what makes a violin sound different from a trumpet
      at the same pitch.
    </template>
  </LessonLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import LessonLayout from '@/components/layout/LessonLayout.vue'
import WaveformCanvas from '@/components/canvas/WaveformCanvas.vue'
import SpectrumCanvas from '@/components/canvas/SpectrumCanvas.vue'
import MathBlock from '@/components/ui/MathBlock.vue'
import SliderControl from '@/components/ui/SliderControl.vue'
import { useAudioEngine } from '@/composables/useAudioEngine.js'

const fundamental = ref(220)
const amplitude = ref(0.5)
const waveform = ref('sawtooth')
const shapes = ['sine', 'sawtooth', 'square', 'triangle']

const { startOscillator, stopOscillator, setGain, analyserNode, isPlaying } = useAudioEngine()

function togglePlay() {
  if (isPlaying.value) {
    stopOscillator()
  } else {
    startOscillator(fundamental.value, waveform.value)
    setGain(amplitude.value)
  }
}

watch(fundamental, (f) => { if (isPlaying.value) startOscillator(f, waveform.value) })
watch(waveform, (w) => { if (isPlaying.value) startOscillator(fundamental.value, w) })
watch(amplitude, (a) => setGain(a))
</script>
