import { dialog } from 'electron'
import { EventHandler } from '../EventHandler'

export class DialogHandler implements EventHandler {
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
