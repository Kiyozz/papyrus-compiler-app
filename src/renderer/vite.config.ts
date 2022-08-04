/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import * as fsSync from 'node:fs'
import * as path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const versionPath = path.resolve('release-version.json')
const { version } = JSON.parse(
  fsSync.readFileSync(versionPath).toString('utf-8'),
) as { version: string }

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'chrome98', // electron version target
    sourcemap: true,
    chunkSizeWarningLimit: 3000,
    emptyOutDir: true,
  },
  resolve: {
    alias: [
      {
        // eslint-disable-next-line prefer-named-capture-group
        find: /^~(.*)/,
        replacement: path.join('node_modules/$1'),
      },
    ],
  },
  define: {
    // path-shorten dep use process in his source code. But it is not available in renderer
    'process.env.debug_path_shorten': 'false',
    'process.env.RELEASE_VERSION': `'${version}'`,
  },
  server: {
    port: 9080,
  },
})
