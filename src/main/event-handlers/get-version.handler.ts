/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { app } from 'electron'
import { is } from 'electron-util'

import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'
import { join, readFile } from '../path/path'

export class GetVersionHandler implements EventHandler {
  private logger = new Logger('GetVersionHandler')

  async listen(): Promise<string> {
    this.logger.debug('getting the app version')

    if (is.development) {
      try {
        const json = await readFile(join(process.env.PWD ?? '', 'package.json'))

        return JSON.parse(json.toString()).version
      } catch {
        return app.getVersion()
      }
    }

    return app.getVersion()
  }
}
