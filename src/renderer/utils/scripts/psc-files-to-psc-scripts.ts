/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptInterface } from '../../interfaces'

export function pscFilesToPscScripts(
  pscFiles: File[],
  actualList?: ScriptInterface[],
): ScriptInterface[] {
  return pscFiles.map(({ name, path }, index) => {
    return {
      id: (actualList?.length ?? 0) + index,
      name,
      path,
      status: ScriptStatus.idle,
    }
  })
}
