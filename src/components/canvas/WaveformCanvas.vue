<template>
  <canvas
    ref="canvasEl"
    class="w-full rounded"
    :width="width"
    :height="height"
  />
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useAnimationFrame } from '@/composables/useAnimationFrame.js'

const props = defineProps({
  analyser: { type: Object, default: null },   // Web Audio AnalyserNode
  color: { type: String, default: '#39ff14' }, // signal-green
  bgColor: { type: String, default: '#0a0e0a' },
  width: { type: Number, default: 512 },
  height: { type: Number, default: 160 },
  active: { type: Boolean, default: false }
})

const canvasEl = ref(null)
const { start, stop } = useAnimationFrame()

let dataBuffer = null

const draw = () => {
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height

  ctx.fillStyle = props.bgColor
  ctx.fillRect(0, 0, W, H)

  // Grid lines
  ctx.strokeStyle = '#1a2e1a'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = (H / 4) * i
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }
  for (let i = 0; i <= 4; i++) {
    const x = (W / 4) * i
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }

  if (!props.analyser || !props.active) {
    // Flat line
    ctx.strokeStyle = props.color + '44'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, H / 2)
    ctx.lineTo(W, H / 2)
    ctx.stroke()
    return
  }

  const bufLen = props.analyser.fftSize
  if (!dataBuffer || dataBuffer.length !== bufLen) {
    dataBuffer = new Float32Array(bufLen)
  }
  props.analyser.getFloatTimeDomainData(dataBuffer)

  ctx.strokeStyle = props.color
  ctx.lineWidth = 2
  ctx.shadowColor = props.color
  ctx.shadowBlur = 4
  ctx.beginPath()

  const sliceW = W / bufLen
  for (let i = 0; i < bufLen; i++) {
    const v = dataBuffer[i]
    const x = i * sliceW
    const y = ((1 - v) / 2) * H
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.shadowBlur = 0
}

watch(() => props.active, (val) => {
  if (val) start(draw)
  else { stop(); draw() }
})

onMounted(() => {
  draw()
  if (props.active) start(draw)
})
</script>
