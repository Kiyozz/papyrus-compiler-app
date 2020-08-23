import { Script } from '@common'
import { ScriptStatus } from '../enums/script-status.enum'

export interface ScriptModel extends Script {
  id: number
  lastModified: number
  status: ScriptStatus
}
