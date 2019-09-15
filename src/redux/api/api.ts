import { GithubReleaseModel, ScriptModel } from '../../models'
import { IpcRenderer } from './ipc-renderer'
import { Games } from '../../enums/games.enum'

class Api {
  private ipc = new IpcRenderer()

  compileScript = (script: ScriptModel, [game, gamePath]: [Games, string]) => {
    return this.ipc.send('compile-script', { script: script.name, game, gamePath })
  }

  getLatestNotes = async () => {
    const response = await fetch('https://api.github.com/repos/Kiyozz/papyrus-compiler-app/releases/latest')

    return await response.json() as Promise<GithubReleaseModel>
  }

  detectMo2SourcesFolders = ([mo2Instance, game]: [string, string]) => {
    return this.ipc.send('mo2-sources-folders', { mo2Instance, game })
  }
}

const api = new Api()

export default api
