/*
 * 2022-2026 Kiyozz.
 */

import { MOD_URL_DEFAULT } from '../common/env'
import { inject } from '#main/inject.ts'

// Inlined at build time by tsdown.config.ts.
export const EnvO = {
  telemetryEnabled: process.env.PCA_TELEMETRY_ENABLED === 'true',
  telemetryApi: process.env.PCA_TELEMETRY_API_URL ?? '',
  telemetryApiKey: process.env.PCA_TELEMETRY_API_KEY ?? '',
  modUrl: process.env.PCA_MOD_URL ?? MOD_URL_DEFAULT,
}

@inject()
export class Env {
  telemetryEnabled = EnvO.telemetryEnabled
  telemetryApi = EnvO.telemetryApi
  telemetryApiKey = EnvO.telemetryApiKey
  modUrl = EnvO.modUrl
}
