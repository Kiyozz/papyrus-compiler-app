/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import type {
  TelemetryEvent,
  TelemetryEventProperties,
} from '../../common/telemetry-event'
import type { EventHandler } from '../interfaces/event-handler'
import type { Telemetry } from '../telemetry/telemetry'

interface Payload<E extends TelemetryEvent> {
  name: E
  properties: TelemetryEventProperties[E]
}

export class TelemetryHandler implements EventHandler {
  constructor(private telemetry: Telemetry) {}

  async listen(args?: Payload<TelemetryEvent>): Promise<void> {
    if (is.undefined(args)) {
      return
    }

    const { name, properties } = args

    return this.telemetry.event({ name, properties })
  }
}
