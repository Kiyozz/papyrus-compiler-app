/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export class CompilationException extends Error {
  constructor(script: string, err: string) {
    const removedString = `Script ${script} failed to compile: `

    super(`${removedString}${err.replace(removedString, '')}`)
  }
}
