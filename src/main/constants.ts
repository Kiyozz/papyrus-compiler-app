/*
 * 2022-2026 Kiyozz.
 */

import { GITHUB_LINK } from '../common/constants'
import { toCompilerDir } from '../common/game'
import { join } from './path/path'
import type { GameType } from '../common/game'

export const GITHUB_ISSUES_NEW_LINK = `${GITHUB_LINK}/issues/new`

/** relative to the game folder, sf is the only one to nest it under Tools */
export const toDefaultCompilerPath = (game: GameType): string =>
  join(toCompilerDir(game), 'PapyrusCompiler.exe')
