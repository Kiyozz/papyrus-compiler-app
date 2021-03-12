/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { IpcMainEvent } from 'electron'

import { checkStore } from '../../common/check-store'
import { Events } from '../../common/events'
import { CompilationResult } from '../../common/interfaces/compilation-result'
import { appStore, defaultConfig } from '../../common/store'
import { compile } from '../compilation/compile'
import { Event } from '../interfaces/event'
import { Logger } from '../logger'

export class ScriptCompileEvent implements Event<string> {
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

  async on(ipcEvent: IpcMainEvent, script: string): Promise<void> {
    this.logger.info('start compilation of scripts', script)
    this.logger.debug('checking the current store values')

    checkStore(appStore, defaultConfig)

    const endEvent = `${Events.CompileScriptFinish}-${script}`

    this.logger.debug('current store values checked')

    try {
      const result = this.cleanSuccessLog(script, await compile(script))

      ipcEvent.reply(endEvent, {
        success: true,
        output: result,
        script
      } as CompilationResult)
    } catch (e) {
      ipcEvent.reply(endEvent, {
        success: false,
        output: this.cleanErrorLog(script, e.message),
        script
      } as CompilationResult)
    }
  }
}
