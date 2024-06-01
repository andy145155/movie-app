const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        navBar: '5rem',
        content: 'calc(100vh - 5rem)'
      },
      colors: {
        "primary-red": "#dc2626"
      }
    },
    screens: {
      ...defaultTheme.screens
    }
  },
  plugins: [],
}

