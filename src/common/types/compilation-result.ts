/*
 * 2022-2026 Kiyozz.
 */

export interface CompilationResult {
  script: string
  output: string
  success: boolean
  /** absolute path of the compiled pex, undefined when the compilation failed */
  pexPath?: string
}
