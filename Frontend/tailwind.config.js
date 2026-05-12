/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        'primary-dark': '#1e40af',
        'primary-light': '#3b82f6',
        secondary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        'danger-light': '#fee2e2',
      },
      spacing: {
        'sidebar-width': '16rem',
      },
    },
  },
  plugins: [],
}
