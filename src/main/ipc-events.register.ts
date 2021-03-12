/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { ipcMain } from '../common/ipc'
import { Event } from './interfaces/event'
import { EventHandler } from './interfaces/event-handler'
import { EventSync } from './interfaces/event-sync'
import { Logger } from './logger'

const logger = new Logger('RegisterIpcEvents')

export function registerIpcEvents(
  handlers: Map<string, EventHandler>,
  events: Map<string, Event>,
  syncs: Map<string, EventSync>
): void {
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

    ipcMain.on(name, (ipcEvent, args) => {
      logger.debug(`"${name}" started`)

      event.on(ipcEvent, args)

      logger.debug(`"${name}" end`)
    })
  })

  syncs.forEach((event, name) => {
    logger.info(`register "${name}"`)

    ipcMain.on(name, (ipcEvent, args) => {
      logger.debug(`"${name}" started`)

      const result = event.onSync(ipcEvent, args)

      logger.debug(`"${name}" payload`, result)
      logger.debug(`"${name}" end`)

      ipcEvent.returnValue = result
    })
  })
}
