/*
 * 2022-2026 Kiyozz.
 */

import { webUtils } from '@renderer/bridge.ts'
import { ScriptStatus } from '../../enums/script-status.enum'
import { uuid } from '../uuid'
import type { ScriptRenderer } from '../../types'

export const pscFilesToScript = (pscFiles: File[]): ScriptRenderer[] => {
  return pscFiles.map((file) => ({
    id: uuid(),
    name: file.name,
    path: webUtils.getPathForFile(file),
    status: ScriptStatus.idle,
  }))
}
