/*
 * 2022-2026 Kiyozz.
 */

import { dialog } from 'electron'
import type { DialogType } from '../../common/types/dialog'

interface DialogHandlerArgs {
  type: DialogType
}

export class DialogHandler {
  async listen(args: DialogHandlerArgs | undefined): Promise<string | null> {
    const type = args?.type

    if (type !== 'folder' && type !== 'file') {
      return null
    }

    const result = await dialog.showOpenDialog({
      properties: [type === 'folder' ? 'openDirectory' : 'openFile'],
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
