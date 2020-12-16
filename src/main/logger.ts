/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import log, { LogFunctions } from 'electron-log'
import { is } from 'electron-util'

export class Logger {
  private logger: LogFunctions
  catchErrors = log.catchErrors

  constructor(namespace: string) {
    this.logger = log.scope(namespace)
  }

  get transports() {
    return log.transports
  }

  get file() {
    return this.transports.file.getFile()
  }

  get previousSessionFilePath() {
    return this.file.path.replace('.log', '.1.log')
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

  warn(...params: unknown[]): void {
    this.logger.warn(...params)
  }

  deprecated(message: string): void {
    if (this.isDebugEnabled()) {
      this.logger.debug(`deprecated: ${message}`)
    }
  }

  isDebugEnabled(): boolean {
    return is.development || process.argv.includes('--debug')
  }
}
