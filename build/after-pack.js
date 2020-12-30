/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const { Platform } = require('electron-builder')

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
  const productName = context.packager.appInfo.productName
  const config = {
    windows: {
      debug: {
        from: 'windows-debug.cmd',
        to: `${productName}-debug.exe.cmd`
      },
      name: {
        from: 'PCA.exe',
        to: `${productName}.exe`
      }
    },
    linux: {
      debug: {
        from: 'linux-debug.sh',
        to: `${productName}-debug.sh`
      },
      name: {
        from: 'PCA',
        to: productName
      }
    },
    mac: {
      debug: {
        from: 'mac-debug.sh',
        to: `${productName}-debug.sh`
      },
      name: {
        from: 'PCA.app',
        to: `${productName}.app`
      }
    }
  }

  let usedConfig

  if (platform === Platform.WINDOWS) {
    usedConfig = config.windows
  } else if (platform === Platform.MAC) {
    usedConfig = config.mac
  } else {
    usedConfig = config.linux
  }

  let debugFile = (
    await readFile(path.resolve(__dirname, usedConfig.debug.from))
  ).toString()
  debugFile = debugFile.replace(usedConfig.name.from, usedConfig.name.to)

  await writeFile(path.resolve(appOutDir, usedConfig.debug.to), debugFile)
}
