/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { uniqArray } from '../../../common/uniq-array'
import { ScriptRenderer } from '../../types'

export const uniqScripts = (scripts: ScriptRenderer[]): ScriptRenderer[] => {
  return uniqArray(scripts, ['name'])
}
