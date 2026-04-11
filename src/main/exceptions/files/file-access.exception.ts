/*
 * 2022-2026 Kiyozz.
 */

import { fromError } from '../../../common/from-error'

export class FileAccessException extends Error {
  constructor(file: string, err?: unknown) {
    super(`Cannot access file "${file}"${fromError(err).message}`)
  }
}
