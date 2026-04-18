/*
 * 2022-2026 Kiyozz.
 */

import { app } from 'electron'
import { isDev } from 'electron-util/main'
import { Logger } from '../logger'
import { join, readFile } from '../path/path'

export class GetVersionHandler {
  private logger = new Logger('GetVersionHandler')

  async listen(): Promise<string> {
    this.logger.debug('getting the app version')

    if (isDev) {
      try {
        const json = JSON.parse(
          (
            await readFile(join(process.env.PWD ?? '', 'package.json'))
          ).toString(),
        ) as {
          version: string
        }

        return json.version
      } catch {
        return app.getVersion()
      }
    }

    return app.getVersion()
  }
}
