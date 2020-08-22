import 'reflect-metadata'
import { ELECTRON_IPC_EVENT, ELECTRON_IPC_INVOKE_EVENT } from './constants'

export function Handler(name: string): ClassDecorator {
  return target => {
    Reflect.defineMetadata(ELECTRON_IPC_EVENT, { name }, target)
  }
}

export function HandlerInvoke(name: string): ClassDecorator {
  return target => {
    Reflect.defineMetadata(ELECTRON_IPC_INVOKE_EVENT, { name }, target)
  }
}

export * from './constants'
