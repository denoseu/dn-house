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
    },
  },
  plugins: [],
}