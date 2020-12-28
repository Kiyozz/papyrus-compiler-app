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
import debounce from 'debounce-fn'
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

  let mainBuilder

  async function mainBuild() {
    console.info(track(), 'Building main')

    if (mainBuilder) {
      await mainBuilder.rebuild()

      console.info(track(), 'Main built')

      return
    }

    mainBuilder = await esbuild.build(esbuildMainConfig({ incremental: true }))

    console.info(track(), 'Main built')
  }

  const mainWatcher = chokidar.watch(
    `${path.resolve('src', 'main') + path.sep}**${path.sep}*.ts`
  )

  mainWatcher.on('ready', () => {
    mainWatcher.on(
      'all',
      debounce(
        async () => {
          await mainBuild()
          startMain()
        },
        { wait: 200 }
      )
    )
  })
  rendererServer.listen(9080, 'localhost', () => {
    console.info(track(), 'Building renderer')
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
