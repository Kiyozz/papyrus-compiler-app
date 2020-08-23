import { toOtherSource, toSource, GameType } from '@common'
import appStore from '../../common/appStore'
import Mo2ModsPathExistsException from '../exceptions/mo2/Mo2ModsPathExistsException'
import Log from './Log'
import * as path from './path'

interface GenerateImportsOptions {
  gameType: GameType
  mo2: {
    instance: string
    sources: string[]
  }
}

const log = new Log('Mo2Generate')

export async function generateImports({ gameType, mo2: { instance, sources } }: GenerateImportsOptions): Promise<string[]> {
  log.info('Generating ModOrganizer imports')

  const sourcesPath = toSource(gameType)
  const otherSourcesPath = toOtherSource(gameType)
  const mo2OverwriteSourcesPath = path.join(instance, 'overwrite', sourcesPath)
  const mo2OverwriteOtherSourcesPath = path.join(instance, 'overwrite', otherSourcesPath)
  const modsFolder = path.join(instance, 'mods')
  const imports = [...sources.map(folder => folder.replace(modsFolder, '.')), mo2OverwriteOtherSourcesPath, mo2OverwriteSourcesPath]

  await path.ensureDirs([mo2OverwriteSourcesPath])

  return imports
}

export async function generateModsPath(mo2Instance: string): Promise<string> {
  log.info('Generating ModOrganizer mods path')

  const modsPath = path.join(mo2Instance, 'mods')
  const modsPathExists = await path.exists(modsPath)

  if (!modsPathExists) {
    throw new Mo2ModsPathExistsException(modsPath)
  }

  return modsPath
}

export async function generateOutput(mo2Instance: string): Promise<string> {
  log.info('Generating ModOrganizer output directory')

  const output = path.join(mo2Instance, appStore.get<string, string>('mo2.output'))

  await path.ensureDirs([output])

  return output
}
