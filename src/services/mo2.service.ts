import { Games } from '../enums/games.enum'

interface CalculateLimitationOptions {
  folders: string[]
  mo2Instance: string
  gamePath: string
  game: Games
}

export class Mo2Service {
  windowsCmdLimitation = 8191

  calculateLimitation({ folders, game, gamePath, mo2Instance }: CalculateLimitationOptions): number {
    const sourcesType = game === 'Skyrim Special Edition' ? 'Source\\Scripts' : 'Scripts\\Source'
    const gameFolderData = gamePath + '\\Data\\' + sourcesType
    const gameFolderPapyrus = gamePath + '\\Papyrus Compiler\\PapyrusCompiler.exe'
    const mo2InstanceWithMods = mo2Instance + '\\mods'
    const flagLength = `-f="TESV_Papyrus_Flags.flg"`.length
    const output = `-o="${mo2Instance}\\overwrite\\${sourcesType}"`
    const spacesBetweenArgs = 4
    const averageScriptLength = 15
    const foldersSum = folders
      .map(folder => folder.replace(mo2Instance, ''))
      .reduce((previous, next) => {
        previous = next.length + previous

        return previous
      }, 0)

    return (
      gameFolderData.length +
      gameFolderPapyrus.length +
      mo2InstanceWithMods.length +
      flagLength +
      output.length +
      spacesBetweenArgs +
      averageScriptLength +
      foldersSum
    )
  }
}
