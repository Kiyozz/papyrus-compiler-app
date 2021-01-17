/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { CompilerPath, Flag, GameType, GamePath, OutputPath } from '../game'
import { Group } from './group.interface'

interface Game {
  type: GameType
  path: GamePath
}

interface Compilation {
  concurrentScripts: number
  compilerPath: CompilerPath
  flag: Flag
  output: OutputPath
}

interface Tutorials {
  settings: boolean
}

interface ConfigMo2 {
  use: boolean
  instance?: string
  output: OutputPath
  mods: string
}

export interface Config {
  game: Game
  compilation: Compilation
  tutorials: Tutorials
  mo2: ConfigMo2
  groups: Group[]
  __internal__: any
}
