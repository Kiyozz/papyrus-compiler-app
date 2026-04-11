import type { IpcMainEvent } from 'electron'

export interface Logger {
  debug: (...args: unknown[]) => void
  info: (...params: unknown[]) => void
  error: (...params: unknown[]) => void
  warn: (...params: unknown[]) => void
}

export type Disposable = () => void

export interface EventHandler {
  listen: (args: any) => unknown | Promise<unknown>
}

export interface Event {
  on: (ipcEvent: IpcMainEvent, args: any) => void
}

export interface EventSync {
  onSync: (ipcEvent: IpcMainEvent, args: any) => unknown
}

export interface IpcManagerOptions {
  useLogging?: boolean
  usePayloadLogging?: boolean
  useErrorLogging?: boolean
}

export class IpcManager<
  EventMap extends string,
  Handler extends EventHandler = EventHandler,
  AsyncEvent extends Event = Event,
  SyncEvent extends EventSync = EventSync,
> {
  constructor(logger: Logger, options?: IpcManagerOptions)

  registerHandlers(handlers: Map<EventMap, Handler>): Disposable
  registerEvents(events: Map<EventMap, AsyncEvent>): Disposable
  registerSyncs(events: Map<EventMap, SyncEvent>): Disposable
}
