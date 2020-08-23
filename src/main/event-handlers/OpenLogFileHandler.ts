import { shell } from 'electron'
import { HandlerInterface } from '../HandlerInterface'

export class OpenLogFileHandler implements HandlerInterface {
  async listen(file: string): Promise<void> {
    try {
      await shell.openExternal(file)
    } catch (e) {
      if (e.message.includes('Invalid URL')) {
        await shell.openExternal(`file://${file}`)
      } else {
        throw e
      }
    }
  }
}
