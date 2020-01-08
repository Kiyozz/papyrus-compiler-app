import 'reflect-metadata'
import { Inject, Injectable } from '@nestjs/common'
import { ELECTRON_IPC_EVENT } from '../decorators'
import log from 'electron-log'
import { ipcMain } from 'electron'
import { HandlerInterface } from '../types/handler.interface'

@Injectable()
export class EventHandlerParser {
  constructor(@Inject('HANDLERS') private eventHandlers: HandlerInterface[]) {}

  register() {
    this.eventHandlers
      .forEach(eventHandler => {
        const { name } = Reflect.getMetadata(ELECTRON_IPC_EVENT, eventHandler.constructor)

        log.info(`Registering ${name} event.`)

        ipcMain.on(name, async (event, args) => {
          log.info(`Event ${name} in progress.`)

          try {
            const payload = await eventHandler.listen(event, args)

            log.info(`Event ${name} succeeded.`)
            event.sender.send(`${name}-success`, payload)
          } catch (e) {
            log.error(`[${name}]`, e)

            event.sender.send(`${name}-error`, e)
          }
        })
      })
  }
}
