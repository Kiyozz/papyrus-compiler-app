/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { BuildOptions } from 'esbuild'
import path from 'path'

export default {
  platform: 'node',
  entryPoints: [
    path.resolve('src/main/main.ts'),
    path.resolve('src/main/preload.ts'),
  ],
  bundle: true,
  target: 'node14.16.0',
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
} as BuildOptions
