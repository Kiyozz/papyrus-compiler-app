/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { ipcMain } from 'electron'
import type { IpcMainEvent } from 'electron'
import type { Disposable, Event, EventHandler, EventSync, IpcManagerOptions, Logger } from '../index.d.ts'

export class IpcManager<
  EventMap extends string,
  Handler extends EventHandler = EventHandler,
  AsyncEvent extends Event = Event,
  SyncEvent extends EventSync = EventSync,
> {
  constructor(
    private logger: Logger,
    private options: IpcManagerOptions = {
      useLogging: true,
      usePayloadLogging: true,
      useErrorLogging: true,
    },
  ) {}

  registerHandlers(handlers: Map<EventMap, Handler>): Disposable {
    handlers.forEach((handler, name) => {
      if (this.options.useLogging) {
        this.logger.info(`+handler: "${name}"`)
      }

      ipcMain.handle(name, async (_, args) => {
        if (this.options.useLogging) {
          this.logger.debug(`handler "${name}" started`)
        }

        try {
          const payload = await handler.listen(args)

          if (this.options.useLogging) {
            this.logger.info(`handler "${name}" succeeded`)
          }

          if (this.options.useLogging && this.options.usePayloadLogging && payload) {
            this.logger.debug(`handler "${name}" payload`, payload)
          }

          return payload
        } catch (e) {
          if (this.options.useErrorLogging) {
            this.logger.error(`"${name}" failed`)
          }

          if (this.options.useErrorLogging && e instanceof Error) {
            this.logger.error(`"${name}"`, e.stack)
          }

          throw e
        }
      })
    })

    return () => {
      handlers.forEach((_, evt) => {
        ipcMain.removeHandler(evt)
      })
    }
  }

  registerEvents(events: Map<EventMap, AsyncEvent>): Disposable {
    const evtFuncList: [EventMap, (evt: IpcMainEvent, args: unknown) => unknown][] = []

    events.forEach((event, name) => {
      if (this.options.useLogging) {
        this.logger.info(`+event "${name}"`)
      }

      const eventFunc: (typeof evtFuncList)[0][1] = (ipcEvent, args) => {
        if (this.options.useLogging) {
          this.logger.debug(`event "${name}" started`)
        }

        event.on(ipcEvent, args)

        if (this.options.useLogging) {
          this.logger.debug(`event "${name}" end`)
        }
      }

      ipcMain.on(name, eventFunc)

      evtFuncList.push([name, eventFunc])
    })

    return () => {
      evtFuncList.forEach(([name, evtFunc]) => {
        ipcMain.removeListener(name, evtFunc)
      })
    }
  }

  registerSyncs(events: Map<EventMap, SyncEvent>): Disposable {
    const evtFuncList: [EventMap, (evt: IpcMainEvent, args: unknown) => unknown][] = []

    events.forEach((event, name) => {
      if (this.options.useLogging) {
        this.logger.info(`+sync event "${name}"`)
      }

      const evtFunc: (typeof evtFuncList)[0][1] = (ipcEvent, args) => {
        if (this.options.useLogging) {
          this.logger.debug(`sync event "${name}" started`)
        }

        const payload = event.onSync(ipcEvent, args)

        if (this.options.useLogging && this.options.usePayloadLogging && payload) {
          this.logger.debug(`sync event "${name}" payload`, payload)
        }

        if (this.options.useLogging) {
          this.logger.debug(`"${name}" end`)
        }

        ipcEvent.returnValue = payload
      }

      ipcMain.on(name, evtFunc)

      evtFuncList.push([name, evtFunc])
    })

    return () => {
      evtFuncList.forEach(([name, evtFunc]) => {
        ipcMain.removeListener(name, evtFunc)
      })
    }
  }
}
