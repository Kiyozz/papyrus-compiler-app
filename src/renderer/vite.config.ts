/*
 * Copyright (c) 2021 Kiyozz|WK.
 *
 * All rights reserved.
 */

import reactRefresh from '@vitejs/plugin-react-refresh'
import * as fsSync from 'node:fs'
import * as path from 'node:path'
import { defineConfig } from 'vite'

const versionPath = path.resolve('release-version.json')
const { version }: { version: string } = JSON.parse(
  fsSync.readFileSync(versionPath).toString('utf-8'),
)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    target: 'chrome96', // electron version target
  },
  resolve: {
    alias: [
      {
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
})
