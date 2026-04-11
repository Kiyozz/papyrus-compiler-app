/*
 * 2022-2026 Kiyozz.
 */

import { fromError } from '../../../common/from-error'

export class FileEnsureException extends Error {
  constructor(item: string, err?: unknown) {
    super(`"${item}" cannot be created${fromError(err).message}`)
  }
}
