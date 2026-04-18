/*
 * 2022-2026 Kiyozz.
 */

import log from 'electron-log'
import type {
  ErrorHandler,
  ErrorHandlerOptions,
  LogFile,
  LogFunctions,
  MainTransports,
} from 'electron-log'
import { isDev } from 'electron-util/main'
import type { LogLevel } from '#common/log-level.ts'

export function applyLogLevel(level: LogLevel): void {
  log.transports.file.level = level
  log.transports.console.level = isDev ? level : false
}

export class Logger {
  private logger: LogFunctions

  constructor(namespace: string) {
    this.logger = log.scope(namespace)
  }

  get transports(): MainTransports {
    return log.transports
  }

  get file(): LogFile {
    return this.transports.file.getFile()
  }

  get previousSessionFilePath(): string {
    return this.file.path.replace('.log', '.1.log')
  }

  catchErrors(options?: ErrorHandlerOptions): ErrorHandler {
    return log.catchErrors(options)
  }

  debug(...params: unknown[]): void {
    this.logger.debug(...params)
  }

  info(...params: unknown[]): void {
    this.logger.info(...params)
  }

  error(...params: unknown[]): void {
    this.logger.error(...params)
  }

  // noinspection JSUnusedGlobalSymbols
  warn(...params: unknown[]): void {
    this.logger.warn(...params)
  }
}
