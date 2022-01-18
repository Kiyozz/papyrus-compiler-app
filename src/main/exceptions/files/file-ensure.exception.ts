/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

export class FileEnsureException extends Error {
  constructor(item: string, err?: unknown) {
    super(`"${item}" cannot be created${err ? `: ${err}` : ''}`)
  }
}
