import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const lessons = [
  {
    num: 1,
    title: 'Sine Waves',
    duration: '~10 min',
    description: 'Explore frequency and amplitude with real-time audio and waveform visualization.',
    path: '/lesson/1',
    component: () => import('@/views/lessons/Lesson01SineWaves.vue')
  },
  {
    num: 2,
    title: 'Harmonics & Additive Synthesis',
    duration: '~12 min',
    description: 'Stack harmonics to build complex waveforms. Discover the Fourier series.',
    path: '/lesson/2',
    component: () => import('@/views/lessons/Lesson02Harmonics.vue')
  },
  {
    num: 3,
    title: 'Frequency vs Time Domain',
    duration: '~8 min',
    description: 'See the same signal as a waveform and as a spectrum — two views of one truth.',
    path: '/lesson/3',
    component: () => import('@/views/lessons/Lesson03FreqTimeDomain.vue')
  },
  {
    num: 4,
    title: 'Filters & Subtractive Synthesis',
    duration: '~12 min',
    description: 'Shape tone by removing harmonics with lowpass, highpass, and bandpass filters.',
    path: '/lesson/4',
    component: () => import('@/views/lessons/Lesson04Filters.vue')
  },
  {
    num: 5,
    title: 'Envelopes & Time',
    duration: '~10 min',
    description: 'ADSR envelopes model how sounds evolve — from piano attacks to organ sustains.',
    path: '/lesson/5',
    component: () => import('@/views/lessons/Lesson05Envelopes.vue')
  },
  {
    num: 6,
    title: 'Modulation',
    duration: '~8 min',
    description: 'LFOs create vibrato, tremolo, and auto-wah. The math behind AM sidebands.',
    path: '/lesson/6',
    component: () => import('@/views/lessons/Lesson06Modulation.vue')
  }
]

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Home' }
  },
  ...lessons.map(l => ({
    path: l.path,
    name: `lesson-${l.num}`,
    component: l.component,
    meta: { title: l.title, duration: l.duration, lessonNum: l.num }
  }))
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
