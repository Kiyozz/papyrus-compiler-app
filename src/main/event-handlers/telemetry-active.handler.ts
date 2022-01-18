/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import { EventHandler } from '../interfaces/event-handler'
import { Telemetry } from '../telemetry/telemetry'

export class TelemetryActiveHandler implements EventHandler<boolean> {
  constructor(private telemetry: Telemetry) {}

  listen(args?: boolean): unknown {
    if (is.undefined(args)) {
      return
    }

    this.telemetry.setActive(args)
  }
}
