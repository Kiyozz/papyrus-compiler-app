import ipc from './ipc-renderer'
import { EVENTS } from '@common'
import { GithubReleaseModel, ScriptModel } from '../../models'

class Api {
  compileScript = (script: ScriptModel) => {
    return ipc.callMain(EVENTS.COMPILE_SCRIPT, script.name)
  }

  getLatestNotes = async () => {
    const response = await fetch('https://api.github.com/repos/Kiyozz/papyrus-compiler-app/releases')

    return (await response.json()) as Promise<GithubReleaseModel[]>
  }

  detectMo2SourcesFolders = () => {
    return ipc.callMain(EVENTS.MO2_MODS_SOURCES)
  }

  detectBadInstallation = () => {
    return ipc.callMain(EVENTS.BAD_INSTALLATION)
  }

  getVersion = () => {
    return ipc.callMain<unknown, string>(EVENTS.GET_VERSION)
  }

  openDialog = (): Promise<string | undefined> => {
    return ipc.callMain<unknown, string | null>(EVENTS.OPEN_DIALOG).then(response => {
      if (response === null) {
        return
      }

      return response
    })
  }
}

export default Api
