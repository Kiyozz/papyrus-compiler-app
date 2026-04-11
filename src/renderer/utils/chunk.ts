/*
 * 2022-2026 Kiyozz.
 */

import type { ScriptRenderer } from '../types'

export const chunk = (
  scripts: ScriptRenderer[],
  size: number,
): ScriptRenderer[][] => {
  return scripts.reduce(
    (acc: ScriptRenderer[][], current: ScriptRenderer, i: number) => {
      if (!(i % size)) {
        acc.push(scripts.slice(i, i + size))
      }

      return acc
    },
    [],
  )
}
