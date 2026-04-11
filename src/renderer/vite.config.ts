/*
 * 2022-2026 Kiyozz.
 */

import * as path from 'node:path'
import * as url from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import Unfonts from 'unplugin-fonts/vite'
import { lingui } from '@lingui/vite-plugin'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './routes',
      generatedRouteTree: './routeTree.gen.ts',
    }),
    react(),
    babel({
      presets: [reactCompilerPreset()],
      plugins: ['@lingui/babel-plugin-lingui-macro'],
    }),
    lingui(),
    tailwindcss(),
    Unfonts({
      custom: {
        families: [
          {
            name: 'Geist',
            src: './assets/fonts/geist/*.woff2',
          },
          {
            name: 'Geist Mono',
            src: './assets/fonts/geist-mono/*.woff2',
          },
        ],
        preload: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@renderer': path.resolve(dirname),
    },
  },
  build: {
    target: 'chrome146', // electron version target
    sourcemap: true,
  },
  define: {
    // path-shorten dep use process in his source code. But it is not available in renderer
    'process.env.debug_path_shorten': 'false',
  },
  server: {
    port: 9080,
  },
})
