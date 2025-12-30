/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'site-bg': 'var(--bg)',
        card: 'var(--card)',
        muted: 'var(--muted)',
        'site-text': 'var(--text)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        border: 'var(--border)',
      },
      borderRadius: {
        DEFAULT: '22px',
      },
      boxShadow: {
        DEFAULT: '0 24px 70px rgba(0, 0, 0, 0.55)',
      },
      fontFamily: {
        sans: ['"Antic"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
