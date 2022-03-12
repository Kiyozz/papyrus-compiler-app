/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { ScriptRenderer } from '../../types'

export function scriptEquals(script: ScriptRenderer) {
  return (compare: ScriptRenderer) => {
    return script.id === compare.id
  }
}

export function scriptInList(scripts: ScriptRenderer[]) {
  return (script: ScriptRenderer) => {
    return !!scripts.find(scriptEquals(script))
  }
}
