import { Script } from '@pca/common/interfaces/script.interface'
import { ScriptStatus } from '../enums/script-status.enum'

export interface ScriptModel extends Script {
  id: number
  status: ScriptStatus
}
