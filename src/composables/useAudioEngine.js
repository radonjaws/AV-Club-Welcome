import { ref, shallowRef, onUnmounted } from 'vue'

export function useAudioEngine() {
  const isPlaying = ref(false)
  const ctx = shallowRef(null)
  const analyserNode = shallowRef(null)

  let oscillators = []
  let gainNode = null
  let filterNode = null
  let lfoOsc = null
  let lfoGain = null

  const ensureContext = () => {
    if (!ctx.value) {
      ctx.value = new AudioContext()
      analyserNode.value = ctx.value.createAnalyser()
      analyserNode.value.fftSize = 2048
      analyserNode.value.smoothingTimeConstant = 0.8
      analyserNode.value.connect(ctx.value.destination)
    }
    if (ctx.value.state === 'suspended') ctx.value.resume()
    return ctx.value
  }

  // ── Stop all active nodes ──────────────────────────────────────────────────
  const stopOscillator = () => {
    oscillators.forEach(o => { try { o.stop(); o.disconnect() } catch {} })
    oscillators = []
    lfoOsc && (() => { try { lfoOsc.stop(); lfoOsc.disconnect() } catch {} })()
    lfoOsc = null
    lfoGain?.disconnect(); lfoGain = null
    gainNode?.disconnect(); gainNode = null
    filterNode?.disconnect(); filterNode = null
    isPlaying.value = false
  }

  // ── Single oscillator → gainNode → analyser ───────────────────────────────
  const startOscillator = (freq = 440, type = 'sine') => {
    stopOscillator()
    const ac = ensureContext()
    gainNode = ac.createGain()
    gainNode.gain.setValueAtTime(0.4, ac.currentTime)
    gainNode.connect(analyserNode.value)

    const osc = ac.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ac.currentTime)
    osc.connect(gainNode)
    osc.start()

    oscillators = [osc]
    isPlaying.value = true
  }

  // ── Gain helper ───────────────────────────────────────────────────────────
  const setGain = (val) => {
    if (gainNode && ctx.value) {
      gainNode.gain.setTargetAtTime(val, ctx.value.currentTime, 0.01)
    }
  }

  // ── Live filter (creates/updates BiquadFilterNode in the chain) ───────────
  const setFilter = (type = 'lowpass', cutoff = 1000, q = 1) => {
    if (!ctx.value || !gainNode) return
    const ac = ctx.value

    if (!filterNode) {
      // Insert filter between gainNode and analyser
      gainNode.disconnect()
      filterNode = ac.createBiquadFilter()
      gainNode.connect(filterNode)
      filterNode.connect(analyserNode.value)
    }

    filterNode.type = type
    filterNode.frequency.setTargetAtTime(cutoff, ac.currentTime, 0.01)
    filterNode.Q.setTargetAtTime(q, ac.currentTime, 0.01)
  }

  // ── ADSR envelope trigger ─────────────────────────────────────────────────
  const triggerEnvelope = (freq = 440, type = 'sine', { attack = 0.05, decay = 0.1, sustain = 0.7, release = 0.5 } = {}) => {
    stopOscillator()
    const ac = ensureContext()
    const noteDur = 0.8 // held duration before release

    const g = ac.createGain()
    const t = ac.currentTime
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.7, t + attack)
    g.gain.linearRampToValueAtTime(sustain * 0.7, t + attack + decay)
    g.gain.setValueAtTime(sustain * 0.7, t + attack + decay + noteDur)
    g.gain.linearRampToValueAtTime(0, t + attack + decay + noteDur + release)
    g.connect(analyserNode.value)
    gainNode = g

    const osc = ac.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    osc.connect(g)
    osc.start()
    osc.stop(t + attack + decay + noteDur + release + 0.05)

    oscillators = [osc]
    isPlaying.value = true
    setTimeout(() => { isPlaying.value = false }, (attack + decay + noteDur + release + 0.1) * 1000)
  }

  // ── LFO modulation ────────────────────────────────────────────────────────
  const setLfo = (rate = 5, depth = 0.3, target = 'amplitude') => {
    if (!ctx.value || oscillators.length === 0) return
    const ac = ctx.value

    // Tear down previous LFO
    lfoOsc && (() => { try { lfoOsc.stop(); lfoOsc.disconnect() } catch {} })()
    lfoGain?.disconnect()

    lfoOsc = ac.createOscillator()
    lfoGain = ac.createGain()
    lfoOsc.type = 'sine'
    lfoOsc.frequency.setValueAtTime(rate, ac.currentTime)
    lfoOsc.connect(lfoGain)

    if (target === 'amplitude' && gainNode) {
      lfoGain.gain.setValueAtTime(depth * 0.4, ac.currentTime)
      lfoGain.connect(gainNode.gain)
    } else if (target === 'frequency' && oscillators[0]) {
      const carrierFreq = oscillators[0].frequency.value
      lfoGain.gain.setValueAtTime(depth * carrierFreq * 0.1, ac.currentTime)
      lfoGain.connect(oscillators[0].frequency)
    }

    lfoOsc.start()
  }

  // ── Additive synthesis ────────────────────────────────────────────────────
  const startAdditive = (harmonicAmplitudes) => {
    stopOscillator()
    const ac = ensureContext()
    const masterGain = ac.createGain()
    masterGain.gain.setValueAtTime(0.5, ac.currentTime)
    masterGain.connect(analyserNode.value)
    gainNode = masterGain

    oscillators = harmonicAmplitudes.map(({ freq, gain: g }) => {
      const osc = ac.createOscillator()
      const partialGain = ac.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ac.currentTime)
      partialGain.gain.setValueAtTime(g, ac.currentTime)
      osc.connect(partialGain)
      partialGain.connect(masterGain)
      osc.start()
      return osc
    })

    isPlaying.value = true
  }

  const cleanup = () => {
    stopOscillator()
    ctx.value?.close()
  }

  onUnmounted(cleanup)

  return {
    isPlaying,
    analyserNode,
    startOscillator,
    stopOscillator,
    startAdditive,
    setGain,
    setFilter,
    triggerEnvelope,
    setLfo,
  }
}
