/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

module.exports = {
  purge: ['./src/renderer/**/*.{tsx,ts}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'sans-serif'],
        nova: ['Proxima Nova', 'sans-serif'],
        harmonia: ['Harmonia Sans', 'sans-serif'],
        mono: ['Roboto Mono', 'ui-monospace', 'monospace']
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
