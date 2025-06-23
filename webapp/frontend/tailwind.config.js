/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // All source files
    "./public/index.html"          // HTML root
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",     // Tailwind Blue-900
        secondary: "#10B981",   // Emerald-500
        accent: "#F59E0B",      // Amber-500
        danger: "#EF4444",      // Red-500
        neutral: "#6B7280"      // Gray-500
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif'
        ],
        mono: [
          'Menlo',
          'Monaco',
          'Consolas',
          'Courier New',
          'monospace'
        ]
      },
      spacing: {
        '128': '32rem',
        '144': '36rem'
      },
      borderRadius: {
        'xl': '1rem'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        slideInUp: 'slideInUp 0.5s ease-out',
        zoomIn: 'zoomIn 0.3s ease-in-out',
      }
    }
  },
  darkMode: 'class', // Enable dark mode support via class
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
};
