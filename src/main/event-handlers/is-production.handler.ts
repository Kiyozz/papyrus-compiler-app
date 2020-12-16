/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { is } from 'electron-util'
import { EventHandlerInterface } from '../interfaces/event-handler.interface'

export class IsProductionHandler implements EventHandlerInterface {
  listen(): boolean {
    return !is.development
  }
}
