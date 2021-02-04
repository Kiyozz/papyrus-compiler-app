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
        'text-green-500',
        'text-red-300'
      ]
    }
  },
  darkMode: false, // or 'media' or 'class'
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
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
