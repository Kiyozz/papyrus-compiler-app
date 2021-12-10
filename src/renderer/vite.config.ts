/*
 * Copyright (c) 2021 Kiyozz|WK.
 *
 * All rights reserved.
 */

import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'
import { defineConfig } from 'vite'

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
})
