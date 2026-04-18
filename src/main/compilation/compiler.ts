/*
 * 2026 Kiyozz.
 */

export abstract class Compiler {
  abstract compile(scriptName: string): Promise<string>
}
