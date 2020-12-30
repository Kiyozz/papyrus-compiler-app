/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const { Platform } = require('electron-builder')
const windowsShortcuts = require('windows-shortcuts')

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

/**
 *
 * @param {import('electron-builder').AfterPackContext} context
 * @return {Promise<void>}
 */
exports.default = async function afterPack(context) {
  const appOutDir = context.appOutDir
  const platform = context.packager.platform

  if (platform === Platform.WINDOWS) {
    await new Promise(resolve => {
      windowsShortcuts.create(
        path.resolve(appOutDir, 'PCA-debug.exe.lnk'),
        {
          target: path.resolve(appOutDir, 'PCA.exe'),
          args: '--debug',
          desc:
            'Run PCA in debug mode. Useful to debug an error. Please report the logs to PCA author'
        },
        () => resolve()
      )
    })
  } else if (platform === Platform.MAC) {
    const bashDebug = await readFile(path.resolve(__dirname, 'mac-debug.sh'))
    await writeFile(path.resolve(appOutDir, 'debug.sh'), bashDebug)
  } else {
    const bashDebug = await readFile(path.resolve(__dirname, 'linux-debug.sh'))
    await writeFile(path.resolve(appOutDir, 'debug.sh'), bashDebug)
  }
}
