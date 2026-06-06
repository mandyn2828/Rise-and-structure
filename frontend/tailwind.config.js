/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1A5553',
        'primary-hover': '#134442',
        'primary-active': '#0E3332',
        'secondary': '#C1664E',
        'secondary-hover': '#A85540',
        'secondary-active': '#8F4733',
        'accent-gold': '#D4A35C',
        'accent-green': '#6B8F71',
        'accent-blue': '#5B8C9E',
        'bg-main': '#FCFAF5',
        'bg-soft': '#F2EBE1',
        'bg-card': '#FFFFFF',
        'text-primary': '#2D2A25',
        'text-secondary': '#6B6560',
        'text-muted': '#B8B0A8',
        'border': '#E3DDD5',
        'border-strong': '#B8B0A8',
      },
      fontFamily: {
        'heading': ['Fraunces', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(45, 42, 37, 0.06)',
        'md': '0 2px 8px rgba(45, 42, 37, 0.08)',
        'lg': '0 4px 16px rgba(45, 42, 37, 0.12)',
        'xl': '0 8px 32px rgba(45, 42, 37, 0.16)',
      },
    },
  },
  plugins: [],
}
