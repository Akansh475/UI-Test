/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sentinel: {
          bg: '#05070A',
          surface: '#0B0F17',
          card: '#101622',
          cardBorder: '#1A2333',
          cardHover: '#161F2E',
          cyan: '#00F0FF',
          blue: '#1A8CFF',
          purple: '#7928CA',
          green: '#00E676',
          amber: '#FFB300',
          red: '#FF2E4D',
          darkRed: '#500713',
          textMuted: '#8492A6',
          textSubtle: '#4E5B70',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.35)',
        'glow-red': '0 0 35px -5px rgba(255, 46, 77, 0.45)',
        'glow-amber': '0 0 30px -5px rgba(255, 179, 0, 0.4)',
        'glow-green': '0 0 30px -5px rgba(0, 230, 118, 0.35)',
        'glow-blue': '0 0 30px -5px rgba(26, 140, 255, 0.35)',
        'hud': '0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
