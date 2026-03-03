import { onUnmounted } from 'vue'

export function useAnimationFrame() {
  let rafId = null

  const start = (callback) => {
    const loop = () => {
      callback()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
  }

  const stop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  onUnmounted(stop)

  return { start, stop }
}
