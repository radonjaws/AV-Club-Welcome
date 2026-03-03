/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}'
  ],
  theme: {
    extend: {
      colors: {
        // Oscilloscope-inspired dark palette
        screen: {
          bg: '#0a0e0a',        // deep near-black green
          grid: '#1a2e1a',      // subtle grid lines
          border: '#1e3a1e',
        },
        signal: {
          green: '#39ff14',     // classic phosphor green
          amber: '#ffb300',     // warm amber for secondary traces
          blue: '#00d4ff',      // spectrum blue
          red: '#ff4444',       // danger / clipping
        },
        panel: {
          bg: '#111827',        // dark slate sidebar
          border: '#1f2937',
          hover: '#1e293b',
          active: '#0f172a',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    }
  },
  plugins: []
}
