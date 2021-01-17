/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { IpcMainEvent } from 'electron'
import { EventInterface } from '../interfaces/event.interface'
import { Logger } from '../logger'
import { checkStore } from '../../common/check-store'
import { appStore, defaultConfig } from '../../common/store'
import { compileScript } from '../services/compile-script.service'
import * as Events from '../../common/events'
import { CompilationResultInterface } from '../../common/interfaces/compilation-result.interface'

export class ScriptCompileEvent implements EventInterface<string> {
  private logger = new Logger('ScriptCompileEvent')

  private cleanSuccessLog(script: string, log: string): string {
    return log
      .replace('Starting 1 compile threads for 1 files...', '')
      .replace(`Compiling "${script.replace('.psc', '')}"...`, '')
      .replace(`Starting assembly of ${script.replace('.psc', '')}`, '')
      .replace('Assembly succeeded', '')
      .replace('Compilation succeeded.', '')
      .replace('0 error(s), 0 warning(s)', '')
      .replace(
        'Batch compile of 1 files finished. 1 succeeded, 0 failed.',
        'Succeeded'
      )
      .trim()
  }

  private cleanErrorLog(script: string, log: string): string {
    return log.replace(`Script ${script} failed to compile: `, '').trim()
  }

  async on(ipcEvent: IpcMainEvent, script: string) {
    this.logger.info('start compilation of scripts', script)
    this.logger.debug('checking the current store values')

    checkStore(appStore, defaultConfig)

    const endEvent = `${Events.CompileScriptFinish}-${script}`

    try {
      const result = this.cleanSuccessLog(script, await compileScript(script))

      ipcEvent.reply(endEvent, {
        success: true,
        output: result,
        script
      } as CompilationResultInterface)
    } catch (e) {
      ipcEvent.reply(endEvent, {
        success: false,
        output: this.cleanErrorLog(script, e.message),
        script
      } as CompilationResultInterface)
    }

    ipcEvent.reply(endEvent)
  }
}
