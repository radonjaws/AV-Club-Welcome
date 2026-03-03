<template>
  <LessonLayout
    :lesson-num="3"
    title="Frequency & Time Domain"
    subtitle="Two views of the same signal"
    duration="8 min"
  >
    <template #controls>
      <SliderControl label="Frequency" :min="80" :max="2000" :step="1" unit="Hz" v-model="frequency" />
      <SliderControl label="Amplitude" :min="0" :max="1" :step="0.01" unit="" v-model="amplitude" />
      <div class="mt-4">
        <p class="text-xs text-audio-muted uppercase tracking-widest mb-2">Waveform</p>
        <div class="flex gap-2 flex-wrap">
          <button v-for="shape in shapes" :key="shape" @click="waveform = shape"
            class="px-3 py-1 rounded text-sm capitalize transition-colors"
            :class="waveform === shape
              ? 'bg-audio-accent text-audio-bg font-semibold'
              : 'bg-audio-surface text-audio-muted border border-audio-border hover:border-audio-accent'">
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
        <div>
          <p class="text-xs text-audio-muted uppercase tracking-widest mb-1">Time Domain</p>
          <WaveformCanvas :analyser="analyserNode" />
        </div>
        <div>
          <p class="text-xs text-audio-muted uppercase tracking-widest mb-1">Frequency Domain</p>
          <SpectrumCanvas :analyser="analyserNode" />
        </div>
      </div>
    </template>

    <template #math>
      <MathBlock expression="\hat{x}(f) = \int_{-\infty}^{\infty} x(t)\, e^{-i 2\pi f t}\, dt" />
      <p class="text-audio-muted text-sm mt-3 leading-relaxed">
        The Fourier Transform converts a time-domain signal into the frequency domain.
        The top canvas shows amplitude vs. time; the bottom shows amplitude vs. frequency.
        A pure sine wave appears as a single spike in the spectrum.
      </p>
    </template>

    <template #context>
      DAWs, spectrum analysers, and equalizers all work in the frequency domain. When
      you notch out a resonance with an EQ, you're surgically editing a specific frequency
      bin — the Fourier Transform is what makes that possible.
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

const frequency = ref(440)
const amplitude = ref(0.5)
const waveform = ref('sine')
const shapes = ['sine', 'sawtooth', 'square', 'triangle']

const { startOscillator, stopOscillator, setGain, analyserNode, isPlaying } = useAudioEngine()

function togglePlay() {
  if (isPlaying.value) {
    stopOscillator()
  } else {
    startOscillator(frequency.value, waveform.value)
    setGain(amplitude.value)
  }
}

watch(frequency, (f) => { if (isPlaying.value) startOscillator(f, waveform.value) })
watch(waveform, (w) => { if (isPlaying.value) startOscillator(frequency.value, w) })
watch(amplitude, (a) => setGain(a))
</script>
