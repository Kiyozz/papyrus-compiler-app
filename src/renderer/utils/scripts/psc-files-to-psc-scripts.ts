/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptRenderer } from '../../types'

export const pscFilesToPscScripts = (
  pscFiles: File[],
  actualList?: ScriptRenderer[],
): ScriptRenderer[] => {
  return pscFiles.map(({ name, path }, index) => {
    return {
      id: (actualList?.length ?? 0) + index,
      name,
      path,
      status: ScriptStatus.idle,
    }
  })
}
