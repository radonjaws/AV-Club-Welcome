<template>
  <LessonLayout
    :lesson-num="1"
    title="Sine Waves"
    subtitle="The fundamental unit of periodic sound"
    duration="10 min"
  >
    <template #controls>
      <SliderControl
        label="Frequency"
        :min="80"
        :max="2000"
        :step="1"
        unit="Hz"
        v-model="frequency"
      />
      <SliderControl
        label="Amplitude"
        :min="0"
        :max="1"
        :step="0.01"
        unit=""
        v-model="amplitude"
      />
      <button
        @click="togglePlay"
        class="mt-4 w-full py-2 rounded font-semibold transition-colors"
        :class="isPlaying
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-audio-accent hover:bg-audio-accent/80 text-audio-bg'"
      >
        {{ isPlaying ? 'Stop' : 'Play' }}
      </button>
    </template>

    <template #visualization>
      <WaveformCanvas :analyser="analyserNode" />
    </template>

    <template #math>
      <MathBlock expression="x(t) = A \cdot \sin(2\pi f t)" />
      <p class="text-audio-muted text-sm mt-3 leading-relaxed">
        A sine wave is fully described by its amplitude <em>A</em> and frequency <em>f</em>.
        Frequency determines pitch; amplitude determines loudness. All real-world sounds
        can be decomposed into sums of sine waves.
      </p>
    </template>

    <template #context>
      Sine waves appear throughout audio: as oscillator waveforms, as LFO modulation
      sources, and as the building blocks of Fourier analysis. Understanding their
      behaviour is prerequisite to everything else in signal processing.
    </template>
  </LessonLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import LessonLayout from '@/components/layout/LessonLayout.vue'
import WaveformCanvas from '@/components/canvas/WaveformCanvas.vue'
import MathBlock from '@/components/ui/MathBlock.vue'
import SliderControl from '@/components/ui/SliderControl.vue'
import { useAudioEngine } from '@/composables/useAudioEngine.js'

const frequency = ref(440)
const amplitude = ref(0.5)

const { startOscillator, stopOscillator, setGain, analyserNode, isPlaying } = useAudioEngine()

function togglePlay() {
  if (isPlaying.value) {
    stopOscillator()
  } else {
    startOscillator(frequency.value, 'sine')
    setGain(amplitude.value)
  }
}

watch(frequency, (f) => { if (isPlaying.value) startOscillator(f, 'sine') })
watch(amplitude, (a) => setGain(a))
</script>
