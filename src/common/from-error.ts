/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'

interface FromError {
  message: string
  stack: string
}

export const fromError = (err?: unknown): FromError => {
  return {
    get message(): string {
      let message = is.error(err) ? err.message : 'unknown error'

      if (is.string(err)) {
        message = err
      }

      return message
    },
    get stack(): string {
      let stack = 'unknown stack'

      if (is.error(err) && err.stack) {
        stack = err.stack
      }

      return stack
    },
  }
}
