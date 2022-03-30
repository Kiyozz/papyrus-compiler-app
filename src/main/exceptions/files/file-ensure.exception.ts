/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { fromError } from '../../../common/from-error'

export class FileEnsureException extends Error {
  constructor(item: string, err?: unknown) {
    super(`"${item}" cannot be created${fromError(err).message}`)
  }
}
