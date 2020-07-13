import i18n from 'i18next'
import { Games } from '../../enums/games.enum'
import { GithubReleaseModel, ScriptModel } from '../../models'
import { IpcRenderer } from './ipc-renderer'

function isJson(json: string): boolean {
  try {
    JSON.parse(json)

    return true
  } catch (err) {
    return false
  }
}

class Api {
  private ipc = new IpcRenderer()

  compileScript = (script: ScriptModel, [game, gamePath, mo2Instance, mo2SourcesFolders]: [Games, string, string, string[]]) => {
    return this.ipc.send('compile-script', { script: script.name, game, gamePath, mo2Instance, mo2SourcesFolders })
      .catch(err => {
        if (!isJson(err)) {
          throw err
        }

        console.log('to', err)

        let { error, command, script } = JSON.parse(err)

        if (isJson(error)) {
          const { gamePath, executable } = JSON.parse(error)

          error = i18n.t('common.logs.invalidConfiguration', { folder: gamePath, exe: executable })
        }

        const commandMessage = `\n${typeof command !== 'undefined' ? i18n.t('common.logs.scriptFailedCommand', { cmd: command }) : ''}`

        throw new Error(`${i18n.t('common.logs.scriptFailed', { script, message: error })}${commandMessage}`)
      })
  }

  getLatestNotes = async () => {
    const response = await fetch('https://api.github.com/repos/Kiyozz/papyrus-compiler-app/releases')

    return await response.json() as Promise<GithubReleaseModel[]>
  }

  detectMo2SourcesFolders = ([mo2Instance, game]: [string, string]) => {
    return this.ipc.send('mo2-sources-folders', { mo2Instance, game })
      .catch(err => {
        if (!isJson(err)) {
          throw err
        }

        const { folder, requiredFolders } = JSON.parse(err)

        throw new Error(i18n.t('page.settings.mo2.errorInstance', { folder, requiredFolders: requiredFolders.map((d: string) => `"${d}"`).join(', ') }))
      })
  }

  detectBadInstallation = ({ gameType, gamePath, isUsingMo2, mo2Path }: { gamePath: string, gameType: Games, isUsingMo2: boolean, mo2Path: string }) => {
    return this.ipc.send('get-file', { gameType, gamePath, isUsingMo2, mo2Path, file: 'Actor.psc' })
  }
}

export default Api
