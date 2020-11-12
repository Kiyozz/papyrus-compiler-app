import { ipcRenderer } from '../../../common/ipc'
import * as EVENTS from '../../../common/events'
import { GithubReleaseModel, ScriptModel } from '../../models'

const GITHUB_REPOSITORY =
  'https://api.github.com/repos/Kiyozz/papyrus-compiler-app'

class IpcApi {
  compileScript = (script: ScriptModel) => {
    return ipcRenderer.invoke(EVENTS.COMPILE_SCRIPT, script.name)
  }

  getLatestNotes = async () => {
    const response = await fetch(`${GITHUB_REPOSITORY}/releases`)

    return (await response.json()) as Promise<GithubReleaseModel[]>
  }

  detectMo2SourcesFolders = () => {
    return ipcRenderer.invoke(EVENTS.MO2_MODS_SOURCES)
  }

  detectBadInstallation = () => {
    return ipcRenderer.invoke(EVENTS.BAD_INSTALLATION)
  }

  getVersion = () => {
    return ipcRenderer.invoke<string>(EVENTS.GET_VERSION)
  }

  openDialog = (): Promise<string | undefined> => {
    return ipcRenderer
      .invoke<string | null>(EVENTS.OPEN_DIALOG)
      .then(response => {
        if (response === null) {
          return
        }

        return response
      })
  }
}

export default IpcApi
