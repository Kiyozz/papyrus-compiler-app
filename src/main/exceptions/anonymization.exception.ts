/*
 * 2026 Kiyozz.
 */

export class AnonymizationException extends Error {
  constructor(pex: string, reason: string) {
    super(`Cannot anonymize "${pex}": ${reason}`)
  }
}
