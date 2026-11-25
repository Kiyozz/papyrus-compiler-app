/*
 * 2022-2026 Kiyozz.
 */

import { dialog } from 'electron'
import type { DialogType } from '../../common/types/dialog'
import { Logger } from '../logger'

const logger = new Logger('DialogHandler')

interface DialogHandlerArgs {
  type: DialogType
  /**
   * Without it, Windows opens the picker on the last folder used. Under MO2,
   * that folder can be one of its virtual file system - Data\Scripts - that
   * the picker fails to reach with an older MO2: it then shows "location is
   * not available" instead of opening.
   */
  defaultPath?: string
}

export class DialogHandler {
  async listen(args: DialogHandlerArgs | undefined): Promise<string | null> {
    const type = args?.type

    if (type !== 'folder' && type !== 'file') {
      return null
    }

    const defaultPath = args?.defaultPath?.trim() || undefined

    logger.debug('opening the picker', type, 'in', defaultPath)

    const result = await dialog.showOpenDialog({
      properties: [type === 'folder' ? 'openDirectory' : 'openFile'],
      defaultPath,
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
