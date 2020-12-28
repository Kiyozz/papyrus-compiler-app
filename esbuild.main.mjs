/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import path from 'path'
import module from 'module'

/**
 * @param {Partial<import('esbuild').BuildOptions>} merge
 *
 * @return {import('esbuild').BuildOptions}
 */
export default (merge = {}) => {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    platform: 'node',
    entryPoints: [path.resolve('src', 'main', 'main.ts')],
    bundle: true,
    target: 'node12.18.4',
    external: ['electron', ...module.builtinModules],
    loader: {
      '.ts': 'ts'
    },
    minify: isProduction,
    sourcemap: isProduction ? 'external' : 'inline',
    outfile: path.resolve('dist', 'main', 'main.js'),
    plugins: [],
    define: {
      'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
      'process.env.ELECTRON_WEBPACK_APP_MOD_URL': `'${
        process.env.ELECTRON_WEBPACK_APP_MOD_URL ??
        'https://www.nexusmods.com/skyrimspecialedition/mods/23852'
      }'`
    },
    ...merge
  }
}
