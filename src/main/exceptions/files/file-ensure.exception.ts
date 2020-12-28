/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export class FileEnsureException extends Error {
  constructor(item: string) {
    super(`"${item}" cannot be created`)
  }
}
