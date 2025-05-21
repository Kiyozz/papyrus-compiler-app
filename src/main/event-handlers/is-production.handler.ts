/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { isDev } from 'electron-util/main'
import type { EventHandler } from '../interfaces/event-handler'

export class IsProductionHandler implements EventHandler {
  listen(): boolean {
    return !isDev
  }
}
