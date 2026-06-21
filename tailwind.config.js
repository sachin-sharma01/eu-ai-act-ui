/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: '#EDEAE2',
        surface: '#F8F6F1',
        accent: {
          DEFAULT: '#2D5A3D',
          dim: '#4A7A5C',
          bg: '#EBF0EC',
        },
        content: {
          DEFAULT: '#1A1919',
          muted: '#7A7670',
          faint: '#AAA69E',
        },
        edge: {
          DEFAULT: '#D4D0C8',
          light: '#E4E1D8',
        },
      },
      fontFamily: {
        display: ['"IBM Plex Serif"', 'Palatino', 'Georgia', 'serif'],
        body: ['"IBM Plex Serif"', 'Palatino', 'Georgia', 'serif'],
        ui: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"Cascadia Code"', 'Consolas', 'monospace'],
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        dotBounce: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(-4px)', opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.75)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        'dot-bounce': 'dotBounce 1.2s ease infinite',
        'pulse-dot': 'pulseDot 1.2s ease infinite',
      },
    },
  },
  plugins: [],
}
