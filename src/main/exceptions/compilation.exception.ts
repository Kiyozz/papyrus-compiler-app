/*
 * 2022-2026 Kiyozz.
 */

export class CompilationException extends Error {
  readonly script: string

  constructor(script: string, err: string) {
    const removedString = `Script ${script} failed to compile: `

    super(`${removedString}${err.replace(removedString, '')}`)

    this.script = script
  }
}
