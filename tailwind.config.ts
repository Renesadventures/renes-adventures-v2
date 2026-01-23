import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0F172A',
        'caribbean-gold': '#D4AF37',
        'san-pedro-pearl': '#F8FAFC',
        'tropical-coral': '#FF6B35',
        'tropical-orange': '#F7931E',
        'tropical-turquoise': '#00CED1',
      },
      keyframes: {
        'slide-in-from-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'zoom-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-in-from-bottom-2': {
          '0%': { transform: 'translateY(0.5rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
        'zoom-in': 'zoom-in 0.3s ease-out',
        'slide-in-from-bottom-2': 'slide-in-from-bottom-2 0.3s ease-out',
      },
    },
  },
  plugins: [typography, forms, aspectRatio],
}

export default config
