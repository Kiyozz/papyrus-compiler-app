/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

export class ApplicationException extends Error {
  constructor(message: string) {
    super(`ApplicationException: Please report to PCA author. ${message}.`)
  }
}
