/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { ScriptStatus } from '../../enums/script-status.enum'
import { uuid } from '../uuid'
import type { ScriptRenderer } from '../../types'

export const pscFilesToScript = (pscFiles: File[]): ScriptRenderer[] => {
  return pscFiles.map(({ name, path }) => {
    return {
      id: uuid(),
      name,
      path,
      status: ScriptStatus.idle,
    }
  })
}
