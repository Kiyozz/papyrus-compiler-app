import { CompileService } from '../services/compile.service'
import { GamepathService } from '../services/gamepath.service'
import { ipcMain } from 'electron'

interface CompileScriptParameters {
  script: string
  output: string
  imports: string
  flag: string
  gamePath: string
}

export class CompileScriptHandler {
  public static register() {
    CompileScriptHandler.registerCompile()
  }

  private static registerCompile() {
    ipcMain.on('compile-script', async (event, { script, output, flag, gamePath, imports }: CompileScriptParameters) => {
      const gamePathService = new GamepathService({ gamePath, flag, output, imports })
      const compileService = new CompileService(gamePathService)

      console.log('Compile script', script)

      try {
        const result = await compileService.compile(script)
        const isSuccess = /0 failed/.test(result)
        console.log(result, isSuccess)

        if (isSuccess) {
          console.log(`Script ${script} sucessfully compiled.`)
          event.sender.send('compile-script-done', { success: result })
        } else {
          CompileScriptHandler.catchError(event, script, { stderr: result })
        }
      } catch (err) {
        console.error(err);
        CompileScriptHandler.catchError(event, script, { stderr: err.message })
      }
    })
  }

  private static catchError(event: Electron.Event, script: string, result: { stderr: string }) {
    console.log(`Script ${script} failed to compile`, result.stderr)
    event.sender.send('compile-script-done', { error: result.stderr })
  }
}
