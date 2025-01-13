/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'med-orange': '#db701b',
        'light-olive': '#6a9839',
        'kelly-green': '#4f7d19',
        'baby-blue': '#10a89a',
        'burnt-red': '#81301e'
      },
      fontFamily: {
        display: ['Young Serif', 'serif'],
        sans: ['Courier Prime', 'monospace'],
      },
    },
  },
  plugins: [],
}