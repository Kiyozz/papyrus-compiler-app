/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export class FileAccessException extends Error {
  constructor(file: string) {
    super(`Cannot access file "${file}"`)
  }
}
