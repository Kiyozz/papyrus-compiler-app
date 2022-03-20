/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

module.exports = {
  mode: 'jit',
  content: ['./src/renderer/**/*.{tsx,ts}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'sans-serif'],
        nova: ['Proxima Nova', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
        body: ['Roboto', '-apple-system', 'sans-serif'],
        segoe: ['Segoe UI', 'Roboto'],
        helvetica: ['Helvetica Neue'],
      },
      height: {
        'screen-titlebar': 'calc(100vh - theme("height.8"))',
        'screen-appbar': 'calc(100vh - theme("height.8") - theme("height.16"))',
        5.5: '1.375rem',
      },
      boxShadow: {
        b: '0 1px 0 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      colors: {
        darker: '#16161a',
        light: {
          300: '#faf7f7',
          400: '#f6f0f1',
          600: '#eae5e6',
          700: '#dddada',
          800: '#cac4c4',
        },
        black: {
          400: '#403e41',
          600: '#2e292d',
          800: '#000',
        },
        primary: {
          400: '#3388ff',
          500: '#418aea',
          600: '#3279d7',
        },
        secondary: {
          400: '#3fc68e',
          500: '#35bc84',
          600: '#27a571',
        },
      },
      transitionTimingFunction: {
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      transitionDuration: {
        225: '225ms',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
