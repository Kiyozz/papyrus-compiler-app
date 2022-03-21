/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Script } from '../../../common/types/script'
import { uniqArray } from '../../../common/uniq-array'
import { ScriptRenderer } from '../../types'

export const uniqScripts = <T extends Script | ScriptRenderer>(
  scripts: T[],
): T[] => {
  return uniqArray(scripts, ['name'])
}
