import log from 'electron-log'

export class LogService {
  private logger: typeof log = log

  debug(...params: any[]): void {
    this.logger.debug(params)
  }

  log(...params: any[]): void {
    this.logger.log(params)
  }

  info(...params: any[]): void {
    this.logger.info(params)
  }

  error(...params: any[]): void {
    this.logger.error(params)
  }
}
