/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta oparta na zmiennych CSS — dzięki temu tryb nocny to jeden blok
        // nadpisań w index.css, a modyfikatory przezroczystości (np. /80)
        // działają dalej normalnie.
        brine: {
          50: 'rgb(var(--c-ink) / <alpha-value>)',
          100: 'rgb(var(--c-ink-soft) / <alpha-value>)',
          200: 'rgb(var(--c-ink-mid) / <alpha-value>)',
          300: 'rgb(var(--c-accent) / <alpha-value>)',
          400: 'rgb(var(--c-accent-2) / <alpha-value>)',
          500: 'rgb(var(--c-active) / <alpha-value>)',
          600: '#0f3050',
          700: '#0d2c4b',
          800: '#0a2036',
          900: '#0d2c4b',
          950: '#081a28',
        },
        // Kolor nagłówków (odwraca się w trybie nocnym).
        navy: {
          DEFAULT: 'rgb(var(--c-heading) / <alpha-value>)',
          2: '#123a63',
        },
        // Stały granat — hero i inne miejsca, gdzie granat jest TŁEM.
        hull: {
          DEFAULT: '#0d2c4b',
          2: '#123a63',
        },
        deep: {
          900: 'rgb(var(--c-surface-2) / <alpha-value>)',
          950: 'rgb(var(--c-bg) / <alpha-value>)',
        },
        cream: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        sand: {
          100: 'rgb(var(--c-sand-1) / <alpha-value>)',
          200: 'rgb(var(--c-sand-2) / <alpha-value>)',
          300: 'rgb(var(--c-sand-3) / <alpha-value>)',
          400: '#d4b878',
        },
        tan: 'rgb(var(--c-line) / <alpha-value>)',
        rope: '#a97e2f',
        signal: '#c8382e',
        gold: '#e8c56b',
        buoyRed: '#c8382e',
        buoyGreen: '#1c7c4a',
        buoyYellow: '#e0ac1a',
      },
      fontFamily: {
        display: ['Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(13,44,75,0.06), 0 2px 0 #e3dac8',
        glow: '0 6px 18px -6px rgba(13,44,75,0.25)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        sway: 'sway 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
