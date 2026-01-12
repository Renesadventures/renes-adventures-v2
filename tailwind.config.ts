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
    },
  },
  plugins: [typography, forms, aspectRatio],
}

export default config
