/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

const path = require('path')
const modules = require('module')

/**
 * @param {Partial<import('esbuild').BuildOptions>} merge
 *
 * @return {import('esbuild').BuildOptions}
 */
module.exports = (merge = {}) => {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    platform: 'node',
    entryPoints: [path.resolve('src/main/main.ts')],
    bundle: true,
    target: 'node12.18.4',
    external: ['electron', ...modules.builtinModules],
    loader: {
      '.ts': 'ts'
    },
    minify: isProduction,
    sourcemap: false,
    outfile: path.resolve('dist/main/main.js'),
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
