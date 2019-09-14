import { CompileService } from '../services/compile.service'
import { GamepathService } from '../services/gamepath.service'
import { ipcMain } from 'electron'
import * as path from 'path'

interface CompileScriptParameters {
  script: string
  output: string
  gamePath: string
  game: 'Skyrim Legendary Edition' | 'Skyrim Special Edition'
}

export class CompileScriptHandler {
  public static register() {
    CompileScriptHandler.registerCompile()
  }

  private static registerCompile() {
    ipcMain.on('compile-script', async (event, { script, game, gamePath }: CompileScriptParameters) => {
      const imports = path.join(gamePath, 'Data', game === 'Skyrim Special Edition' ? 'Source\\Scripts' : 'Scripts\\Source')
      const output = path.join(gamePath, 'Data\\Scripts')
      const gamePathService = new GamepathService({ gamePath, flag: 'TESV_Papyrus_Flags.flg', output, imports })
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
    event.sender.send('compile-script-error', new Error(result.stderr))
  }
}
