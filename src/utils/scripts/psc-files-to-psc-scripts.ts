import { ScriptModel } from '../../models'
import { ScriptStatus } from '../../enums/script-status.enum'
import { get } from 'lodash-es'

export default function pscFilesToPscScripts(pscFiles: File[], actualList?: ScriptModel[]): ScriptModel[] {
  return pscFiles.map(({ name, path, lastModified }, index) => {
    return {
      id: get(actualList, 'length', 0) + index + 1,
      name,
      path,
      lastModified,
      status: ScriptStatus.IDLE
    }
  })
}
