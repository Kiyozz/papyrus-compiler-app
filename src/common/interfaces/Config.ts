import type { CompilerPath, Flag, GamePath, GameType, OutputPath } from '../game'
import { Group } from './Group'

interface ConfigMo2 {
  use: boolean
  instance?: string
  output: OutputPath
  mods: string
}

export interface Config {
  mo2: ConfigMo2
  gameType: GameType
  gamePath: GamePath
  flag: Flag
  output: OutputPath
  compilerPath: CompilerPath
  groups: Group[]
  __internal__: any
}
