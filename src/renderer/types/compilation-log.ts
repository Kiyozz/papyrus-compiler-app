/*
 * 2026 Kiyozz.
 */

import type { ScriptRenderer } from './script-renderer'

export type CompilationLog = {
  script: ScriptRenderer
  output: string
  success: boolean
}
