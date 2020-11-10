import { is } from 'electron-util'
import { app } from 'electron'
import { join, readFile } from '../services/path.service'
import { EventHandler } from '../interfaces/event.handler'
import { Logger } from '../logger'

export class GetVersionHandler implements EventHandler {
  private logger = new Logger(GetVersionHandler.name)

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
