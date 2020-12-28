/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export class ApplicationException extends Error {
  constructor(message: string) {
    super(`Application error: ${message}. Please report to PCA author.`)
  }
}
