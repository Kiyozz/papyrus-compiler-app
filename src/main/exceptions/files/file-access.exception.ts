/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

export class FileAccessException extends Error {
  constructor(file: string, err?: unknown) {
    super(`Cannot access file "${file}"${err ? `: ${err}` : ''}`)
  }
}
