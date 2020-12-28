/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export function uniqArray<T>(
  arrayInput: T[] = [],
  keys: (keyof T)[] = []
): T[] {
  if (!Array.isArray(arrayInput)) {
    throw new TypeError(
      `Expected an array for arrayInput, got ${typeof arrayInput}`
    )
  }
  if (!Array.isArray(keys)) {
    throw new TypeError(`Expected an array for keys, got ${typeof keys}`)
  }

  const keyValues = arrayInput.map((value): [keyof T, unknown] => {
    const key = keys.map(k => value[k]).join('|') as keyof T
    return [key, value]
  })

  const kvMap = new Map<keyof T, T>(keyValues as any)
  return [...kvMap.values()]
}
