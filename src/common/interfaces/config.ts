/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { CompilerPath, Flag, GameType, GamePath, OutputPath } from '../game'
import type { Theme } from '../theme'
import { Group } from './group'

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
  telemetry: boolean
}

interface ConfigMo2 {
  use: boolean
  instance?: string
  output: OutputPath
  mods: string
}

interface Telemetry {
  active: boolean
}

export interface Config {
  game: Game
  compilation: Compilation
  tutorials: Tutorials
  mo2: ConfigMo2
  groups: Group[]
  telemetry: Telemetry
  theme: Theme
  __internal__: unknown
}
