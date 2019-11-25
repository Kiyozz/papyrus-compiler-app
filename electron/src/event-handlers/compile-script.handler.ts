import { Event } from '../decorators'
import { CompileService } from '../services/compile.service'
import { UtilsService } from '../services/utils.service'
import * as path from 'path'
import log from 'electron-log'
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

  @Event('compile-script')
  async compileScriptEvent(event: Electron.IpcMainEvent, { script, game, gamePath, mo2SourcesFolders, mo2Instance }: CompileScriptParameters) {
    const sourcesFolderType = game === 'Skyrim Special Edition' ? 'Source\\Scripts' : 'Scripts\\Source'
    const pathToCheckGameSourceFolder = game === 'Skyrim Special Edition' ? 'Scripts\\Source' : 'Source\\Scripts'
    const imports = path.join(gamePath, 'Data', sourcesFolderType)
    const otherGameSourceFolder = path.join(gamePath, 'Data', pathToCheckGameSourceFolder)
    const output = path.join(gamePath, 'Data\\Scripts')
    const gamePathService = new UtilsService({
      gamePath,
      flag: 'TESV_Papyrus_Flags.flg',
      output,
      imports,
      mo2SourcesFolders,
      mo2Instance,
      game,
      sourcesFolderType,
      otherGameSourceFolder
    })
    const compileService = new CompileService(gamePathService)

    log.info('Started compilation for script:', script)

    try {
      const result = await compileService.compile(script)
      const isSuccess = /0 failed/.test(result)

      log.log('Compilation result\n\n', result, '\n')
      log.log('Compilation is success', isSuccess)

      if (isSuccess) {
        log.info(`Script ${script} sucessfully compiled.`)

        return result
      } else {
        this.throwError(script, { stderr: result })
      }
    } catch (err) {
      this.throwError(script, { stderr: err.message })
    }
  }

  private throwError(script: string, result: { stderr: string }) {
    throw new Error(`Script ${script} failed to compile: ${result.stderr}`)
  }
}
