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

process.env.NODE_ENV = 'development'

let electronProcess

function startMain() {
  if (electronProcess) {
    process.kill(electronProcess.pid)

    electronProcess = undefined
  }

  electronProcess = spawn(
    path.resolve(path.resolve('node_modules/.bin/electron')),
    ['dist/main/main.js']
  )

  electronProcess.stdout.pipe(process.stdout)
  electronProcess.stderr.pipe(process.stdout)

  electronProcess.on('close', code => {
    process.exit(code || 0)
  })
}

async function dev() {
  const rendererCompiler = webpack(webpackRendererConfig())
  const rendererServer = new WebpackDevServer(rendererCompiler, {
    hot: true,
    overlay: true
  })

  const esbuildMainService = await esbuild.startService()

  function mainBuild() {
    return esbuildMainService
      .build(esbuildMainConfig())
      .then(() => console.info('Main built'))
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
  rendererServer.listen(9080, 'localhost')

  await Promise.all([
    mainBuild(),
    new Promise(resolve => {
      rendererCompiler.hooks.done.tap('Hook', () => resolve())
    })
  ])

  await startMain()
}

dev()
