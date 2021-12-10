/* eslint-disable @typescript-eslint/ban-ts-comment */

import { MOD_URL_DEFAULT } from '../common/env'

export const Env = {
  telemetryFeature:
    // @ts-ignore
    (import.meta.env.ELECTRON_TELEMETRY_FEATURE ?? 'false') === 'true',
  modUrl:
    // @ts-ignore
    import.meta.env.ELECTRON_WEBPACK_APP_MOD_URL ?? MOD_URL_DEFAULT,
}
