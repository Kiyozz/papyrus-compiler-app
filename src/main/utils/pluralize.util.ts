/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

interface PluralizeOptions {
  single?: string
  multiple?: string
}

export function pluralize(
  iterable: unknown[],
  options: PluralizeOptions = {},
): string {
  return iterable.length > 1 ? options.multiple ?? 's' : options.single ?? ''
}
