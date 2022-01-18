/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { dialog } from 'electron'

import { DialogType } from '../../common/types/dialog'
import { EventHandler } from '../interfaces/event-handler'

type DialogHandlerArgs = {
  type: DialogType
}

export class DialogHandler implements EventHandler<DialogHandlerArgs> {
  async listen({ type }: DialogHandlerArgs): Promise<string | null> {
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
