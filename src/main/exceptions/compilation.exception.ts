/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

export class CompilationException extends Error {
  constructor(script: string, err: string) {
    const removedString = `Script ${script} failed to compile: `

    super(`${removedString}${err.replace(removedString, '')}`)
  }
}
