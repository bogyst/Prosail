/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Motyw żeglarski
        brine: {
          50: '#eef7fb',
          100: '#d6ecf5',
          200: '#aed8ea',
          300: '#7bbcd9',
          400: '#489cc4',
          500: '#2b7fab',
          600: '#22658d',
          700: '#1f5173',
          800: '#1f4460',
          900: '#0f2b3f',
          950: '#081a28',
        },
        deep: {
          900: '#0a1a2b',
          950: '#050f1a',
        },
        sand: {
          100: '#f7f1e3',
          200: '#efe4c8',
          300: '#e3d1a3',
          400: '#d4b878',
        },
        rope: '#c9a15a',
        buoyRed: '#e2454a',
        buoyGreen: '#1fa463',
        buoyYellow: '#f4c430',
      },
      fontFamily: {
        display: ['"Barlow Semi Condensed"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(4, 20, 34, 0.6)',
        glow: '0 0 40px -8px rgba(72, 156, 196, 0.45)',
      },
      backgroundImage: {
        'sea-radial':
          'radial-gradient(1200px 800px at 20% -10%, rgba(43,127,171,0.35), transparent), radial-gradient(1000px 700px at 100% 0%, rgba(15,43,63,0.6), transparent)',
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
