/*
 * 2022-2026 Kiyozz.
 */

export class ApplicationException extends Error {
  constructor(message: string) {
    super(`ApplicationException: Please report to PCA author. ${message}.`)
  }
}
