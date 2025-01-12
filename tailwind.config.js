/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'med-orange': '#D27354',
        'light-olive': '#8ebf5b',
        'kelly-green': '#4f7d19',
      },
      fontFamily: {
        display: ['Young Serif', 'serif'],
        sans: ['Raleway Variable', 'sans-serif'],
      },
    },
  },
  plugins: [],
}