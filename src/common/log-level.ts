/*
 * 2022-2026 Kiyozz.
 */

export const LogLevel = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
} as const

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel]
