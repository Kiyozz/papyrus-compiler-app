import { ScriptModel } from './script.model'

export interface GroupModel {
  id: number
  name: string
  scripts: ScriptModel[]
}
