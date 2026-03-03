<template>
  <canvas
    ref="canvasEl"
    class="w-full rounded"
    :width="width"
    :height="height"
  />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAnimationFrame } from '@/composables/useAnimationFrame.js'

const props = defineProps({
  analyser: { type: Object, default: null },
  color: { type: String, default: '#00d4ff' },   // signal-blue
  bgColor: { type: String, default: '#0a0e0a' },
  width: { type: Number, default: 512 },
  height: { type: Number, default: 160 },
  active: { type: Boolean, default: false },
  maxFreq: { type: Number, default: 5000 }       // Hz to show on right edge
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

  // Grid
  ctx.strokeStyle = '#1a2e1a'
  ctx.lineWidth = 1
  for (let i = 1; i <= 4; i++) {
    const y = (H / 4) * i
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  if (!props.analyser || !props.active) {
    ctx.strokeStyle = props.color + '33'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W, H); ctx.stroke()
    return
  }

  const bufLen = props.analyser.frequencyBinCount
  if (!dataBuffer || dataBuffer.length !== bufLen) {
    dataBuffer = new Uint8Array(bufLen)
  }
  props.analyser.getByteFrequencyData(dataBuffer)

  const sampleRate = props.analyser.context.sampleRate
  const binHz = sampleRate / (bufLen * 2)
  const maxBin = Math.min(bufLen - 1, Math.floor(props.maxFreq / binHz))

  const barW = W / maxBin
  const grad = ctx.createLinearGradient(0, H, 0, 0)
  grad.addColorStop(0, props.color + 'aa')
  grad.addColorStop(1, props.color)
  ctx.fillStyle = grad

  for (let i = 0; i < maxBin; i++) {
    const barH = (dataBuffer[i] / 255) * H
    const x = i * barW
    ctx.fillRect(x, H - barH, Math.max(1, barW - 1), barH)
  }

  // Frequency axis labels
  ctx.fillStyle = '#374151'
  ctx.font = '10px monospace'
  ctx.textAlign = 'center'
  const labels = [500, 1000, 2000, 4000]
  labels.forEach(hz => {
    if (hz <= props.maxFreq) {
      const binIdx = hz / binHz
      const x = (binIdx / maxBin) * W
      ctx.fillText(`${hz >= 1000 ? hz/1000 + 'k' : hz}`, x, H - 4)
    }
  })
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
