/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { is } from 'electron-util'
import { EventHandler } from '../interfaces/event.handler'

export class IsProductionHandler implements EventHandler {
  listen(): boolean {
    return !is.development
  }
}
