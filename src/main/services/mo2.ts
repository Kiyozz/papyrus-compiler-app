import { toAntiSlash } from '@common/slash'
import { GameType, toOtherSource, toSource } from '@common/game'
import appStore from '../../common/appStore'
import Mo2ModsPathExistsException from '../exceptions/mo2/Mo2ModsPathExistsException'
import Mo2SourcesException from '../exceptions/mo2/Mo2SourcesException'
import Log from './Log'
import * as path from './path'

interface GenerateImportsOptions {
  gameType: GameType
  mo2: {
    instance: string
  }
}

const log = new Log('Mo2Generate')

async function getSources(gameType: GameType, instance: string) {
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

  log.info('[MO2] DoubleSourceFolders', doubleSourceFolders)

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

  log.info('[MO2] Folders containing sources', files)

  files.sort()

  return files
}

export async function generateImports({
  gameType,
  mo2: { instance }
}: GenerateImportsOptions): Promise<string[]> {
  log.info('Generating ModOrganizer imports')

  const sourcesPath = toSource(gameType)
  const otherSourcesPath = toOtherSource(gameType)
  const modsPath = path.join(instance, appStore.get('mo2.mods'))

  try {
    const sources = await getSources(gameType, instance)
    const mo2OverwriteSourcesPath = path.join(
      instance,
      'overwrite',
      sourcesPath
    )
    const mo2OverwriteOtherSourcesPath = path.join(
      instance,
      'overwrite',
      otherSourcesPath
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

export async function generateModsPath(mo2Instance: string): Promise<string> {
  log.info('Generating ModOrganizer mods path')

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

export async function generateOutput(mo2Instance: string): Promise<string> {
  log.info('Generating ModOrganizer output directory')

  const output = path.join(
    mo2Instance,
    appStore.get<string, string>('mo2.output')
  )

  await path.ensureDirs([output])

  return output
}
