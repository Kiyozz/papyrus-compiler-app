import { dialog } from 'electron'
import { HandlerInterface } from '../HandlerInterface'

export class DialogHandler implements HandlerInterface {
  async listen(): Promise<any> {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (result.canceled) {
      return null
    }

    const [folder] = result.filePaths

    if (!folder) {
      return null
    }

    return folder
  }
}
