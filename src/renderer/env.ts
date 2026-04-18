/*
 * 2022-2026 Kiyozz.
 */

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { MOD_URL_DEFAULT } from '../common/env'

interface Envs {
  telemetryFeature: boolean
  modUrl: string
}

export const Env: Envs = {
  telemetryFeature:
    (import.meta.env.ELECTRON_TELEMETRY_FEATURE ?? 'false') === 'true',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  modUrl: import.meta.env.ELECTRON_WEBPACK_APP_MOD_URL ?? MOD_URL_DEFAULT,
}
