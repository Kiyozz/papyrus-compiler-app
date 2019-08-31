import { ScriptModel } from '../../models'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { ScriptStatus } from '../../enums/script-status.enum'

export default function getIconFromStatus(script: ScriptModel): IconProp {
  switch (script.status) {
    case ScriptStatus.IDLE:
      return 'clock'
    case ScriptStatus.RUNNING:
      return 'spinner'
    case ScriptStatus.SUCCESS:
      return 'check-circle'
    default:
      return 'exclamation-circle'
  }
}
