/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4336A',
          50: '#FDF2F8',
          100: '#FCE7F3', 
          500: '#D4336A',
          600: '#B8295A',
          700: '#9F1E4E',
          900: '#701A75',
        },
        secondary: {
          DEFAULT: '#2D2D2D',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          500: '#6B7280',
          600: '#6B7280',
          700: '#374151',
          800: '#2D2D2D',
          900: '#1F2937',
        },
        accent: {
          DEFAULT: '#F4C2C2',
          50: '#FEF7F7',
          100: '#F4C2C2',
          200: '#FECACA',
        },
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}