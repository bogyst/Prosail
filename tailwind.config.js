/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Motyw „Bałtyk Classic” — jasny krem + granat + czerwień sygnałowa.
        // Skala brine przemapowana na wersję do jasnego tła (te same nazwy
        // klas w komponentach, nowe wartości).
        brine: {
          50: '#182c40', // globalny kolor tekstu
          100: '#33475c', // tekst pomocniczy
          200: '#274e74',
          300: '#175d84', // akcenty / linki
          400: '#2b7fab',
          500: '#123a63', // aktywne przełączniki (granat, biały tekst)
          600: '#0f3050',
          700: '#0d2c4b',
          800: '#0a2036',
          900: '#0d2c4b', // granat hero
          950: '#081a28',
        },
        navy: {
          DEFAULT: '#0d2c4b',
          2: '#123a63',
        },
        deep: {
          900: '#f3ecdd', // dawniej ciemne tła — teraz kremy
          950: '#faf6ee',
        },
        cream: '#faf6ee',
        sand: {
          100: '#f7f1e3',
          200: '#efe7d7',
          300: '#e3d1a3',
          400: '#d4b878',
        },
        tan: '#e3dac8',
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
