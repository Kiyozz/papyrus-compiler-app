/*
 * 2022-2026 Kiyozz.
 */

import type { Script } from '#common/types/script.ts'
import type { ScriptStatus } from '../enums/script-status.enum'

export type ScriptRenderer = Script & {
  id: string
  status: ScriptStatus
  /** absolute path of the pex of the last run, undefined when it failed */
  pexPath?: string
}
