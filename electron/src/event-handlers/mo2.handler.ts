import { ipcMain } from 'electron'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'

interface Mo2SourcesFolderParameters {
  mo2Instance: string
  game: 'Skyrim Special Edition' | 'Skyrim Legendary Edition'
}

export class Mo2Handler {
  static register() {
    this.registerDetect()
  }

  private static registerDetect() {
    ipcMain.on('mo2-sources-folders', async (event, { mo2Instance, game }: Mo2SourcesFolderParameters) => {
      const sourcesFolderType = game === 'Skyrim Special Edition' ? 'Source\\Scripts' : 'Scripts\\Source'

      if (!mo2Instance || !game) {
        this.throwError('Missing parameters: mo2Instance or game', event)

        return
      }

      try {
        await fs.stat(path.resolve(mo2Instance, 'mods'))
      } catch (e) {
        this.throwError(`Folder "mods" does not exists in ${mo2Instance}`, event)

        return
      }

      glob(`${mo2Instance}\\mods\\**\\${sourcesFolderType}`, (err, files) => {
        if (err) {
          this.throwError(err, event)

          return
        }

        event.sender.send('mo2-sources-folders-success', files.map((file) => file.replace(/\//g, '\\')))
      })
    })
  }

  private static throwError(err: Error | string, event: Electron.IpcMainEvent) {
    if (typeof err === 'string') {
      err = new Error(err)
    }

    if (err.hasOwnProperty('message')) {
      err = err.message
    }

    event.sender.send('mo2-sources-folders-error', err)
  }
}
