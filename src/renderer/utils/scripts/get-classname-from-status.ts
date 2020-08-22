import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptModel } from '../../models'
import classes from '../../pages/compilation-page/compilation-page.module.scss'

export default function getClassNameFromStatus(script: ScriptModel): string {
  switch (script.status) {
    case ScriptStatus.IDLE:
      return classes.idle
    case ScriptStatus.RUNNING:
      return classes.running
    case ScriptStatus.SUCCESS:
      return classes.success
    default:
      return classes.failed
  }
}