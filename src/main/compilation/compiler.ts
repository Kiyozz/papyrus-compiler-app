/*
 * 2026 Kiyozz.
 */

export interface CompileResult {
  /** raw compiler output */
  output: string
  /** name given to the compiler, namespaced when the script declares one */
  name: string
  /** absolute path of the pex the compiler writes */
  pexPath: string
}

export abstract class Compiler {
  abstract compile(scriptPath: string): Promise<CompileResult>
}
