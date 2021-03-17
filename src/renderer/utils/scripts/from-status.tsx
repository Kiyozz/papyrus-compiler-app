/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder'
import React from 'react'

import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptInterface } from '../../interfaces'

export function getClassNameFromStatus(script: ScriptInterface): string {
  switch (script.status) {
    case ScriptStatus.Idle:
      return 'text-black-600 dark:text-gray-500'
    case ScriptStatus.Running:
      return 'text-blue-800 dark:text-blue-600'
    case ScriptStatus.Success:
      return 'text-green-500 dark:text-green-400'
    default:
      return 'text-red-300'
  }
}

export function getIconFromStatus(script: ScriptInterface): JSX.Element {
  switch (script.status) {
    case ScriptStatus.Idle:
      return <QueryBuilderIcon />
    case ScriptStatus.Running:
      return <HourglassEmptyIcon />
    case ScriptStatus.Success:
      return <CheckCircleIcon />
    default:
      return <ErrorIcon />
  }
}
