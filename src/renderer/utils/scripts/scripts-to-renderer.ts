/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { ScriptStatus } from '../../enums/script-status.enum'
import { uuid } from '../uuid'
import type { Script } from '../../../common/types/script'
import type { ScriptRenderer } from '../../types'

export const scriptsToRenderer = (
  scriptsRenderer: ScriptRenderer[],
  scripts: Script[],
): ScriptRenderer[] => {
  return [
    ...scriptsRenderer,
    ...scripts.map(s => {
      const script: ScriptRenderer = {
        ...s,
        id: uuid(),
        status: ScriptStatus.idle,
      }

      return script
    }),
  ]
}
