/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import {
  TelemetryEvent,
  TelemetryEventProperties,
} from '../../common/telemetry-event'
import { EventHandler } from '../interfaces/event-handler'
import { Telemetry } from '../telemetry/telemetry'

type Payload<E extends TelemetryEvent> = {
  name: E
  properties: TelemetryEventProperties[E]
}

export class TelemetryHandler implements EventHandler<Payload<TelemetryEvent>> {
  constructor(private telemetry: Telemetry) {}

  async listen(args?: Payload<TelemetryEvent>): Promise<void> {
    if (is.undefined(args)) {
      return
    }

    const { name, properties } = args

    return this.telemetry.event({ name, properties })
  }
}
