/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export class FileEnsureException extends Error {
  constructor(item: string, err?: unknown) {
    super(`"${item}" cannot be created${err ? `: ${err}` : ''}`)
  }
}
