/*
 * 2022-2026 Kiyozz.
 */

// Vite only exposes `VITE_`-prefixed variables through `import.meta.env`, so
// these go through explicit `define` entries in vite.config.ts instead.
declare const __TELEMETRY_ENABLED__: boolean
declare const __MOD_URL__: string

interface Envs {
  telemetryEnabled: boolean
  modUrl: string
}

export const Env: Envs = {
  telemetryEnabled: __TELEMETRY_ENABLED__,
  modUrl: __MOD_URL__,
}
