import React from 'react'
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import { ScriptModel } from '../../models'
import { ScriptStatus } from '../../enums/script-status.enum'

export default function getIconFromStatus(script: ScriptModel): JSX.Element {
  switch (script.status) {
    case ScriptStatus.IDLE:
      return <QueryBuilderIcon />
    case ScriptStatus.RUNNING:
      return <HourglassEmptyIcon />
    case ScriptStatus.SUCCESS:
      return <CheckCircleIcon />
    default:
      return <ErrorIcon />
  }
}
