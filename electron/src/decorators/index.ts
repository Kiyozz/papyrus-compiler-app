import 'reflect-metadata'
import { ELECTRON_IPC_EVENT } from './constants'

export interface EventMeta {
  name: string
}

export function Event(name: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(ELECTRON_IPC_EVENT, { name }, target)
  }
}

export * from './constants'
