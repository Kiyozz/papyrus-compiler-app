import 'reflect-metadata'
import { ELECTRON_IPC_EVENT, EventMeta } from '../decorators'
import log from 'electron-log'
import { EventHandler } from '../types/event-handler.interface'
import { ipcMain } from 'electron'

export class EventHandlerParser {
  constructor(private eventHandlers: EventHandler[]) {}

  register() {
    this.eventHandlers
      .forEach(target => {
        const eventHandler = new target()
        const keys = Reflect.ownKeys(target.prototype);

        (keys as string[])
          .filter(key => Reflect.hasMetadata(ELECTRON_IPC_EVENT, eventHandler, key))
          .map(key => Reflect.getMetadata(ELECTRON_IPC_EVENT, eventHandler, key))
          .map<EventMeta>(meta => {
            meta.callback = meta.callback.bind(eventHandler)

            return meta
          })
          .forEach((meta: EventMeta) => {
            log.info(`Registering ${meta.name} event.`)

            ipcMain.on(meta.name, async (event, args) => {
              log.info(`Event ${meta.name} in progress.`)

              try {
                const payload = await meta.callback(event, args)

                log.info(`Event ${meta.name} succeeded.`)
                event.sender.send(`${meta.name}-success`, payload)
              } catch (e) {
                log.error(`[${meta.name}]`, e)

                event.sender.send(`${meta.name}-error`, e)
              }
            })
          })
      })
  }
}
