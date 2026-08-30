/*
 * 2026 Kiyozz.
 */

import type { ScriptRenderer } from './script-renderer'

export type CompilationLog = {
  script: ScriptRenderer
  output: string
  success: boolean
  /** absolute path of the compiled pex, undefined when the compilation failed */
  pexPath?: string
}
