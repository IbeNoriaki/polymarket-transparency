/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#1a1a1a',
        border: '#2a2a2a',
        'text-primary': '#f5f5f5',
        'text-muted': '#a0a0a0',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#22c55e',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
