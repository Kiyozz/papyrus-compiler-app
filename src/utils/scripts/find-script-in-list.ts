import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptModel } from '../../models'

export default function findScriptInList(scripts: ScriptModel[], id: number, status: ScriptStatus): ScriptModel | undefined {
  const script = scripts.find(script => script.id === id)

  if (!script) {
    return
  }

  script.status = status

  return script
}
