/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptModel } from '../../models'

export default function getClassNameFromStatus(script: ScriptModel): string {
  switch (script.status) {
    case ScriptStatus.IDLE:
      return 'text-gray-500'
    case ScriptStatus.RUNNING:
      return 'text-blue-800'
    case ScriptStatus.SUCCESS:
      return 'text-green-500'
    default:
      return 'text-red-300'
  }
}
