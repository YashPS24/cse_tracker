/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cse: {
          gold:    '#C9A84C',
          goldlt:  '#F0D080',
          navy:    '#0B1F3A',
          navylt:  '#152D52',
          teal:    '#0D7C6E',
          tealt:   '#14A899',
          slate:   '#1E2D3D',
          muted:   '#8B9BB4',
          border:  '#1E3050',
          up:      '#1DB88A',
          down:    '#E84545',
          warn:    '#F0A500',
        }
      }
    }
  },
  plugins: []
}
