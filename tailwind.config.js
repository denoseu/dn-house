/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dongdong': ['dongdong', 'sans-serif'],
        'louis' : ['louis', 'sans-serif'],
      },
      animation: {
        'expand': 'expand 0.3s ease-out forwards',
      },
      keyframes: {
        expand: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}