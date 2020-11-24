/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { CompilerPath, Flag, GamePath, GameType, OutputPath } from '../game'
import { Group } from './group.interface'

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