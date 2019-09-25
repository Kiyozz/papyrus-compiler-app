import { CompileService } from '../services/compile.service'
import { UtilsService } from '../services/utils.service'
import { ipcMain } from 'electron'
import * as path from 'path'
import { GameType } from '../types/game.type'

interface CompileScriptParameters {
  script: string
  output: string
  gamePath: string
  game: GameType
  mo2Instance: string
  mo2SourcesFolders: string[]
}

export class CompileScriptHandler {
  public static register() {
    CompileScriptHandler.registerCompile()
  }

  private static registerCompile() {
    ipcMain.on('compile-script', async (event, { script, game, gamePath, mo2SourcesFolders, mo2Instance }: CompileScriptParameters) => {
      const sourcesFolderType = game === 'Skyrim Special Edition' ? 'Source\\Scripts' : 'Scripts\\Source'
      const imports = path.join(gamePath, 'Data', sourcesFolderType)
      const output = path.join(gamePath, 'Data\\Scripts')
      const gamePathService = new UtilsService({
        gamePath,
        flag: 'TESV_Papyrus_Flags.flg',
        output,
        imports,
        mo2SourcesFolders,
        mo2Instance,
        game,
        sourcesFolderType
      })
      const compileService = new CompileService(gamePathService)

      console.log('Compile script', script)

      try {
        const result = await compileService.compile(script)
        const isSuccess = /0 failed/.test(result)
        console.log(result, isSuccess)

        if (isSuccess) {
          console.log(`Script ${script} sucessfully compiled.`)
          event.sender.send('compile-script-success', result)
        } else {
          CompileScriptHandler.catchError(event, script, { stderr: result })
        }
      } catch (err) {
        console.error(err)
        CompileScriptHandler.catchError(event, script, { stderr: err.message })
      }
    })
  }

  private static catchError(event: Electron.IpcMainEvent, script: string, result: { stderr: string }) {
    console.log(`Script ${script} failed to compile`, result.stderr)
    event.sender.send('compile-script-error', result.stderr)
  }
}
