<template>
  <LessonLayout
    :lesson-num="5"
    title="Envelopes"
    subtitle="Shaping amplitude over time with ADSR"
    duration="10 min"
  >
    <template #controls>
      <SliderControl label="Frequency" :min="80" :max="1000" :step="1" unit="Hz" v-model="frequency" />
      <SliderControl label="Attack" :min="0.001" :max="2" :step="0.001" unit="s" v-model="attack" />
      <SliderControl label="Decay" :min="0.001" :max="2" :step="0.001" unit="s" v-model="decay" />
      <SliderControl label="Sustain" :min="0" :max="1" :step="0.01" unit="" v-model="sustain" />
      <SliderControl label="Release" :min="0.001" :max="4" :step="0.001" unit="s" v-model="release" />
      <button @click="trigger" class="mt-4 w-full py-2 rounded font-semibold bg-audio-accent hover:bg-audio-accent/80 text-audio-bg transition-colors">
        Trigger Note
      </button>
    </template>

    <template #visualization>
      <WaveformCanvas :analyser="analyserNode" />
    </template>

    <template #math>
      <MathBlock expression="g(t) = \begin{cases} t/A & 0 \le t < A \\ 1 - (1-S)(t-A)/D & A \le t < A+D \\ S & \text{held} \\ S \cdot e^{-(t-t_r)/R} & \text{release} \end{cases}" />
      <p class="text-audio-muted text-sm mt-3 leading-relaxed">
        An ADSR envelope shapes the gain of a signal over time. Attack sets how quickly
        it rises, Decay how it settles, Sustain the held level, and Release how it fades
        after the note is released.
      </p>
    </template>

    <template #context>
      Every synthesiser and sampler uses envelopes. Percussion sounds have fast attacks
      and short releases; pads have slow attacks and long releases. The envelope applied
      here directly modulates a GainNode in the Web Audio graph.
    </template>
  </LessonLayout>
</template>

<script setup>
import { ref } from 'vue'
import LessonLayout from '@/components/layout/LessonLayout.vue'
import WaveformCanvas from '@/components/canvas/WaveformCanvas.vue'
import MathBlock from '@/components/ui/MathBlock.vue'
import SliderControl from '@/components/ui/SliderControl.vue'
import { useAudioEngine } from '@/composables/useAudioEngine.js'

const frequency = ref(440)
const attack  = ref(0.05)
const decay   = ref(0.1)
const sustain = ref(0.7)
const release = ref(0.5)

const { triggerEnvelope, analyserNode } = useAudioEngine()

function trigger() {
  triggerEnvelope(frequency.value, 'sine', {
    attack:  attack.value,
    decay:   decay.value,
    sustain: sustain.value,
    release: release.value,
  })
}
</script>
