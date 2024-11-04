/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        neutral: {
          50: 'rgb(var(--neutral-50) / <alpha-value>)',
          100: 'rgb(var(--neutral-100) / <alpha-value>)',
          200: 'rgb(var(--neutral-200) / <alpha-value>)',
          500: 'rgb(var(--neutral-500) / <alpha-value>)',
          600: 'rgb(var(--neutral-600) / <alpha-value>)',
          700: 'rgb(var(--neutral-700) / <alpha-value>)',
        },
        'pastel-pink': {
          50: 'rgb(var(--pastel-pink-50) / <alpha-value>)',
          100: 'rgb(var(--pastel-pink-100) / <alpha-value>)',
          500: 'rgb(var(--pastel-pink-500) / <alpha-value>)',
          600: 'rgb(var(--pastel-pink-600) / <alpha-value>)',
        },
        'pastel-blue': {
          50: 'rgb(var(--pastel-blue-50) / <alpha-value>)',
          100: 'rgb(var(--pastel-blue-100) / <alpha-value>)',
          500: 'rgb(var(--pastel-blue-500) / <alpha-value>)',
          600: 'rgb(var(--pastel-blue-600) / <alpha-value>)',
        },
        'pastel-yellow': {
          50: 'rgb(var(--pastel-yellow-50) / <alpha-value>)',
          100: 'rgb(var(--pastel-yellow-100) / <alpha-value>)',
          500: 'rgb(var(--pastel-yellow-500) / <alpha-value>)',
          600: 'rgb(var(--pastel-yellow-600) / <alpha-value>)',
        },
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
        },
        danger: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        }
      },
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
};