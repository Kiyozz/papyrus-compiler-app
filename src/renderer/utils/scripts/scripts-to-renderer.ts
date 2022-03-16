/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Script } from '../../../common/types/script'
import bridge from '../../bridge'
import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptRenderer } from '../../types'

export const scriptsToRenderer = (
  scriptsRenderer: ScriptRenderer[],
  scripts: Script[],
): ScriptRenderer[] => {
  return [
    ...scriptsRenderer,
    ...scripts.map(
      s =>
        ({
          ...s,
          id: bridge.uuid(),
          status: ScriptStatus.idle,
        } as ScriptRenderer),
    ),
  ]
}
