/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import log from 'electron-log'
import { is } from 'electron-util'
import { cliArgs } from './cli-args'
import type {
  LogFile,
  LogFunctions,
  Transports,
  CatchErrorsOptions,
  CatchErrorsResult,
} from 'electron-log'

const isDev = is.development
const isDebug = cliArgs.debug ?? false

if (!isDev && !isDebug) {
  log.transports.console.level = false
}

export class Logger {
  private logger: LogFunctions

  constructor(namespace: string) {
    this.logger = log.scope(namespace)
  }

  get transports(): Transports {
    return log.transports
  }

  get file(): LogFile {
    return this.transports.file.getFile()
  }

  get previousSessionFilePath(): string {
    return this.file.path.replace('.log', '.1.log')
  }

  catchErrors(options?: CatchErrorsOptions): CatchErrorsResult {
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
    return is.development || isDebug
  }
}
