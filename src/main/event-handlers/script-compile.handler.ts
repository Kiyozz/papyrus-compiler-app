/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { EventHandlerInterface } from '../interfaces/event-handler.interface'
import { compileScript } from '../services/compile-script.service'
import { Logger } from '../logger'
import { checkStore } from '../../common/check-store'
import { appStore, defaultConfig } from '../../common/store'

export class ScriptCompileHandler implements EventHandlerInterface<string> {
  private readonly logger = new Logger('ScriptCompileHandler')

  async listen(script?: string) {
    if (is.undefined(script)) {
      throw new TypeError('Missing script parameter')
    }

    this.logger.info('start of file compilation', script)
    this.logger.debug('checking the current store values')

    checkStore(appStore, defaultConfig)

    const result = await compileScript(script)

    this.logger.info(`the file ${script} has been compiled`)
    this.logger.debug(result)

    return result
  }
}
