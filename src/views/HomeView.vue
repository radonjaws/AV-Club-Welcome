<template>
  <div class="p-8 max-w-5xl mx-auto">
    <!-- Hero -->
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-white mb-3">AV Club Welcome</h1>
      <p class="text-audio-muted text-lg leading-relaxed max-w-2xl">
        An interactive introduction to audio engineering concepts. Explore sine waves,
        harmonics, frequency-domain analysis, filters, envelopes, and modulation — all
        with live audio and real-time visualizations.
      </p>
    </div>

    <!-- Lesson cards -->
    <h2 class="text-xs font-semibold uppercase tracking-widest text-audio-muted mb-4">
      Lessons
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="lesson in lessons"
        :key="lesson.num"
        :to="`/lesson/${lesson.num}`"
        class="group block bg-audio-surface border border-audio-border rounded-lg p-5 hover:border-audio-accent transition-colors"
      >
        <div class="flex items-start justify-between mb-3">
          <span class="text-2xl font-bold text-audio-accent font-mono">
            {{ String(lesson.num).padStart(2, '0') }}
          </span>
          <span class="text-xs text-audio-muted bg-audio-bg px-2 py-0.5 rounded-full">
            {{ lesson.duration }}
          </span>
        </div>
        <h3 class="text-white font-semibold mb-1 group-hover:text-audio-accent transition-colors">
          {{ lesson.title }}
        </h3>
        <p class="text-audio-muted text-sm leading-relaxed">{{ lesson.description }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
const lessons = [
  {
    num: 1,
    title: 'Sine Waves',
    duration: '10 min',
    description: 'The fundamental building block of sound. Control frequency and amplitude and hear the result in real time.',
  },
  {
    num: 2,
    title: 'Harmonics',
    duration: '12 min',
    description: 'Stack sine waves at integer multiples to build complex tones and explore the Fourier series.',
  },
  {
    num: 3,
    title: 'Frequency & Time Domain',
    duration: '8 min',
    description: 'See the same signal from two perspectives: as a waveform over time and as a spectrum of frequencies.',
  },
  {
    num: 4,
    title: 'Filters',
    duration: '12 min',
    description: 'Shape the frequency content of a signal with low-pass, high-pass, and band-pass filters.',
  },
  {
    num: 5,
    title: 'Envelopes',
    duration: '10 min',
    description: 'Control how sound evolves over time using Attack, Decay, Sustain, and Release parameters.',
  },
  {
    num: 6,
    title: 'Modulation',
    duration: '8 min',
    description: 'Use one signal to control another — the basis of vibrato, tremolo, FM synthesis, and beyond.',
  },
]
</script>
