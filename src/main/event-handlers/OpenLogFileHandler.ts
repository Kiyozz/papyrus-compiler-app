import { shell } from 'electron'
import { EventHandler } from '../EventHandler'

export class OpenLogFileHandler implements EventHandler {
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
