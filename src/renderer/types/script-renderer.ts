/*
 * 2022-2026 Kiyozz.
 */

import type { Script } from '../../common/types/script'
import type { ScriptStatus } from '../enums/script-status.enum'

export type ScriptRenderer = Script & {
  id: string
  status: ScriptStatus
}
