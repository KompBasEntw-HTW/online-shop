/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        lora: ['Lora', 'sans-serif']
      },
      colors: {
        brand: {
          DEFAULT: '#009687',
          50: '#F1F9F8',
          100: '#E2F3F1',
          200: '#BFE5E1',
          300: '#C2FFF9',
          400: '#99FFF5',
          500: '#00B8A5',
          600: '#009687',
          700: '##007A6E',
          800: '#00665C',
          900: '##005249'
        }
      }
    }
  },
  plugins: []
}
