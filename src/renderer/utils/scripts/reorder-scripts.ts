/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { ScriptRenderer } from '../../types'

export const reorderScripts = (scripts: ScriptRenderer[]): ScriptRenderer[] => {
  return scripts.map((script, index) => ({ ...script, id: index }))
}
