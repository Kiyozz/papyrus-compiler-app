/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import path from 'path'
import { spawn } from 'child_process'
import chokidar from 'chokidar'
import webpack from 'webpack'
import esbuild from 'esbuild'
import WebpackDevServer from 'webpack-dev-server'
import webpackRendererConfig from '../webpack.renderer.mjs'
import esbuildMainConfig from '../esbuild.main.mjs'
import { track } from './track.mjs'

process.env.NODE_ENV = 'development'

let electronProcess

function startMain() {
  if (electronProcess) {
    console.info(track(), 'Kill latest main')
    process.kill(electronProcess.pid)

    electronProcess = undefined
  }

  console.info(track(), 'Start main')
  electronProcess = spawn(
    path.resolve(path.resolve('node_modules/.bin/electron')),
    ['dist/main/main.js']
  )

  electronProcess.stdout.pipe(process.stdout)
  electronProcess.stderr.pipe(process.stdout)

  electronProcess.on('close', (code, signal) => {
    if (signal !== null) {
      process.exit(code || 0)
    }
  })
}

async function dev() {
  console.info(track(), 'Start')
  const rendererCompiler = webpack(webpackRendererConfig())
  const rendererServer = new WebpackDevServer(rendererCompiler, {
    hot: true,
    overlay: true
  })

  const esbuildMainService = await esbuild.startService()

  function mainBuild() {
    console.info(track(), 'Started main')

    return esbuildMainService
      .build(esbuildMainConfig())
      .then(() => console.info(track(), 'Main built'))
  }

  const mainWatcher = chokidar.watch(
    `${path.resolve('src', 'main') + path.sep}**${path.sep}*.ts`
  )

  mainWatcher.on('ready', () => {
    mainWatcher.on('all', async () => {
      await mainBuild()
      startMain()
    })
  })
  rendererServer.listen(9080, 'localhost', () => {
    console.info(track(), 'Started renderer')
  })

  await Promise.all([
    mainBuild(),
    new Promise(resolve => {
      rendererCompiler.hooks.done.tap('Hook', () => {
        console.info(track(), 'Renderer built')
        resolve()
      })
    })
  ])

  await startMain()
}

dev()
