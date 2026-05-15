/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',        // blue-700 — main brand
        secondary: '#0F172A',      // slate-900 — dark text
        accent: '#F59E0B',         // amber-500 — highlights
        success: '#10B981',        // emerald-500
        danger: '#EF4444',         // red-500
        background: '#F8FAFC',     // slate-50
        card: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
