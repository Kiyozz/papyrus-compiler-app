/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import type { EventHandler } from '../interfaces/event-handler'
import type { Telemetry } from '../telemetry/telemetry'

export class TelemetryActiveHandler implements EventHandler {
  constructor(private telemetry: Telemetry) {}

  listen(args: boolean) {
    if (is.undefined(args)) {
      return
    }

    this.telemetry.setActive(args)
  }
}
