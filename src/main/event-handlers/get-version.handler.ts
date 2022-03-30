/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { app } from 'electron'
import { is } from 'electron-util'
import { Logger } from '../logger'
import { join, readFile } from '../path/path'
import type { EventHandler } from '../interfaces/event-handler'

export class GetVersionHandler implements EventHandler {
  private logger = new Logger('GetVersionHandler')

  async listen(): Promise<string> {
    this.logger.debug('getting the app version')

    if (is.development) {
      try {
        const json = JSON.parse(
          (
            await readFile(join(process.env.PWD ?? '', 'package.json'))
          ).toString(),
        ) as { version: string }

        return json.version
      } catch {
        return app.getVersion()
      }
    }

    return app.getVersion()
  }
}
