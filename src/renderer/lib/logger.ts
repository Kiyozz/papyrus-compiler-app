/*
 * 2026 Kiyozz.
 */

import { bridge } from '@renderer/bridge.ts'
import { LogLevel } from '#common/log-level.ts'

function format(param: unknown): string {
  if (typeof param === 'string') return param

  if (param instanceof Error) {
    return param.stack ?? `${param.name}: ${param.message}`
  }

  if (typeof param === 'object' && param !== null) {
    try {
      return JSON.stringify(param)
    } catch {
      return String(param)
    }
  }

  return String(param)
}

/**
 * The renderer cannot reach electron-log directly, so entries are forwarded to
 * the main process, which writes them to the log files. Also kept in the
 * devtools console, where they are useful while developing.
 */
class Logger {
  readonly #scope: string

  constructor(scope: string) {
    this.#scope = scope
  }

  debug(...params: unknown[]): void {
    this.#write(LogLevel.debug, params)
  }

  info(...params: unknown[]): void {
    this.#write(LogLevel.info, params)
  }

  warn(...params: unknown[]): void {
    this.#write(LogLevel.warn, params)
  }

  error(...params: unknown[]): void {
    this.#write(LogLevel.error, params)
  }

  #write(level: LogLevel, params: unknown[]): void {
    console[level](`(${this.#scope})`, ...params)

    // never let a broken channel take down what was being logged
    void bridge.log
      .write(level, this.#scope, params.map(format).join(' '))
      .catch(() => {})
  }
}

export { Logger }
