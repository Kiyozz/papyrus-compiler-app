/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { is } from 'electron-util'
import type { EventHandler } from '../interfaces/event-handler'

export class IsProductionHandler implements EventHandler {
  listen(): boolean {
    return !is.development
  }
}
