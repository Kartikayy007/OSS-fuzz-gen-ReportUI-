/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a73e8',
          50: '#f0f7ff',
          100: '#e0eefe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#47acf7',
          500: '#1a90ea',
          600: '#1a73e8',
          700: '#1259c3',
          800: '#144a9f',
          900: '#154080',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 6px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
} 