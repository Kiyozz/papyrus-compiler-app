/*
 * 2022-2026 Kiyozz.
 */

import { ScriptStatus } from '../../enums/script-status.enum'
import type { ScriptRenderer } from '../../types'

export function isRunningScript(script: ScriptRenderer) {
  return script.status === ScriptStatus.running
}

export function isSuccessScript(script: ScriptRenderer) {
  return script.status === ScriptStatus.success
}

export function isFailedScript(script: ScriptRenderer) {
  return script.status === ScriptStatus.failed
}
