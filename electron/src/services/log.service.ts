import log from 'electron-log'

export class LogService {
  debug(...params: any[]): void {
    log.debug(params)
  }

  log(...params: any[]): void {
    log.log(params)
  }

  info(...params: any[]): void {
    log.info(params)
  }

  error(...params: any[]): void {
    log.error(params)
  }
}
