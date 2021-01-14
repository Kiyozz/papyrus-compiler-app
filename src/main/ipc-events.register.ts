/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { ipcMain } from '../common/ipc'
import { EventHandlerInterface } from './interfaces/event-handler.interface'
import { Logger } from './logger'
import { EventInterface } from './interfaces/event.interface'

const logger = new Logger('RegisterIpcEvents')

export function registerIpcEvents(
  handlers: Map<string, EventHandlerInterface>,
  events: Map<string, EventInterface>
) {
  handlers.forEach((handler, name) => {
    logger.info(`register "${name}"`)

    ipcMain.handle(name, async (_, args) => {
      logger.debug(`"${name}" started`)

      try {
        const payload = await handler.listen(args)

        logger.info(`"${name}" succeeded`)
        logger.debug(`payload "${name}"`, payload)

        return payload
      } catch (e) {
        logger.error(`"${name}" failed`)
        logger.error(`"${name}"`, e.stack)

        throw e
      }
    })
  })

  events.forEach((event, name) => {
    logger.info(`register "${name}"`)

    ipcMain.on(name, async (ipcEvent, args) => {
      logger.debug(`"${name}" started`)

      await event.on(ipcEvent, args)

      logger.debug(`"${name}" end`)
    })
  })
}
