/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
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
    // @ts-expect-error
    (import.meta.env.ELECTRON_TELEMETRY_FEATURE ?? 'false') === 'true',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  modUrl:
    // @ts-expect-error
    import.meta.env.ELECTRON_WEBPACK_APP_MOD_URL ?? MOD_URL_DEFAULT,
}
