import log from 'electron-log'
import { is } from 'electron-util'

export class Logger {
  catchErrors = log.catchErrors

  constructor(private namespace: string) {}

  get transports() {
    return log.transports
  }

  get file() {
    return log.transports.file.getFile()
  }

  get previousSessionFilePath() {
    return this.file.path.replace('.log', '.1.log')
  }

  debug(...params: unknown[]): void {
    if (this.isDebugEnabled()) {
      log.debug(`[${this.namespace}]`, params)
    }
  }

  log(...params: unknown[]): void {
    log.log(`[${this.namespace}]`, params)
  }

  info(...params: unknown[]): void {
    log.info(`[${this.namespace}]`, params)
  }

  error(...params: unknown[]): void {
    log.error(`[${this.namespace}]`, params)
  }

  warn(...params: unknown[]): void {
    log.warn(`[${this.namespace}]`, params)
  }

  isDebugEnabled(): boolean {
    return is.development
  }
}
