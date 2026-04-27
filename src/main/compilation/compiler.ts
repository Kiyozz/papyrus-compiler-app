/*
 * 2026 Kiyozz.
 */

export abstract class Compiler {
  abstract compile(scriptPath: string): Promise<string>
}
