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
        vault: {
          bg: '#0a0a0c',
          surface: '#111216',
          card: '#17181f',
          border: '#262833',
          gold: '#d4af37',
          neon: '#00f0ff',
          accent: '#ff0055'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
