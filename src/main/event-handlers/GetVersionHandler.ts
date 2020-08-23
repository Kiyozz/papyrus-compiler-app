import { is } from 'electron-util'
import { app } from 'electron'
import { join, readFile } from '../services/path'
import { HandlerInterface } from '../HandlerInterface'

export class GetVersionHandler implements HandlerInterface {
  async listen(): Promise<string> {
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
