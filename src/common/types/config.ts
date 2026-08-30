/*
 * 2022-2026 Kiyozz.
 */

import type { Group } from './group'
import type {
  CompilerPath,
  Flag,
  GameType,
  GamePath,
  OutputPath,
} from '../game'
import type { LogLevel } from '../log-level'
import type { Theme } from '../theme'

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

interface ConfigMo2 {
  use: boolean
}

interface Telemetry {
  active: boolean
}

interface Setup {
  /** the setup wizard was walked through to its end at least once */
  done: boolean
}

export interface Config {
  game: Game
  compilation: Compilation
  mo2: ConfigMo2
  groups: Group[]
  telemetry: Telemetry
  setup: Setup
  theme: Theme
  locale: string
  logLevel: LogLevel
  __internal__: unknown
}
