/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Crimson Text', 'serif'],
        'display': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        artistic: {
          cream: '#fefce8',
          'pale-yellow': '#fef3c7',
          'soft-blue': '#f0f9ff',
          'light-blue': '#e0f2fe',
          'algae': {
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          },
        }
      },
    },
  },
  plugins: [],
}