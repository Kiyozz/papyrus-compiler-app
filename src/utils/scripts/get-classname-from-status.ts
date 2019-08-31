import { ScriptModel } from '../../models'
import { ScriptStatus } from '../../enums/script-status.enum'

export default function getClassNameFromStatus(script: ScriptModel): string {
  switch (script.status) {
    case ScriptStatus.IDLE:
      return 'app-list-group-item-script-status-idle'
    case ScriptStatus.RUNNING:
      return 'app-list-group-item-script-status-running'
    case ScriptStatus.SUCCESS:
      return 'app-list-group-item-script-status-success'
    default:
      return 'app-list-group-item-script-status-failed'
  }
}
