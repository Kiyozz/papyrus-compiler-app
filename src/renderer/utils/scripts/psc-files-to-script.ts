/*
 * 2022-2026 Kiyozz.
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
