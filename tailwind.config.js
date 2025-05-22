/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-geist-mono)'],
        quicksand: ['Quicksand', 'sans-serif'],
        'noto-jp': ['"Noto Sans JP"', 'sans-serif'],
      },
      colors: {
        // Anime-inspired color palette
        sakura: {
          50: '#fff0f6',
          100: '#ffe0eb',
          200: '#ffc2d7',
          300: '#ffa3c2',
          400: '#ff85ad',
          500: '#ff6699',
          600: '#ff4d85',
          700: '#ff3371',
          800: '#ff1a5c',
          900: '#ff0048',
        },
        sky: {
          50: '#e6f8ff',
          100: '#ccf1ff',
          200: '#99e3ff',
          300: '#66d5ff',
          400: '#33c7ff',
          500: '#00b9ff',
          600: '#0094cc',
          700: '#006f99',
          800: '#004a66',
          900: '#002533',
        },
        lavender: {
          50: '#f5f0ff',
          100: '#ebe0ff',
          200: '#d6c2ff',
          300: '#c2a3ff',
          400: '#ad85ff',
          500: '#9966ff',
          600: '#7a52cc',
          700: '#5c3d99',
          800: '#3d2966',
          900: '#1f1433',
        },
        matcha: {
          50: '#f0fff4',
          100: '#e0ffe9',
          200: '#c2ffd3',
          300: '#a3ffbd',
          400: '#85ffa7',
          500: '#66ff91',
          600: '#52cc74',
          700: '#3d9957',
          800: '#29663a',
          900: '#14331d',
        },
      },
    },
  },
  plugins: [
    typography,
  ],
}
