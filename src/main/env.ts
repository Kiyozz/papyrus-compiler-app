/*
 * 2022-2026 Kiyozz.
 */

import { MOD_URL_DEFAULT } from '../common/env'
import { inject } from '#main/inject.ts'

export const EnvO = {
  telemetryApi: process.env.ELECTRON_TELEMETRY_FEATURE ?? '',
  telemetryApiKey: process.env.ELECTRON_TELEMETRY_API_KEY ?? '',
  modUrl: process.env.ELECTRON_WEBPACK_APP_MOD_URL ?? MOD_URL_DEFAULT,
}

@inject()
export class Env {
  telemetryApi = process.env.ELECTRON_TELEMETRY_FEATURE ?? ''
  telemetryApiKey = process.env.ELECTRON_TELEMETRY_API_KEY ?? ''
  modUrl = process.env.ELECTRON_WEBPACK_APP_MOD_URL ?? ''
}
