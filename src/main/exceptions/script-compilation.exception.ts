/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

export class ScriptCompilationException extends Error {
  constructor(script: string, err: string, cmd?: string) {
    const removedString = `Script ${script} failed to compile: `

    super(
      `${removedString}${err.replace(removedString, '')}${
        !is.undefined(cmd) ? `\nExecuted command was : ${cmd}` : ''
      }`
    )
  }
}
