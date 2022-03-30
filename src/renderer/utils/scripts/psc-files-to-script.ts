/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import bridge from '../../bridge'
import { ScriptStatus } from '../../enums/script-status.enum'
import type { ScriptRenderer } from '../../types'

export const pscFilesToScript = (pscFiles: File[]): ScriptRenderer[] => {
  return pscFiles.map(({ name, path }) => {
    return {
      id: bridge.uuid(),
      name,
      path,
      status: ScriptStatus.idle,
    }
  })
}
