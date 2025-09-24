/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'telkom-blue': '#0073CF',
        'telkom-dark-blue': '#0056A3',
        'telkom-light-blue': '#E6F3FF',
        'telkom-gray': '#F5F5F5',
        'telkom-dark-gray': '#666666'
      },
      fontFamily: {
        'telkom': ['Arial', 'Helvetica', 'sans-serif']
      }
    },
  },
  plugins: [],
}