import { toAntiSlash } from '@pca/common/slash'
import { GameType, toOtherSource, toSource } from '@pca/common/game'
import { appStore } from '@pca/common/store'
import { Mo2ModsPathExistsException } from '../exceptions/mo2/mo2-mods-path-exists.exception'
import { Mo2SourcesException } from '../exceptions/mo2/mo2-sources.exception'
import { Logger } from '../logger'
import * as path from './path.service'

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
  const modsPath = path.join(instance, appStore.get('mo2.mods'))
  const foldersToCheck = [sourcesPath, otherSourcesPath].map(
    p => `${modsPath}/**/${p}`
  )

  let files: string[] = await path.getPathsInFolder(foldersToCheck, {
    absolute: true,
    deep: 3,
    onlyDirectories: true
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

      return isSame && new RegExp(sourcesPath).test(file) ? file : before
    })
    .filter(f => !!f) as readonly string[]

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
    .map(file => toAntiSlash(file))

  logger.debug('[MO2] Folders containing sources', files)

  files.sort()

  return files
}

export async function getImportsPath({
  gameType,
  mo2: { instance }
}: GenerateImportsOptions): Promise<string[]> {
  logger.info('getting MO2 imports path')

  const sourcePath = toSource(gameType)
  const otherSourcePath = toOtherSource(gameType)
  const modsPath = path.join(instance, appStore.get('mo2.mods'))

  try {
    const sources = await getModsSourcesPath(gameType, instance)
    const mo2OverwriteSourcesPath = path.join(instance, 'overwrite', sourcePath)
    const mo2OverwriteOtherSourcesPath = path.join(
      instance,
      'overwrite',
      otherSourcePath
    )
    const imports = [
      ...sources.map(folder => folder.replace(modsPath, '.')),
      mo2OverwriteOtherSourcesPath,
      mo2OverwriteSourcesPath
    ]

    await path.ensureDirs([mo2OverwriteSourcesPath])

    return imports
  } catch (e) {
    throw new Mo2SourcesException(e.message)
  }
}

export async function getModsPath(mo2Instance: string): Promise<string> {
  logger.info('getting MO2 mods path')

  const modsPath = path.join(
    mo2Instance,
    appStore.get<string, string>('mo2.mods')
  )
  const modsPathExists = await path.exists(modsPath)

  if (!modsPathExists) {
    throw new Mo2ModsPathExistsException(modsPath)
  }

  return modsPath
}

export async function getOutputPath(mo2Instance: string): Promise<string> {
  logger.info('getting MO2 output path')

  const output = path.join(
    mo2Instance,
    appStore.get<string, string>('mo2.output')
  )

  await path.ensureDirs([output])

  return output
}
