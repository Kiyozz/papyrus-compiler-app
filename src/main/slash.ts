/*
 * 2022-2026 Kiyozz.
 */

export function toSlash(value: string): string {
  return value.replace(/\\/g, '/')
}

export function toAntiSlash(value: string): string {
  return value.replace(/\//g, '\\')
}
