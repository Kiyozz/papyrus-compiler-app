/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import path from 'path'
import rimraf from 'rimraf'
import esbuild from 'esbuild'
import webpack from 'webpack'
import esbuildMainConfig from '../esbuild.main.mjs'
import webpackRendererConfig from '../webpack.renderer.mjs'
import { track } from './track.mjs'

process.env.NODE_ENV = 'production'

function clean() {
  rimraf.sync(path.resolve('dist'))
}

async function build() {
  console.info(track(), 'Start')
  clean()

  console.info(track(), 'Creating production build...')

  const rendererCompiler = webpack(webpackRendererConfig())
  const esbuildService = await esbuild.startService()

  await Promise.all([
    esbuildService
      .build(esbuildMainConfig())
      .then(() => console.info(track(), 'Main built')),
    new Promise((resolve, reject) => {
      rendererCompiler.run(err => {
        if (err) {
          console.error(track(), 'Error when building renderer')
          return reject(err)
        }

        resolve()
      })
    }).then(() => console.info(track(), 'Renderer built'))
  ])

  process.exit(0)
}

build()
