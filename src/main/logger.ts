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
import { cliArgs } from './cli-args'

const isDebug = cliArgs.debug ?? false

if (!isDev && !isDebug) {
  log.transports.console.level = false
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
    if (this.isDebugEnabled()) {
      this.logger.debug(...params)
    }
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

  isDebugEnabled(): boolean {
    return isDev || isDebug
  }
}
