/*
 * 2026 Kiyozz.
 */

export interface CompileResult {
  /** raw compiler output */
  output: string
  /** name given to the compiler, namespaced when the script declares one */
  name: string
}

export abstract class Compiler {
  abstract compile(scriptPath: string): Promise<CompileResult>
}
