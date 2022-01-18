/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { IpcMainEvent } from 'electron'

import { CompilationResult } from '../../common/types/compilation-result'
import { compile } from '../compilation/compile'
import { Event } from '../interfaces/event'
import { IpcEvent } from '../ipc-event'
import { Logger } from '../logger'
import { checkStore } from '../store/settings/check'
import { settingsStore, defaultConfig } from '../store/settings/store'

export class ScriptCompileEvent implements Event<string> {
  private logger = new Logger('ScriptCompileEvent')

  private static _cleanSuccessLog(script: string, log: string): string {
    return log
      .replace('Starting 1 compile threads for 1 files...', '')
      .replace(`Compiling "${script.replace('.psc', '')}"...`, '')
      .replace(`Starting assembly of ${script.replace('.psc', '')}`, '')
      .replace('Assembly succeeded', '')
      .replace('Compilation succeeded.', '')
      .replace('0 error(s), 0 warning(s)', '')
      .replace(
        'Batch compile of 1 files finished. 1 succeeded, 0 failed.',
        'Succeeded',
      )
      .trim()
  }

  private static _cleanErrorLog(script: string, log: string): string {
    return log.replace(`Script ${script} failed to compile: `, '').trim()
  }

  async on(ipcEvent: IpcMainEvent, script: string): Promise<void> {
    this.logger.info('start compilation of scripts', script)
    this.logger.debug('checking the current store values')

    checkStore(settingsStore, defaultConfig)

    const endEvent = `${IpcEvent.compileScriptFinish}-${script}`

    this.logger.debug('current store values checked')

    try {
      const result = ScriptCompileEvent._cleanSuccessLog(
        script,
        await compile(script),
      )

      ipcEvent.reply(endEvent, {
        success: true,
        output: result,
        script,
      } as CompilationResult)
    } catch (e) {
      let errorMessage: string

      if (e instanceof Error) {
        errorMessage = e.message
      } else {
        errorMessage = `unknown error ${e}`
      }

      ipcEvent.reply(endEvent, {
        success: false,
        output: ScriptCompileEvent._cleanErrorLog(script, errorMessage),
        script,
      } as CompilationResult)
    }
  }
}
