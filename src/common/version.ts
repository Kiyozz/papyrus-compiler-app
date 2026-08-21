/*
 * 2022-2026 Kiyozz.
 */

declare const __PUBLIC_VERSION__: string

// Calendar-style release number (`2026.1`), read from package.json and inlined
// at build time by tsdown.config.ts and src/renderer/vite.config.ts.
export const publicVersion = __PUBLIC_VERSION__
