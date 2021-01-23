/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { ipcRenderer } from '../../../common/ipc'
import * as Events from '../../../common/events'
import { GithubReleaseInterface, ScriptInterface } from '../../interfaces'
import { DialogType } from '../../../common/interfaces/dialog.interface'
import { CompilationResultInterface } from '../../../common/interfaces/compilation-result.interface'

const GITHUB_REPOSITORY =
  'https://api.github.com/repos/Kiyozz/papyrus-compiler-app'

export class IpcApi {
  sendCompileScript = (scripts: ScriptInterface[]) => {
    for (const script of scripts) {
      ipcRenderer.send(Events.CompileScriptStart, script.name)
    }
  }

  whenCompileScript = (script: string): Promise<CompilationResultInterface> => {
    return new Promise<CompilationResultInterface>((resolve, reject) => {
      ipcRenderer.once<CompilationResultInterface>(
        `${Events.CompileScriptFinish}-${script}`,
        result => {
          if (result.success) {
            resolve(result)
          } else {
            reject(new Error(result.output))
          }
        }
      )
    })
  }

  getLatestNotes = async () => {
    const response = await fetch(`${GITHUB_REPOSITORY}/releases`)

    return (await response.json()) as Promise<GithubReleaseInterface[]>
  }

  detectBadInstallation = () => {
    return ipcRenderer.invoke(Events.BadInstallation)
  }

  getVersion = () => {
    return ipcRenderer.invoke<string>(Events.GetVersion)
  }

  openDialog = ({
    type
  }: {
    type: DialogType
  }): Promise<string | undefined> => {
    return ipcRenderer
      .invoke<string | null>(Events.OpenDialog, { type })
      .then(response => {
        if (response === null) {
          return
        }

        return response
      })
  }
}
