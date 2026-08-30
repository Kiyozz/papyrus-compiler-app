/*
 * 2026 Kiyozz.
 */

import type { GameType } from '../game'

export type DiagnosticId =
  /** the game executable is not in the game folder */
  | 'game-exe'
  /** no compiler, no sources, no archives: the kit was never installed */
  | 'ck-missing'
  /** the kit shipped its sources as archives that nobody extracted */
  | 'sources-archived'
  /** PapyrusCompiler.exe is not where the settings say */
  | 'compiler'
  /** neither archives nor psc, the kit is there but its sources are not */
  | 'sources-missing'
  /** se and vr only: psc sit in the le source folder, which their kit ignores */
  | 'sources-legacy'
  /** the compiler in use belongs to a game this one is not compatible with */
  | 'compiler-foreign'
  /** the script extender runs but did not bring its psc along */
  | 'extender-sources'

export interface DiagnosticArchive {
  /** absolute path of the archive */
  path: string
  name: string
  /** false for the le rar, PCA only extracts zip */
  extractable: boolean
}

export interface DiagnosticItem {
  id: DiagnosticId
  severity: 'error' | 'warning'
  /** set on `sources-archived` only */
  archives?: DiagnosticArchive[]
  /** on `compiler-foreign`: the game the configured compiler belongs to */
  game?: GameType
  /**
   * on `compiler-foreign`: the compiler this game installed, when it sits
   * where the kit puts it
   */
  compilerPath?: string
  /** on `sources-legacy`: the folder holding the misplaced psc */
  sourcePath?: string
}

export interface Diagnostic {
  items: DiagnosticItem[]
}

export interface ExtractResult {
  path: string
  ok: boolean
  /** set when `ok` is false, already readable by a human */
  error?: string
  /** the game folder is write protected, extracting can never work from PCA */
  denied?: boolean
}

export const hasError = (diagnostic: Diagnostic): boolean =>
  diagnostic.items.some((item) => item.severity === 'error')
