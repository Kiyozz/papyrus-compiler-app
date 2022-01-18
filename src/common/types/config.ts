/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { CompilerPath, Flag, GameType, GamePath, OutputPath } from '../game'
import type { Theme } from '../theme'
import { Group } from './group'

type Game = {
  type: GameType
  path: GamePath
}

type Compilation = {
  concurrentScripts: number
  compilerPath: CompilerPath
  flag: Flag
  output: OutputPath
}

type Tutorials = {
  settings: boolean
  telemetry: boolean
}

type ConfigMo2 = {
  use: boolean
  instance?: string
  output: OutputPath
  mods: string
}

type Telemetry = {
  active: boolean
}

export type Config = {
  game: Game
  compilation: Compilation
  tutorials: Tutorials
  mo2: ConfigMo2
  groups: Group[]
  telemetry: Telemetry
  theme: Theme
  locale: string
  __internal__: unknown
}
