/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
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
