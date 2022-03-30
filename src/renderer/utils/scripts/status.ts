/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
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
