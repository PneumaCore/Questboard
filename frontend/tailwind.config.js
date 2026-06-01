/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/components/**/*.{vue,js}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: {
          DEFAULT: '#12121a',
          light: '#1e1e2e'
        },
        primary: '#00f0ff',
        secondary: '#ff0055',
        accent: '#a855f7',
        success: '#00e676',
        warning: '#ffab00',
        'text-main': '#e2e8f0',
        'text-muted': '#94a3b8',
        border: '#2d2d3a'
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif']
      }
    }
  },
  plugins: []
}
