import { Injectable } from '@nestjs/common'
import { Mo2ModsPathExistsException } from '../exceptions/mo2'
import { GameHelper } from '../helpers/game.helper'
import { PathHelper } from '../helpers/path.helper'
import { GameType } from '../types/game.type'

interface GenerateImportsOptions {
  game: GameType
  mo2Path: string
  mo2SourcesFolders: string[]
}

@Injectable()
export class Mo2Service {
  constructor(
    private readonly pathHelper: PathHelper,
    private readonly gameHelper: GameHelper
  ) {}

  async generateImports({ game, mo2Path, mo2SourcesFolders }: GenerateImportsOptions): Promise<string[]> {
    const sourcesPath = this.gameHelper.toSource(game)
    const otherSourcesPath = this.gameHelper.toOtherSource(game)
    const mo2OverwriteSourcesPath = this.pathHelper.join(mo2Path, 'overwrite', sourcesPath)
    const mo2OverwriteOtherSourcesPath = this.pathHelper.join(mo2Path, 'overwrite', otherSourcesPath)
    const modsFolder = this.pathHelper.join(mo2Path, 'mods')

    const imports = [
      ...mo2SourcesFolders.map(folder => folder.replace(modsFolder, '.')),
      mo2OverwriteOtherSourcesPath,
      mo2OverwriteSourcesPath
    ]

    await this.pathHelper.ensureDirs([
      ...mo2SourcesFolders,
      mo2OverwriteOtherSourcesPath,
      mo2OverwriteSourcesPath
    ])

    return imports
  }

  async generateModsPath(mo2Instance: string): Promise<string> {
    const modsPath = this.pathHelper.join(mo2Instance, 'mods')

    const modsPathExists = await this.pathHelper.exists(modsPath)

    if (!modsPathExists) {
      throw new Mo2ModsPathExistsException(modsPath)
    }

    return modsPath
  }

  async generateOutput(mo2Instance: string): Promise<string> {
    const output = this.pathHelper.join(mo2Instance, 'overwrite/Scripts')

    await this.pathHelper.ensureDirs([output])

    return output
  }
}
