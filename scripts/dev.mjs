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
import depsTree from 'dependency-tree'
import webpackRendererConfig from '../webpack.renderer.mjs'
import esbuildMainConfig from '../esbuild.main.mjs'
import { track } from './track.mjs'

process.env.NODE_ENV = 'development'

/** @var {import('stream').Stream} */
let electronProcess
const isWindows = process.platform === 'win32'
const electronBin = isWindows ? 'electron.cmd' : 'electron'

function killProcess(pid) {
  if (isWindows) {
    spawn('taskkill', ['/pid', pid, '/f', '/t'])
  } else {
    process.kill(pid)
  }
}

function getDeps(file) {
  return depsTree.toList({
    filename: file,
    directory: path.dirname(file),
    filter: filePath => filePath.indexOf('node_modules') === -1
  })
}

function startMain() {
  if (electronProcess) {
    console.info(track(), 'Kill latest main')
    killProcess(electronProcess.pid)

    electronProcess = undefined
  }

  console.info(track(), 'Start main')
  electronProcess = spawn(
    path.resolve(path.resolve(`node_modules/.bin/${electronBin}`)),
    ['dist/main/main.js']
  )

  electronProcess.stdout.on('data', data => {
    console.log(track(), data.toString())
  })
  electronProcess.stderr.on('data', data => {
    console.log(track(), 'STDERR', data.toString())
  })

  electronProcess.on('close', (code, signal) => {
    if (signal !== null) {
      process.exit(code || 0)
    }
  })
}

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

function watchMain() {
  const mainSources = path.join(path.resolve('src/main'), '**', '*.ts')
  const mainWatcher = chokidar.watch([
    mainSources,
    ...getDeps(path.resolve('src/main/main.ts'))
  ])

  mainWatcher.on('ready', () => {
    mainWatcher.on(
      'all',
      debounce(
        async () => {
          await mainBuild()
          startMain()
          await mainWatcher.close()
          watchMain()
        },
        { wait: 200 }
      )
    )
  })
}

async function dev() {
  console.info(track(), 'Start')
  const rendererCompiler = webpack(webpackRendererConfig())
  const rendererServer = new WebpackDevServer(rendererCompiler, {
    hot: true,
    overlay: true
  })

  watchMain()
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
