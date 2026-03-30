/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'wp-space': '#424242',
        'wp-champagne': '#f4e5cd',
        'wp-robin': '#58ccc6',
        'wp-platinum': '#e5e5e5',
      }
    },
  },
  plugins: [],
}