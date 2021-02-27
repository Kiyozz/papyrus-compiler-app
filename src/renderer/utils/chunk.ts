/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { ScriptInterface } from '../interfaces'

export function chunk(
  scripts: ScriptInterface[],
  size: number
): ScriptInterface[][] {
  return scripts.reduce(
    (acc: ScriptInterface[][], current: ScriptInterface, i: number) => {
      if (!(i % size)) {
        acc.push(scripts.slice(i, i + size))
      }

      return acc
    },
    []
  )
}
