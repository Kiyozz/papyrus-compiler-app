/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { is } from 'electron-util'
import { toOtherSource, toSource } from '../../common/game'
import { ApplicationException } from '../exceptions/application.exception'
import { ConfigurationException } from '../exceptions/configuration.exception'
import { Logger } from '../logger'
import * as path from '../path/path'
import { toAntiSlash, toSlash } from '../slash'
import { settingsStore } from '../store/settings/store'
import type { GameType } from '../../common/game'

interface GenerateImportsOptions {
  gameType: GameType
  mo2: {
    instance: string
  }
}

const logger = new Logger('Mo2Service')

async function getModsSourcesPath(gameType: GameType, instance: string) {
  const sourcesPath = toSource(gameType)
  const otherSourcesPath = toOtherSource(gameType)
  const modsPath = path.join(instance, settingsStore.get('mo2.mods'))
  const foldersToCheck = [sourcesPath, otherSourcesPath].map(
    p => `${modsPath}/**/${p}`,
  )

  let files: string[] = await path.getPathsInFolder(foldersToCheck, {
    absolute: true,
    deep: 3,
    onlyDirectories: true,
  })
  const doubleSourceFolders = files
    .map((file, index, list) => {
      const before = list[index === 0 ? 1 : index - 1]

      if (!before) {
        return false
      }

      const sliced = file.slice(0, -15)
      const slicedBefore = before.slice(0, -15)
      const isSame = sliced === slicedBefore

      if (!isSame) {
        return false
      }

      return new RegExp(sourcesPath).test(file) ? file : before
    })
    .filter(f => Boolean(f)) as readonly string[]

  logger.debug('[MO2] DoubleSourceFolders', doubleSourceFolders)

  files = files
    .filter(file => {
      const sliced = file.slice(0, -15)
      const isInDouble = doubleSourceFolders.some(inFile => {
        const slicedIn = inFile.slice(0, -15)

        return sliced === slicedIn
      })

      if (!isInDouble) {
        return true
      }

      return doubleSourceFolders.includes(file)
    })
    .map(file =>
      path.normalize(is.linux || is.macos ? toSlash(file) : toAntiSlash(file)),
    )

  logger.debug('[MO2] Folders containing sources', files)

  files.sort()

  return files
}

export async function getImportsPath({
  gameType,
  mo2: { instance },
}: GenerateImportsOptions): Promise<string[]> {
  logger.info('getting MO2 imports path')

  const sourcePath = toSource(gameType)
  const otherSourcePath = toOtherSource(gameType)
  const modsPath = path.join(instance, settingsStore.get('mo2.mods'))

  try {
    const sources = await getModsSourcesPath(gameType, instance)
    const overwritePath = path.join(instance, 'overwrite')
    const mo2OverwriteSourcesPath = path.normalize(
      path.join(overwritePath, sourcePath),
    )
    const mo2OverwriteOtherSourcesPath = path.normalize(
      path.join(overwritePath, otherSourcePath),
    )
    const imports = [
      ...sources.map(folder => folder.replace(modsPath, '.')),
      mo2OverwriteOtherSourcesPath,
      mo2OverwriteSourcesPath,
    ]

    await path.ensureDirs([
      mo2OverwriteSourcesPath,
      mo2OverwriteOtherSourcesPath,
    ])

    return imports
  } catch (e) {
    if (e instanceof Error) {
      throw new ApplicationException(e.message)
    }

    throw e
  }
}

export function getModsPath(mo2Instance: string): string {
  logger.info('getting MO2 mods path')

  const modsPath = path.join(
    mo2Instance,
    settingsStore.get<string, string>('mo2.mods'),
  )
  const modsPathExists = path.exists(modsPath)

  if (!modsPathExists) {
    throw new ConfigurationException(`${modsPath} does not exist`)
  }

  return modsPath
}

export async function getOutputPath(mo2Instance: string): Promise<string> {
  logger.info('getting MO2 output path')

  const outputRaw = path.normalize(
    path.join(mo2Instance, settingsStore.get<string, string>('mo2.output')),
  )

  const output =
    is.macos || is.linux ? toSlash(outputRaw) : toAntiSlash(outputRaw)

  await path.ensureDirs([output])

  return output
}
