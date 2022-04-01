/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { compile } from '../compilation/compile'
import { IpcEvent } from '../ipc-event'
import { Logger } from '../logger'
import { checkStore } from '../store/settings/check'
import { settingsStore, defaultConfig } from '../store/settings/store'
import { ApplicationException } from '../exceptions/application.exception'
import { fromError } from '../../common/from-error'
import type { Event } from '../interfaces/event'
import type { CompilationResult } from '../../common/types/compilation-result'
import type { IpcMainEvent } from 'electron'

export class ScriptCompileEvent implements Event {
  private logger = new Logger('ScriptCompileEvent')

  private static _cleanSuccessLog(script: string, log: string): string {
    return log
      .replace(
        /Papyrus Compiler Version (?<version>.*) for (?<game>Fallout 4|Skyrim)/,
        '',
      )
      .replace('Starting 1 compile threads for 1 files...', '')
      .replace(`Compiling "${script.replace('.psc', '')}"...`, '')
      .replace(`Compiling "${script}"...`, '')
      .replace(/Copyright (?<text>.*). All rights reserved\.?/, '')
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
    if (is.undefined(script)) {
      throw new ApplicationException('script-compile-on: script is undefined')
    }

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
      const errorMessage: string = fromError(e).message

      ipcEvent.reply(endEvent, {
        success: false,
        output: ScriptCompileEvent._cleanErrorLog(script, errorMessage),
        script,
      } as CompilationResult)
    }
  }
}
