/*
 * 2022-2026 Kiyozz.
 */

import { is } from 'electron-util'
import { toOtherSource, toSource } from '#common/game.ts'
import { ApplicationException } from '../exceptions/application.exception'
import { ConfigurationException } from '../exceptions/configuration.exception'
import { Logger } from '../logger'
import * as path from '../path/path'
import { toAntiSlash, toSlash } from '../slash'
import type { GameType } from '#common/game.ts'
import { SettingsStore } from '#main/store/settings/store.ts'
import { inject } from '#main/inject.ts'

interface GenerateImportsOptions {
  gameType: GameType
  mo2: {
    instance: string
  }
}

@inject()
export class Mo2Service {
  #logger = new Logger('Mo2')
  #settingsStore: SettingsStore

  constructor(settingsStore: SettingsStore) {
    this.#settingsStore = settingsStore
  }

  getModsPath(mo2Instance: string): string {
    this.#logger.info('getting MO2 mods path')

    const modsPath = path.join(
      mo2Instance,
      this.#settingsStore.get<string, string>('mo2.mods'),
    )
    const modsPathExists = path.exists(modsPath)

    if (!modsPathExists) {
      throw new ConfigurationException(`${modsPath} does not exist`)
    }

    return modsPath
  }

  async getOutputPath(mo2Instance: string): Promise<string> {
    this.#logger.info('getting MO2 output path')

    const outputRaw = path.normalize(
      path.join(
        mo2Instance,
        this.#settingsStore.get<string, string>('mo2.output'),
      ),
    )

    const output =
      is.macos || is.linux ? toSlash(outputRaw) : toAntiSlash(outputRaw)

    await path.ensureDirs([output])

    return output
  }

  async getImportsPath({
    gameType,
    mo2: { instance },
  }: GenerateImportsOptions): Promise<string[]> {
    this.#logger.info('getting MO2 imports path')

    const sourcePath = toSource(gameType)
    const otherSourcePath = toOtherSource(gameType)
    const modsPath = path.join(instance, this.#settingsStore.get('mo2.mods'))

    try {
      const sources = await this.getModsSourcesPath(gameType, instance)
      const overwritePath = path.join(instance, 'overwrite')
      const mo2OverwriteSourcesPath = path.normalize(
        path.join(overwritePath, sourcePath),
      )
      const mo2OverwriteOtherSourcesPath = path.normalize(
        path.join(overwritePath, otherSourcePath),
      )
      const imports = [
        ...sources.map((folder) => folder.replace(modsPath, '.')),
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

  async getModsSourcesPath(gameType: GameType, instance: string) {
    const sourcesPath = toSource(gameType)
    const otherSourcesPath = toOtherSource(gameType)
    const modsPath = path.join(instance, this.#settingsStore.get('mo2.mods'))
    const foldersToCheck = [sourcesPath, otherSourcesPath].map(
      (p) => `${modsPath}/**/${p}`,
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
      .filter((f) => Boolean(f)) as readonly string[]

    this.#logger.debug('[MO2] DoubleSourceFolders', doubleSourceFolders)

    files = files
      .filter((file) => {
        const sliced = file.slice(0, -15)
        const isInDouble = doubleSourceFolders.some((inFile) => {
          const slicedIn = inFile.slice(0, -15)

          return sliced === slicedIn
        })

        if (!isInDouble) {
          return true
        }

        return doubleSourceFolders.includes(file)
      })
      .map((file) =>
        path.normalize(
          is.linux || is.macos ? toSlash(file) : toAntiSlash(file),
        ),
      )

    this.#logger.debug('[MO2] Folders containing sources', files)

    files.sort()

    return files
  }
}
