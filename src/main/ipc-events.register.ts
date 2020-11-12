import { ipcMain as ipc } from '../common/ipc'
import { EventHandler } from './interfaces/event.handler'
import { Logger } from './logger'

const logger = new Logger('RegisterIpcEvents')

export function registerIpcEvents(handlers: Map<string, EventHandler>) {
  handlers.forEach((handler, name) => {
    logger.info(`register "${name}"`)

    ipc.handle(name, async (_, args) => {
      logger.debug(`"${name}" started`)

      try {
        const payload = await handler.listen(args)

        logger.info(`"${name}" succeeded`)
        logger.debug(`payload "${name}"`, payload)

        return payload
      } catch (e) {
        logger.error(`"${name}" failed`)
        logger.error(`[${name}]`, e)

        throw e
      }
    })
  })
}
