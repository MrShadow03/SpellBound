/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html"
  ],
  theme: {
    extend: {
      fontSize: {
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
        xxl: ['32px', '40px'],
        focus: ['96px', '120px']
      },
      colors: {
        'v-sky': '#ABC1D1',
        'v-rose': '#C76E7A',
        'v-purple': '#895570'
      }
    },
  },
  plugins: [],
}

