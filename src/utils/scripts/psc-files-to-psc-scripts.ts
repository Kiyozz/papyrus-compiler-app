import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptModel } from '../../models'

export function pscFilesToPscScripts(pscFiles: File[], actualList?: ScriptModel[]): ScriptModel[] {
  return pscFiles.map(({ name, path, lastModified }, index) => {
    return {
      id: (actualList?.length ?? 0) + index,
      name,
      path,
      lastModified,
      status: ScriptStatus.IDLE
    }
  })
}
