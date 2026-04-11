/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */
import { Platform } from 'electron-builder'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

/**
 *
 * @param {import('electron-builder').AfterPackContext} context
 * @return {Promise<void>}
 */
export default async function afterPack(context) {
  const appOutDir = context.appOutDir
  const platform = context.packager.platform
  const productName = context.packager.appInfo.productName
  const config = {
    windows: {
      debug: {
        from: 'windows-debug.cmd',
        to: `${productName}-debug.exe.cmd`,
      },
      name: {
        from: 'PCA.exe',
        to: `${productName}.exe`,
      },
    },
    linux: {
      debug: {
        from: 'linux-debug.sh',
        to: `${productName}-debug.sh`,
      },
      name: {
        from: 'PCA',
        to: productName,
      },
    },
    mac: {
      debug: {
        from: 'mac-debug.sh',
        to: `${productName}-debug.sh`,
      },
      name: {
        from: 'PCA.app',
        to: `${productName}.app`,
      },
    },
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
    await fs.readFile(path.resolve(dirname, usedConfig.debug.from))
  ).toString()
  debugFile = debugFile.replace(usedConfig.name.from, usedConfig.name.to)

  await fs.writeFile(path.resolve(appOutDir, usedConfig.debug.to), debugFile)
}
