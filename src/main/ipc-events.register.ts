/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Event } from './interfaces/event'
import { EventHandler } from './interfaces/event-handler'
import { EventSync } from './interfaces/event-sync'
import { ipcMain } from './ipc'
import { Logger } from './logger'

const logger = new Logger('RegisterIpcEvents')

export function registerIpcEvents(
  handlers: Map<string, EventHandler>,
  events: Map<string, Event>,
  syncs: Map<string, EventSync>,
): void {
  handlers.forEach((handler, name) => {
    logger.info(`register "${name}"`)

    ipcMain.handle(name, async (_, args) => {
      logger.debug(`"${name}" started`)

      try {
        const payload = await handler.listen(args)

        logger.info(`"${name}" succeeded`)

        if (payload) {
          logger.debug(`"${name}" payload`, payload)
        }

        return payload
      } catch (e) {
        logger.error(`"${name}" failed`)

        if (e instanceof Error) {
          logger.error(`"${name}"`, e.stack)
        }

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

      const payload = event.onSync(ipcEvent, args)

      if (payload) {
        logger.debug(`"${name}" payload`, payload)
      }

      logger.debug(`"${name}" end`)

      ipcEvent.returnValue = payload
    })
  })
}
