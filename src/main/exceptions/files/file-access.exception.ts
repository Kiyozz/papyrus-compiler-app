/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export class FileAccessException extends Error {
  constructor(file: string, err?: unknown) {
    super(`Cannot access file "${file}"${err ? `: ${err}` : ''}`)
  }
}
