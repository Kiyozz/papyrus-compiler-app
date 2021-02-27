/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptInterface } from '../../interfaces'

export default function getClassNameFromStatus(
  script: ScriptInterface
): string {
  switch (script.status) {
    case ScriptStatus.Idle:
      return 'text-gray-500'
    case ScriptStatus.Running:
      return 'text-blue-800'
    case ScriptStatus.Success:
      return 'text-green-500'
    default:
      return 'text-red-300'
  }
}
