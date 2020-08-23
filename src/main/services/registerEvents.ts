import { ipcMain as ipc } from 'electron-better-ipc'
import { HandlerInterface } from '../HandlerInterface'
import Log from './Log'

const log = new Log('registerEvents')

export function registerEvents(handlers: Map<string, HandlerInterface>) {
  log.info('Register events.')

  handlers.forEach((handler, name) => {
    log.info(`Register event "${name}".`)

    ipc.answerRenderer(name, async args => {
      log.info(`Event "${name}" in progress.`)

      try {
        const payload = await handler.listen(args)

        log.info(`Event "${name}" succeeded.`)
        log.debug(`Payload "${name}"`, payload)

        return payload
      } catch (e) {
        log.error(`Event "${name}" failed.`)
        log.error(`[${name}]`, e)

        throw e
      }
    })
  })
}
