import { ipcMain as ipc } from '@common/ipc'
import { EventHandler } from './EventHandler'
import { Logger } from './Logger'

const logger = new Logger('registerIpcEvents')

export function registerIpcEvents(handlers: Map<string, EventHandler>) {
  handlers.forEach((handler, name) => {
    logger.info(`Register event "${name}".`)

    ipc.handle(name, async (_, args) => {
      logger.info(`Event "${name}" started.`)

      try {
        const payload = await handler.listen(args)

        logger.info(`Event "${name}" succeeded.`)
        logger.debug(`Payload "${name}"`, payload)

        return payload
      } catch (e) {
        logger.error(`Event "${name}" failed.`)
        logger.error(`[${name}]`, e)

        throw e
      }
    })
  })
}
