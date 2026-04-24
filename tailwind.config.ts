import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0e0c0b',
        card: '#151210',
        card2: '#1c1915',
        card3: '#232018',
        border: '#2a2520',
        border2: '#3a3430',
        orange: '#ff5500',
        cyan: '#00d4b4',
        purple: '#b040ff',
        text1: '#f0ece6',
        text2: '#9a9490',
        text3: '#5a5450',
        green: '#00e87a',
        amber: '#ffaa00',
        red: '#ff3545',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'var(--font-sans)', 'sans-serif'],
        mono: ['Space Mono', 'var(--font-mono)', 'monospace'],
      },
      animation: {
        'pulse-ring': 'pulse-ring 3s ease-in-out infinite',
        blink: 'blink 1.4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(0.95)', opacity: '0.6' },
          '50%': { transform: 'scale(1.05)', opacity: '0.3' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
}

export default config
