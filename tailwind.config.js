/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'fira-code': ['"Fira Code"', 'monospace'],
      },
      colors: {
        'custom-dark': '#0F172A',
        'custom-darker': '#0B1120',
      },
    },
  },
  plugins: [],
}