import log from 'electron-log'

export default class Log {
  constructor(private namespace: string) {}

  debug(...params: unknown[]): void {
    log.debug(`[${this.namespace}]`, params)
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

  get transports() {
    return log.transports
  }

  catchErrors = log.catchErrors

  get file() {
    return log.transports.file.getFile()
  }

  get previousSessionFilePath() {
    return this.file.path.replace('.log', '.1.log')
  }
}
