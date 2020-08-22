import { ScriptStatus } from '../enums/script-status.enum'

export interface ScriptModel {
  id: number
  name: string
  path: string
  lastModified: number
  status: ScriptStatus
}
