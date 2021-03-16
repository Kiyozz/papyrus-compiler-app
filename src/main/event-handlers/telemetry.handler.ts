/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import {
  TelemetryEvents,
  TelemetryEventsProperties
} from '../../common/telemetry-events'
import { EventHandler } from '../interfaces/event-handler'
import { Telemetry } from '../telemetry/telemetry'

interface Payload<E extends TelemetryEvents> {
  name: E
  properties: TelemetryEventsProperties[E]
}

export class TelemetryHandler
  implements EventHandler<Payload<TelemetryEvents>> {
  constructor(private telemetry: Telemetry) {}

  async listen(args?: Payload<TelemetryEvents>): Promise<void> {
    if (is.undefined(args)) {
      return
    }

    const { name, properties } = args

    return this.telemetry.event({ name, properties })
  }
}
