/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

const path = require('path')

/** @var {Partial<import('esbuild').BuildOptions>} */
module.exports = {
  platform: 'node',
  entryPoints: [path.resolve('src/main/main.ts')],
  bundle: true,
  target: 'node14.16.0',
  loader: {
    '.ts': 'ts'
  },
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
    }'`
  }
}
