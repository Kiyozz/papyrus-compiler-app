/*
 * 2022-2026 Kiyozz.
 */

import minimist from 'minimist'
import type {
  CompilerPath,
  GamePath,
  GameType,
  OutputPath,
} from '../common/game'

interface CliArgs {
  'game-path'?: GamePath
  'game-type'?: GameType
  'compiler-path'?: CompilerPath
  'output-path'?: OutputPath
  debug?: boolean
}

export const cliArgs = minimist<CliArgs>(process.argv)

export type { CliArgs }
