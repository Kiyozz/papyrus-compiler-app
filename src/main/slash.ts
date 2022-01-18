/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

export function toSlash(value: string): string {
  return value.replace(/\\/g, '/')
}

export function toAntiSlash(value: string): string {
  return value.replace(/\//g, '\\')
}
