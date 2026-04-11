/*
 * 2022-2026 Kiyozz.
 */

export interface ExecException extends Error {
  stderr: string
  stdout: string
}
