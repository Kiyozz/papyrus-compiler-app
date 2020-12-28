/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { ipcRenderer } from '../../../common/ipc'
import * as EVENTS from '../../../common/events'
import { GithubReleaseInterface, ScriptInterface } from '../../interfaces'
import { DialogType } from '../../../common/interfaces/dialog.interface'

const GITHUB_REPOSITORY =
  'https://api.github.com/repos/Kiyozz/papyrus-compiler-app'

export class IpcApi {
  compileScript = (script: ScriptInterface) => {
    return ipcRenderer.invoke(EVENTS.COMPILE_SCRIPT, script.name)
  }

  getLatestNotes = async () => {
    const response = await fetch(`${GITHUB_REPOSITORY}/releases`)

    return (await response.json()) as Promise<GithubReleaseInterface[]>
  }

  detectBadInstallation = () => {
    return ipcRenderer.invoke(EVENTS.BAD_INSTALLATION)
  }

  getVersion = () => {
    return ipcRenderer.invoke<string>(EVENTS.GET_VERSION)
  }

  openDialog = ({
    type
  }: {
    type: DialogType
  }): Promise<string | undefined> => {
    return ipcRenderer
      .invoke<string | null>(EVENTS.OPEN_DIALOG, { type })
      .then(response => {
        if (response === null) {
          return
        }

        return response
      })
  }
}
