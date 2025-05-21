// noinspection JSUnusedGlobalSymbols

/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import type { BuildOptions } from 'esbuild'

const releaseVersionPath = path.resolve('release-version.json')
const mainPath = path.resolve('src/main')

const releaseVersion = JSON.parse(await fs.readFile(releaseVersionPath, 'utf-8')) as {
  version: string
}

const main: BuildOptions = {
  platform: 'node',
  entryPoints: [
    path.resolve(mainPath, 'main.ts'),
  ],
  bundle: true,
  target: 'node22',
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
    'process.env.RELEASE_VERSION': `'${releaseVersion.version}'`,
  },
}

const preload: BuildOptions = {
  platform: 'node',
  entryPoints: [path.resolve(mainPath, 'preload.ts')],
  bundle: true,
  format: 'esm',
  target: 'node22', // electron version target
  // it is important to use .mjs extension for preload script because of how electron load preload script
  outExtension: {
    '.js': '.mjs',
  }
}

// eslint-disable-next-line import/no-default-export
export default [main, preload]
