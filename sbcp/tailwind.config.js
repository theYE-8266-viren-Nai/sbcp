
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Purple Palette from the image
        brand: {
          50: '#f8f7ff',    // Very light purple
          100: '#f0eeff',   // Light purple tint
          200: '#e6e0ff',   // Lighter purple
          300: '#bfc0d1',   // #bfc0d1 from your palette
          400: '#60519b',   // #60519b from your palette
          500: '#1e202c',   // #1e202c from your palette
          600: '#31323c',   // #31323c from your palette
          700: '#2a2b35',   // Darker variant
          800: '#1a1b23',   // Very dark
          900: '#0f1015',   // Darkest
        },
        // Pinterest-inspired colors
        pinterest: {
          red: '#e60023',
          'red-dark': '#ad081b',
          'red-light': '#ff5b85',
          cream: '#fffbf5',
          'gray-light': '#f7f7f7',
          'gray-medium': '#767676',
          'gray-dark': '#333333',
        }
      },
      fontFamily: {
        'pinterest': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'pinterest': '16px',
        'pinterest-lg': '24px',
      },
      boxShadow: {
        'pinterest': '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
        'pinterest-lg': '0 8px 32px 0 rgba(0, 0, 0, 0.16)',
        'pinterest-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.18)',
      }
    },
  },
  plugins: [],
}