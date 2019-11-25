import 'reflect-metadata'
import { ELECTRON_IPC_EVENT } from './constants'

export interface EventMeta {
  name: string
  callback: (...args: any[]) => any
}

export function Event(name: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(ELECTRON_IPC_EVENT, { name, callback: descriptor.value }, target, propertyKey)
  }
}

export * from './constants'
