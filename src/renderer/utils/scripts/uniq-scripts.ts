/*
 * 2022-2026 Kiyozz.
 */

import { uniqArray } from '../../../common/uniq-array'
import type { Script } from '../../../common/types/script'
import type { ScriptRenderer } from '../../types'

export const uniqScripts = <T extends Script | ScriptRenderer>(
  scripts: T[],
): T[] => {
  return uniqArray(scripts, ['name'])
}
