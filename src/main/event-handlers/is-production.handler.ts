/*
 * 2022-2026 Kiyozz.
 */

import { isDev } from 'electron-util/main'
import type { EventHandler } from '../interfaces/event-handler'

export class IsProductionHandler implements EventHandler {
  listen(): boolean {
    return !isDev
  }
}
