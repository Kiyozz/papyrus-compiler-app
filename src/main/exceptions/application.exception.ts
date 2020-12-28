/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export class ApplicationException extends Error {
  constructor(message: string) {
    super(`ApplicationException: Please report to PCA author. ${message}.`)
  }
}
