/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zombie: {
          green: '#40ff40',
          dark: '#1f2937',
          blood: '#dc2626'
        }
      }
    },
  },
  plugins: [],
} 