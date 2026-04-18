/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import { Telemetry } from '../telemetry/telemetry'
import { inject } from '#main/inject.ts'

@inject()
export class TelemetryActiveHandler {
  readonly #telemetry: Telemetry

  constructor(telemetry: Telemetry) {
    this.#telemetry = telemetry
  }

  listen(args: boolean) {
    if (is.undefined(args)) {
      return
    }

    this.#telemetry.active = args
  }
}
