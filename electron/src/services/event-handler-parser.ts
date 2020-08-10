import 'reflect-metadata'
import { ELECTRON_IPC_EVENT, ELECTRON_IPC_INVOKE_EVENT } from '../decorators'
import { ipcMain } from 'electron'
import { HandlerInterface, HandlerInvokeInterface } from '../types/handler.interface'
import { LogService } from './log.service'

export class EventHandlerParser {
  constructor(
    private eventHandlers: HandlerInterface[],
    private eventHandlersInvoke: HandlerInvokeInterface[],
    private readonly logService: LogService
  ) {}

  register() {
    this.eventHandlers.forEach(eventHandler => {
      const { name } = Reflect.getMetadata(ELECTRON_IPC_EVENT, eventHandler.constructor)

      this.logService.info(`Registering ${name} event.`)

      ipcMain.on(name, async (event, args) => {
        this.logService.info(`Event ${name} in progress.`)

        try {
          const payload = await eventHandler.listen(event, args)

          this.logService.info(`Event ${name} succeeded.`)
          event.sender.send(`${name}-success`, payload)
        } catch (e) {
          this.logService.error(`Event ${name} failed.`)
          this.logService.error(`[${name}]`, e)

          event.sender.send(`${name}-error`, e.message)
        }
      })
    })

    this.eventHandlersInvoke.forEach(eventHandler => {
      const { name } = Reflect.getMetadata(ELECTRON_IPC_INVOKE_EVENT, eventHandler.constructor)

      this.logService.info(`Registering ${name} invoke event.`)

      ipcMain.handle(name, async (event, args) => {
        this.logService.info(`Event invoke ${name} in progress.`)

        try {
          const payload = await eventHandler.listen(event, args)

          this.logService.info(`Event invoke ${name} succeeded.`)

          return payload
        } catch (e) {
          this.logService.error(`Event ${name} failed.`)
          this.logService.error(`[${name}]`, e)

          throw e
        }
      })
    })
  }
}
