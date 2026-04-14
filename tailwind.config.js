/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pinterest: {
          cream: '#F9F8F6',
          charcoal: '#333333',
          gold: '#B8860B',
          goldlight: '#D4AF37',
          sage: '#B2AC88',
          rose: '#E9D5D5',
          sand: '#E5E0D8',
          dark: '#1A1A1A',
        },
      },
      boxShadow: {
        'soft-lift': '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
