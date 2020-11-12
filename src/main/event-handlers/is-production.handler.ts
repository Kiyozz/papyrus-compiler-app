import { EventHandler } from '../interfaces/event.handler'
import { is } from 'electron-util'

export class IsProductionHandler implements EventHandler {
  listen(): boolean {
    return !is.development
  }
}
