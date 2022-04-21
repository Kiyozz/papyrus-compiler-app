/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { defineConfig } from 'tsup'

// eslint-disable-next-line import/no-default-export
export default defineConfig([
  {
    entry: ['src/**/*.ts'],
    sourcemap: true,
    clean: true,
    splitting: false,
    bundle: false,
    minify: false,
    dts: true,
    target: 'node16',
    banner: {
      js: '// @pca/electron-ipc - MIT',
    },
    format: ['esm', 'cjs'],
  },
])
