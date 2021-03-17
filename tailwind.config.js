/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

module.exports = {
  purge: {
    content: ['./src/renderer/**/*.{tsx,ts}'],
    options: {
      safelist: [
        'text-gray-500',
        'text-blue-800',
        'text-blue-600',
        'text-green-500',
        'text-green-400',
        'text-red-300',
        'text-black-400'
      ]
    }
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'sans-serif'],
        nova: ['Proxima Nova', 'sans-serif'],
        mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
        body: ['Roboto', '-apple-system', 'sans-serif'],
        segoe: ['"Segoe UI"', 'Roboto']
      },
      height: {
        'screen-titlebar': 'calc(100vh - theme("height.8"))',
        'screen-appbar': 'calc(100vh - theme("height.8") - theme("height.16"))'
      },
      colors: {
        darker: '#16161a',
        light: {
          300: '#faf7f7',
          400: '#f6f0f1',
          600: '#eae5e6',
          700: '#dddada',
          800: '#cac4c4'
        },
        black: {
          400: '#403e41',
          600: '#2e292d',
          800: '#000'
        },
        primary: {
          400: '#539dff',
          500: '#418aea',
          600: '#3279d7'
        },
        secondary: {
          400: '#3fc68e',
          500: '#35bc84',
          600: '#27a571'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
