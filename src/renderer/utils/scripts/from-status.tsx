/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import React from 'react'
import { ScriptStatus } from '../../enums/script-status.enum'
import type { ScriptRenderer } from '../../types'

const classNameFromStatus = (script: ScriptRenderer): string => {
  switch (script.status) {
    case ScriptStatus.idle:
      return 'text-black-600 dark:text-gray-500'
    case ScriptStatus.running:
      return 'text-blue-800 dark:text-blue-600'
    case ScriptStatus.success:
      return 'text-green-500 dark:text-green-400'
    default:
      return 'text-red-300'
  }
}

export const iconFromStatus = (script: ScriptRenderer) => {
  switch (script.status) {
    case ScriptStatus.idle:
      return null
    case ScriptStatus.running:
      return <HourglassEmptyIcon className={classNameFromStatus(script)} />
    case ScriptStatus.success:
      return <CheckCircleIcon className={classNameFromStatus(script)} />
    default:
      return <ErrorIcon className={classNameFromStatus(script)} />
  }
}
