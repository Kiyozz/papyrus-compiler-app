import { Injectable } from '@nestjs/common'
import { HandlerInvoke } from '../decorators'
import { HandlerInterface } from '../types/handler.interface'
import { dialog } from 'electron'

@HandlerInvoke('open-dialog')
@Injectable()
export class DialogHandler implements HandlerInterface {
  async listen(event: Electron.IpcMainEvent, args?: any): Promise<any> {
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
