# AV Club Welcome — Dev Stack Tutorial

This guide introduces the technologies behind this project and walks through how the code is organized. You already know HTML and CSS — this builds on that foundation.

---

## Table of Contents

1. [The Big Picture](#1-the-big-picture)
2. [NPM and the Node Ecosystem](#2-npm-and-the-node-ecosystem)
3. [Vite — the Dev Server and Build Tool](#3-vite--the-dev-server-and-build-tool)
4. [Vue 3 — the JavaScript Framework](#4-vue-3--the-javascript-framework)
5. [Tailwind CSS — Utility-First Styling](#5-tailwind-css--utility-first-styling)
6. [Vue Router — Multi-Page Navigation](#6-vue-router--multi-page-navigation)
7. [KaTeX — Math Rendering](#7-katex--math-rendering)
8. [Web Audio API — the Sound Engine](#8-web-audio-api--the-sound-engine)
9. [Project File Map](#9-project-file-map)
10. [Components in Depth](#10-components-in-depth)
11. [Composables in Depth](#11-composables-in-depth)
12. [How a Lesson is Built](#12-how-a-lesson-is-built)
13. [Getting Started Locally](#13-getting-started-locally)

---

## 1. The Big Picture

This is a **single-page application (SPA)**. The browser loads one HTML file once, and JavaScript handles everything after that — navigation, audio, drawing — without ever requesting a new page from a server.

The stack in one sentence: **Vue 3** handles the UI, **Vite** runs the dev server and bundles the code, **Tailwind** handles styling, **Vue Router** handles navigation, and the browser's built-in **Web Audio API** produces sound.

```
Browser
 └── index.html          ← the one HTML file the server sends
      └── main.js        ← JavaScript entry point, mounts Vue
           └── App.vue   ← root Vue component (sidebar + router outlet)
                └── <RouterView> renders the current lesson or home page
```

---

## 2. NPM and the Node Ecosystem

**Node.js** is a JavaScript runtime that runs outside the browser — on your machine. **NPM** (Node Package Manager) comes with it and lets you install open-source libraries.

### Key commands

```bash
npm install          # reads package.json and downloads all dependencies
npm run dev          # starts the Vite dev server (live-reload preview)
npm run build        # compiles the project into static files in /dist
```

### `package.json`

Every Node project has a `package.json` that lists what the project needs:

```json
{
  "dependencies": {
    "vue": "^3.5.13",        // the framework — shipped to users
    "vue-router": "^4.5.0",  // navigation — shipped to users
    "katex": "^0.16.11"      // math rendering — shipped to users
  },
  "devDependencies": {
    "vite": "^6.1.0",              // build tool — dev only
    "@vitejs/plugin-vue": "^5.2.1", // teaches Vite to understand .vue files
    "tailwindcss": "^3.4.17"       // CSS utility framework — dev only
  }
}
```

`devDependencies` are tools used while building. `dependencies` are libraries that end up in the final app.

---

## 3. Vite — the Dev Server and Build Tool

**Vite** (pronounced "veet") does two jobs:

1. **During development** — serves files instantly with hot module replacement (HMR). When you save a file, the browser updates in under a second without a full reload.
2. **For production** — bundles and minifies everything into a handful of optimized files in the `dist/` folder.

You mostly don't need to think about Vite. Just run `npm run dev` and it takes care of itself.

---

## 4. Vue 3 — the JavaScript Framework

Vue is the heart of the project. It lets you write **components** — reusable pieces of UI that combine HTML, CSS, and JavaScript in a single `.vue` file.

### Single-File Components (`.vue` files)

Every `.vue` file has up to three sections:

```html
<template>
  <!-- HTML goes here. Vue adds extra powers like v-if, v-for, :prop, @event -->
</template>

<script setup>
  // JavaScript logic goes here.
  // "setup" means we use the modern Composition API.
</script>

<style>
  /* CSS scoped to this component (optional — we mostly use Tailwind instead) */
</style>
```

### Reactivity — `ref()`

The key idea in Vue is **reactivity**: when data changes, the UI updates automatically. You declare reactive data with `ref()`:

```js
import { ref } from 'vue'

const frequency = ref(440)   // a reactive number, starts at 440
frequency.value = 880        // updating .value triggers a UI re-render
```

In the template, you use the variable directly (Vue unwraps `.value` for you):

```html
<p>Current frequency: {{ frequency }} Hz</p>
```

### Binding data to HTML

| Syntax | What it does |
|--------|--------------|
| `{{ value }}` | Renders text content |
| `:prop="value"` | Binds a JS value to an HTML attribute or component prop |
| `@click="handler"` | Listens for a DOM event |
| `v-if="condition"` | Conditionally renders an element |
| `v-for="item in list"` | Renders a list of elements |
| `v-model="value"` | Two-way binding (reads and writes) |

### `watch()`

When you need to react to a value changing and run some code (not just update the template), use `watch`:

```js
watch(frequency, (newFreq) => {
  // called every time frequency.value changes
  startOscillator(newFreq, 'sine')
})
```

### `computed()`

A `computed` value is derived from other reactive data and updates automatically:

```js
const displayValue = computed(() =>
  props.decimals > 0
    ? props.modelValue.toFixed(props.decimals)
    : props.modelValue
)
```

---

## 5. Tailwind CSS — Utility-First Styling

Instead of writing custom CSS classes, **Tailwind** gives you hundreds of small utility classes that you apply directly in the HTML:

```html
<!-- Traditional CSS approach -->
<div class="card">...</div>   <!-- then write .card { padding: 20px; ... } somewhere -->

<!-- Tailwind approach -->
<div class="p-5 rounded-lg border border-gray-700 bg-gray-900">...</div>
```

Common patterns you'll see in this project:

| Class | What it does |
|-------|--------------|
| `flex`, `grid` | Flexbox / CSS Grid layout |
| `w-full`, `h-full` | 100% width / height |
| `px-5 py-3` | Padding: x-axis 5 units, y-axis 3 units |
| `text-sm`, `text-xs` | Font size |
| `text-gray-400` | Text color |
| `rounded-lg` | Border radius |
| `border border-panel-border` | Border with a custom color |
| `lg:hidden` | Hidden on large screens (responsive) |
| `hover:bg-panel-hover` | Background changes on hover |
| `transition-colors` | Smooth color transitions |

Custom colors like `signal-green`, `panel-bg`, `audio-accent` are defined in `tailwind.config.js`.

---

## 6. Vue Router — Multi-Page Navigation

**Vue Router** makes it look like there are multiple pages, even though it's one HTML file. It swaps out the component shown in `<RouterView>` based on the URL.

Routes are defined in [src/router/index.js](src/router/index.js):

```js
const routes = [
  { path: '/',          component: HomeView },
  { path: '/lesson/1',  component: Lesson01SineWaves },
  { path: '/lesson/2',  component: Lesson02Harmonics },
  // ...
]
```

In templates you use `<RouterLink>` instead of `<a>` to navigate without a page reload:

```html
<RouterLink to="/lesson/1">Go to Lesson 1</RouterLink>
```

And `<RouterView>` is the placeholder where the current route's component is rendered — you can see it in [src/App.vue](src/App.vue:31).

---

## 7. KaTeX — Math Rendering

**KaTeX** renders LaTeX math notation in the browser. The `MathBlock` component wraps it:

```html
<MathBlock expression="x(t) = A \cdot \sin(2\pi f t)" />
```

That renders as a properly typeset equation. The LaTeX string is passed as a prop, and KaTeX converts it to HTML with the right symbols and sizing.

---

## 8. Web Audio API — the Sound Engine

The **Web Audio API** is built into the browser — no library needed. It works like a signal chain of nodes you connect together:

```
OscillatorNode → GainNode → AnalyserNode → destination (speakers)
```

- **OscillatorNode** — generates a waveform (sine, square, sawtooth, triangle) at a given frequency
- **GainNode** — controls volume
- **AnalyserNode** — lets you read the audio data for visualization (without affecting the sound)
- **destination** — the browser's audio output (your speakers/headphones)

You create nodes from an `AudioContext`:

```js
const ctx = new AudioContext()
const osc = ctx.createOscillator()
const gain = ctx.createGain()

osc.frequency.value = 440    // A4
osc.type = 'sine'
gain.gain.value = 0.4

osc.connect(gain)
gain.connect(ctx.destination)
osc.start()
```

---

## 9. Project File Map

```
src/
├── main.js                        ← Entry point: creates the Vue app
├── App.vue                        ← Root layout: sidebar + router outlet
├── style.css                      ← Global CSS (mostly Tailwind base styles)
│
├── router/
│   └── index.js                   ← Route definitions and lesson metadata
│
├── composables/                   ← Reusable logic (no UI)
│   ├── useAudioEngine.js          ← All Web Audio API operations
│   └── useAnimationFrame.js       ← requestAnimationFrame loop helper
│
├── components/
│   ├── layout/
│   │   ├── AppSidebar.vue         ← Navigation sidebar
│   │   └── LessonLayout.vue       ← Shared page structure for every lesson
│   ├── canvas/
│   │   ├── WaveformCanvas.vue     ← Draws the time-domain waveform
│   │   └── SpectrumCanvas.vue     ← Draws the frequency spectrum (FFT)
│   └── ui/
│       ├── SliderControl.vue      ← Labeled range input with live value display
│       └── MathBlock.vue          ← KaTeX equation renderer
│
└── views/
    ├── HomeView.vue               ← Landing / lesson index page
    └── lessons/
        ├── Lesson01SineWaves.vue
        ├── Lesson02Harmonics.vue
        ├── Lesson03FreqTimeDomain.vue
        ├── Lesson04Filters.vue
        ├── Lesson05Envelopes.vue
        └── Lesson06Modulation.vue
```

---

## 10. Components in Depth

### Props — passing data into a component

Props are how a parent passes data down to a child component. In the child, you declare what props it accepts:

```js
// SliderControl.vue
const props = defineProps({
  label: { type: String, required: true },
  min:   { type: Number, default: 0 },
  max:   { type: Number, default: 100 },
  modelValue: { type: Number, required: true },
  unit:  { type: String, default: '' },
})
```

The parent then passes values using the `:prop="value"` binding syntax:

```html
<SliderControl
  label="Frequency"
  :min="80"
  :max="2000"
  v-model="frequency"
  unit="Hz"
/>
```

### `v-model` — two-way binding

`v-model` is shorthand for passing a value *and* listening for updates. `SliderControl` implements it by:
1. Accepting a `modelValue` prop (the current value, read from the parent)
2. Emitting an `update:modelValue` event when the slider moves (writes back to the parent)

```js
defineEmits(['update:modelValue'])
```

```html
<input
  :value="modelValue"
  @input="$emit('update:modelValue', Number($event.target.value))"
/>
```

### Slots — passing HTML into a component

Slots let a parent inject content into a child's template. `LessonLayout` uses **named slots** to accept different sections from each lesson:

```html
<!-- LessonLayout.vue defines the slots: -->
<div class="controls-panel">
  <slot name="controls" />     ← content injected here
</div>
<div class="visualization-panel">
  <slot name="visualization" /> ← content injected here
</div>
```

Each lesson fills those slots:

```html
<!-- Lesson01SineWaves.vue uses the layout: -->
<LessonLayout title="Sine Waves" :lesson-num="1">
  <template #controls>
    <SliderControl ... />
    <button>Play</button>
  </template>

  <template #visualization>
    <WaveformCanvas :analyser="analyserNode" />
  </template>
</LessonLayout>
```

This is how all six lessons share the same page structure without duplicating code.

### Lifecycle hooks — `onMounted`, `onUnmounted`

These run at specific moments in a component's life:

```js
onMounted(() => {
  draw()           // run the first draw as soon as the canvas is in the DOM
})

onUnmounted(() => {
  cleanup()        // stop audio / cancel animation when leaving the page
})
```

---

## 11. Composables in Depth

A **composable** is a function that packages reactive state and logic so multiple components can share it. By convention they're named `use___`.

### `useAnimationFrame` — [src/composables/useAnimationFrame.js](src/composables/useAnimationFrame.js)

`requestAnimationFrame` is the browser's built-in way to run code at the display's refresh rate (~60 times per second) — perfect for smooth animations.

```js
export function useAnimationFrame() {
  let rafId = null

  const start = (callback) => {
    const loop = () => {
      callback()                       // draw one frame
      rafId = requestAnimationFrame(loop) // schedule the next frame
    }
    rafId = requestAnimationFrame(loop)
  }

  const stop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)  // cancel the scheduled frame
      rafId = null
    }
  }

  onUnmounted(stop)  // auto-cleanup when the component is destroyed

  return { start, stop }
}
```

`WaveformCanvas` uses it like this:

```js
const { start, stop } = useAnimationFrame()

// When audio starts playing, begin the draw loop
watch(() => props.active, (val) => {
  if (val) start(draw)   // start calling draw() ~60x/sec
  else     stop()         // stop the loop
})
```

### `useAudioEngine` — [src/composables/useAudioEngine.js](src/composables/useAudioEngine.js)

This composable owns all Web Audio state and exposes clean functions for each lesson to call:

```js
export function useAudioEngine() {
  const isPlaying = ref(false)
  const analyserNode = shallowRef(null)  // shallowRef: Vue won't deeply watch AudioNode internals

  // ... internal audio nodes (not reactive — they don't need to be) ...

  const startOscillator = (freq = 440, type = 'sine') => { ... }
  const stopOscillator  = () => { ... }
  const setGain         = (val) => { ... }
  const setFilter       = (type, cutoff, q) => { ... }
  const triggerEnvelope = (freq, type, { attack, decay, sustain, release }) => { ... }
  const setLfo          = (rate, depth, target) => { ... }
  const startAdditive   = (harmonicAmplitudes) => { ... }

  onUnmounted(cleanup)   // close AudioContext when leaving the page

  return { isPlaying, analyserNode, startOscillator, stopOscillator, ... }
}
```

A lesson imports only what it needs:

```js
// Lesson 1 only needs basic oscillator control
const { startOscillator, stopOscillator, setGain, analyserNode, isPlaying } = useAudioEngine()
```

**Key design detail:** `analyserNode` is returned and passed directly to `WaveformCanvas` as a prop. The canvas reads audio data from it on every animation frame — the composable and the canvas component never need to know about each other directly.

---

## 12. How a Lesson is Built

Putting it all together, here's the complete data flow for Lesson 1:

```
Lesson01SineWaves.vue
│
├── reactive state
│   ├── frequency = ref(440)       ← bound to SliderControl via v-model
│   └── amplitude = ref(0.5)       ← bound to SliderControl via v-model
│
├── useAudioEngine()
│   ├── isPlaying                  ← controls Play/Stop button label and color
│   ├── analyserNode               ← passed to WaveformCanvas as a prop
│   ├── startOscillator(freq)      ← called on Play button click
│   ├── stopOscillator()           ← called on Stop button click
│   └── setGain(amplitude)         ← called whenever amplitude slider moves
│
├── watch(frequency)               ← restarts oscillator live when slider moves
├── watch(amplitude)               ← updates gain live when slider moves
│
└── LessonLayout (slots)
    ├── #controls  → SliderControl × 2, Play/Stop button
    ├── #visualization → WaveformCanvas (reads analyserNode every frame)
    ├── #math      → MathBlock (renders LaTeX equation)
    └── #context   → plain text paragraph
```

Every other lesson follows this same pattern — swap in different composable functions and different sliders, and you have a new interactive lesson.

---

## 13. Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org) (LTS version recommended) — this also installs NPM

### Steps

```bash
# 1. Clone the repo (if you haven't already)
git clone https://github.com/your-org/AV-Club-Welcome.git
cd AV-Club-Welcome

# 2. Install dependencies (only needed once, or after package.json changes)
npm install

# 3. Start the dev server
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`). Open it in your browser. Changes you make to any `.vue` file will appear instantly.

### Build for production

```bash
npm run build
```

This creates a `dist/` folder with static files you can deploy anywhere.

---

### Quick Vocabulary Reference

| Term | Meaning |
|------|---------|
| **SPA** | Single-Page Application — one HTML file, JS handles navigation |
| **Component** | A reusable piece of UI in a `.vue` file |
| **Composable** | A reusable function that packages reactive logic |
| **Props** | Data passed from a parent component into a child |
| **Emit** | An event a child sends back up to its parent |
| **Slot** | A placeholder where a parent can inject HTML into a child |
| **Reactive** | Data that automatically updates the UI when it changes |
| **`ref()`** | Makes a value reactive |
| **`computed()`** | A reactive value derived from other reactive values |
| **`watch()`** | Runs code when a reactive value changes |
| **HMR** | Hot Module Replacement — live browser updates during dev |
| **AudioContext** | The root object of the Web Audio API |
| **AnalyserNode** | Reads audio data for visualization without affecting the sound |
