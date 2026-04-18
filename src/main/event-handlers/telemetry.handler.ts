/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import type {
  TelemetryEvent,
  TelemetryEventProperties,
} from '#common/telemetry-event.ts'
import { Telemetry } from '#main/telemetry/telemetry.ts'
import { inject } from '#main/inject.ts'

interface Payload<E extends TelemetryEvent> {
  name: E
  properties: TelemetryEventProperties[E]
}

@inject()
export class TelemetryHandler {
  #telemetry: Telemetry

  constructor(telemetry: Telemetry) {
    this.#telemetry = telemetry
  }

  async listen(args?: Payload<TelemetryEvent>): Promise<void> {
    if (is.undefined(args)) {
      return
    }

    const { name, properties } = args

    return this.#telemetry.event({ name, properties })
  }
}
