<template>
  <LessonLayout
    :lesson-num="6"
    title="Modulation"
    subtitle="Using one signal to control another"
    duration="8 min"
  >
    <template #controls>
      <SliderControl label="Carrier Freq" :min="80" :max="1000" :step="1" unit="Hz" v-model="carrierFreq" />
      <SliderControl label="LFO Rate" :min="0.1" :max="20" :step="0.1" unit="Hz" v-model="lfoRate" />
      <SliderControl label="LFO Depth" :min="0" :max="1" :step="0.01" unit="" v-model="lfoDepth" />
      <div class="mt-4">
        <p class="text-xs text-audio-muted uppercase tracking-widest mb-2">Modulation Target</p>
        <div class="flex gap-2">
          <button v-for="target in targets" :key="target" @click="modTarget = target"
            class="px-3 py-1 rounded text-sm capitalize transition-colors"
            :class="modTarget === target
              ? 'bg-audio-accent text-audio-bg font-semibold'
              : 'bg-audio-surface text-audio-muted border border-audio-border hover:border-audio-accent'">
            {{ target }}
          </button>
        </div>
      </div>
      <button @click="togglePlay" class="mt-4 w-full py-2 rounded font-semibold transition-colors"
        :class="isPlaying ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-audio-accent hover:bg-audio-accent/80 text-audio-bg'">
        {{ isPlaying ? 'Stop' : 'Play' }}
      </button>
    </template>

    <template #visualization>
      <WaveformCanvas :analyser="analyserNode" />
    </template>

    <template #math>
      <MathBlock expression="x(t) = A(t) \cdot \sin\!\left(2\pi f_c t + \phi(t)\right)" />
      <p class="text-audio-muted text-sm mt-3 leading-relaxed">
        Amplitude Modulation (AM) varies <em>A(t)</em> — heard as tremolo.
        Frequency Modulation (FM) varies the instantaneous frequency via <em>φ(t)</em>
        — heard as vibrato at low LFO rates, and rich timbral FM synthesis at audio rates.
      </p>
    </template>

    <template #context>
      LFO modulation below ~20 Hz creates musical effects (tremolo, vibrato, auto-wah).
      When the modulator rises into the audio range (above ~20 Hz), you enter FM
      synthesis territory — the same technique Yamaha used in the DX7.
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

const carrierFreq = ref(440)
const lfoRate  = ref(5)
const lfoDepth = ref(0.4)
const modTarget = ref('amplitude')
const targets = ['amplitude', 'frequency']

const { startOscillator, stopOscillator, setLfo, analyserNode, isPlaying } = useAudioEngine()

function togglePlay() {
  if (isPlaying.value) {
    stopOscillator()
  } else {
    startOscillator(carrierFreq.value, 'sine')
    setLfo(lfoRate.value, lfoDepth.value, modTarget.value)
  }
}

watch([lfoRate, lfoDepth, modTarget], ([r, d, t]) => {
  if (isPlaying.value) setLfo(r, d, t)
})
watch(carrierFreq, (f) => { if (isPlaying.value) startOscillator(f, 'sine') })
</script>
