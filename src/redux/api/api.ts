import { Games } from '../../enums/games.enum'
import { GithubReleaseModel, ScriptModel } from '../../models'
import { IpcRenderer } from './ipc-renderer'

class Api {
  private ipc = new IpcRenderer()

  compileScript = (
    script: ScriptModel,
    [game, gamePath, mo2Instance, mo2SourcesFolders]: [Games, string, string, string[]]
  ) => {
    return this.ipc.send('compile-script', { script: script.name, game, gamePath, mo2Instance, mo2SourcesFolders })
  }

  getLatestNotes = async () => {
    const response = await fetch('https://api.github.com/repos/Kiyozz/papyrus-compiler-app/releases')

    return (await response.json()) as Promise<GithubReleaseModel[]>
  }

  detectMo2SourcesFolders = ([mo2Instance, game]: [string, string]) => {
    return this.ipc.send('mo2-sources-folders', { mo2Instance, game })
  }

  detectBadInstallation = ({
    gameType,
    gamePath,
    isUsingMo2,
    mo2Path
  }: {
    gamePath: string
    gameType: Games
    isUsingMo2: boolean
    mo2Path: string
  }) => {
    return this.ipc.invoke('get-file', { gameType, gamePath, isUsingMo2, mo2Path, file: 'Actor.psc' })
  }

  openLogFile = () => {
    return this.ipc.send('log-file')
  }

  openDialog = (): Promise<string | undefined> => {
    return this.ipc.invoke<string | null>('open-dialog').then(response => {
      if (response === null) {
        return
      }

      return response
    })
  }
}

export default Api
