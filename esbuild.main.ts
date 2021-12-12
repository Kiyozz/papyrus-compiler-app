/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { BuildOptions, PluginBuild } from 'esbuild'
import fsSync from 'fs'
import fs from 'fs/promises'
import path from 'path'

const mainPath = path.resolve('src/main')
const distMainPath = path.resolve('dist/main')
const distBrowserWindows = path.join(distMainPath, 'browser-windows')

const files = [
  {
    from: path.resolve(mainPath, 'browser-windows/starting.html'),
    to: path.join(distBrowserWindows, 'starting.html'),
  },
]

const config: BuildOptions = {
  platform: 'node',
  entryPoints: [
    path.resolve(mainPath, 'main.ts'),
    path.resolve(mainPath, 'preload.ts'),
  ],
  bundle: true,
  target: 'node16.9.1',
  define: {
    'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
    'process.env.ELECTRON_WEBPACK_APP_MOD_URL': `'${
      process.env.ELECTRON_WEBPACK_APP_MOD_URL ??
      'https://www.nexusmods.com/skyrimspecialedition/mods/23852'
    }'`,
    'process.env.ELECTRON_TELEMETRY_API': `'${
      process.env.ELECTRON_TELEMETRY_API ?? ''
    }'`,
    'process.env.ELECTRON_TELEMETRY_API_KEY': `'${
      process.env.ELECTRON_TELEMETRY_API_KEY ?? ''
    }'`,
    'process.env.ELECTRON_TELEMETRY_FEATURE': `'${
      process.env.ELECTRON_TELEMETRY_FEATURE ?? 'false'
    }'`,
  },
  plugins: [
    {
      name: 'copy-plugin',
      setup(build: PluginBuild): void {
        build.onEnd(async () => {
          if (!fsSync.existsSync(distBrowserWindows)) {
            await fs.mkdir(path.join(distMainPath, 'browser-windows'), {
              recursive: true,
            })
          }

          for (const file of files) {
            const from = await fs.readFile(file.from)

            try {
              await fs.writeFile(file.to, from)
            } catch (e) {
              console.error(e)
              process.exit(1)
            }
          }
        })
      },
    },
  ],
}

// noinspection JSUnusedGlobalSymbols
export default config
