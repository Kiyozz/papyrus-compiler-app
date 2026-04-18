/*
 * 2022-2026 Kiyozz.
 */

import { isDev } from 'electron-util/main'

export class IsProductionHandler {
  listen(): boolean {
    return !isDev
  }
}
